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
  Star
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

    const sendToN8N = async (automationData: any) => {
    try {
      const webhookPayload = {
        // Basic event info
        event_type: 'automation_created',
        timestamp: new Date().toISOString(),
        
        // Automation details
        automation_name: automationData.name,
        automation_description: automationData.description,
        trigger_name: automationData.trigger.name,
        trigger_category: automationData.trigger.category,
        actions_count: automationData.actions.length,
        actions: automationData.actions.map((action: Action) => action.name),
        
        // User details
        user_id: user?.id || 'anonymous',
        user_email: user?.email || 'anonymous@lluvia.ai',
        user_name: user?.name || 'Anonymous User',
        user_plan: user?.plan || 'free',
        
        // Metadata
        source: 'lluvia-ai-platform',
        webhook_id: `webhook_${Date.now()}`,
        automation_id: `automation_${Date.now()}`
      };

      const response = await fetch('https://lluviaomer.app.n8n.cloud/webhook-test/lluvia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'LLUVIA-AI-Platform/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log('🔍 ===== N8N WEBHOOK DEBUG =====');
      console.log('📤 Sent Payload:', JSON.stringify(webhookPayload, null, 2));
      console.log('📡 N8N Response Status:', response.status);
      console.log('📡 N8N Response Headers:', Object.fromEntries(response.headers.entries()));

      // Read response text only once
      const responseText = await response.text();
      const contentType = response.headers.get('content-type');
      
      console.log('📡 N8N Response Content-Type:', contentType);
      console.log('📡 N8N Response Text (First 500 chars):', responseText.substring(0, 500));
      console.log('📡 N8N Response Full Length:', responseText.length);
      
      // Check if it's HTML (N8N might return an HTML page)
      if (responseText.toLowerCase().includes('<html>') || responseText.toLowerCase().includes('<!doctype')) {
        console.log('⚠️ WARNING: N8N returned HTML instead of JSON - Webhook might not be configured correctly');
        console.log('🔧 Check your N8N workflow: Make sure webhook node is active and properly configured');
      }
      
      console.log('🔍 ===========================');

      if (!response.ok) {
        console.error('❌ N8N Error Response:', responseText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
      }

      // Try to parse JSON, but handle cases where response might be empty or not JSON
      let result;

      if (responseText.trim() === '') {
        // Empty response is considered success for webhooks
        result = { message: 'Webhook received successfully', status: 'success' };
      } else if (contentType && contentType.includes('application/json')) {
        try {
          result = JSON.parse(responseText);
        } catch (jsonError) {
          console.warn('⚠️ Could not parse JSON response, using text:', responseText);
          result = { message: responseText, status: 'success' };
        }
      } else {
        // Non-JSON response (might be HTML or plain text)
        result = { message: responseText, status: 'success', contentType };
      }

      console.log('✅ Automation sent to N8N successfully:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Failed to send automation to N8N:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
    
    // Send to N8N webhook
    const webhookResult = await sendToN8N(automationData);
    
    if (webhookResult.success) {
      alert('🎉 Automation created and sent to N8N successfully!');
      
      // Reset form
      setAutomationName('');
      setAutomationDescription('');
      setSelectedTrigger(null);
      setSelectedActions([]);
      setTriggerSearchTerm('');
      setActionSearchTerm('');
      setTriggerCategory('all');
      setActionCategory('all');
    } else {
      alert(`⚠️ Automation created but failed to send to N8N: ${webhookResult.error}`);
    }
    
    setIsCreating(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Settings;
    return IconComponent;
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl mb-4 shadow-2xl"
          >
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
            <h1 className="text-3xl font-bold text-white">Create New Automation</h1>
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
          <p className="text-xl text-gray-300">Build powerful automations in minutes</p>
            </div>
            
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Automation Details */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Automation Details</h2>
            </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="e.g., Gmail to Slack Notifications"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    maxLength={100}
                  />
                  <p className="text-gray-400 text-sm mt-1">{automationName.length}/100 characters</p>
                    </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                    placeholder="Describe what this automation does..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                    maxLength={500}
                  />
                  <p className="text-gray-400 text-sm mt-1">{automationDescription.length}/500 characters</p>
                      </div>
              </div>
            </div>

            {/* Selected Components Preview */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Selected Components</h2>
              </div>

              <div className="space-y-4">
                {/* Selected Trigger */}
                {selectedTrigger ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        {React.createElement(getIcon(selectedTrigger.icon), { className: "w-5 h-5 text-white" })}
                      </div>
                      <div>
                        <p className="text-blue-300 text-sm font-medium">TRIGGER</p>
                        <p className="text-white font-semibold">{selectedTrigger.name}</p>
              </div>
            </div>
                  </motion.div>
                ) : (
                  <div className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-center">
                    <p className="text-gray-400">No trigger selected</p>
                  </div>
                )}

                {/* Selected Actions */}
                {selectedActions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-green-300 text-sm font-medium">ACTIONS ({selectedActions.length})</p>
                    {selectedActions.map((action, index) => {
                      const IconComponent = getIcon(action.icon);
                      return (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-medium">{action.name}</span>
                          </div>
              <button
                            onClick={() => handleActionToggle(action)}
                            className="text-green-300 hover:text-red-400 transition-colors"
              >
                            <X className="w-4 h-4" />
              </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-center">
                    <p className="text-gray-400">No actions selected</p>
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
            className="space-y-6"
          >
            {/* Triggers Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
        </div>
                  <h2 className="text-2xl font-bold text-white">Select Trigger</h2>
        </div>
                <button
                  onClick={() => setShowTriggers(!showTriggers)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Select Actions</h2>
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </div>
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
                <span>Sending to N8N...</span>
                <RefreshCw className="w-6 h-6 animate-spin" />
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                <span>Create Automation</span>
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