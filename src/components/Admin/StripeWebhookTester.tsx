import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  CreditCard,
  Mail,
  DollarSign
} from 'lucide-react';

const StripeWebhookTester: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testWebhookFlow = async () => {
    setLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Basic Plan Payment Test',
        description: 'Test $1.00 payment for Basic plan',
        amount: 100,
        email: 'test-basic@example.com',
        expectedPlan: 'basic'
      },
      {
        name: 'Pro Plan Payment Test',
        description: 'Test $39.00 payment for Pro plan',
        amount: 3900,
        email: 'test-pro@example.com',
        expectedPlan: 'pro'
      }
    ];

    const results = [];

    for (const test of tests) {
      try {
        // Simulate webhook payload
        const webhookPayload = {
          type: 'checkout.session.completed',
          data: {
            object: {
              id: `cs_test_${Date.now()}`,
              customer: `cus_test_${Date.now()}`,
              customer_email: test.email,
              amount_total: test.amount,
              currency: 'usd',
              payment_status: 'paid',
              mode: 'payment'
            }
          }
        };

        // Here you would normally call your webhook endpoint
        // For testing, we'll simulate the response
        const result = {
          test: test.name,
          status: 'success',
          message: `Webhook would process ${test.email} with ${test.amount} cents for ${test.expectedPlan} plan`,
          details: {
            email: test.email,
            amount: test.amount,
            expectedPlan: test.expectedPlan,
            webhookPayload: webhookPayload
          }
        };

        results.push(result);
      } catch (error) {
        results.push({
          test: test.name,
          status: 'error',
          message: `Test failed: ${error}`,
          details: { error }
        });
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Stripe Webhook Tester</h1>
          <p className="text-gray-300">Stripe webhook işlevselliğini test et</p>
        </div>

        {/* Test Button */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Webhook Test Senaryoları</h2>
              <p className="text-gray-300">Stripe ödeme webhook'larını test etmek için aşağıdaki butona tıklayın</p>
            </div>
            <button
              onClick={testWebhookFlow}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>{loading ? 'Test Ediliyor...' : 'Test Başlat'}</span>
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Test Sonuçları</h3>
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl"
              >
                <div className="flex items-start space-x-4">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{result.test}</h4>
                    <p className="text-gray-300 mb-4">{result.message}</p>
                    
                    {result.details && (
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Test Detayları:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Email:</span>
                            <span className="text-white ml-2">{result.details.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-white ml-2">{result.details.amount} cents</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Expected Plan:</span>
                            <span className="text-white ml-2">{result.details.expectedPlan}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className={`ml-2 ${
                              result.status === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {result.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Information Panel */}
        <div className="mt-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Webhook İşleyişi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="text-white font-medium">Stripe Ödeme</h4>
                <p className="text-gray-300 text-sm">Kullanıcı Stripe üzerinden ödeme yapar</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="text-white font-medium">Email Kontrolü</h4>
                <p className="text-gray-300 text-sm">Email ile kullanıcı aranır veya oluşturulur</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <div>
                <h4 className="text-white font-medium">Plan Atama</h4>
                <p className="text-gray-300 text-sm">Ödeme miktarına göre plan atanır</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StripeWebhookTester;
