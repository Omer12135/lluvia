import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Workflow, 
  Zap, 
  Clock, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Menu,
  X,
  Bot,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  BarChart3,
  Loader2,
  Share2,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './Auth/AuthModal';
import { createClient } from '@supabase/supabase-js';
import { stripeProducts } from '../stripe-config';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('register');
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleSelectPlan = async (priceId: string) => {
    const product = stripeProducts.find(p => p.priceId === priceId);
    
    if (product?.price === 0) {
      // Free plan - redirect to signup  
      navigate('/signup');
    } else {
      // Paid plans - redirect to actual Stripe checkout
      if (product.name.includes('Pro')) {
        window.open('https://buy.stripe.com/cNibJ23wibOe0bbflGfEk01', '_blank');
      } else if (product.name.includes('Custom')) {
        // For Custom plan, redirect to contact form or custom checkout
        window.open('https://calendly.com/lluvia-ai/custom-plan', '_blank');
      }
    }
  };

  const features = [
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Visual Workflow Builder",
      description: "Create complex automations with our intuitive drag-and-drop interface"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "500+ Integrations",
      description: "Connect with your favorite apps and services seamlessly"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Execution",
      description: "Monitor and track your automations in real-time"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together with your team on automation projects"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Get insights into your automation performance and usage"
    }
  ];

  const automationExamples = [
    {
      title: "Email Marketing",
      description: "Automatically send personalized emails based on user behavior",
      icon: <Mail className="w-5 h-5" />,
      tags: ["Gmail", "Mailchimp", "Auto-respond"]
    },
    {
      title: "CRM Sync",
      description: "Keep your customer data synchronized across all platforms",
      icon: <Database className="w-5 h-5" />,
      tags: ["Salesforce", "HubSpot", "Sync"]
    },
    {
      title: "Social Media",
      description: "Schedule and post content across multiple social platforms",
      icon: <Share2 className="w-5 h-5" />,
      tags: ["Twitter", "LinkedIn", "Schedule"]
    },
    {
      title: "Customer Support",
      description: "Automate ticket creation and response workflows",
      icon: <MessageSquare className="w-5 h-5" />,
      tags: ["Zendesk", "Slack", "Auto-respond"]
    }
  ];

  const getPlanIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free plan':
        return <Star className="w-6 h-6 text-gray-400" />;
      case 'pro plan':
        return <Users className="w-6 h-6 text-blue-500" />;
      case 'custom plan':
        return <Crown className="w-6 h-6 text-purple-500" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const getFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free plan':
        return [
          '2 automations per month',
          'All trigger types',
          'Email support',
          'Standard templates',
          'Basic analytics',
          'Community support'
        ];
      case 'pro plan':
        return [
          '50 automations per month',
          'All trigger types',
          'AI Chatbot (500 messages/month)',
          'Webhook integration',
          'Email support',
          'Automation templates',
          'Advanced analytics',
          'Priority support'
        ];
      case 'custom plan':
        return [
          'Everything in Pro',
          'Unlimited automations',
          'Custom workflows',
          'Custom integrations',
          'Orchestra AI Agent',
          '1-on-1 onboarding',
          'SLA guarantee',
          'Bulk operations',
          'Advanced security',
          'Dedicated support',
          'Setup by LLUVIA team'
        ];
      default:
        return [];
    }
  };

  const isCurrentPlan = (productName: string) => {
    if (!user) return false;
    
    const planMap: { [key: string]: string } = {
      'free plan': 'free',
      'pro plan': 'pro',
      'custom plan': 'custom'
    };
    
    return user.plan === planMap[productName.toLowerCase()];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Workflow className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white">AutomateAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Welcome, {user.name}</span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogin}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                
                {user ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-left"
                  >
                    Dashboard
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleLogin}
                      className="text-gray-300 hover:text-white transition-colors text-left"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Automate Your
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Workflow</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed"
            >
              Connect your favorite apps and automate repetitive tasks with our powerful AI-driven platform. 
              Save hours every day and focus on what matters most.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <span>Start Automating Free</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
                <span>Watch Demo</span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-white border-y-[3px] sm:border-y-[4px] border-y-transparent ml-0.5 sm:ml-1"></div>
                </div>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-sm sm:text-base">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-sm sm:text-base">2 free automations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-sm sm:text-base">Setup in minutes</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Powerful Automation Features</h2>
            <p className="text-lg sm:text-xl text-gray-400">Everything you need to automate your business processes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4 sm:mb-6">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-lg sm:text-xl text-gray-400">Start free and scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {stripeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/5 rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:bg-white/10 ${
                  product.name === 'Custom Plan'
                    ? 'border-purple-500 ring-2 ring-purple-500/20 sm:scale-105'
                    : product.name === 'Pro Plan'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-white/10 hover:border-white/20'
                }`}
              >
                {product.name === 'Custom Plan' && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Enterprise
                    </span>
                  </div>
                )}

                <div className="text-center mb-6 sm:mb-8">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {getPlanIcon(product.name)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {product.price === 0 ? 'Free' : `$${product.price}`}
                    </span>
                    {product.price > 0 && (
                      <span className="text-gray-400 text-sm sm:text-base">
                        {product.mode === 'subscription' ? '/month' : ' one-time'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm">{product.description}</p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {getFeatures(product.name).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 sm:space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(product.priceId)}
                  disabled={isCurrentPlan(product.name)}
                  className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                    product.name === 'Custom Plan'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : product.name === 'Pro Plan'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : isCurrentPlan(product.name)
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span>
                    {product.price === 0 ? 'Start Free' : 
                     isCurrentPlan(product.name) ? 'Current Plan' :
                     `Choose ${product.name}`}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 sm:p-12 border border-purple-500/20 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">Join thousands of businesses already saving time with LLUVIA AI</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button className="bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 w-full sm:w-auto">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;