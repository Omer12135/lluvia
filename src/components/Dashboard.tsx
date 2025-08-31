import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Workflow, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Download,
  ArrowLeft,
  Settings,
  BarChart3,
  Zap,
  User,
  Crown,
  Bot,
  Menu,
  X
} from 'lucide-react';
import AutomationCreator from './AutomationCreator';
import AutomationHistory from './AutomationHistory';
import ExampleAutomations from './ExampleAutomations';
import AutomationGuidance from './AutomationGuidance';

import { useAutomation } from '../context/AutomationContext';
import { getProductByPriceId } from '../stripe-config';
import { webhookService } from '../services/webhookService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, logout, forceSessionSync } = useAuth();
  const { automations, remainingAutomations, currentMonthUsage, automationLimit } = useAutomation();
  const [activeTab, setActiveTab] = useState('create');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // ✅ Console log ekle - Debug için
  console.log('Dashboard rendered, user:', user);
  console.log('Dashboard rendered, userProfile:', userProfile);
  console.log('Dashboard rendered, automations:', automations);

  // Listen for tab change events from child components
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('changeTab', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, []);

  // Auth callback handling - Ana sekmede email confirmation sonrası
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !user) {
      console.log('Dashboard: Auth callback detected, starting force session sync...');
      
      const handleAuthCallback = async () => {
        try {
          console.log('Dashboard: Starting force session sync...');
          await forceSessionSync();
          console.log('Dashboard: Force session sync completed');
        } catch (error) {
          console.error('Dashboard: Force session sync failed:', error);
        }
      };

      handleAuthCallback();
    }
  }, [searchParams, user, forceSessionSync]);

  // Message listener - Yeni sekmeden gelen auth callback bilgisini yakala
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log('Dashboard: Message received:', event.data);
      
      if (event.data.type === 'AUTH_CALLBACK' && !user) {
        console.log('Dashboard: Received auth callback from new tab:', event.data);
        
        try {
          console.log('Dashboard: Starting force session sync from message...');
          await forceSessionSync();
          console.log('Dashboard: Force session sync completed from message');
        } catch (error) {
          console.error('Dashboard: Force session sync failed from message:', error);
        }
      }
    };

    console.log('Dashboard: Setting up message listener...');
    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log('Dashboard: Removing message listener...');
      window.removeEventListener('message', handleMessage);
    };
  }, [user, forceSessionSync]);

  // Loading state - User state sync olana kadar bekle
  if (!user) {
    console.log('Dashboard: User not found, waiting for auth state sync...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Syncing authentication...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  // Get user-specific automations
  const userAutomations = automations.filter(a => a.userId === user.id);
  const completedAutomations = userAutomations.filter(a => a.status === 'completed').length;
  const runningAutomations = userAutomations.filter(a => a.status === 'running').length;

  // Get user stats from profile
  const userAutomationsUsed = userProfile?.automations_used || 0;
  const userAutomationsLimit = userProfile?.automations_limit || 2;
  const userPlan = userProfile?.plan || 'free';

  const tabs = [
    { id: 'create', label: 'Create', icon: <Plus className="w-4 h-4" />, description: 'Build automations' },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" />, description: 'View past runs' },
    { id: 'examples', label: 'Examples', icon: <Zap className="w-4 h-4" />, description: 'Browse templates' },
    { id: 'guidance', label: 'Guide', icon: <Settings className="w-4 h-4" />, description: 'Learn best practices' },
  ];

  // Calculate stats based on user's actual data
  const getTotalAutomations = () => {
    return userAutomations.length;
  };

  const getSuccessRate = () => {
    return "98.5%"; // Fixed success rate for all users
  };

  const getTimeSaved = () => {
    return "80h/monthly";
  };

  // Webhook test fonksiyonu
  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      // Önce bağlantıyı test et
      const connectionSuccess = await webhookService.testWebhook();
      if (!connectionSuccess) {
        alert('❌ Webhook bağlantısı başarısız!');
        return;
      }

      // Sonra test verisi gönder
      const dataSuccess = await webhookService.testWebhookWithData();
      if (dataSuccess) {
        alert('✅ Webhook bağlantısı ve veri gönderimi başarılı!');
      } else {
        alert('⚠️ Bağlantı var ama veri gönderimi başarısız!');
      }
    } catch (error) {
      console.error('Webhook test error:', error);
      alert('❌ Webhook test hatası!');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // Get current plan name
  const getCurrentPlanName = () => {
    if (!userProfile) return 'Free Plan';
    
    switch (userProfile.plan) {
      case 'pro':
        return 'Pro Plan';
      case 'custom':
        return 'Custom Plan';
      default:
        return 'Free Plan';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header - Ultra Compact */}
      <div className="lg:hidden bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
                    <path d="M5 7L5.5 9L8 9.5L5.5 10L5 12L4.5 10L2 9.5L4.5 9L5 7Z"/>
                  </svg>
                </div>
                <span className="text-base font-bold text-white">LLUVIA AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white/10 rounded-lg px-2 py-1">
                <Crown className={`w-3 h-3 ${
                  getCurrentPlanName().includes('Pro') ? 'text-blue-500' :
                  'text-gray-400'
                }`} />
                <span className="text-xs font-medium text-white">{getCurrentPlanName().split(' ')[0]}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-1 rounded-lg hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu - Compact */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 pt-2 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">{completedAutomations} Done</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">{runningAutomations} Running</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                    title="Test Webhook"
                  >
                    {isTestingWebhook ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"/>
                    <path d="M5 7L5.5 9L8 9.5L5.5 10L5 12L4.5 10L2 9.5L4.5 9L5 7Z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">LLUVIA AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                                  <Crown className={`w-4 h-4 ${
                    getCurrentPlanName().includes('Pro') ? 'text-blue-500' :
                    'text-gray-400'
                  }`} />
                <span className="text-sm font-medium text-white">{getCurrentPlanName()}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">{completedAutomations} Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">{runningAutomations} Running</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  title="Test Webhook"
                >
                  {isTestingWebhook ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="container mx-auto px-3 lg:px-6 py-3 lg:py-8">
        {/* Stats Cards - Ultra Compact Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-3 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-2 lg:p-6 border border-white/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-gray-400 text-xs lg:text-sm font-medium">Total</p>
                <p className="text-lg lg:text-3xl font-bold text-white">{getTotalAutomations()}</p>
              </div>
              <BarChart3 className="w-4 h-4 lg:w-8 lg:h-8 text-purple-500 mt-1 lg:mt-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-2 lg:p-6 border border-white/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-gray-400 text-xs lg:text-sm font-medium">Remaining</p>
                <p className="text-lg lg:text-3xl font-bold text-white">{remainingAutomations}</p>
              </div>
              <Zap className="w-4 h-4 lg:w-8 lg:h-8 text-yellow-500 mt-1 lg:mt-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-2 lg:p-6 border border-white/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-gray-400 text-xs lg:text-sm font-medium">Used This Month</p>
                <p className="text-lg lg:text-3xl font-bold text-white">{currentMonthUsage}/{automationLimit}</p>
              </div>
              <Clock className="w-4 h-4 lg:w-8 lg:h-8 text-blue-500 mt-1 lg:mt-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl p-2 lg:p-6 border border-white/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-gray-400 text-xs lg:text-sm font-medium">Success</p>
                <p className="text-lg lg:text-3xl font-bold text-white">{getSuccessRate()}</p>
              </div>
              <CheckCircle className="w-4 h-4 lg:w-8 lg:h-8 text-green-500 mt-1 lg:mt-0" />
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation - Ultra Compact Mobile */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg lg:rounded-xl border border-white/20 mb-3 lg:mb-8 overflow-hidden">
          {/* Mobile Tab Navigation - Ultra Compact */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center min-w-[80px] px-3 py-3 font-medium transition-all duration-200 text-center border-b-2 ${
                    activeTab === tab.id
                      ? 'text-white border-purple-500 bg-gradient-to-r from-purple-600/30 to-blue-600/30'
                      : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mb-1.5 ${
                    activeTab === tab.id ? 'bg-purple-500/20' : 'bg-white/10'
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="text-xs font-semibold leading-tight">{tab.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden lg:grid lg:grid-cols-4 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-2 px-4 py-4 font-medium transition-all duration-200 text-center ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-b-4 border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-105'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === tab.id ? 'bg-purple-500/20' : 'bg-white/10'
                }`}>
                  {tab.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content - Mobile Optimized */}
          <div className="p-3 lg:p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'create' && <AutomationCreator />}
              {activeTab === 'history' && <AutomationHistory />}

              {activeTab === 'examples' && <ExampleAutomations />}
              {activeTab === 'guidance' && <AutomationGuidance />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;