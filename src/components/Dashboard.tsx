import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
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
  Bot
} from 'lucide-react';
import AutomationCreator from './AutomationCreator';
import AutomationHistory from './AutomationHistory';
import ExampleAutomations from './ExampleAutomations';
import AutomationGuidance from './AutomationGuidance';
import AIChatInterface from './AI/AIChatInterface';
import { useAutomation } from '../context/AutomationContext';
import { getProductByPriceId } from '../stripe-config';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { automations } = useAutomation();
  const [activeTab, setActiveTab] = useState('create');

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

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Get user-specific automations
  const userAutomations = automations.filter(a => a.userId === user.id);
  const completedAutomations = userAutomations.filter(a => a.status === 'completed').length;
  const runningAutomations = userAutomations.filter(a => a.status === 'running').length;

  const tabs = [
    { id: 'create', label: 'Create New', icon: <Plus className="w-4 h-4" />, description: 'Build custom automations' },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" />, description: 'View past automations' },
    { id: 'ai-chat', label: 'AI Chatbot', icon: <Bot className="w-4 h-4" />, description: 'Get AI assistance' },
    { id: 'examples', label: 'Examples', icon: <Zap className="w-4 h-4" />, description: 'Browse templates' },
    { id: 'guidance', label: 'Guidance', icon: <Settings className="w-4 h-4" />, description: 'Learn best practices' },
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

  // Get current plan name
  const getCurrentPlanName = () => {
    if (!user) return 'Free Plan';
    
    switch (user.plan) {
      case 'starter':
        return 'Starter Plan';
      case 'pro':
        return 'Pro Plan';
      default:
        return 'Basic Plan';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
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
              {/* Plan Badge */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <Crown className={`w-4 h-4 ${
                  getCurrentPlanName().includes('Pro') ? 'text-blue-500' :
                  getCurrentPlanName().includes('Starter') ? 'text-purple-500' :
                  'text-gray-400'
                }`} />
                <span className="text-sm font-medium text-white">{getCurrentPlanName()}</span>
              </div>
              
              {/* Usage Stats */}
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
              
              {/* User Menu */}
              <div className="flex items-center space-x-2">
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Automations</p>
                <p className="text-3xl font-bold text-white">{getTotalAutomations()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-white">{getSuccessRate()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Time Saved</p>
                <p className="text-3xl font-bold text-white">{getTimeSaved()}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 border-b border-white/10">
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

          {/* Tab Content */}
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'create' && <AutomationCreator />}
              {activeTab === 'history' && <AutomationHistory />}
              {activeTab === 'ai-chat' && <AIChatInterface />}
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