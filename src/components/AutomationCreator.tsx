import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Zap, 
  Mail, 
  Database, 
  Calendar, 
  Globe,
  CheckCircle,
  X,
  Settings,
  Clock,
  MessageSquare,
  Bot,
  Phone,
  Video,
  Cloud,
  Calculator,
  FileText,
  Users,
  Target,
  Shield,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Search,
  Bell,
  AlertTriangle,
  Package,
  Truck,
  Home,
  Rocket,
  TrendingUp,
  Book,
  Bookmark,
  Activity,
  Eye,
  Mic,
  Lightbulb,
  Languages,
  Building,
  Smartphone,
  GitBranch,
  Folder,
  HelpCircle,
  Bug,
  Wifi,
  MapPin,
  Share2,
  Workflow,
  Figma,
  Trello,
  Linkedin,
  Twitter,
  Music,
  Play,
  Monitor,
  RefreshCw,
  Lock,
  Image as ImageIcon,
  Link,
  Layers,
  Code,
  Server,
  Sparkles,
  Heart,
  Star,
  Check,
  EyeOff,
  TestTube,
  AlertCircle
} from 'lucide-react';
import { triggers, actions, Trigger, Action } from '../data/applicationsData';
import { useAuth } from '../context/AuthContext';

// Icon mapping
const iconMap: Record<string, any> = {
  'Mail': Mail,
  'Database': Database,
  'Calendar': Calendar,
  'Globe': Globe,
  'CheckCircle': CheckCircle,
  'Settings': Settings,
  'Clock': Clock,
  'MessageSquare': MessageSquare,
  'Bot': Bot,
  'Phone': Phone,
  'Video': Video,
  'Cloud': Cloud,
  'Calculator': Calculator,
  'FileText': FileText,
  'Users': Users,
  'Target': Target,
  'Shield': Shield,
  'CreditCard': CreditCard,
  'ShoppingCart': ShoppingCart,
  'BarChart3': BarChart3,
  'Search': Search,
  'Bell': Bell,
  'AlertTriangle': AlertTriangle,
  'Package': Package,
  'Truck': Truck,
  'Home': Home,
  'Rocket': Rocket,
  'TrendingUp': TrendingUp,
  'Book': Book,
  'Bookmark': Bookmark,
  'Activity': Activity,
  'Eye': Eye,
  'Mic': Mic,
  'Lightbulb': Lightbulb,
  'Languages': Languages,
  'Building': Building,
  'Smartphone': Smartphone,
  'GitBranch': GitBranch,
  'Folder': Folder,
  'HelpCircle': HelpCircle,
  'Bug': Bug,
  'Wifi': Wifi,
  'MapPin': MapPin,
  'Share2': Share2,
  'Workflow': Workflow,
  'Figma': Figma,
  'Trello': Trello,
  'Linkedin': Linkedin,
  'Twitter': Twitter,
  'Music': Music,
  'Play': Play,
  'Monitor': Monitor,
  'RefreshCw': RefreshCw,
  'Lock': Lock,
  'Image': ImageIcon,
  'Link': Link,
  'Layers': Layers,
  'Code': Code,
  'Server': Server
};

interface AutomationCreatorProps {}

