import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Globe, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  status: 'active' | 'inactive';
  lastTriggered?: Date;
  totalCalls: number;
}

const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'LLUVIA AI Webhook (POST)',
      url: 'https://lluviaomer.app.n8n.cloud/webhook/lluvia',
      method: 'POST',
      status: 'active',
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalCalls: 1247
    },
    {
      id: '2',
      name: 'LLUVIA AI Webhook (GET)',
      url: 'https://lluviaomer.app.n8n.cloud/webhook/lluvia',
      method: 'GET',
      status: 'active',
      lastTriggered: new Date(Date.now() - 45 * 60 * 1000),
      totalCalls: 523
    },
    {
      id: '3',
      name: 'Payment Notification',
      url: 'https://lluviaomer.app.n8n.cloud/webhook/payment',
      method: 'POST',
      status: 'active',
      lastTriggered: new Date(Date.now() - 30 * 60 * 1000),
      totalCalls: 89
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: 'https://lluviaomer.app.n8n.cloud/webhook/lluvia',
    method: 'POST' as 'GET' | 'POST'
  });

  const addWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) return;

    const webhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      method: newWebhook.method,
      status: 'active',
      totalCalls: 0
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ name: '', url: '', method: 'POST' });
    setShowAddForm(false);
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const toggleWebhookStatus = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w
    ));
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Webhook Management</h3>
          <p className="text-gray-400">Manage your N8n webhook endpoints</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Webhook</span>
        </button>
      </div>

      {/* Add Webhook Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Add New Webhook</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Webhook Name
              </label>
              <input
                type="text"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                placeholder="e.g., Customer Onboarding"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Method
              </label>
              <select
                value={newWebhook.method}
                onChange={(e) => setNewWebhook({ ...newWebhook, method: e.target.value as 'GET' | 'POST' })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              placeholder="https://n8n.myserver.com/webhook/..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={addWebhook}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Webhook
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook, index) => (
          <motion.div
            key={webhook.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-semibold text-white">{webhook.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      webhook.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {webhook.method}
                    </span>
                    <span>{webhook.totalCalls} calls</span>
                    {webhook.lastTriggered && (
                      <span>Last: {webhook.lastTriggered.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  {webhook.status === 'active' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    webhook.status === 'active' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {webhook.status}
                  </span>
                </div>
                
                <button
                  onClick={() => copyWebhookUrl(webhook.url)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => toggleWebhookStatus(webhook.id)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Toggle Status"
                >
                  <Activity className="w-4 h-4" />
                </button>
                
                <button
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 bg-black/30 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Webhook URL:</p>
                  <code className="text-sm text-gray-300 break-all block">{webhook.url}</code>
                </div>
                <button
                  onClick={() => copyWebhookUrl(webhook.url)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {webhooks.length === 0 && (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No webhooks configured yet. Add your first webhook to get started!</p>
        </div>
      )}
    </div>
  );
};

export default WebhookManager;