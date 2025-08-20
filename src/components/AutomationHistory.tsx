import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Download,
  MoreVertical,
  Play
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { useAuth } from '../context/AuthContext';

const AutomationHistory: React.FC = () => {
  const { automations } = useAutomation();
  const { user } = useAuth();

  // Filter automations for current user
  const userAutomations = user ? automations.filter(a => a.userId === user.id) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'running':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'pending':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    if (duration < 60) return `${duration}s`;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const downloadResult = (automation: any) => {
    if (!automation.result) return;

    const dataStr = JSON.stringify(automation.result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${automation.name.toLowerCase().replace(/\s+/g, '-')}-result.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Automation History</h3>
        <p className="text-gray-400">View and manage your previous automation executions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: userAutomations.length, color: 'text-blue-400' },
          { label: 'Completed', value: userAutomations.filter(a => a.status === 'completed').length, color: 'text-green-400' },
          { label: 'Running', value: userAutomations.filter(a => a.status === 'running').length, color: 'text-yellow-400' },
          { label: 'Failed', value: userAutomations.filter(a => a.status === 'failed').length, color: 'text-red-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        {userAutomations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white/5 rounded-lg border border-white/10"
          >
            <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">No Automations Yet</h4>
            <p className="text-gray-400 mb-6">Create your first automation to get started with workflow automation!</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  // Find the parent component that has setActiveTab
                  const event = new CustomEvent('changeTab', { detail: 'create' });
                  window.dispatchEvent(event);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Create First Automation
              </button>
              <button 
                onClick={() => {
                  // Find the parent component that has setActiveTab
                  const event = new CustomEvent('changeTab', { detail: 'examples' });
                  window.dispatchEvent(event);
                }}
                className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Browse Examples
              </button>
            </div>
          </motion.div>
        ) : (
          userAutomations.map((automation, index) => (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(automation.status)}
                  <div>
                    <h4 className="text-lg font-semibold text-white">{automation.name}</h4>
                    <p className="text-gray-400 text-sm">{automation.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{automation.createdAt.toLocaleDateString()} at {automation.createdAt.toLocaleTimeString()}</span>
                      {automation.duration && (
                        <span>Duration: {formatDuration(automation.duration)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                    {automation.status.toUpperCase()}
                  </span>
                  
                  {automation.result && (
                    <button
                      onClick={() => downloadResult(automation)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                     title="Download Result"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      // Show automation details or actions menu
                      const actions = [
                        'View Details',
                        'Duplicate Automation',
                        'Edit Automation',
                        'Delete Automation'
                      ];
                      const action = prompt(`Select action for "${automation.name}":\n\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`);
                      if (action) {
                        const actionIndex = parseInt(action) - 1;
                        if (actionIndex >= 0 && actionIndex < actions.length) {
                          alert(`${actions[actionIndex]} selected for "${automation.name}"`);
                        }
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="More Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {automation.result && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                      View Result Data
                    </summary>
                    <div className="mt-2 bg-black/30 p-3 rounded-lg">
                      <pre className="text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(automation.result, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AutomationHistory;