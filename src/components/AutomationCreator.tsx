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
  Palette,
  Sparkles as SparklesIcon
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
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Large Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl px-8 py-4 border border-pink-400/30 shadow-2xl"
          >
            <SparklesIcon className="w-8 h-8 text-pink-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Create New Automation
            </h1>
            <SparklesIcon className="w-8 h-8 text-purple-400 animate-pulse" />
          </motion.div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Automation created successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">{error}</span>
          </motion.div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Automation Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                <span>Automation Name</span>
              </h2>
              <input
                type="text"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                placeholder="e.g., Gmail to Slack Notification"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Book className="w-5 h-5 text-orange-400" />
                <span>Description</span>
              </h2>
              <textarea
                value={automationDescription}
                onChange={(e) => setAutomationDescription(e.target.value)}
                placeholder="Describe what your automation does... (max 2000 words)"
                maxLength={2000}
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
              />
              <div className="mt-2 text-right">
                <span className="text-xs text-gray-400">
                  {automationDescription.length}/2000
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Selections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trigger Choose */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Trigger Choose</span>
              </h2>
              
              <div className="relative">
                <button
                  onClick={() => setIsTriggerDropdownOpen(!isTriggerDropdownOpen)}
                  className="w-full p-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-xl text-left hover:from-yellow-400/30 hover:to-orange-500/30 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">
                      {selectedTrigger ? selectedTrigger.name : 'Select a trigger...'}
                    </span>
                  </div>
                  {isTriggerDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-yellow-400" />
                  )}
                </button>

                <AnimatePresence>
                  {isTriggerDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                        {triggers.map((trigger) => {
                          const Icon = iconMap[trigger.icon] || Zap;
                          return (
                            <button
                              key={trigger.id}
                              onClick={() => {
                                setSelectedTrigger(trigger);
                                setIsTriggerDropdownOpen(false);
                              }}
                              className={`w-full p-3 rounded-lg border transition-all text-left ${
                                selectedTrigger?.id === trigger.id
                                  ? 'border-yellow-500 bg-gradient-to-br from-yellow-400/20 to-orange-500/20'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Icon className="w-4 h-4 text-yellow-400" />
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

                {/* Selected Trigger Display */}
                {selectedTrigger && (
                  <div className="mt-3 p-3 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-lg border border-yellow-400/20">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">{selectedTrigger.name}</span>
                      <button
                        onClick={() => setSelectedTrigger(null)}
                        className="ml-auto p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions Choose */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-pink-400" />
                <span>Actions Choose</span>
              </h2>
              
              <div className="space-y-4">
                {/* Category and Actions Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex-1 p-3 bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-lg text-left hover:from-purple-400/30 hover:to-pink-500/30 transition-all duration-200 flex items-center justify-between"
                  >
                    <span className="text-white font-medium">
                      Category: {selectedCategory}
                    </span>
                    {isCategoryDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                    className="p-3 bg-gradient-to-r from-pink-400/20 to-purple-500/20 border border-pink-400/30 rounded-lg hover:from-pink-400/30 hover:to-purple-500/30 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4 text-pink-400" />
                    <span className="text-white font-medium text-sm">
                      {selectedActions.length > 0 ? `${selectedActions.length} selected` : 'Select'}
                    </span>
                  </button>
                </div>

                {/* Category Dropdown */}
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto scrollbar-hide">
                        {actionCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`p-2 rounded border transition-all text-left ${
                              selectedCategory === category
                                ? 'border-purple-500 bg-gradient-to-br from-purple-400/20 to-pink-500/20'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <span className={`text-sm font-medium ${
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
                      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                        {getActionsByCategory(selectedCategory).map((action) => {
                          const Icon = iconMap[action.icon] || Zap;
                          const isSelected = selectedActions.find(a => a.id === action.id);
                          
                          return (
                            <motion.button
                              key={action.id}
                              onClick={() => isSelected ? removeAction(action.id) : addAction(action)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full p-3 rounded-lg border transition-all text-left group ${
                                isSelected
                                  ? 'border-pink-500 bg-gradient-to-br from-pink-400/20 to-purple-500/20 shadow-lg'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-pink-500/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                  <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-400' : 'text-gray-400 group-hover:text-white'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {action.name}
                                  </p>
                                  <span className={`text-sm ${isSelected ? 'text-pink-300' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                    {action.category}
                                  </span>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="p-1 bg-pink-500/20 rounded-full"
                                  >
                                    <CheckCircle className="w-4 h-4 text-pink-400" />
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
                  <div className="p-3 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-lg border border-pink-400/20">
                    <h3 className="text-sm font-semibold text-white mb-2">Selected Actions</h3>
                    <div className="space-y-2">
                      {selectedActions.map((action, index) => {
                        const Icon = iconMap[action.icon] || Zap;
                        return (
                          <div
                            key={action.id}
                            className="flex items-center space-x-3 p-2 bg-white/5 rounded"
                          >
                            <span className="text-pink-400 font-medium text-sm">{index + 1}</span>
                            <Icon className="w-4 h-4 text-pink-400" />
                            <span className="text-white text-sm flex-1">{action.name}</span>
                            <button
                              onClick={() => removeAction(action.id)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
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
            </motion.div>

            {/* Platform Choose */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span>Platform Choose</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;
                  
                  return (
                    <motion.button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 group ${
                        isSelected
                          ? `border-transparent bg-gradient-to-r ${platform.color} shadow-lg`
                          : `border-white/20 bg-white/5 hover:bg-white/10 hover:${platform.borderColor}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {platform.name}
                          </h3>
                          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-400 group-hover:text-white/80'}`}>
                            {platform.description}
                          </p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-1 bg-white/20 rounded-full"
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Create Automation Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleCreate}
            disabled={isCreating || !automationName.trim() || !automationDescription.trim() || !selectedTrigger || selectedActions.length === 0}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 hover:from-pink-600 hover:via-purple-600 hover:to-yellow-600 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-pink-500/25 mx-auto"
          >
            {isCreating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Creating Automation...</span>
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                <span>Create Automation</span>
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AutomationCreator;