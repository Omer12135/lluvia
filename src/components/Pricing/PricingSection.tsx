import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Zap, Users, Loader2, Linkedin } from 'lucide-react';
import { stripeProducts } from '../../stripe-config';
import { useAuth } from '../../context/AuthContext';

interface PricingSectionProps {
  onSelectPlan: (priceId: string) => void;
  loading?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, loading = false }) => {
  const { user } = useAuth();

  const getPlanIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free plan':
        return <Star className="w-6 h-6 text-gray-400" />;
      case 'pro plan':
        return <Users className="w-6 h-6 text-blue-500" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const renderFeature = (label: string) => {
    return (
      <div className="flex items-center space-x-3">
        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
        <span className="text-sm text-gray-300">{label}</span>
      </div>
    );
  };

  const getFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free plan':
        return [
          'Basic Workflow',
          '1 automation per month',
          'All trigger types',
          'Email support',
          'Standard templates',
          'Basic analytics',
          'Community support'
        ];
      case 'pro plan':
        return [
          'Complex Workflow',
          '50 automations per month',
          'All trigger types',
          'AI Chatbot (500 messages/month)',
          'Webhook integration',
          'Email support',
          'Automation templates',
          'Advanced analytics',
          'Priority support'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
        <p className="text-xl text-gray-400">Start free and scale as you grow</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {stripeProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white/5 rounded-2xl p-8 border transition-all duration-300 hover:bg-white/10 ${
              product.name === 'Pro Plan'
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {getPlanIcon(product.name)}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">
                  {product.price === 0 ? 'Free' : `$${product.price}`}
                </span>
                {product.price > 0 && (
                  <span className="text-gray-400">
                    {product.mode === 'subscription' ? '/month' : ' one-time'}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">{product.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              {getFeatures(product.name).map((feature, featureIndex) => (
                <div key={featureIndex}>
                  {renderFeature(feature)}
                </div>
              ))}
            </div>

            <button
              onClick={() => product.price > 0 ? onSelectPlan(product.priceId) : null}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                product.name === 'Pro Plan'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : product.price === 0
                  ? 'bg-gray-600 text-gray-300 cursor-default'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {product.price === 0 ? 'Current Plan' : `Get ${product.name}`}
                </span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* LinkedIn Section */}
      <div className="mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/20"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Linkedin className="w-8 h-8 text-blue-500" />
            <h3 className="text-2xl font-bold text-white">Follow Us on LinkedIn</h3>
          </div>
          <p className="text-gray-300 mb-6">Stay updated with the latest automation tips, industry insights, and company news</p>
          <a
            href="https://uk.linkedin.com/company/lluvia-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
          >
            <Linkedin className="w-5 h-5" />
            <span>Visit Our LinkedIn Page</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingSection;