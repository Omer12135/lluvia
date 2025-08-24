import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Star,
  Mail,
  Database,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Users,
  FileText,
  Zap,
  Settings,
  Bot,
  Globe,
  CheckCircle,
  Clock,
  Phone,
  Video,
  Cloud,
  Calculator,
  Target,
  Shield,
  CreditCard,
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
  MousePointer
} from 'lucide-react';
import { useAutomation } from '../../context/AutomationContext';
import { triggers, actions } from '../../data/applicationsData';

const AdminAutomationManager: React.FC = () => {
  const { exampleAutomations, addExampleAutomation, updateExampleAutomation, deleteExampleAutomation } = useAutomation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: '',
    actions: [] as string[],
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    estimatedTime: '',
    steps: [''],
    useCase: '',
    popularity: 50,
    icon: 'Star'
  });

  const availableIcons = [
    { name: 'Mail', component: <Mail className="w-5 h-5" /> },
    { name: 'Database', component: <Database className="w-5 h-5" /> },
    { name: 'MessageSquare', component: <MessageSquare className="w-5 h-5" /> },
    { name: 'Calendar', component: <Calendar className="w-5 h-5" /> },
    { name: 'ShoppingCart', component: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Users', component: <Users className="w-5 h-5" /> },
    { name: 'FileText', component: <FileText className="w-5 h-5" /> },
    { name: 'Star', component: <Star className="w-5 h-5" /> },
    { name: 'Zap', component: <Zap className="w-5 h-5" /> },
    { name: 'Settings', component: <Settings className="w-5 h-5" /> },
    { name: 'Bot', component: <Bot className="w-5 h-5" /> },
    { name: 'Globe', component: <Globe className="w-5 h-5" /> },
    { name: 'CheckCircle', component: <CheckCircle className="w-5 h-5" /> },
    { name: 'Clock', component: <Clock className="w-5 h-5" /> },
    { name: 'Phone', component: <Phone className="w-5 h-5" /> },
    { name: 'Video', component: <Video className="w-5 h-5" /> },
    { name: 'Cloud', component: <Cloud className="w-5 h-5" /> },
    { name: 'Calculator', component: <Calculator className="w-5 h-5" /> },
    { name: 'Target', component: <Target className="w-5 h-5" /> },
    { name: 'Shield', component: <Shield className="w-5 h-5" /> },
    { name: 'CreditCard', component: <CreditCard className="w-5 h-5" /> },
    { name: 'BarChart3', component: <BarChart3 className="w-5 h-5" /> },
    { name: 'Rocket', component: <Rocket className="w-5 h-5" /> },
    { name: 'Heart', component: <Heart className="w-5 h-5" /> },
    { name: 'MousePointer', component: <MousePointer className="w-5 h-5" /> },
    { name: 'Workflow', component: <Workflow className="w-5 h-5" /> }
  ];

  const categories = [
    'Core',
    'Marketing',
    'Data Management', 
    'Communication',
    'Productivity',
    'E-commerce',
    'Sales',
    'Finance',
    'HR',
    'Customer Service',
    'Analytics',
    'Development',
    'Support'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger: '',
      actions: [],
      category: '',
      difficulty: 'Beginner',
      estimatedTime: '',
      steps: [''],
      useCase: '',
      popularity: 50,
      icon: 'Star'
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.trigger || !formData.category || !formData.useCase || !formData.estimatedTime) {
      alert('Please fill in all required fields');
      return;
    }

    const filteredSteps = formData.steps.filter(step => step.trim() !== '');
    if (filteredSteps.length === 0) {
      alert('Please add at least one step');
      return;
    }

    const exampleData = {
      ...formData,
      steps: filteredSteps
    };

    if (editingId) {
      updateExampleAutomation(editingId, exampleData);
    } else {
      addExampleAutomation(exampleData);
    }

    resetForm();
  };

  const startEdit = (example: any) => {
    setFormData({
      name: example.name,
      description: example.description,
      trigger: example.trigger,
      actions: [...example.actions],
      category: example.category,
      difficulty: example.difficulty,
      estimatedTime: example.estimatedTime,
      steps: [...example.steps],
      useCase: example.useCase,
      popularity: example.popularity,
      icon: example.icon
    });
    setEditingId(example.id);
    setShowAddForm(true);
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, '']
    });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({
      ...formData,
      steps: newSteps
    });
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        steps: newSteps
      });
    }
  };

  const toggleAction = (actionName: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.includes(actionName)
        ? prev.actions.filter(a => a !== actionName)
        : [...prev.actions, actionName]
    }));
  };

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.component : <Star className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Admin Automation Management</h3>
          <p className="text-gray-400">Add and manage automation templates for users</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Automation</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-2xl font-bold text-white">
              {editingId ? '✏️ Edit Automation' : '✨ Create New Automation'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  🎯 Automation Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gmail to Slack Integration"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  📝 Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this automation does..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    📂 Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    🎚️ Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty} className="bg-gray-800">{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    ⏱️ Estimated Time *
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    placeholder="e.g., 5 minutes"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    ⭐ Popularity (1-100) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.popularity}
                    onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) || 50 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  🎨 Icon *
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {availableIcons.map(icon => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: icon.name })}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        formData.icon === icon.name
                          ? 'bg-purple-500/30 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/25'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {icon.component}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  🚀 Trigger *
                </label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Trigger</option>
                  {triggers.map(trigger => (
                    <option key={trigger.id} value={trigger.name} className="bg-gray-800">{trigger.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  ⚡ Actions (Optional)
                </label>
                <div className="max-h-48 overflow-y-auto bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="grid grid-cols-1 gap-2">
                    {actions.slice(0, 20).map(action => (
                      <label key={action.id} className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.actions.includes(action.name)}
                          onChange={() => toggleAction(action.name)}
                          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <span className="text-gray-300 text-sm">{action.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Selected: {formData.actions.length} actions</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  💡 Use Case *
                </label>
                <textarea
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  placeholder="Explain when and why to use this automation..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-300">
                🔄 Workflow Steps *
              </label>
              <button
                onClick={addStep}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Step</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder="e.g., Trigger: New user signup"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formData.steps.length > 1 && (
                    <button
                      onClick={() => removeStep(index)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
            >
              <Save className="w-5 h-5" />
              <span>{editingId ? 'Update' : 'Create'} Automation</span>
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-600 text-white px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Automations List */}
      <div className="grid grid-cols-1 gap-6">
        {exampleAutomations.map((example, index) => (
          <motion.div
            key={example.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {getIconComponent(example.icon)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{example.name}</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      example.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      example.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {example.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                      {example.category}
                    </span>
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{example.popularity}%</span>
                    </span>
                    <span className="text-gray-400">{example.estimatedTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEdit(example)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${example.name}"?`)) {
                      deleteExampleAutomation(example.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-gray-300">{example.description}</p>
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <p className="text-blue-400 text-sm">
                    <strong>💡 Use Case:</strong> {example.useCase}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                    🚀 {example.trigger}
                  </span>
                  {example.actions.slice(0, 3).map((action, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">
                      ⚡ {action}
                    </span>
                  ))}
                  {example.actions.length > 3 && (
                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-xs font-semibold">
                      +{example.actions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-3">🔄 Workflow Steps:</p>
                <div className="space-y-2">
                  {example.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {exampleAutomations.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl border border-white/10">
          <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Automations Yet</h3>
          <p className="text-gray-400 mb-6">Create your first automation template to get started!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Create First Automation
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAutomationManager;