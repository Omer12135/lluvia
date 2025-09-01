import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  Zap,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AutomationHistory: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample automation history data - starts empty for new users
  const [automationHistory, setAutomationHistory] = useState<any[]>([]);

  // Update automation history based on user profile
  useEffect(() => {
    if (userProfile && userProfile.automations_used > 0) {
      const history = [
        {
          id: 1,
          name: 'Email automation created',
          description: 'Gmail to Slack notification workflow',
          status: 'completed',
          createdAt: '2 minutes ago',
          trigger: 'New Email',
          actions: ['Send Slack Message'],
          platform: 'N8N',
          executionTime: '1.2s',
          successRate: 100
        },
        {
          id: 2,
          name: 'Database sync automation created',
          description: 'Automated database backup and sync',
          status: 'completed',
          createdAt: '15 minutes ago',
          trigger: 'Scheduled',
          actions: ['Backup Database', 'Sync to Cloud'],
          platform: 'Make',
          executionTime: '45.3s',
          successRate: 98
        },
        {
          id: 3,
          name: 'Social media automation created',
          description: 'Cross-platform social media posting',
          status: 'completed',
          createdAt: '1 hour ago',
          trigger: 'New Blog Post',
          actions: ['Post to Twitter', 'Post to LinkedIn', 'Post to Facebook'],
          platform: 'N8N',
          executionTime: '12.8s',
          successRate: 95
        },
        {
          id: 4,
          name: 'File backup automation created',
          description: 'Automatic file backup to cloud storage',
          status: 'completed',
          createdAt: '2 hours ago',
          trigger: 'File Change',
          actions: ['Upload to Dropbox', 'Send Notification'],
          platform: 'Make',
          executionTime: '8.5s',
          successRate: 100
        },
        {
          id: 5,
          name: 'CRM automation created',
          description: 'Customer data synchronization',
          status: 'completed',
          createdAt: '3 hours ago',
          trigger: 'New Lead',
          actions: ['Add to CRM', 'Send Welcome Email', 'Create Task'],
          platform: 'N8N',
          executionTime: '3.2s',
          successRate: 97
        },
        {
          id: 6,
          name: 'Invoice automation created',
          description: 'Automatic invoice generation and sending',
          status: 'completed',
          createdAt: '5 hours ago',
          trigger: 'Payment Received',
          actions: ['Generate Invoice', 'Send Email', 'Update Records'],
          platform: 'Make',
          executionTime: '6.7s',
          successRate: 99
        }
      ];
      setAutomationHistory(history);
    }
  }, [userProfile]);

  const filters = [
    { id: 'all', name: 'All', icon: Activity },
    { id: 'completed', name: 'Completed', icon: CheckCircle },
    { id: 'running', name: 'Running', icon: Play },
    { id: 'failed', name: 'Failed', icon: AlertCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'running':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'running':
        return Play;
      case 'failed':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredHistory = automationHistory.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Automation History</h1>
            <p className="text-gray-300">Track your automation activities and performance.</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <History className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>



      {/* Filters and Search */}
          <motion.div
        initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
              placeholder="Search automations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
            </div>
            
          {/* Filters */}
          <div className="flex gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-white'
                      : 'bg-white/5 border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{filter.name}</span>
                </button>
              );
            })}
          </div>
            </div>
      </motion.div>

      {/* Automation History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Automations
          </h2>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
            </div>
            
        <div className="space-y-4">
          {filteredHistory.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {item.status}
                      </span>
            </div>
            
                    <p className="text-gray-300 mb-3">{item.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-400">Trigger:</span>
                        <span className="text-white">{item.trigger}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Execution:</span>
                        <span className="text-white">{item.executionTime}</span>
            </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400">Success:</span>
                        <span className="text-white">{item.successRate}%</span>
          </div>
        </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.actions.map((action, actionIndex) => (
                        <span
                          key={actionIndex}
                          className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300"
                        >
                          {action}
                          </span>
                      ))}
                        </div>
                        </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <span>Created {item.createdAt}</span>
                  <span>Platform: {item.platform}</span>
            </div>
              </motion.div>
            );
          })}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No automations found matching your criteria.</p>
        </div>
        )}
      </motion.div>
    </div>
  );
};

export default AutomationHistory;