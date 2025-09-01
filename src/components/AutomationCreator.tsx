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
  Crown,
  Image as ImageIcon,
  Link,
  Layers,
  Code,
  Server,
  Sparkles,
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  Cpu,
  Palette
} from 'lucide-react';
import { triggers, actions, Trigger, Action } from '../data/applicationsData';
import { useAuth } from '../context/AuthContext';
import { automationService } from '../lib/supabase';
import { webhookService, AutomationWebhookData } from '../services/webhookService';

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
  'Crown': Crown,
  'Image': ImageIcon,
  'Link': Link,
  'Layers': Layers,
  'Code': Code,
  'Server': Server,
  'Sparkles': Sparkles,
  'Heart': Heart,
  'Star': Star
};

const AutomationCreator: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('n8n');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Dropdown states
  const [isTriggerDropdownOpen, setIsTriggerDropdownOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);

  // Get unique categories for actions
  const actionCategories = ['All', ...Array.from(new Set(actions.map(action => action.category))).sort()];

  // Platform options with colorful design
  const platforms = [
    {
      id: 'n8n',
      name: 'N8N',
      description: 'Open source workflow automation',
      icon: Cpu,
      color: 'from-pink-400 to-purple-500',
      bgColor: 'bg-gradient-to-br from-pink-400/20 to-purple-500/20',
      borderColor: 'border-pink-400/30'
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      description: 'Visual automation platform',
      icon: Palette,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20',
      borderColor: 'border-yellow-400/30'
    }
  ];

  const handleCreate = async () => {
    if (!user) return;

    setIsCreating(true);
    setError('');

    try {
      // Create automation
      const automation = {
        user_id: user.id,
        automation_name: automationName,
        automation_description: automationDescription,
        webhook_payload: {
          trigger: selectedTrigger?.name || 'Unknown',
          actions: selectedActions.map(a => a.name),
          platform: selectedPlatform
        },
        status: 'pending' as const
      };

      const createdAutomation = await automationService.createAutomation(automation);

      // Send webhook data
      const webhookData: AutomationWebhookData = {
        automationName: automationName,
        automationDescription: automationDescription,
        trigger: selectedTrigger?.name || 'Unknown',
        actions: selectedActions.map(a => a.name),
        platform: selectedPlatform,
        userId: user.id,
        userEmail: user.email,
        userName: userProfile?.name || user.email || 'Unknown',
        userPlan: userProfile?.plan || 'free',
        status: 'pending',
        createdAt: new Date().toISOString(),
        automationId: createdAutomation.id,
        timestamp: new Date().toISOString(),
        source: 'automation-creator',
        test: false
      };

      await webhookService.sendAutomationData(webhookData);

      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setAutomationName('');
      setAutomationDescription('');
      setSelectedTrigger(null);
      setSelectedActions([]);
      setSelectedCategory('All');
      setSelectedPlatform('n8n');
      setIsTriggerDropdownOpen(false);
      setIsActionsDropdownOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error creating automation:', err);
      setError('Error creating automation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const addAction = (action: Action) => {
    if (!selectedActions.find(a => a.id === action.id)) {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const removeAction = (actionId: string) => {
    setSelectedActions(selectedActions.filter(a => a.id !== actionId));
  };

  const getActionsByCategory = (category: string) => {
    if (category === 'All') {
      return actions;
    }
    return actions.filter(action => action.category === category);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400">Please login to create automations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Automation Creator</h1>
          <p className="text-gray-300">Create new automations and streamline your workflows</p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Automation created successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Platform */}
          <div className="space-y-6">
            {/* Basic Information - Square Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl aspect-square">
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex-1">
                  <label className="block text-white text-sm font-medium mb-2">Automation Name</label>
                  <input
                    type="text"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="e.g., Gmail to Slack Notification"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                    placeholder="Describe what your automation does..."
                    className="w-full h-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Platform Selection - Compact Square Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl aspect-square">
              <h2 className="text-lg font-semibold text-white mb-4">Platform Choose</h2>
              
              <div className="space-y-3 h-full flex flex-col justify-center">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;
                  
                  return (
                    <motion.button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-xl border transition-all text-left group ${
                        isSelected
                          ? `border-transparent bg-gradient-to-r ${platform.color} shadow-lg`
                          : `border-white/20 bg-white/5 hover:bg-white/10 hover:${platform.borderColor}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-white group-hover:text-white'}`}>
                            {platform.name}
                          </h3>
                          <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400 group-hover:text-gray-300'}`}>
                            {platform.description}
                          </p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              disabled={isCreating || !automationName.trim() || !automationDescription.trim() || !selectedTrigger || selectedActions.length === 0}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Create Automation</span>
                </>
              )}
            </button>
          </div>

          {/* Middle Column - Trigger Selection */}
          <div className="space-y-6">
            {/* Trigger Selection - Square Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden aspect-square">
              <button
                onClick={() => setIsTriggerDropdownOpen(!isTriggerDropdownOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all h-full"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-white">Trigger Selection</h2>
                    <p className="text-gray-400 text-sm">
                      {selectedTrigger ? selectedTrigger.name : 'Select a trigger'}
                    </p>
                  </div>
                </div>
                {isTriggerDropdownOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {isTriggerDropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
                      {triggers.map((trigger) => {
                        const Icon = iconMap[trigger.icon] || Zap;
                        return (
                          <button
                            key={trigger.id}
                            onClick={() => {
                              setSelectedTrigger(trigger);
                              setIsTriggerDropdownOpen(false);
                            }}
                            className={`w-full p-4 rounded-lg border transition-all text-left ${
                              selectedTrigger?.id === trigger.id
                                ? 'border-yellow-500 bg-gradient-to-br from-yellow-400/20 to-orange-500/20'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5 text-yellow-400" />
                              <div>
                                <p className="text-white font-medium">{trigger.name}</p>
                                <p className="text-gray-400 text-sm">{trigger.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Trigger Display */}
            {selectedTrigger && (
              <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/20 shadow-lg">
                <h3 className="text-sm font-semibold text-white mb-2">Selected Trigger</h3>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-yellow-400 font-medium text-sm">1</span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">{selectedTrigger.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions Selection */}
          <div className="space-y-6">
            {/* Actions Selection - Square Card */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden aspect-square">
              <button
                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all h-full"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400/20 to-purple-500/20 border border-pink-400/30">
                    <Workflow className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-white">Actions Selection</h2>
                    <p className="text-gray-400 text-sm">
                      {selectedActions.length > 0 
                        ? `${selectedActions.length} actions selected` 
                        : 'Select actions'
                      }
                    </p>
                  </div>
                </div>
                {isActionsDropdownOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {isActionsDropdownOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6">
                      {/* Category Tabs */}
                      <div className="mb-4">
                        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 overflow-x-auto scrollbar-hide">
                          {actionCategories.map((category) => (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={`px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap flex-shrink-0 ${
                                selectedCategory === category
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Actions by Category */}
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {getActionsByCategory(selectedCategory).map((action) => {
                          const Icon = iconMap[action.icon] || Zap;
                          const isSelected = selectedActions.find(a => a.id === action.id);
                          
                          return (
                            <motion.button
                              key={action.id}
                              onClick={() => isSelected ? removeAction(action.id) : addAction(action)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-4 rounded-lg border transition-all text-left group ${
                                isSelected
                                  ? 'border-pink-500 bg-gradient-to-br from-pink-400/20 to-purple-500/20 shadow-lg'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-pink-500/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                  <Icon className={`w-5 h-5 ${isSelected ? 'text-pink-400' : 'text-gray-400 group-hover:text-white'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className={`font-medium ${isSelected ? 'text-white' : 'text-white group-hover:text-white'}`}>{action.name}</p>
                                  <p className={`text-sm ${isSelected ? 'text-pink-200' : 'text-gray-400 group-hover:text-gray-300'}`}>{action.description}</p>
                                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                    isSelected 
                                      ? 'bg-pink-500/30 text-pink-200' 
                                      : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-gray-300'
                                  }`}>
                                    {action.category}
                                  </span>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex-shrink-0"
                                  >
                                    <CheckCircle className="w-6 h-6 text-pink-400" />
                                  </motion.div>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* No actions found message */}
                      {getActionsByCategory(selectedCategory).length === 0 && (
                        <div className="text-center py-8">
                          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-400">No actions found in this category</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Actions Display */}
            {selectedActions.length > 0 && (
              <div className="bg-gradient-to-br from-pink-400/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-4 border border-pink-400/20 shadow-lg">
                <h3 className="text-sm font-semibold text-white mb-2">Selected Actions</h3>
                
                <div className="space-y-2">
                  {selectedActions.map((action, index) => {
                    const Icon = iconMap[action.icon] || Zap;
                    return (
                      <div
                        key={action.id}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-pink-400 font-medium text-sm">{index + 1}</span>
                        <Icon className="w-4 h-4 text-pink-400" />
                        <span className="text-white text-sm">{action.name}</span>
                        <button
                          onClick={() => removeAction(action.id)}
                          className="ml-auto p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AutomationCreator;