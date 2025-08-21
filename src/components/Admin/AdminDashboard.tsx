import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Activity, 
  DollarSign,
  Globe,
  Settings,
  BarChart3,
  Zap,
  LogOut,
  User
} from 'lucide-react';
import WebhookManager from './WebhookManager';
import WebhookTester from './WebhookTester';
import N8NDebugger from './N8NDebugger';
import { useAuth, User as UserType } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import ExampleAutomationManager from './ExampleAutomationManager';
import AdminAutomationManager from './AdminAutomationManager';
import AutomationRequestsManager from './AutomationRequestsManager';
import UserManagement from './UserManagement';
import { useAutomation } from '../../context/AutomationContext';

const AdminDashboard: React.FC = () => {
  const { systemStats, users, updateUser, deleteUser, suspendUser, activateUser } = useAuth();
  const { admin, adminLogout } = useAdmin();
  const { automations } = useAutomation();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated as admin
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'requests', label: 'Automation Requests', icon: <Activity className="w-4 h-4" /> },
    { id: 'webhooks', label: 'Webhooks', icon: <Globe className="w-4 h-4" /> },
    { id: 'webhook-test', label: 'Webhook Test', icon: <Globe className="w-4 h-4" /> },
    { id: 'n8n-debug', label: 'N8N Debug', icon: <Settings className="w-4 h-4" /> },
    { id: 'admin-automations', label: 'Add Automations', icon: <Zap className="w-4 h-4" /> },
    { id: 'examples', label: 'Example Automations', icon: <Zap className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const stats = [
    { 
      label: 'Total Users', 
      value: systemStats.totalUsers.toString(), 
      icon: <Users className="w-6 h-6 text-blue-500" />, 
      change: systemStats.totalUsers > 0 ? '+' + Math.round((systemStats.totalUsers / 10) * 100) / 10 + '%' : '0%'
    },
    { 
      label: 'Active Automations', 
      value: systemStats.activeAutomations.toString(), 
      icon: <Zap className="w-6 h-6 text-purple-500" />, 
      change: systemStats.activeAutomations > 0 ? '+' + Math.round((systemStats.activeAutomations / 50) * 100) / 10 + '%' : '0%'
    },
    { 
      label: 'Monthly Revenue', 
      value: '$' + systemStats.monthlyRevenue.toLocaleString(), 
      icon: <DollarSign className="w-6 h-6 text-green-500" />, 
      change: systemStats.monthlyRevenue > 0 ? '+' + Math.round((systemStats.monthlyRevenue / 1000) * 100) / 10 + '%' : '0%'
    },
    { 
      label: 'System Uptime', 
      value: systemStats.systemUptime.toFixed(1) + '%', 
      icon: <Activity className="w-6 h-6 text-orange-500" />, 
      change: '+0.1%'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Admin Dashboard</span>
            </div>
            
            {/* Admin User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">{admin?.username}</span>
              </div>
              <button
                onClick={adminLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-8 overflow-hidden">
          <div className="grid grid-cols-9 border-b border-white/10">
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
                <div className="text-sm font-semibold">{tab.label}</div>
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
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">System Overview</h3>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <p className="text-green-400 text-xs mt-1">{stat.change} from last month</p>
                          </div>
                          {stat.icon}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced User Statistics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">User Analytics</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Google Users</span>
                          <span className="text-white font-semibold">{systemStats.googleUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Email Users</span>
                          <span className="text-white font-semibold">{systemStats.emailUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Verified Users</span>
                          <span className="text-white font-semibold">{systemStats.verifiedUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">2FA Enabled</span>
                          <span className="text-white font-semibold">{systemStats.twoFactorUsers}</span>
                          </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-300 text-sm">New user registration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-300 text-sm">Automation created</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-300 text-sm">Plan upgrade</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-300 text-sm">Payment processed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && <AutomationRequestsManager />}
              {activeTab === 'webhooks' && <WebhookManager />}
              {activeTab === 'webhook-test' && <WebhookTester />}
              {activeTab === 'n8n-debug' && <N8NDebugger />}
              {activeTab === 'admin-automations' && <AdminAutomationManager />}
              {activeTab === 'examples' && <ExampleAutomationManager />}

              {activeTab === 'users' && (
                <UserManagement
                  users={users}
                  onUserUpdate={updateUser}
                  onUserDelete={deleteUser}
                  onUserSuspend={suspendUser}
                  onUserActivate={activateUser}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">System Settings</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">General Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            System Name
                          </label>
                          <input
                            type="text"
                            defaultValue="LLUVIA AI"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Automations per User
                          </label>
                          <input
                            type="number"
                            defaultValue="200"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Security Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Two-Factor Authentication</span>
                          <button className="bg-green-500 w-12 h-6 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Google OAuth</span>
                          <button className="bg-green-500 w-12 h-6 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Email Verification</span>
                          <button className="bg-green-500 w-12 h-6 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">API Rate Limiting</span>
                          <button className="bg-green-500 w-12 h-6 rounded-full relative">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;