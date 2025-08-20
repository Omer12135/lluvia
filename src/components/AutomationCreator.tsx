import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Zap, 
  Mail, 
  Database, 
  Calendar, 
  Globe,
  Loader2,
  CheckCircle,
  Download,
  X,
  Image as ImageIcon,
  Palette,
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
  DollarSign,
  TrendingUp,
  Book,
  Bookmark,
  Activity,
  Eye,
  Mic,
  Network,
  Lightbulb,
  Languages,
  Building,
  Smartphone,
  GitBranch,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Music,
  Link
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { useAuth } from '../context/AuthContext';
import { triggers, actions, categories, getActionsByCategory, getTriggersByCategory } from '../data/applicationsData';

const AutomationCreator: React.FC = () => {
  const { addAutomation } = useAutomation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: '',
    actions: [] as string[]
  });
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [selectedTriggerCategory, setSelectedTriggerCategory] = useState('All');
  const [selectedActionCategory, setSelectedActionCategory] = useState('All');

  // Icon mapping for dynamic rendering
  const iconMap: { [key: string]: React.ReactNode } = {
    Settings: <Settings className="w-5 h-5" />,
    Plus: <Plus className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
    Clock: <Clock className="w-5 h-5" />,
    Globe: <Globe className="w-5 h-5" />,
    Mail: <Mail className="w-5 h-5" />,
    Bot: <Bot className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    Phone: <Phone className="w-5 h-5" />,
    Video: <Video className="w-5 h-5" />,
    Cloud: <Cloud className="w-5 h-5" />,
    Calculator: <Calculator className="w-5 h-5" />,
    FileText: <FileText className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    Target: <Target className="w-5 h-5" />,
    Shield: <Shield className="w-5 h-5" />,
    CreditCard: <CreditCard className="w-5 h-5" />,
    ShoppingCart: <ShoppingCart className="w-5 h-5" />,
    BarChart3: <BarChart3 className="w-5 h-5" />,
    Search: <Search className="w-5 h-5" />,
    Bell: <Bell className="w-5 h-5" />,
    AlertTriangle: <AlertTriangle className="w-5 h-5" />,
    Package: <Package className="w-5 h-5" />,
    Truck: <Truck className="w-5 h-5" />,
    Home: <Home className="w-5 h-5" />,
    Rocket: <Rocket className="w-5 h-5" />,
    DollarSign: <DollarSign className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    Book: <Book className="w-5 h-5" />,
    Bookmark: <Bookmark className="w-5 h-5" />,
    Activity: <Activity className="w-5 h-5" />,
    Eye: <Eye className="w-5 h-5" />,
    Mic: <Mic className="w-5 h-5" />,
    Network: <Network className="w-5 h-5" />,
    Lightbulb: <Lightbulb className="w-5 h-5" />,
    Languages: <Languages className="w-5 h-5" />,
    Building: <Building className="w-5 h-5" />,
    Smartphone: <Smartphone className="w-5 h-5" />,
    GitBranch: <GitBranch className="w-5 h-5" />,
    Twitter: <Twitter className="w-5 h-5" />,
    Linkedin: <Linkedin className="w-5 h-5" />,
    Facebook: <Facebook className="w-5 h-5" />,
    Youtube: <Youtube className="w-5 h-5" />,
    Music: <Music className="w-5 h-5" />,
    Calendar: <Calendar className="w-5 h-5" />,
    CheckCircle: <CheckCircle className="w-5 h-5" />,
    Link: <Link className="w-5 h-5" />,
    Image: <ImageIcon className="w-5 h-5" />
  };

  const imageOptions = [
    {
      id: 'business',
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Business Meeting'
    },
    {
      id: 'technology',
      url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Technology'
    },
    {
      id: 'teamwork',
      url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Teamwork'
    },
    {
      id: 'office',
      url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Modern Office'
    },
    {
      id: 'analytics',
      url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Analytics'
    },
    {
      id: 'workspace',
      url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Workspace'
    }
  ];

  const styleOptions = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, minimalist design with sharp edges',
      preview: 'bg-gradient-to-r from-blue-500 to-purple-500'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional, professional appearance',
      preview: 'bg-gradient-to-r from-gray-600 to-gray-800'
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Bold colors and dynamic elements',
      preview: 'bg-gradient-to-r from-pink-500 to-orange-500'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean, and focused design',
      preview: 'bg-gradient-to-r from-gray-300 to-gray-500'
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Dark theme with accent colors',
      preview: 'bg-gradient-to-r from-gray-900 to-black'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Earth tones and organic feel',
      preview: 'bg-gradient-to-r from-green-600 to-emerald-600'
    }
  ];

  const handleCreateAutomation = () => {
    if (!formData.name || !formData.description || !formData.trigger) {
      alert('Please fill in all required fields');
      return;
    }

    if (!user) {
      alert('Please log in to create automations');
      return;
    }

    // Check automation limits
    if (user.automationsUsed >= user.automationsLimit && user.plan !== 'pro') {
      alert(`You have reached your automation limit (${user.automationsLimit}). Please upgrade your plan.`);
      return;
    }

    // Show style selection modal
    setShowStyleModal(true);
  };

  const handleStyleSubmit = async () => {
    if (!selectedImage || !selectedStyle) {
      alert('Please select both an image and a style');
      return;
    }

    setIsProcessing(true);
    setShowStyleModal(false);

    try {
      // Use the correct webhook URL from the image
      const webhookUrl = 'https://lluviaomer.app.n8n.cloud/webhook/lluvia';
      
      const selectedTrigger = triggers.find(t => t.id === formData.trigger);
      const selectedActions = actions.filter(a => formData.actions.includes(a.id));
      
      const payload = {
        automation: {
          name: formData.name,
          description: formData.description,
          trigger: {
            id: formData.trigger,
            name: selectedTrigger?.name || 'Unknown',
            description: selectedTrigger?.description || ''
          },
          actions: selectedActions.map(action => ({
            id: action.id,
            name: action.name,
            description: action.description
          }))
        },
        user: {
          id: user?.id || 'anonymous',
          email: user?.email || 'anonymous@example.com',
          name: user?.name || 'Anonymous User',
          plan: user?.plan || 'free'
        },
        style: {
          selectedStyle: selectedStyle,
          selectedImage: selectedImage,
          imageUrl: imageOptions.find(img => img.id === selectedImage)?.url
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setWebhookResponse({
        success: true,
        data: result,
        url: webhookUrl,
        payload: payload
      });

      // Add automation to local state
      addAutomation({
        name: formData.name,
        description: formData.description,
        status: 'completed',
        userId: user.id
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        trigger: '',
        actions: []
      });
      setSelectedImage('');
      setSelectedStyle('');

    } catch (error) {
      console.error('Error sending to webhook:', error);
      setWebhookResponse({
        error: true,
        message: 'Failed to process automation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResponse = () => {
    if (!webhookResponse) return;

    const dataStr = JSON.stringify(webhookResponse, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `automation-response-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleActionToggle = (actionId: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.includes(actionId)
        ? prev.actions.filter(id => id !== actionId)
        : [...prev.actions, actionId]
    }));
  };

  const filteredTriggers = getTriggersByCategory(selectedTriggerCategory);
  const filteredActions = getActionsByCategory(selectedActionCategory);
  const selectedTrigger = triggers.find(t => t.id === formData.trigger);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Create New Automation</h3>
        <p className="text-gray-400">Build custom workflows to automate your business processes</p>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-8 border border-white/20 text-center"
          >
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Processing...</h3>
            <p className="text-gray-400">Your automation data is being processed, please wait.</p>
            <div className="mt-4 w-64 bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 60 }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Webhook Response Display */}
      {webhookResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {webhookResponse.error ? (
                <X className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              <h4 className="text-lg font-semibold text-white">
                {webhookResponse.error ? 'Process Failed' : 'Process Completed'}
              </h4>
            </div>
            
            <button
              onClick={downloadResponse}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {JSON.stringify(webhookResponse, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Style Selection Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Image and Style Selection</h3>
              <button
                onClick={() => setShowStyleModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Selection */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Select Image</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageOptions.map((image) => (
                  <motion.button
                    key={image.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(image.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === image.id
                        ? 'border-purple-500 ring-2 ring-purple-500/50'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{image.title}</span>
                    </div>
                    {selectedImage === image.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Select Style</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {styleOptions.map((style) => (
                  <motion.button
                    key={style.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                      selectedStyle === style.id
                        ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg mb-3 ${style.preview}`}></div>
                    <h5 className="font-semibold text-white mb-1">{style.name}</h5>
                    <p className="text-gray-400 text-sm">{style.description}</p>
                    {selectedStyle === style.id && (
                      <div className="mt-2">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStyleModal(false)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStyleSubmit}
                disabled={!selectedImage || !selectedStyle}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Selection
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Automation Form */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Automation Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Customer Onboarding Flow"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this automation will do..."
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Trigger Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trigger Type *
          </label>
          
          {/* Trigger Category Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedTriggerCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTriggerCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredTriggers.map((trigger) => (
              <motion.button
                key={trigger.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, trigger: trigger.id })}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  formData.trigger === trigger.id
                    ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-blue-500">
                    {iconMap[trigger.icon] || <Settings className="w-5 h-5" />}
                  </div>
                  <span className="font-medium text-white text-sm">{trigger.name}</span>
                </div>
                <p className="text-gray-400 text-xs">{trigger.description}</p>
                <span className="inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {trigger.category}
                </span>
              </motion.button>
            ))}
          </div>

          {selectedTrigger && (
            <div className="mt-4 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <p className="text-blue-400 text-sm">
                <strong>Selected Trigger:</strong> {selectedTrigger.name} - {selectedTrigger.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions Selection */}
        {formData.trigger && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Actions * (Select one or more)
            </label>
            
            {/* Action Category Filter */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedActionCategory(category)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedActionCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {filteredActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleActionToggle(action.id)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                    formData.actions.includes(action.id)
                      ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-green-500">
                      {iconMap[action.icon] || <Settings className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-white text-sm">{action.name}</span>
                    {formData.actions.includes(action.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{action.description}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    {action.category}
                  </span>
                </motion.button>
              ))}
            </div>

            {formData.actions.length > 0 && (
              <div className="mt-4 bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <p className="text-green-400 text-sm mb-2">
                  <strong>Selected Actions ({formData.actions.length}):</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.actions.map(actionId => {
                    const action = actions.find(a => a.id === actionId);
                    return action ? (
                      <span key={actionId} className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        {action.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={handleCreateAutomation}
            disabled={!formData.name || !formData.description || !formData.trigger || formData.actions.length === 0}
            className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-6 h-6" />
            <span>Select Style & Image</span>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-white mb-2">Automation Tips</h5>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Start with simple triggers and gradually add complexity</li>
              <li>• Test your automations with sample data first</li>
              <li>• Use descriptive names for easy identification</li>
              <li>• Select multiple actions to create powerful workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationCreator;