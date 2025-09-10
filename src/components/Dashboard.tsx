import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Zap,
  Workflow,
  History,
  BookOpen,
  Home,
  LogOut,
} from 'lucide-react';
import AutomationCreator from './AutomationCreator';
import Profile from './Profile';
import AutomationHistory from './AutomationHistory';
import ExampleAutomations from './ExampleAutomations';
import DashboardOverview from './DashboardOverview';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'automations', name: 'Automations', icon: Workflow },
    { id: 'examples', name: 'Examples', icon: BookOpen },
    { id: 'history', name: 'History', icon: History },
    { id: 'profile', name: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview onTabChange={setActiveTab} />;
      case 'automations':
        return <AutomationCreator />;
      case 'examples':
        return <ExampleAutomations />;
      case 'history':
        return <AutomationHistory />;
      case 'profile':
        return <Profile />;
      default:
        return <DashboardOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
                </div>
            <h1 className="text-2xl font-bold text-white">LLUVIA AI</h1>
      </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </motion.button>
              );
            })}
                </div>
                </div>
          </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full p-6"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;