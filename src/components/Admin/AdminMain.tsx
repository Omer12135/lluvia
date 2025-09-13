import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import AdminBlogManager from './AdminBlogManager';
import WebhookManager from './WebhookManager';
import SubscriptionViewer from './SubscriptionViewer';
import StripePaymentManager from './StripePaymentManager';
import StripeWebhookTester from './StripeWebhookTester';

const AdminMain: React.FC = () => {
  const { admin, adminLogout } = useAdmin();
  const [currentSection, setCurrentSection] = useState('dashboard');


  const handleLogout = () => {
    adminLogout();
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'blog':
        return <AdminBlogManager />;
      case 'webhooks':
        return <WebhookManager />;
      case 'subscriptions':
        return <SubscriptionViewer />;
      case 'stripe-payments':
        return <StripePaymentManager />;
      case 'webhook-tester':
        return <StripeWebhookTester />;
      default:
        return <AdminDashboard />;
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'Kullanıcı Yönetimi';
      case 'blog':
        return 'Blog Yönetimi';
      case 'webhooks':
        return 'Webhook Yönetimi';
      case 'subscriptions':
        return 'Stripe Subscriptions';
      case 'stripe-payments':
        return 'Stripe Ödemeleri';
      case 'webhook-tester':
        return 'Webhook Tester';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {currentSection !== 'dashboard' && (
                <button
                  onClick={() => setCurrentSection('dashboard')}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              )}
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-xl font-semibold text-white">
                {getSectionTitle()}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Hoş geldin, <span className="text-white font-medium">{admin?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentSection()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMain;
