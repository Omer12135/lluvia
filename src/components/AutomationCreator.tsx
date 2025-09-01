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
  const [isTriggerDropdownOpen, setIsTriggerDropdownOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Get unique categories from actions
  const actionCategories = ['All', ...Array.from(new Set(actions.map(action => action.category)))];

  // Platform options with colorful design
  const platforms = [
    {
      id: 'n8n',
      name: 'N8N',
      description: 'Open-source workflow automation',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      description: 'Visual automation platform',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
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
      setIsCategoryDropdownOpen(false);

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
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Automation Creator</h1>
          <p className="text-gray-300 text-sm">Create new automations and streamline your workflows</p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Automation created successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Main Grid Layout - 2x2 Grid with smaller cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          
          {/* Basic Information - Smaller Square Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl aspect-square">
            <h2 className="text-lg font-semibold text-white mb-3">Basic Information</h2>
            
            <div className="space-y-3 h-full flex flex-col">
              <div className="flex-1">
                <label className="block text-white text-xs font-medium mb-1">Automation Name</label>
                <input
                  type="text"
                  value={automationName}
                  onChange={(e) => setAutomationName(e.target.value)}
                  placeholder="e.g., Gmail to Slack Notification"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-white text-xs font-medium mb-1">Description</label>
                <textarea
                  value={automationDescription}
                  onChange={(e) => setAutomationDescription(e.target.value)}
                  placeholder="Describe what your automation does..."
                  className="w-full h-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Platform Selection - Smaller Square Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl aspect-square">
            <h2 className="text-lg font-semibold text-white mb-3">Platform Choose</h2>
            
            <div className="space-y-2 h-full flex flex-col justify-center">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatform === platform.id;
                
                return (
                  <motion.button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 group ${
                      isSelected
                        ? `border-transparent bg-gradient-to-r ${platform.color} shadow-lg`
                        : `border-white/20 bg-white/5 hover:bg-white/10 hover:${platform.borderColor}`
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {platform.name}
                        </h3>
                        <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400 group-hover:text-white/80'}`}>
                          {platform.description}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1 bg-white/20 rounded-full"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Trigger Selection - Smaller Square Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl aspect-square">
            <h2 className="text-lg font-semibold text-white mb-3">Trigger Selection</h2>
            
            <div className="h-full flex flex-col">
              {/* Trigger Dropdown Button */}
              <button
                onClick={() => setIsTriggerDropdownOpen(!isTriggerDropdownOpen)}
                className="w-full p-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-lg text-left hover:from-yellow-400/30 hover:to-orange-500/30 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium text-sm">
                    {selectedTrigger ? selectedTrigger.name : 'Select a trigger...'}
                  </span>
                </div>
                {isTriggerDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-yellow-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-yellow-400" />
                )}
              </button>

              {/* Trigger Dropdown */}
              <AnimatePresence>
                {isTriggerDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-hide">
                      {triggers.map((trigger) => {
                        const Icon = iconMap[trigger.icon] || Zap;
                        return (
                          <button
                            key={trigger.id}
                            onClick={() => {
                              setSelectedTrigger(trigger);
                              setIsTriggerDropdownOpen(false);
                            }}
                            className={`w-full p-2 rounded border transition-all text-left ${
                              selectedTrigger?.id === trigger.id
                                ? 'border-yellow-500 bg-gradient-to-br from-yellow-400/20 to-orange-500/20'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className="w-3 h-3 text-yellow-400" />
                              <div>
                                <p className="text-white font-medium text-xs">{trigger.name}</p>
                                <p className="text-gray-400 text-xs">{trigger.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Trigger Display */}
              {selectedTrigger && (
                <div className="mt-2 p-2 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded border border-yellow-400/20">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-white text-xs font-medium truncate">{selectedTrigger.name}</span>
                    <button
                      onClick={() => setSelectedTrigger(null)}
                      className="ml-auto p-0.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Selection - Smaller Square Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl aspect-square">
            <h2 className="text-lg font-semibold text-white mb-3">Actions Selection</h2>
            
            <div className="h-full flex flex-col">
              {/* Category Dropdown Button */}
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex-1 p-2 bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded text-left hover:from-purple-400/30 hover:to-pink-500/30 transition-all duration-200 flex items-center justify-between"
                >
                  <span className="text-white font-medium text-xs truncate">
                    {selectedCategory}
                  </span>
                  {isCategoryDropdownOpen ? (
                    <ChevronUp className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  )}
                </button>
                
                <button
                  onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                  className="p-2 bg-gradient-to-r from-pink-400/20 to-purple-500/20 border border-pink-400/30 rounded hover:from-pink-400/30 hover:to-purple-500/30 transition-all duration-200"
                >
                  <Settings className="w-4 h-4 text-pink-400" />
                </button>
              </div>

              {/* Category Dropdown */}
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2 overflow-hidden"
                  >
                    <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-hide">
                      {actionCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full p-2 rounded border transition-all text-left ${
                            selectedCategory === category
                              ? 'border-purple-500 bg-gradient-to-br from-purple-400/20 to-pink-500/20'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className={`text-xs font-medium ${
                            selectedCategory === category
                              ? 'text-white'
                              : 'text-gray-300 hover:text-white'
                          }`}>
                            {category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions Dropdown */}
              <AnimatePresence>
                {isActionsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Actions List */}
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-hide">
                      {getActionsByCategory(selectedCategory).map((action) => {
                        const Icon = iconMap[action.icon] || Zap;
                        const isSelected = selectedActions.find(a => a.id === action.id);
                        
                        return (
                          <motion.button
                            key={action.id}
                            onClick={() => isSelected ? removeAction(action.id) : addAction(action)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-2 rounded border transition-all text-left group ${
                              isSelected
                                ? 'border-pink-500 bg-gradient-to-br from-pink-400/20 to-purple-500/20 shadow-lg'
                                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`p-1 rounded ${isSelected ? 'bg-pink-500/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                <Icon className={`w-3 h-3 ${isSelected ? 'text-pink-400' : 'text-gray-400 group-hover:text-white'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-xs truncate ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                  {action.name}
                                </p>
                                <span className={`text-xs ${isSelected ? 'text-pink-300' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                  {action.category}
                                </span>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="p-0.5 bg-pink-500/20 rounded-full flex-shrink-0"
                                >
                                  <CheckCircle className="w-3 h-3 text-pink-400" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Actions Display */}
              {selectedActions.length > 0 && (
                <div className="mt-2 p-2 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded border border-pink-400/20">
                  <h3 className="text-xs font-semibold text-white mb-1">Selected Actions</h3>
                  <div className="space-y-1">
                    {selectedActions.slice(0, 2).map((action, index) => {
                      const Icon = iconMap[action.icon] || Zap;
                      return (
                        <div
                          key={action.id}
                          className="flex items-center space-x-2 p-1 bg-white/5 rounded"
                        >
                          <span className="text-pink-400 font-medium text-xs">{index + 1}</span>
                          <Icon className="w-3 h-3 text-pink-400" />
                          <span className="text-white text-xs truncate flex-1">{action.name}</span>
                          <button
                            onClick={() => removeAction(action.id)}
                            className="p-0.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                    {selectedActions.length > 2 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{selectedActions.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Button - Full Width */}
        <div className="mt-6 max-w-5xl mx-auto">
          <button
            onClick={handleCreate}
            disabled={isCreating || !automationName.trim() || !automationDescription.trim() || !selectedTrigger || selectedActions.length === 0}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            {isCreating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Create Automation</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AutomationCreator;