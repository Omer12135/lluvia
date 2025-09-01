import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Settings, 
  User, 
  Plus, 
  Zap,
  Workflow
} from 'lucide-react';
import AutomationCreator from './AutomationCreator';
import Analytics from './Analytics';
import SettingsPanel from './SettingsPanel';
import Profile from './Profile';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('automations');

  const tabs = [
    { id: 'automations', name: 'Automations', icon: Workflow },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'profile', name: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'automations':
        return <AutomationCreator />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsPanel />;
      case 'profile':
        return <Profile />;
      default:
        return <AutomationCreator />;
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
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              </button>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-1">
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
      <div className="flex-1 overflow-hidden">
            <motion.div
              key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderContent()}
            </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;