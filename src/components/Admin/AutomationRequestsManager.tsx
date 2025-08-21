import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  Download,
  Eye,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { webhookService } from '../../services/webhookService';

interface AutomationRequest {
  id: string;
  user_id: string;
  automation_name: string;
  automation_description: string;
  webhook_payload: any;
  webhook_response: any;
  status: 'pending' | 'sent' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  n8n_execution_id?: string;
  user_profiles?: {
    name: string;
    email: string;
    plan: string;
  };
}

const AutomationRequestsManager: React.FC = () => {
  const [requests, setRequests] = useState<AutomationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AutomationRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAutomationRequests();
  }, []);

  const loadAutomationRequests = async () => {
    setLoading(true);
    try {
      const result = await webhookService.getAutomationRequests();
      if (result.success) {
        setRequests(result.data);
      } else {
        console.error('Failed to load automation requests:', result.error);
      }
    } catch (error) {
      console.error('Error loading automation requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAutomationRequests();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'sent':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'sent':
        return 'text-blue-400 bg-blue-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const downloadRequestData = (request: AutomationRequest) => {
    const data = {
      id: request.id,
      user: request.user_profiles,
      automation: {
        name: request.automation_name,
        description: request.automation_description
      },
      webhook_payload: request.webhook_payload,
      webhook_response: request.webhook_response,
      status: request.status,
      n8n_execution_id: request.n8n_execution_id,
      created_at: request.created_at,
      updated_at: request.updated_at
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `automation-request-${request.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      request.automation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_profiles?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStats = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      sent: requests.filter(r => r.status === 'sent').length,
      completed: requests.filter(r => r.status === 'completed').length,
      failed: requests.filter(r => r.status === 'failed').length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Automation Requests</h3>
          <p className="text-gray-400">Monitor all user automation requests sent to N8n</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-400', icon: <Database className="w-4 h-4" /> },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400', icon: <Clock className="w-4 h-4" /> },
          { label: 'Sent', value: stats.sent, color: 'text-blue-400', icon: <Globe className="w-4 h-4" /> },
          { label: 'Completed', value: stats.completed, color: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Failed', value: stats.failed, color: 'text-red-400', icon: <XCircle className="w-4 h-4" /> }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
              <div className={stat.color}>{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by automation name, user email, or name..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading automation requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <Database className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-white mb-2">No Automation Requests</h4>
          <p className="text-gray-400">No automation requests found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(request.status)}
                  <div>
                    <h4 className="text-lg font-semibold text-white">{request.automation_name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{request.user_profiles?.name || 'Unknown'}</span>
                      </span>
                      <span>{request.user_profiles?.email}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.user_profiles?.plan === 'pro' ? 'bg-blue-500/20 text-blue-400' :
                        
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {request.user_profiles?.plan || 'free'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                  
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => downloadRequestData(request)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Download Data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 text-sm mb-2">{request.automation_description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(request.created_at).toLocaleString()}</span>
                    </span>
                    {request.n8n_execution_id && (
                      <span className="flex items-center space-x-1">
                        <Globe className="w-3 h-3" />
                        <span>ID: {request.n8n_execution_id}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Webhook Status:</p>
                  {request.webhook_response ? (
                    <div className="text-xs text-gray-300">
                      {request.webhook_response.success ? (
                        <span className="text-green-400">✅ Successfully sent to N8n</span>
                      ) : (
                        <span className="text-red-400">❌ {request.webhook_response.error}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">No response data</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Automation Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{selectedRequest.automation_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{new Date(selectedRequest.created_at).toLocaleString()}</span>
                    </div>
                    {selectedRequest.n8n_execution_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">N8n ID:</span>
                        <span className="text-white font-mono">{selectedRequest.n8n_execution_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">User Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{selectedRequest.user_profiles?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedRequest.user_profiles?.email || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedRequest.user_profiles?.plan === 'pro' ? 'bg-blue-500/20 text-blue-400' :
                        
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {selectedRequest.user_profiles?.plan || 'free'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Webhook Payload</h4>
                  <div className="bg-black/30 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-300">
                      {JSON.stringify(selectedRequest.webhook_payload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-3">Webhook Response</h4>
                  <div className="bg-black/30 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-300">
                      {JSON.stringify(selectedRequest.webhook_response, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => downloadRequestData(selectedRequest)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Data</span>
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AutomationRequestsManager;