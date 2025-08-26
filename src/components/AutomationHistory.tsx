import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Download,
  MoreVertical,
  Play,
  AlertTriangle,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { useAuth } from '../context/AuthContext';

const AutomationHistory: React.FC = () => {
  const { automations, exportAutomationToJson, exportAllAutomationsToJson, automationLimit } = useAutomation();
  const { user } = useAuth();
  
  // State for filtering and sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter automations for current user
  const userAutomations = user ? automations.filter(a => a.userId === user.id) : [];

  // Get unique categories and statuses
  const categories = useMemo(() => {
    const cats = [...new Set(userAutomations.map(a => a.trigger || 'Uncategorized'))];
    return ['all', ...cats];
  }, [userAutomations]);

  const statuses = useMemo(() => {
    const stats = [...new Set(userAutomations.map(a => a.status))];
    return ['all', ...stats];
  }, [userAutomations]);

  // Filtered and sorted automations
  const filteredAndSortedAutomations = useMemo(() => {
    let filtered = userAutomations.filter(automation => {
      const matchesCategory = selectedCategory === 'all' || automation.trigger === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || automation.status === selectedStatus;
      const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           automation.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesSearch;
    });

    // Sort automations
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [userAutomations, selectedCategory, selectedStatus, searchTerm, sortBy, sortOrder]);

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Automation History</h3>
          <p className="text-sm sm:text-base text-gray-400">View and manage your previous automation executions</p>
        </div>
        
        {userAutomations.length > 0 && (
          <button
            onClick={exportAllAutomationsToJson}
            className="mt-2 sm:mt-0 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        )}
      </div>

      {/* Plan Limit Warning */}
      {user?.plan === 'free' && userAutomations.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <h4 className="text-yellow-400 font-medium">Free Plan Limit Reached</h4>
              <p className="text-yellow-300 text-sm">
                You have reached the Free Plan limit of 1 automation. Upgrade to Pro Plan to create unlimited automations.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
            className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10"
          >
            <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filtering and Sorting Controls */}
      {userAutomations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-semibold">Filters & Sorting</h4>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Search automations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className="bg-gray-800">
                    {status === 'all' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
              
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="date" className="bg-gray-800">Sort by Date</option>
                <option value="name" className="bg-gray-800">Sort by Name</option>
                <option value="status" className="bg-gray-800">Sort by Status</option>
              </select>
              
              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-1 text-sm"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-400">
            Showing {filteredAndSortedAutomations.length} of {userAutomations.length} automations
          </div>
        </motion.div>
      )}

      {/* Automation List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAndSortedAutomations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12 bg-white/5 rounded-lg border border-white/10"
          >
            <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">No Automations Yet</h4>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Create your first automation to get started with workflow automation!</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => {
                  // Find the parent component that has setActiveTab
                  const event = new CustomEvent('changeTab', { detail: 'create' });
                  window.dispatchEvent(event);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm sm:text-base"
              >
                Create First Automation
              </button>
              <button 
                onClick={() => {
                  // Find the parent component that has setActiveTab
                  const event = new CustomEvent('changeTab', { detail: 'examples' });
                  window.dispatchEvent(event);
                }}
                className="bg-white/10 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 text-sm sm:text-base"
              >
                Browse Examples
              </button>
            </div>
          </motion.div>
        ) : (
          filteredAndSortedAutomations.map((automation, index) => (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {getStatusIcon(automation.status)}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white truncate">{automation.name}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{automation.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500">
                      <span>{automation.createdAt.toLocaleDateString()} at {automation.createdAt.toLocaleTimeString()}</span>
                      {automation.duration && (
                        <span>Duration: {formatDuration(automation.duration)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-2">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                    {automation.status.toUpperCase()}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => exportAutomationToJson(automation.id)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Export to JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {automation.result && (
                      <button
                        onClick={() => downloadResult(automation)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Download Result"
                      >
                        <Play className="w-4 h-4" />
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
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="More Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {automation.result && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <details className="group">
                    <summary className="cursor-pointer text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                      View Result Data
                    </summary>
                    <div className="mt-2 bg-black/30 p-2 sm:p-3 rounded-lg">
                      <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">
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