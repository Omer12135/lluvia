import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  X,
  RefreshCw,
  Settings
} from 'lucide-react';

interface SubscriptionData {
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

const SubscriptionManagement: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.subscription_id) return;

    try {
      setCancelling(true);
      
      // Call Stripe API to cancel subscription
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.subscription_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Reload subscription data
      await loadSubscription();
      alert('Subscription cancelled successfully. You will retain access until the end of your billing period.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription?.subscription_id) return;

    try {
      setReactivating(true);
      
      // Call Stripe API to reactivate subscription
      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.subscription_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      // Reload subscription data
      await loadSubscription();
      alert('Subscription reactivated successfully!');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      alert('Failed to reactivate subscription. Please try again.');
    } finally {
      setReactivating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'past_due':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'canceled':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'trialing':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-purple-300/30 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-purple-300/30 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-purple-300/30 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
        <div className="text-center">
          <CreditCard className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
          <p className="text-purple-200">
            You don't have an active subscription. Upgrade to Pro to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border border-purple-400/30 rounded-xl">
            <CreditCard className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Subscription Management</h3>
            <p className="text-sm text-purple-200">Manage your Pro Plan subscription</p>
          </div>
        </div>
        <button
          onClick={loadSubscription}
          className="p-2 text-purple-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Subscription Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.subscription_status)}`}>
            {subscription.subscription_status.charAt(0).toUpperCase() + subscription.subscription_status.slice(1)}
          </span>
        </div>
        
        {subscription.payment_method_brand && (
          <div className="flex items-center space-x-2 text-sm text-purple-200">
            <CreditCard className="w-4 h-4" />
            <span>
              {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
            </span>
          </div>
        )}
      </div>

      {/* Billing Period */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Current Period</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-purple-200">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/20 pt-6">
        <div className="flex flex-col space-y-3">
          {subscription.subscription_status === 'active' && !subscription.cancel_at_period_end && (
            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  <span>Cancel Subscription</span>
                </>
              )}
            </button>
          )}

          {subscription.cancel_at_period_end && (
            <button
              onClick={handleReactivateSubscription}
              disabled={reactivating}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 hover:text-green-300 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reactivating ? (
                <>
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Reactivating...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Reactivate Subscription</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => window.open('https://billing.stripe.com/p/login/test_7sI00V8wB8wB8wB8w', '_blank')}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 hover:text-purple-300 rounded-xl transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Billing</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