const AutomationCreator: React.FC<AutomationCreatorProps> = () => {
  const { user } = useAuth();
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [triggerSearchTerm, setTriggerSearchTerm] = useState('');
  const [actionSearchTerm, setActionSearchTerm] = useState('');
  const [triggerCategory, setTriggerCategory] = useState<string>('all');
  const [actionCategory, setActionCategory] = useState<string>('all');
  const [showTriggers, setShowTriggers] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // N8N Integration States
  const [showN8NSettings, setShowN8NSettings] = useState(false);
  const [n8nUrl, setN8nUrl] = useState('');
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [n8nConnected, setN8nConnected] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  const [integrationType, setIntegrationType] = useState<'api' | 'webhook'>('api');

  // Get unique categories
  const triggerCategories = ['all', ...new Set(triggers.map(t => t.category))];
  const actionCategories = ['all', ...new Set(actions.map(a => a.category))];

  // Filter functions
  const filteredTriggers = triggers.filter(trigger => {
    const matchesSearch = trigger.name.toLowerCase().includes(triggerSearchTerm.toLowerCase()) ||
                         trigger.description.toLowerCase().includes(triggerSearchTerm.toLowerCase());
    const matchesCategory = triggerCategory === 'all' || trigger.category === triggerCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(actionSearchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(actionSearchTerm.toLowerCase());
    const matchesCategory = actionCategory === 'all' || action.category === actionCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTriggerSelect = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setShowTriggers(false);
    setTriggerSearchTerm('');
  };

  const handleActionToggle = (action: Action) => {
    setSelectedActions(prev => {
      const isSelected = prev.some(a => a.id === action.id);
      if (isSelected) {
        return prev.filter(a => a.id !== action.id);
      } else {
        return [...prev, action];
      }
    });
  };

  // N8N Connection Test
  const testN8NConnection = async () => {
    if (!n8nUrl.trim()) {
      alert('Please enter your N8N URL');
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('idle');

    try {
      let testUrl = '';
      let headers: any = {};

      if (integrationType === 'api') {
        if (!n8nApiKey.trim()) {
          alert('Please enter your N8N API Key');
          return;
        }
        testUrl = `${n8nUrl.replace(/\/$/, '')}/api/v1/credentials`;
        headers = {
          'X-N8N-API-KEY': n8nApiKey,
          'Content-Type': 'application/json'
        };
      } else {
        if (!n8nWebhookUrl.trim()) {
          alert('Please enter your N8N Webhook URL');
          return;
        }
        testUrl = n8nWebhookUrl;
        headers = {
          'Content-Type': 'application/json'
        };
      }

      const response = await fetch(testUrl, {
        method: integrationType === 'api' ? 'GET' : 'POST',
        headers,
        body: integrationType === 'webhook' ? JSON.stringify({
          test: true,
          timestamp: new Date().toISOString()
        }) : undefined
      });

      if (response.ok) {
        setConnectionStatus('success');
        setN8nConnected(true);
        alert('✅ N8N connection successful!');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('N8N connection test failed:', error);
      setConnectionStatus('error');
      setN8nConnected(false);
      alert(`❌ N8N connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingConnection(false);
    }
  };

  // Create N8N Workflow
  const createN8NWorkflow = async (automationData: any) => {
    if (!n8nConnected) {
      throw new Error('N8N not connected. Please configure your N8N settings first.');
    }

    // Generate N8N workflow JSON
    const workflow = {
      name: automationData.name,
      nodes: [
        // Trigger node
        {
          id: 'trigger-node',
          name: automationData.trigger.name,
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
          parameters: {
            httpMethod: 'POST',
            path: `webhook/${automationData.name.toLowerCase().replace(/\s+/g, '-')}`,
            responseMode: 'responseNode',
            options: {}
          }
        },
        // Action nodes
        ...automationData.actions.map((action: Action, index: number) => ({
          id: `action-node-${index}`,
          name: action.name,
          type: `n8n-nodes-base.${action.category.toLowerCase()}`,
          typeVersion: 1,
          position: [460 + (index * 220), 300],
          parameters: {
            // Basic parameters - would be customized based on action type
            operation: 'create',
            resource: action.category.toLowerCase()
          }
        }))
      ],
      connections: {
        'trigger-node': {
          main: [
            automationData.actions.map((_: Action, index: number) => ({
              node: `action-node-${index}`,
              type: 'main',
              index: 0
            }))
          ]
        }
      },
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      versionId: '1'
    };

    try {
      let createUrl = '';
      let headers: any = {};

      if (integrationType === 'api') {
        createUrl = `${n8nUrl.replace(/\/$/, '')}/api/v1/workflows`;
        headers = {
          'X-N8N-API-KEY': n8nApiKey,
          'Content-Type': 'application/json'
        };
      } else {
        // For webhook, we'll send the workflow data to be processed
        createUrl = n8nWebhookUrl;
        headers = {
          'Content-Type': 'application/json'
        };
      }

      const response = await fetch(createUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workflow,
          automation: automationData,
          user: {
            id: user?.id,
            email: user?.email,
            name: user?.name
          },
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, workflowId: result.id || 'created', data: result };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to create N8N workflow:', error);
      throw error;
    }
  };

  const handleCreate = async () => {
    if (!automationName.trim()) {
      alert('Please enter an automation name');
      return;
    }
    if (!automationDescription.trim()) {
      alert('Please enter an automation description');
      return;
    }
    if (!selectedTrigger) {
      alert('Please select a trigger');
      return;
    }

    setIsCreating(true);

    const automationData = {
      name: automationName,
      description: automationDescription,
      trigger: selectedTrigger,
      actions: selectedActions
    };

    console.log('Creating automation:', automationData);
    
    try {
      if (n8nConnected) {
        // Create workflow in N8N
        const result = await createN8NWorkflow(automationData);
        alert(`🎉 Automation created successfully in N8N!\nWorkflow ID: ${result.workflowId}`);
      } else {
        // Simulate local creation
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('🎉 Automation created successfully! (Local mode)');
      }
      
      // Reset form
      setAutomationName('');
      setAutomationDescription('');
      setSelectedTrigger(null);
      setSelectedActions([]);
      setTriggerSearchTerm('');
      setActionSearchTerm('');
      setTriggerCategory('all');
      setActionCategory('all');
    } catch (error) {
      console.error('Error creating automation:', error);
      alert(`❌ Failed to create automation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Settings;
    return IconComponent;
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 p-3 sm:p-4 rounded-2xl mb-4 shadow-2xl"
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
            <h1 className="text-xl sm:text-3xl font-bold text-white">Create New Automation</h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
          </motion.div>
          <p className="text-lg sm:text-xl text-gray-300">Build powerful automations in minutes</p>
          
          {/* N8N Integration Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            <button
              onClick={() => setShowN8NSettings(!showN8NSettings)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                n8nConnected 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{n8nConnected ? 'N8N Connected' : 'Connect N8N'}</span>
              {n8nConnected && <Check className="w-4 h-4" />}
            </button>
          </motion.div>
        </div>
            
        {/* N8N Integration Settings */}
        <AnimatePresence>
          {showN8NSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-blue-500/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">N8N Integration Settings</h3>
                </div>
                <button
                  onClick={() => setShowN8NSettings(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Integration Type Selection */}
                <div>
                  <label className="block text-white font-medium mb-2">Integration Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="api"
                        checked={integrationType === 'api'}
                        onChange={(e) => setIntegrationType(e.target.value as 'api' | 'webhook')}
                        className="text-blue-500"
                      />
                      <span className="text-white">API Key</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="webhook"
                        checked={integrationType === 'webhook'}
                        onChange={(e) => setIntegrationType(e.target.value as 'api' | 'webhook')}
                        className="text-blue-500"
                      />
                      <span className="text-white">Webhook URL</span>
                    </label>
                  </div>
                </div>

                {/* N8N URL */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    N8N URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={n8nUrl}
                    onChange={(e) => setN8nUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* API Key or Webhook URL */}
                {integrationType === 'api' ? (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      API Key <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={n8nApiKey}
                        onChange={(e) => setN8nApiKey(e.target.value)}
                        placeholder="Enter your N8N API key"
                        className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Webhook URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={n8nWebhookUrl}
                      onChange={(e) => setN8nWebhookUrl(e.target.value)}
                      placeholder="https://your-n8n-instance.com/webhook/automation"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Connection Status */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testN8NConnection}
                    disabled={testingConnection}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
                  >
                    {testingConnection ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                    <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  {connectionStatus === 'success' && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span>Connected</span>
                    </div>
                  )}

                  {connectionStatus === 'error' && (
                    <div className="flex items-center space-x-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Connection Failed</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-sm text-gray-300">
                    <strong>API Key Method:</strong> Direct integration with N8N API for workflow creation.<br/>
                    <strong>Webhook Method:</strong> Send automation data to your N8N webhook for processing.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Automation Details */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Automation Details</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                    Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="e.g., Gmail to Slack Notifications"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
                    maxLength={100}
                  />
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{automationName.length}/100 characters</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                    placeholder="Describe what this automation does..."
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    maxLength={500}
                  />
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{automationDescription.length}/500 characters</p>
                </div>
              </div>
            </div>

            {/* Selected Components Preview */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Selected Components</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Selected Trigger */}
                {selectedTrigger ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 sm:p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                        {React.createElement(getIcon(selectedTrigger.icon), { className: "w-4 h-4 sm:w-5 sm:h-5 text-white" })}
                      </div>
                      <div>
                        <p className="text-blue-300 text-xs sm:text-sm font-medium">TRIGGER</p>
                        <p className="text-white font-semibold text-sm sm:text-base">{selectedTrigger.name}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-center">
                    <p className="text-gray-400 text-sm sm:text-base">No trigger selected</p>
                  </div>
                )}

                {/* Selected Actions */}
                {selectedActions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-green-300 text-xs sm:text-sm font-medium">ACTIONS ({selectedActions.length})</p>
                    {selectedActions.map((action, index) => {
                      const IconComponent = getIcon(action.icon);
                      return (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-2.5 sm:p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="text-white font-medium text-sm sm:text-base">{action.name}</span>
                          </div>
                          <button
                            onClick={() => handleActionToggle(action)}
                            className="text-green-300 hover:text-red-400 transition-colors p-1"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-center">
                    <p className="text-gray-400 text-sm sm:text-base">No actions selected</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Triggers & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Triggers Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Select Trigger</h2>
                </div>
                <button
                  onClick={() => setShowTriggers(!showTriggers)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  {showTriggers ? 'Hide' : 'Browse'}
                </button>
              </div>

              <AnimatePresence>
                {showTriggers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Search and Filter */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Search triggers..."
                        value={triggerSearchTerm}
                        onChange={(e) => setTriggerSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={triggerCategory}
                        onChange={(e) => setTriggerCategory(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {triggerCategories.map(category => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
          </div>

                    {/* Triggers Grid */}
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {filteredTriggers.map((trigger) => {
                        const IconComponent = getIcon(trigger.icon);
                        const isSelected = selectedTrigger?.id === trigger.id;
                        return (
                          <motion.div
                key={trigger.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                            onClick={() => handleTriggerSelect(trigger)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-600/30 border-blue-400'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">{trigger.name}</p>
                                <p className="text-gray-400 text-xs truncate">{trigger.description}</p>
                              </div>
                              {isSelected && <CheckCircle className="w-5 h-5 text-blue-400" />}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Select Actions</h2>
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </div>
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  {showActions ? 'Hide' : 'Browse'}
                </button>
          </div>

              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Search and Filter */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Search actions..."
                        value={actionSearchTerm}
                        onChange={(e) => setActionSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <select
                        value={actionCategory}
                        onChange={(e) => setActionCategory(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {actionCategories.map(category => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
            </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {filteredActions.map((action) => {
                        const IconComponent = getIcon(action.icon);
                        const isSelected = selectedActions.some(a => a.id === action.id);
                        return (
                          <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                            onClick={() => handleActionToggle(action)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-green-600/30 border-green-400'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-green-500' : 'bg-gray-600'}`}>
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">{action.name}</p>
                                <p className="text-gray-400 text-xs truncate">{action.description}</p>
                              </div>
                              {isSelected && <CheckCircle className="w-5 h-5 text-green-400" />}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          </div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleCreate}
            disabled={!automationName.trim() || !automationDescription.trim() || !selectedTrigger || isCreating}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-xl font-bold rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            {isCreating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>{n8nConnected ? 'Creating in N8N...' : 'Creating Automation...'}</span>
                <RefreshCw className="w-6 h-6 animate-spin" />
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                <span>{n8nConnected ? 'Create in N8N' : 'Create Automation'}</span>
                <Star className="w-6 h-6" />
              </>
            )}
          </button>
          {(!automationName.trim() || !selectedTrigger) && (
            <p className="text-gray-400 text-sm mt-2">
              {!automationName.trim() ? 'Enter automation name' : 'Select a trigger'} to continue
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AutomationCreator;