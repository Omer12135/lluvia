import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  Linkedin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './Auth/AuthModal';
import BlogSection from './BlogSection';
import { createClient } from '@supabase/supabase-js';
import { stripeProducts } from '../stripe-config';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth callback - Email confirmation sonrası code parameter'ı yakala
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      console.log('Auth callback detected with code:', code);
      
      // Email confirmation sonrası otomatik dashboard'a yönlendir
      // User state'in sync olması için daha uzun delay
      setTimeout(() => {
        console.log('Redirecting to dashboard after email confirmation...');
        navigate('/dashboard');
      }, 3000);
    }
  }, [searchParams, navigate]);

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
    
    if (!product) {
      console.error('Product not found for priceId:', priceId);
      return;
    }
    
    if (product.price === 0) {
      // Free plan - redirect to signup  
      navigate('/signup');
    } else {
      // Paid plans - redirect to actual Stripe checkout
      if (product.name.includes('Pro')) {
        window.open('https://buy.stripe.com/cNibJ23wibOe0bbflGfEk01', '_blank');
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

      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
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
          'Basic analytics'
        ];
      case 'pro plan':
        return [
          'Complex Workflow',
          '50 automations per month',
          'All trigger types',
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

  const isCurrentPlan = (productName: string) => {
    if (!user) return false;
    
    const planMap: { [key: string]: string } = {
      'free plan': 'free',
      'pro plan': 'pro'
    };
    
    return userProfile?.plan === planMap[productName.toLowerCase()];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
                  <path d="M5 7L5.5 9L8 9.5L5.5 10L5 12L4.5 10L2 9.5L4.5 9L5 7Z"/>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">LLUVIA AI</span>
            </div>

                         {/* Desktop Navigation */}
             <nav className="hidden lg:flex items-center space-x-6">
               <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">How It Works</a>
               <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Features</a>
               <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Pricing</a>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">Blog</Link>
              <button
                onClick={handleLogin}
                className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-sm sm:text-base font-medium"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden mt-4 pt-4 border-t border-white/10"
            >
                             <div className="flex flex-col space-y-3">
                 <a 
                   href="#how-it-works" 
                   className="text-gray-300 hover:text-white transition-colors text-base py-2"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   How It Works
                 </a>
                 <a 
                   href="#features" 
                   className="text-gray-300 hover:text-white transition-colors text-base py-2"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   Features
                 </a>
                <a 
                  href="#pricing" 
                  className="text-gray-300 hover:text-white transition-colors text-base py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                 <Link 
                   to="/blog" 
                   className="text-gray-300 hover:text-white transition-colors text-base py-2"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   Blog
                 </Link>
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-base py-2 text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleGetStarted();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-base font-medium w-full"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-32 pb-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Automate Your
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Workflow</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0"
            >
              Connect your favorite apps and automate repetitive tasks with our powerful AI-driven platform. 
              Save hours every day and focus on what matters most.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-center space-x-6 mb-6 sm:mb-8"
            >
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <span className="text-gray-300 text-sm font-medium">N8N</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <span className="text-gray-300 text-sm font-medium">Make (Integromat)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0"
            >
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <span>Start Automating Free</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button className="text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto py-4 sm:py-0">
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
              className="mt-8 sm:mt-12 flex flex-row items-center justify-center space-x-4 sm:space-x-8 text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-xs sm:text-base">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-xs sm:text-base">1 free automation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-xs sm:text-base">Setup in minutes</span>
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

             {/* How It Works Section */}
       <section id="how-it-works" className="py-12 sm:py-20 bg-black/20">
         <div className="container mx-auto px-4 sm:px-6">
           <div className="text-center mb-12 sm:mb-16">
             <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
             <p className="text-lg sm:text-xl text-gray-400">Create your automation in just 3 simple steps</p>
           </div>

           <div className="max-w-5xl mx-auto">
             {/* Steps */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
               {/* Step 1: Prompt */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="relative"
               >
                 <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 sm:p-8 border border-purple-500/20 text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <span className="text-2xl font-bold text-white">1</span>
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Prompt</h3>
                   <p className="text-gray-300 mb-6">Describe what you want to automate in natural language</p>
                                       <div className="bg-white/10 rounded-lg p-4 text-left h-20 flex items-center">
                      <p className="text-sm text-gray-300 italic">"When a new email arrives, save it to Google Sheets and send a notification to Slack"</p>
                    </div>
                 </div>
                 
                 {/* Arrow */}
                 <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                   <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                     <ArrowRight className="w-4 h-4 text-white" />
                   </div>
                 </div>
               </motion.div>

               {/* Step 2: Choose Trigger */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="relative"
               >
                 <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 sm:p-8 border border-blue-500/20 text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <span className="text-2xl font-bold text-white">2</span>
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Choose Trigger</h3>
                   <p className="text-gray-300 mb-6">Select what will start your automation</p>
                                       <div className="bg-white/10 rounded-lg p-4 text-left h-20 flex flex-col justify-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">New Email (Gmail)</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">New Form Submission</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">Scheduled Time</span>
                      </div>
                    </div>
                 </div>
                 
                 {/* Arrow */}
                 <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                   <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                     <ArrowRight className="w-4 h-4 text-white" />
                   </div>
                 </div>
               </motion.div>

               {/* Step 3: Choose Actions */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
               >
                 <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 sm:p-8 border border-green-500/20 text-center">
                   <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <span className="text-2xl font-bold text-white">3</span>
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Choose Actions</h3>
                   <p className="text-gray-300 mb-6">Define what happens when triggered</p>
                                       <div className="bg-white/10 rounded-lg p-4 text-left h-20 flex flex-col justify-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">Save to Google Sheets</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">Send Slack Message</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-300">Create Calendar Event</span>
                      </div>
                    </div>
                 </div>
               </motion.div>
             </div>

             {/* Result */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-blue-500/20 rounded-2xl p-6 sm:p-8 border border-emerald-500/30 text-center shadow-2xl"
             >
               {/* Animated Background Elements */}
               <div className="absolute inset-0 overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-xl animate-pulse"></div>
                 <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                 <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg animate-bounce"></div>
               </div>

               {/* Success Icon with Animation */}
               <motion.div
                 initial={{ scale: 0, rotate: -180 }}
                 animate={{ scale: 1, rotate: 0 }}
                 transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                 className="relative z-10 mb-6"
               >
                 <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-emerald-400/30">
                   <CheckCircle className="w-10 h-10 text-white animate-pulse" />
                 </div>
                 <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-xl animate-ping opacity-30"></div>
               </motion.div>

               {/* Title with Glow Effect */}
               <motion.h3
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10 drop-shadow-lg"
               >
                 <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                   Automation Created!
                 </span>
               </motion.h3>

               {/* Subtitle */}
               <motion.p
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.7 }}
                 className="text-lg sm:text-xl text-gray-200 mb-8 relative z-10"
               >
                 Your automation is now live and will run automatically
               </motion.p>

               {/* Status Card with Enhanced Design */}
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.8 }}
                 className="relative z-10 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-xl p-6 max-w-2xl mx-auto border border-white/20 shadow-2xl"
               >
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                   {/* Status */}
                   <div className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-400/30">
                     <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                     <span className="text-sm font-medium text-emerald-200">Status: Active</span>
                   </div>

                   {/* Last Run */}
                   <div className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                     <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                     <span className="text-sm font-medium text-blue-200">Last run: 2 min ago</span>
                   </div>

                   {/* Download Button */}
                   <motion.button
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 border border-emerald-400/30 group"
                   >
                     <motion.svg
                       animate={{ y: [0, -2, 0] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="w-5 h-5 group-hover:scale-110 transition-transform"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                     >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </motion.svg>
                     <span className="group-hover:scale-105 transition-transform">Download</span>
                   </motion.button>
                 </div>

                 {/* Success Message */}
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 1 }}
                   className="mt-4 text-center"
                 >
                   <p className="text-sm text-emerald-300 font-medium">
                     🎉 Your automation is ready to boost your productivity!
                   </p>
                 </motion.div>
               </motion.div>
             </motion.div>
           </div>
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
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-base sm:text-xl text-gray-400">Start free and scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {stripeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 hover:bg-white/10 ${
                  product.name === 'Pro Plan'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >


                <div className="text-center mb-6 sm:mb-8">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    {getPlanIcon(product.name)}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-4xl font-bold text-white">
                      {product.price === 0 ? 'Free' : `$${product.price}`}
                    </span>
                    {product.price > 0 && (
                      <span className="text-gray-400 text-sm sm:text-base">
                        {product.mode === 'subscription' ? '/month' : ' one-time'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">{product.description}</p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {getFeatures(product.name).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (product.name === 'Pro Plan') {
                      window.open('https://buy.stripe.com/3cI14ogj405we21ddyfEk02', '_blank');
                    } else {
                      handleSelectPlan(product.priceId);
                    }
                  }}
                  disabled={isCurrentPlan(product.name)}
                  className={`w-full py-3 sm:py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                    product.name === 'Pro Plan'
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

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">What is LLUVIA AI?</h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Main Description */}
            <div className="bg-white/5 rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/10 mb-8">
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6">
                LLUVIA AI is an advanced AI-powered platform that enables individual users and businesses to easily create their own automation solutions. By integrating with powerful automation tools such as N8N and Make (Integromat), it helps you transform complex business processes into smart automations.
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
                Without requiring any technical knowledge, you can set up and manage any type of automation—from daily tasks to corporate processes—on your own.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 sm:p-6 border border-purple-500/20 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">2K+</div>
                <div className="text-sm sm:text-base text-gray-300">Happy Users</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-4 sm:p-6 border border-blue-500/20 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">80h</div>
                <div className="text-sm sm:text-base text-gray-300">Hours Saved / Month</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-4 sm:p-6 border border-green-500/20 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-sm sm:text-base text-gray-300">Integrations</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-4 sm:p-6 border border-orange-500/20 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-sm sm:text-base text-gray-300">Uptime</div>
              </div>
            </div>

            {/* LinkedIn Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 sm:p-8 border border-blue-500/20 text-center"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Linkedin className="w-8 h-8 text-blue-500" />
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Follow Us on LinkedIn</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-300 mb-6">Stay updated with the latest automation tips, industry insights, and company news</p>
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
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 sm:p-12 border border-purple-500/20 text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">Join thousands of businesses already saving time with LLUVIA AI</p>
            
            <div className="flex justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
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