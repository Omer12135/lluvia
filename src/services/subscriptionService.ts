import { supabase } from '../lib/supabase';

export interface UserSubscription {
  customer_id: string;
  subscription_id: string;
  subscription_status: string;
  price_id: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  payment_method_brand?: string;
  payment_method_last4?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'custom';
  automations_used: number;
  automations_limit: number;
  ai_messages_used: number;
  ai_messages_limit: number;
  current_month_automations_used: number;
  last_reset_date: string;
  monthly_automations_used: number;
  created_at: string;
  updated_at: string;
}

export const subscriptionService = {
  // Kullanıcının mevcut aboneliğini getir
  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching user subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  },

  // Kullanıcının profilini getir
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  // Kullanıcının planını güncelle
  async updateUserPlan(plan: 'free' | 'pro'): Promise<boolean> {
    try {
      let automationsLimit = 1; // Free plan default
      let aiMessagesLimit = 0; // Free plan default

      if (plan === 'pro') {
        automationsLimit = 50; // Pro plan limit
        aiMessagesLimit = 1000; // Pro plan AI messages limit
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          plan,
          automations_limit: automationsLimit,
          ai_messages_limit: aiMessagesLimit,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating user plan:', error);
        return false;
      }

      console.log(`User plan updated to ${plan} with ${automationsLimit} automations limit`);
      return true;
    } catch (error) {
      console.error('Error in updateUserPlan:', error);
      return false;
    }
  },

  // Kullanıcının otomasyon kullanımını kontrol et
  async checkAutomationUsage(): Promise<{
    canCreate: boolean;
    currentUsage: number;
    limit: number;
    remaining: number;
  }> {
    try {
      const profile = await this.getUserProfile();
      
      if (!profile) {
        return {
          canCreate: false,
          currentUsage: 0,
          limit: 0,
          remaining: 0
        };
      }

      const currentUsage = profile.plan === 'free' 
        ? profile.current_month_automations_used 
        : profile.automations_used;
      
      const remaining = profile.automations_limit - currentUsage;
      const canCreate = remaining > 0;

      return {
        canCreate,
        currentUsage,
        limit: profile.automations_limit,
        remaining
      };
    } catch (error) {
      console.error('Error in checkAutomationUsage:', error);
      return {
        canCreate: false,
        currentUsage: 0,
        limit: 0,
        remaining: 0
      };
    }
  },

  // Otomasyon kullanımını artır
  async incrementAutomationUsage(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_automation_usage', {
        user_uuid: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) {
        console.error('Error incrementing automation usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in incrementAutomationUsage:', error);
      return false;
    }
  },

  // Kullanıcının plan durumunu kontrol et ve güncelle
  async syncUserPlanFromSubscription(): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription();
      const profile = await this.getUserProfile();

      if (!profile) {
        console.error('User profile not found');
        return false;
      }

      let newPlan: 'free' | 'pro' = 'free';

      // Stripe subscription durumuna göre plan belirle
      if (subscription && subscription.subscription_status === 'active') {
        // Price ID'ye göre plan belirle
        if (subscription.price_id === 'price_1Rs2mPK4TeoPEcnVVGOmeNcs') {
          newPlan = 'pro';
        }
      }

      // Plan değişmişse güncelle
      if (profile.plan !== newPlan) {
        const success = await this.updateUserPlan(newPlan);
        if (success) {
          console.log(`User plan synced from ${profile.plan} to ${newPlan}`);
        }
        return success;
      }

      return true;
    } catch (error) {
      console.error('Error in syncUserPlanFromSubscription:', error);
      return false;
    }
  },

  // Kullanıcının plan bilgilerini getir
  async getPlanInfo(): Promise<{
    currentPlan: 'free' | 'pro';
    automationsLimit: number;
    automationsUsed: number;
    automationsRemaining: number;
    aiMessagesLimit: number;
    aiMessagesUsed: number;
    aiMessagesRemaining: number;
    isPro: boolean;
    subscriptionStatus?: string;
  }> {
    try {
      const [profile, subscription] = await Promise.all([
        this.getUserProfile(),
        this.getUserSubscription()
      ]);

      if (!profile) {
        return {
          currentPlan: 'free',
          automationsLimit: 1,
          automationsUsed: 0,
          automationsRemaining: 1,
          aiMessagesLimit: 0,
          aiMessagesUsed: 0,
          aiMessagesRemaining: 0,
          isPro: false
        };
      }

      const currentUsage = profile.plan === 'free' 
        ? profile.current_month_automations_used 
        : profile.automations_used;

      return {
        currentPlan: profile.plan === 'custom' ? 'free' : profile.plan,
        automationsLimit: profile.automations_limit,
        automationsUsed: currentUsage,
        automationsRemaining: profile.automations_limit - currentUsage,
        aiMessagesLimit: profile.ai_messages_limit,
        aiMessagesUsed: profile.ai_messages_used,
        aiMessagesRemaining: profile.ai_messages_limit - profile.ai_messages_used,
        isPro: profile.plan === 'pro',
        subscriptionStatus: subscription?.subscription_status
      };
    } catch (error) {
      console.error('Error in getPlanInfo:', error);
      return {
        currentPlan: 'free',
        automationsLimit: 1,
        automationsUsed: 0,
        automationsRemaining: 1,
        aiMessagesLimit: 0,
        aiMessagesUsed: 0,
        aiMessagesRemaining: 0,
        isPro: false
      };
    }
  }
};
