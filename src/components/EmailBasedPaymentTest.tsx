import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CreditCard, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

const EmailBasedPaymentTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'basic' | 'pro'>('basic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const testEmailBasedPayment = async () => {
    if (!email) {
      setResult({ type: 'error', message: 'Lütfen bir email adresi girin' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          plan: plan,
          priceId: plan === 'basic' ? 'price_basic_plan' : 'price_1Rs2mPK4TeoPEcnVVGOmeNcs',
          successUrl: `${window.location.origin}/success?plan=${plan}&email=${encodeURIComponent(email)}`,
          cancelUrl: `${window.location.origin}/test?cancelled=true`
        }),
      });

      const data = await response.json();

      if (data.error) {
        setResult({ type: 'error', message: data.error });
      } else if (data.url) {
        setResult({ 
          type: 'success', 
          message: 'Stripe checkout sayfası oluşturuldu! Yönlendiriliyor...' 
        });
        
        // Redirect to Stripe checkout
        setTimeout(() => {
          window.location.href = data.url;
        }, 2000);
      } else {
        setResult({ type: 'error', message: 'Beklenmeyen bir hata oluştu' });
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult({ type: 'error', message: 'API çağrısı sırasında bir hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl w-fit mx-auto mb-4">
            <TestTube className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Tabanlı Ödeme Testi</h1>
          <p className="text-gray-300">
            Bu test sayfası email tabanlı plan yükseltme özelliğini test etmek için kullanılır.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Test Email Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Bu email adresi Supabase'de kayıtlı olmalıdır.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Test Edilecek Plan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlan('basic')}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  plan === 'basic'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Basic Plan</div>
                  <div className="text-sm opacity-75">$1</div>
                </div>
              </button>
              <button
                onClick={() => setPlan('pro')}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  plan === 'pro'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">Pro Plan</div>
                  <div className="text-sm opacity-75">$39</div>
                </div>
              </button>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${
                result.type === 'success' 
                  ? 'bg-green-500/20 border-green-500/30' 
                  : 'bg-red-500/20 border-red-500/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                {result.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <p className={`text-sm ${
                  result.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.message}
                </p>
              </div>
            </motion.div>
          )}

          <button
            onClick={testEmailBasedPayment}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Test Ediliyor...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>{plan === 'basic' ? 'Basic Plan Test Ödemesi ($1)' : 'Pro Plan Test Ödemesi ($39)'}</span>
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Bu test gerçek bir ödeme işlemi başlatır. Test kartı kullanın:
              <br />
              <code className="bg-gray-800 px-2 py-1 rounded text-green-400">
                4242 4242 4242 4242
              </code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailBasedPaymentTest;
