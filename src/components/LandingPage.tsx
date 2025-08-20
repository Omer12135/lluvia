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
  Loader2
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
      if (product.name.includes('Starter')) {
        window.open('https://buy.stripe.com/eVq3cw4Am4lMcXXflGfEk00', '_blank');
      } else if (product.name.includes('Pro')) {
        window.open('https://buy.stripe.com/cNibJ23wibOe0bbflGfEk01', '_blank');
      }
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Smart Triggers",
      description: "Webhook, email, schedule, and database triggers to start your automations"
    },
    {
      icon: <Bot className="w-8 h-8 text-blue-500" />,
      title: "AI Assistant",
      description: "Get help creating workflows with our intelligent automation assistant"
    },
    {
      icon: <Database className="w-8 h-8 text-green-500" />,
      title: "Data Integration",
      description: "Connect with Airtable, Google Sheets, CRM systems, and hundreds of apps"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Enterprise Security",
      description: "Bank-level security with encryption and compliance standards"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: "Analytics Dashboard",
      description: "Track performance, monitor success rates, and optimize your workflows"
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-500" />,
      title: "Team Collaboration",
      description: "Share automations, manage permissions, and work together seamlessly"
    }
  ];

  const automationExamples = [
    {
      title: "Email to CRM Sync",
      description: "Automatically add new email contacts to your CRM system",
      steps: ["Email received", "Extract contact info", "Add to CRM", "Send notification"]
    },
    {
      title: "Invoice Processing",
      description: "Process invoices from email attachments to accounting software",
      steps: ["Email with attachment", "Extract invoice data", "Create record", "Send confirmation"]
    },
    {
      title: "Social Media Monitoring",
      description: "Track mentions and automatically respond or create tickets",
      steps: ["Social mention detected", "Analyze sentiment", "Route to team", "Auto-respond"]
    }
  ];

  const getPlanIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'basic plan':
        return <Star className="w-6 h-6 text-gray-400" />;
      case 'starter plan':
        return <Zap className="w-6 h-6 text-purple-500" />;
      case 'pro plan':
        return <Users className="w-6 h-6 text-blue-500" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const getFeatures = (name: string) => {
    switch (name.toLowerCase()) {
      case 'basic plan':
        return [
          '2 automations per month',
          'All trigger types',
          'Email support',
          'Standard templates',
          'Basic analytics',
          'Community support'
        ];
      case 'starter plan':
        return [
          '15 automations per month',
          'All trigger types',
          'AI Chatbot (100 messages/month)',
          'Webhook integration',
          'Email support',
          'Automation templates',
          'Advanced analytics',
          'Team management (3 users)',
          'Priority support'
        ];
      case 'pro plan':
        return [
          'Everything in Starter',
          '50 automations per month',
          'All trigger types',
          'AI Chatbot (1000 messages/month)',
          'Webhook integration',
          'Priority support',
          '1-on-1 onboarding',
          'SLA guarantee',
          'Bulk operations',
          'Advanced security',
          'Custom workflows',
          'Dedicated account manager',
          'Team management (10 users)',
          'Custom integrations'
        ];
      default:
        return [];
    }
  };

  const isCurrentPlan = (productName: string) => {
    if (!user) return false;
    
    const planMap: { [key: string]: string } = {
      'basic plan': 'free',
      'starter plan': 'starter', 
      'pro plan': 'pro'
    };
    
    return user.plan === planMap[productName.toLowerCase()];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AutomateAI</span>
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
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Automate Your
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Workflow</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed"
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Start Automating Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                <span>Watch Demo</span>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
                </div>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center space-x-8 text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>2 free automations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Setup in minutes</span>
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
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Automation Features</h2>
            <p className="text-xl text-gray-400">Everything you need to automate your business processes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-400">Start free and scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {stripeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/5 rounded-2xl p-8 border transition-all duration-300 hover:bg-white/10 ${
                  product.name === 'Starter Plan'
                    ? 'border-purple-500 ring-2 ring-purple-500/20 scale-105'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {product.name === 'Starter Plan' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

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
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(product.priceId)}
                  disabled={isCurrentPlan(product.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    product.name === 'Starter Plan'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
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
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-12 border border-purple-500/20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of businesses already saving time with LLUVIA AI</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
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