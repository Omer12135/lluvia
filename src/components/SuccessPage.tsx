import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Mail, Zap, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface SuccessPageProps {
  plan?: string;
  email?: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ plan = 'basic', email }) => {
  const { userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if this is a successful payment redirect
    const urlParams = new URLSearchParams(window.location.search);
    const successPlan = urlParams.get('plan') || plan;
    const successEmail = urlParams.get('email') || email;

    if (successPlan && successEmail) {
      // Update user profile based on the plan
      updateUserPlan(successPlan, successEmail);
    } else {
      setLoading(false);
    }
  }, [plan, email]);

  const updateUserPlan = async (planType: string, userEmail: string) => {
    try {
      setLoading(true);

      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('user_id, plan')
        .eq('email', userEmail)
        .single();

      if (userError || !userData) {
        setError('Kullanıcı bulunamadı');
        return;
      }

      // Check if user already has the plan
      if (userData.plan === planType) {
        setLoading(false);
        return;
      }

      // Update plan based on type
      let automationsLimit = 1;
      let aiMessagesLimit = 0;

      if (planType === 'basic') {
        automationsLimit = 10;
        aiMessagesLimit = 100;
      } else if (planType === 'pro') {
        automationsLimit = 50;
        aiMessagesLimit = 1000;
      }

      // Update user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          plan: planType,
          automations_limit: automationsLimit,
          ai_messages_limit: aiMessagesLimit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userData.user_id);

      if (updateError) {
        setError('Plan güncellenirken bir hata oluştu');
        return;
      }

      // Update local profile if it's the current user
      if (userProfile && userProfile.email === userEmail) {
        await updateProfile({
          plan: planType as 'free' | 'basic' | 'pro',
          automations_limit: automationsLimit,
          ai_messages_limit: aiMessagesLimit
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error updating user plan:', error);
      setError('Plan güncellenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const getPlanInfo = (planType: string) => {
    switch (planType) {
      case 'basic':
        return {
          name: 'Basic Plan',
          price: '$1',
          features: [
            { icon: Zap, text: '10 Otomasyon Hakkı', color: 'text-blue-400' },
            { icon: Sparkles, text: '100 AI Mesaj Hakkı', color: 'text-purple-400' },
            { icon: Shield, text: 'Temel Destek', color: 'text-green-400' }
          ],
          color: 'from-blue-500 to-cyan-500',
          borderColor: 'border-blue-500/30',
          bgColor: 'bg-blue-500/10'
        };
      case 'pro':
        return {
          name: 'Pro Plan',
          price: '$39',
          features: [
            { icon: Zap, text: '50 Otomasyon Hakkı', color: 'text-yellow-400' },
            { icon: Sparkles, text: '1000 AI Mesaj Hakkı', color: 'text-purple-400' },
            { icon: Shield, text: 'Öncelikli Destek', color: 'text-green-400' }
          ],
          color: 'from-purple-500 to-pink-500',
          borderColor: 'border-purple-500/30',
          bgColor: 'bg-purple-500/10'
        };
      default:
        return {
          name: 'Free Plan',
          price: 'Ücretsiz',
          features: [
            { icon: Zap, text: '1 Otomasyon Hakkı', color: 'text-gray-400' },
            { icon: Sparkles, text: 'AI Mesaj Yok', color: 'text-gray-400' },
            { icon: Shield, text: 'Topluluk Desteği', color: 'text-gray-400' }
          ],
          color: 'from-gray-500 to-gray-600',
          borderColor: 'border-gray-500/30',
          bgColor: 'bg-gray-500/10'
        };
    }
  };

  const planInfo = getPlanInfo(plan);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Planınız güncelleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Hata Oluştu</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Dashboard'a Git
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Ödeme Başarılı! 🎉</h1>
          <p className="text-gray-300 text-lg">
            {planInfo.name} başarıyla aktif edildi
          </p>
        </div>

        {/* Plan Details */}
        <div className="mb-8">
          <div className={`p-6 rounded-xl border-2 ${planInfo.borderColor} ${planInfo.bgColor}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{planInfo.name}</h3>
              <div className={`px-4 py-2 bg-gradient-to-r ${planInfo.color} rounded-lg`}>
                <span className="text-white font-bold text-lg">{planInfo.price}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {planInfo.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-r ${planInfo.color} rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        {email && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Email Adresi</p>
                <p className="text-blue-400 text-sm">{email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            <span>Dashboard'a Git</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => window.location.href = '/automation-creator'}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
          >
            <Zap className="w-4 h-4" />
            <span>İlk Otomasyonunuzu Oluşturun</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Planınız otomatik olarak aktif edildi. Artık tüm özelliklerden yararlanabilirsiniz!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;