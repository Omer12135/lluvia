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
  const { user } = useAuth();
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('n8n');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'n8n', name: 'N8N', icon: Workflow, description: 'Open source workflow automation' },
    { id: 'make', name: 'Make (Integromat)', icon: Zap, description: 'Visual automation platform' },
    { id: 'zapier', name: 'Zapier', icon: Link, description: 'Connect your apps and automate workflows' },
    { id: 'ifttt', name: 'IFTTT', icon: Sparkles, description: 'If This Then That automation' }
  ];

  const handleCreate = async () => {
    if (!user) {
      setError('Otomasyon oluşturmak için giriş yapmalısınız');
      return;
    }

    if (!automationName.trim() || !automationDescription.trim() || !selectedTrigger || selectedActions.length === 0) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Create automation in Supabase
      const automationData = {
        user_id: user.id,
        automation_name: automationName.trim(),
        automation_description: automationDescription.trim(),
        webhook_payload: {
          trigger: selectedTrigger.name,
          actions: selectedActions.map(a => a.name),
          platform: selectedPlatform
        },
        status: 'pending' as const
      };

      const createdAutomation = await automationService.createAutomation(automationData);

      // Send webhook data
      const webhookData: AutomationWebhookData = {
        automationName: automationName.trim(),
        automationDescription: automationDescription.trim(),
        trigger: selectedTrigger.name,
        actions: selectedActions.map(a => a.name),
        platform: selectedPlatform,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userPlan: user.plan,
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
      setSelectedPlatform('n8n');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      console.error('Error creating automation:', err);
      setError('Otomasyon oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
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

  const reorderActions = (fromIndex: number, toIndex: number) => {
    const newActions = [...selectedActions];
    const [removed] = newActions.splice(fromIndex, 1);
    newActions.splice(toIndex, 0, removed);
    setSelectedActions(newActions);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400">Otomasyon oluşturmak için giriş yapın</p>
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
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Otomasyon Oluşturucu</h1>
          <p className="text-gray-300">Yeni otomasyonlar oluşturun ve iş akışlarınızı otomatikleştirin</p>
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
              <span className="text-green-400">Otomasyon başarıyla oluşturuldu!</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Temel Bilgiler</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Otomasyon Adı</label>
                  <input
                    type="text"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="Örn: Gmail to Slack Notification"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Açıklama</label>
                  <textarea
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                    placeholder="Otomasyonunuzun ne yaptığını açıklayın..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Platform Seçimi</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-blue-400" />
                        <div className="text-left">
                          <p className="text-white font-medium">{platform.name}</p>
                          <p className="text-gray-400 text-xs">{platform.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              disabled={isCreating || !automationName.trim() || !automationDescription.trim() || !selectedTrigger || selectedActions.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Otomasyon Oluştur</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Trigger and Actions */}
          <div className="space-y-6">
            {/* Trigger Selection */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Tetikleyici Seçimi</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {triggers.map((trigger) => {
                  const Icon = iconMap[trigger.icon] || Zap;
                  return (
                    <button
                      key={trigger.id}
                      onClick={() => setSelectedTrigger(trigger)}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        selectedTrigger?.id === trigger.id
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">{trigger.name}</p>
                          <p className="text-gray-400 text-sm">{trigger.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Selection */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Aksiyon Seçimi</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {actions.map((action) => {
                  const Icon = iconMap[action.icon] || Zap;
                  const isSelected = selectedActions.find(a => a.id === action.id);
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => isSelected ? removeAction(action.id) : addAction(action)}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{action.name}</p>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Actions Order */}
            {selectedActions.length > 0 && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Seçilen Aksiyonlar</h3>
                
                <div className="space-y-2">
                  {selectedActions.map((action, index) => {
                    const Icon = iconMap[action.icon] || Zap;
                    return (
                      <div
                        key={action.id}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-blue-400 font-medium text-sm">{index + 1}</span>
                        <Icon className="w-4 h-4 text-blue-400" />
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