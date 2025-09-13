import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  CheckCircle, 
  ArrowUpRight, 
  Mail, 
  CreditCard,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface PlanUpgradeProps {
  onClose?: () => void;
}

const PlanUpgrade: React.FC<PlanUpgradeProps> = ({ onClose }) => {
  const { userProfile, updateProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'payment' | 'success'>('email');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Lütfen geçerli bir email adresi girin');
        return;
      }

      // Check if email is already in use
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser && existingUser.email !== userProfile?.email) {
        setError('Bu email adresi zaten kullanımda');
        return;
      }

      // If email is valid and available, proceed to payment
      setStep('payment');
    } catch (error) {
      console.error('Email validation error:', error);
      setError('Email doğrulama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };


  // Test mode: Direct upgrade function
  const handleTestUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      if (userProfile) {
        // Basic plan upgrade
        await updateProfile({
          plan: 'basic',
          automations_limit: 10,
          ai_messages_limit: 100
        });
        
        setStep('success');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setError(`Upgrade failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Stripe checkout session
  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          plan: 'basic',
          priceId: 'price_basic_plan', // Basic plan price ID
          successUrl: `${window.location.origin}/success?plan=basic`,
          cancelUrl: `${window.location.origin}/pricing`
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      setError('Ödeme sayfası oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };


  const basicPlan = {
    name: 'Basic Plan',
    price: '$1',
    productId: 'prod_T2eC5v6BDh4AFg',
    features: [
      { icon: Zap, text: '10 Otomasyon Hakkı', color: 'text-blue-400' },
      { icon: Sparkles, text: '100 AI Mesaj Hakkı', color: 'text-purple-400' },
      { icon: Shield, text: 'Temel Destek', color: 'text-green-400' }
    ],
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10'
  };

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 max-w-md w-full"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Basic Plan Aktif! 🎉</h2>
            <p className="text-gray-300 mb-6">
              Tebrikler! Basic planınız başarıyla aktif edildi. Artık 10 otomasyon hakkınız var.
            </p>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Dashboard'a Git
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Pro Plan'a Yükselt</h2>
              <p className="text-gray-300">Daha fazla otomasyon hakkı kazanın</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Basic Plan */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Plan</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border-2 border-blue-500/30 bg-blue-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">{basicPlan.name}</h4>
              <div className={`px-4 py-2 bg-gradient-to-r ${basicPlan.color} rounded-lg`}>
                <span className="text-white font-bold text-lg">{basicPlan.price}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {basicPlan.features.map((feature, featureIndex) => {
                const Icon = feature.icon;
                return (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-r ${basicPlan.color} rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {step === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Basic Plan için Email Adresiniz
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Bu email adresi basic planınızla ilişkilendirilecek ve sistem tarafından tanınacak.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Kontrol Ediliyor...</span>
                    </>
                  ) : (
                    <>
                      <span>Devam Et</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-2">Ödeme Bilgileri</h3>
              <p className="text-gray-300 mb-4">
                Email adresiniz doğrulandı: <span className="text-blue-400 font-medium">{email}</span>
              </p>
              <p className="text-sm text-gray-400">
                Basic plana geçiş yaparak 10 otomasyon hakkı kazanacaksınız.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('email')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Geri
                </button>
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Ödeme Sayfasına Yönlendiriliyor...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Basic Plan'a Geç - $1</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3">veya</p>
                <button
                  onClick={handleTestUpgrade}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Test: Hemen Basic Plan'a Geç</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Test modunda ödeme yapmadan plan yükseltme
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PlanUpgrade;