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
  Star
} from 'lucide-react';
import { triggers, actions, Trigger, Action } from '../data/applicationsData';
import { useAuth } from '../context/AuthContext';
import { useAutomation } from '../context/AutomationContext';

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
  const { addAutomation, canCreateAutomation, automationLimit, remainingAutomations, currentMonthUsage } = useAutomation();
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'n8n' | 'make' | null>(null);
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

    if (!selectedPlatform) {
      alert('Please select a platform (N8N or Make)');
      return;
    }

          if (!canCreateAutomation) {
        if (automationLimit === 1) {
        alert('You have reached the Free Plan limit of 1 automation. Please upgrade to Pro Plan to create more automations.');
      } else {
        alert('You have reached your automation limit. Please upgrade your plan to create more automations.');
      }
      return;
    }

    setIsCreating(true);

         const automationData = {
       name: automationName,
       description: automationDescription,
       trigger: selectedTrigger?.name || '',
       actions: selectedActions.map(a => a.name),
       platform: selectedPlatform,
       userId: user?.id || '',
       status: 'pending' as const
     };

    console.log('Creating automation:', automationData);
    
    try {
      const success = await addAutomation(automationData);
      
      if (success) {
        alert('🎉 Automation created successfully!');
        
        // Reset form
        setAutomationName('');
        setAutomationDescription('');
        setSelectedTrigger(null);
        setSelectedActions([]);
        setSelectedPlatform(null);
        setTriggerSearchTerm('');
        setActionSearchTerm('');
        setTriggerCategory('all');
        setActionCategory('all');
      } else {
        alert('❌ Failed to create automation. Please check your plan limits.');
      }
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
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-2xl"
          >
            <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-white animate-pulse" />
            <h1 className="text-lg sm:text-3xl font-bold text-white">Create New Automation</h1>
            <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-white animate-pulse" />
          </motion.div>
          <p className="text-sm sm:text-xl text-gray-300">Build powerful automations in minutes</p>
          
          {/* Usage Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center justify-center space-x-4 text-sm"
          >
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-medium">{remainingAutomations}</span>
              <span className="text-gray-300">remaining</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-white font-medium">{currentMonthUsage}</span>
              <span className="text-gray-300">/ {automationLimit} used</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 sm:space-y-6"
          >
            {/* Automation Details */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg sm:rounded-xl">
                  <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">Automation Details</h2>
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
                    className="w-full px-4 py-3 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-base sm:text-base"
                    maxLength={100}
                  />
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">{automationName.length}/100 characters</p>
                </div>

                                 <div>
                   <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                     Description <span className="text-pink-400">*</span>
                   </label>
                   <textarea
                     value={automationDescription}
                     onChange={(e) => setAutomationDescription(e.target.value)}
                     placeholder="Set up an automation that works with my other sub-workflow to send customers personalized emails related to their requests every month. This should run four times a month."
                     rows={4}
                     className="w-full px-4 py-3 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none text-base sm:text-base"
                   />
                 </div>
              </div>
            </div>

            {/* Selected Components Preview */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">Selected Components</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Selected Trigger */}
                {selectedTrigger ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 sm:p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg sm:rounded-xl"
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
                  <div className="p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-lg sm:rounded-xl text-center">
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
                          className="p-3 sm:p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                              <IconComponent className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="text-white font-medium text-sm sm:text-base">{action.name}</span>
                          </div>
                          <button
                            onClick={() => handleActionToggle(action)}
                            className="text-green-300 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4 sm:w-4 sm:h-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-lg sm:rounded-xl text-center">
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
            className="space-y-3 sm:space-y-6"
          >
            {/* Triggers Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl">
                    <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">Select Trigger</h2>
                </div>
                <button
                  onClick={() => setShowTriggers(!showTriggers)}
                  className="px-4 sm:px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
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
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Search triggers..."
                        value={triggerSearchTerm}
                        onChange={(e) => setTriggerSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
                      />
                      <select
                        value={triggerCategory}
                        onChange={(e) => setTriggerCategory(e.target.value)}
                        className="px-4 py-3 sm:px-3 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm"
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
                            className={`p-4 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-600/30 border-blue-400'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2.5 sm:p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                <IconComponent className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm sm:text-sm truncate">{trigger.name}</p>
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
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl">
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">Select Actions</h2>
                </div>
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="px-4 sm:px-4 py-2.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base"
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
                    className="space-y-3 sm:space-y-4"
                  >
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Search actions..."
                        value={actionSearchTerm}
                        onChange={(e) => setActionSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-sm"
                      />
                      <select
                        value={actionCategory}
                        onChange={(e) => setActionCategory(e.target.value)}
                        className="px-4 py-3 sm:px-3 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-sm"
                      >
                        {actionCategories.map(category => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-3 max-h-64 overflow-y-auto">
                      {filteredActions.map((action) => {
                        const IconComponent = getIcon(action.icon);
                        const isSelected = selectedActions.some(a => a.id === action.id);
                        return (
                          <motion.div
                            key={action.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleActionToggle(action)}
                            className={`p-4 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-green-600/30 border-green-400'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-400'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2.5 sm:p-2 rounded-lg ${isSelected ? 'bg-green-500' : 'bg-gray-600'}`}>
                                <IconComponent className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
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

             {/* Platform Selection Section */}
             <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 shadow-2xl">
               <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
                 <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg sm:rounded-xl">
                   <Workflow className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                 </div>
                 <h2 className="text-lg sm:text-2xl font-bold text-white">Select Platform</h2>
                 <span className="text-pink-400 text-xs sm:text-sm">*</span>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                 {/* N8N Option */}
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setSelectedPlatform('n8n')}
                   className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                     selectedPlatform === 'n8n'
                       ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-400 ring-2 ring-blue-400/20'
                       : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-400'
                   }`}
                 >
                   <div className="flex items-center space-x-3 mb-3">
                     <div className={`p-2.5 sm:p-3 rounded-lg ${selectedPlatform === 'n8n' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                       <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                       </svg>
                     </div>
                     <div>
                       <h3 className="text-white font-semibold text-sm sm:text-base">N8N</h3>
                       <p className="text-gray-400 text-xs sm:text-sm">Open-source automation</p>
                     </div>
                     {selectedPlatform === 'n8n' && (
                       <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 ml-auto" />
                     )}
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="text-gray-300 text-xs sm:text-sm">Free & Open Source</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                       <span className="text-gray-300 text-xs sm:text-sm">Self-hosted</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                       <span className="text-gray-300 text-xs sm:text-sm">Node.js based</span>
                     </div>
                   </div>
                 </motion.div>

                 {/* Make (Integromat) Option */}
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setSelectedPlatform('make')}
                   className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                     selectedPlatform === 'make'
                       ? 'bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-400 ring-2 ring-orange-400/20'
                       : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-400'
                   }`}
                 >
                   <div className="flex items-center space-x-3 mb-3">
                     <div className={`p-2.5 sm:p-3 rounded-lg ${selectedPlatform === 'make' ? 'bg-orange-500' : 'bg-gray-600'}`}>
                       <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                       </svg>
                     </div>
                     <div>
                       <h3 className="text-white font-semibold text-sm sm:text-base">Make (Integromat)</h3>
                       <p className="text-gray-400 text-xs sm:text-sm">Visual automation platform</p>
                     </div>
                     {selectedPlatform === 'make' && (
                       <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 ml-auto" />
                     )}
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="text-gray-300 text-xs sm:text-sm">Cloud-based</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                       <span className="text-gray-300 text-xs sm:text-sm">Visual interface</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                       <span className="text-gray-300 text-xs sm:text-sm">Enterprise ready</span>
                     </div>
                   </div>
                 </motion.div>
               </div>

               {!selectedPlatform && (
                 <p className="text-gray-400 text-xs sm:text-sm mt-3 text-center">
                   Please select a platform to continue
                 </p>
               )}
             </div>
           </motion.div>
         </div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 sm:mt-8 text-center"
        >
                     <button
             onClick={handleCreate}
             disabled={!automationName.trim() || !automationDescription.trim() || !selectedTrigger || !selectedPlatform || isCreating || !canCreateAutomation}
            className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-4 text-white text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3 mx-auto ${
              !canCreateAutomation 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 hover:shadow-purple-500/25 hover:scale-105'
            }`}
          >
            {isCreating ? (
              <>
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                <span>Creating Automation...</span>
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              </>
            ) : !canCreateAutomation ? (
              <>
                <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Upgrade to Create More</span>
                <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Create Automation</span>
                <Star className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            )}
          </button>
          {!canCreateAutomation && (
            <p className="text-red-400 text-sm mt-3 sm:mt-2">
                              {automationLimit === 1 
                ? 'You have reached the Free Plan limit of 1 automation. Please upgrade to Pro Plan to create more automations.'
                : 'You have reached your automation limit. Please upgrade your plan to create more automations.'
              }
            </p>
          )}
                     {(!automationName.trim() || !automationDescription.trim() || !selectedTrigger || !selectedPlatform) && canCreateAutomation && (
             <p className="text-gray-400 text-sm mt-3 sm:mt-2">
               {!automationName.trim() ? 'Enter automation name' : !automationDescription.trim() ? 'Enter automation description' : !selectedTrigger ? 'Select a trigger' : 'Select a platform'} to continue
             </p>
           )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AutomationCreator;