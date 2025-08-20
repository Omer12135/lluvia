import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Server
} from 'lucide-react';
import { triggers, actions, Trigger, Action } from '../data/applicationsData';

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

interface AutomationCreatorProps {
  onClose: () => void;
}

const AutomationCreator: React.FC<AutomationCreatorProps> = ({ onClose }) => {
  const [step, setStep] = useState<'trigger' | 'actions' | 'details' | 'review'>('trigger');
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');

  // Get unique categories
  const triggerCategories = ['all', ...new Set(triggers.map(t => t.category))];
  const actionCategories = ['all', ...new Set(actions.map(a => a.category))];

  // Filter functions
  const filteredTriggers = triggers.filter(trigger => {
    const matchesSearch = trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trigger.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || trigger.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTriggerSelect = (trigger: Trigger) => {
    setSelectedTrigger(trigger);
    setStep('actions');
    setSearchTerm('');
    setSelectedCategory('all');
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

  const handleNext = () => {
    if (step === 'actions') {
      setStep('details');
    } else if (step === 'details') {
      setStep('review');
    }
  };

  const handleBack = () => {
    if (step === 'actions') {
      setStep('trigger');
      setSelectedTrigger(null);
    } else if (step === 'details') {
      setStep('actions');
    } else if (step === 'review') {
      setStep('details');
    }
  };

  const handleCreate = () => {
    console.log('Creating automation:', {
      name: automationName,
      description: automationDescription,
      trigger: selectedTrigger,
      actions: selectedActions
    });
    onClose();
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Settings;
    return IconComponent;
  };

  const renderTriggerSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Select a Trigger</h3>
        <p className="text-gray-400">Choose what will start your automation</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search triggers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {triggerCategories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
            </div>
            
      {/* Triggers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredTriggers.map((trigger) => {
          const IconComponent = getIcon(trigger.icon);
          return (
            <motion.div
              key={trigger.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTriggerSelect(trigger)}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">{trigger.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{trigger.description}</p>
                  <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-2">
                    {trigger.category}
                  </span>
          </div>
          </div>
        </motion.div>
          );
        })}
      </div>

      {filteredTriggers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No triggers found matching your criteria</p>
        </div>
      )}
    </div>
  );

  const renderActionSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Select Actions (Optional)</h3>
        <p className="text-gray-400">Choose what happens when the trigger fires</p>
      </div>

      {/* Selected Trigger */}
      {selectedTrigger && (
        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              {React.createElement(getIcon(selectedTrigger.icon), { className: "w-5 h-5 text-white" })}
            </div>
            <div>
              <h4 className="text-white font-medium">Trigger: {selectedTrigger.name}</h4>
              <p className="text-blue-300 text-sm">{selectedTrigger.description}</p>
            </div>
          </div>
                      </div>
                    )}

      {/* Selected Actions */}
      {selectedActions.length > 0 && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <h4 className="text-white font-medium mb-3">Selected Actions ({selectedActions.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedActions.map((action) => {
              const IconComponent = getIcon(action.icon);
              return (
                <div key={action.id} className="flex items-center space-x-2 px-3 py-1 bg-green-800 rounded-full">
                  <IconComponent className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">{action.name}</span>
              <button
                    onClick={() => handleActionToggle(action)}
                    className="text-green-300 hover:text-white"
                  >
                    <X className="w-3 h-3" />
              </button>
            </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {actionCategories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
          </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredActions.map((action) => {
          const IconComponent = getIcon(action.icon);
          const isSelected = selectedActions.some(a => a.id === action.id);
          return (
            <motion.div
              key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              onClick={() => handleActionToggle(action)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-gray-800 border-gray-700 hover:border-green-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-green-600' : 'bg-gray-600'}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                  </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">{action.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{action.description}</p>
                  <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded mt-2">
                    {action.category}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </motion.div>
          );
        })}
          </div>

      {filteredActions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No actions found matching your criteria</p>
            </div>
          )}
        </div>
  );

  const renderDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Automation Details</h3>
        <p className="text-gray-400">Give your automation a name and description</p>
      </div>

      {/* Selected Trigger & Actions Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Selected Components</h4>
        <div className="space-y-3">
          {/* Trigger */}
          {selectedTrigger && (
            <div className="flex items-center space-x-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="p-2 bg-blue-600 rounded-lg">
                {React.createElement(getIcon(selectedTrigger.icon), { className: "w-4 h-4 text-white" })}
              </div>
              <div>
                <span className="text-blue-300 text-sm font-medium">TRIGGER:</span>
                <span className="text-white ml-2">{selectedTrigger.name}</span>
              </div>
            </div>
          )}
          
          {/* Actions */}
          {selectedActions.length > 0 && (
            <div className="space-y-2">
              {selectedActions.map((action, index) => {
                const IconComponent = getIcon(action.icon);
                return (
                  <div key={action.id} className="flex items-center space-x-3 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-green-300 text-sm font-medium">ACTION {index + 1}:</span>
                      <span className="text-white ml-2">{action.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedActions.length === 0 && (
            <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-center">
              <span className="text-gray-400 text-sm">No actions selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Automation Name */}
      <div className="space-y-2">
        <label className="block text-white font-medium">
          Automation Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={automationName}
          onChange={(e) => setAutomationName(e.target.value)}
          placeholder="e.g., Email to Slack Notification, Customer Onboarding Flow..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={100}
        />
        <p className="text-gray-400 text-sm">{automationName.length}/100 characters</p>
      </div>

      {/* Automation Description */}
      <div className="space-y-2">
        <label className="block text-white font-medium">
          Description <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          value={automationDescription}
          onChange={(e) => setAutomationDescription(e.target.value)}
          placeholder="Describe what this automation does, when it runs, and what outcomes you expect..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          maxLength={500}
        />
        <p className="text-gray-400 text-sm">{automationDescription.length}/500 characters</p>
      </div>

      {/* Automation Examples */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">💡 Naming Tips</h4>
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">
            <span className="text-green-400">Good:</span> "Gmail to Slack - New Customer Emails"
          </p>
          <p className="text-gray-300">
            <span className="text-green-400">Good:</span> "Stripe Payment → Update Airtable Customer Record"
          </p>
          <p className="text-gray-300">
            <span className="text-red-400">Avoid:</span> "My Automation" or "Test 123"
          </p>
        </div>
      </div>
    </div>
  );

    const renderReview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Review Your Automation</h3>
        <p className="text-gray-400">Confirm your automation setup</p>
      </div>

      {/* Automation Info */}
      <div className="p-6 bg-purple-900/20 border border-purple-700 rounded-lg">
        <div className="space-y-3">
          <div>
            <h4 className="text-purple-300 font-semibold text-lg">{automationName || 'Unnamed Automation'}</h4>
            {automationDescription && (
              <p className="text-gray-300 text-sm mt-2">{automationDescription}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Trigger */}
        {selectedTrigger && (
          <div className="p-6 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                {React.createElement(getIcon(selectedTrigger.icon), { className: "w-6 h-6 text-white" })}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">TRIGGER</h4>
                <h5 className="text-blue-300 font-medium">{selectedTrigger.name}</h5>
                <p className="text-gray-400 text-sm">{selectedTrigger.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Arrow */}
        {selectedActions.length > 0 && (
          <div className="flex justify-center">
            <div className="p-2 bg-gray-700 rounded-full">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        )}

        {/* Actions */}
        {selectedActions.length > 0 ? (
          <div className="space-y-3">
            {selectedActions.map((action, index) => {
              const IconComponent = getIcon(action.icon);
              return (
                <div key={action.id} className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-600 rounded-lg">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">ACTION {index + 1}</h4>
                      <h5 className="text-green-300 font-medium">{action.name}</h5>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
              </div>
        ) : (
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center">
            <p className="text-gray-400">No actions selected - this automation will only trigger without performing any actions</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Automation</h2>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${step === 'trigger' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-400">Trigger</span>
                <div className={`w-3 h-3 rounded-full ${step === 'actions' ? 'bg-blue-500' : (step === 'details' || step === 'review') ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                <span className="text-sm text-gray-400">Actions</span>
                <div className={`w-3 h-3 rounded-full ${step === 'details' ? 'bg-blue-500' : step === 'review' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                <span className="text-sm text-gray-400">Details</span>
                <div className={`w-3 h-3 rounded-full ${step === 'review' ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                <span className="text-sm text-gray-400">Review</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

                {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 'trigger' && renderTriggerSelection()}
          {step === 'actions' && renderActionSelection()}
          {step === 'details' && renderDetails()}
          {step === 'review' && renderReview()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleBack}
            disabled={step === 'trigger'}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex space-x-3">
            {step === 'actions' && (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Details
              </button>
            )}
            {step === 'details' && (
              <button
                onClick={handleNext}
                disabled={!automationName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review
              </button>
            )}
            {step === 'review' && (
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Create Automation</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AutomationCreator;
