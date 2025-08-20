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
  Zap
} from 'lucide-react';
import { useAutomation } from '../../context/AutomationContext';

const ExampleAutomationManager: React.FC = () => {
  const { exampleAutomations, addExampleAutomation, updateExampleAutomation, deleteExampleAutomation } = useAutomation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    icon: 'Star',
    steps: [''],
    popularity: 50,
    useCase: ''
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
    { name: 'Zap', component: <Zap className="w-5 h-5" /> }
  ];

  const categories = [
    'Marketing',
    'Data Management', 
    'Communication',
    'Productivity',
    'E-commerce',
    'Sales',
    'Finance',
    'HR',
    'Customer Service',
    'Analytics'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      icon: 'Star',
      steps: [''],
      popularity: 50,
      useCase: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.category || !formData.useCase) {
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
      category: example.category,
      icon: example.icon,
      steps: [...example.steps],
      popularity: example.popularity,
      useCase: example.useCase
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

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.component : <Star className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Example Automation Management</h3>
          <p className="text-gray-400">Manage automation templates that users can use</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Example</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Example Automation' : 'Add New Example Automation'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Email Marketing Campaign"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableIcons.map(icon => (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: icon.name })}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.icon === icon.name
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {icon.component}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Popularity (1-100) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.popularity}
                  onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this automation does..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Use Case *
                </label>
                <textarea
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  placeholder="Explain when and why to use this automation..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Workflow Steps *
              </label>
              <button
                onClick={addStep}
                className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm w-8">{index + 1}.</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder="e.g., Trigger: New user signup"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {formData.steps.length > 1 && (
                    <button
                      onClick={() => removeStep(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Update' : 'Add'} Example</span>
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Examples List */}
      <div className="space-y-4">
        {exampleAutomations.map((example, index) => (
          <motion.div
            key={example.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  {getIconComponent(example.icon)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{example.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      {example.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{example.popularity}%</span>
                    </span>
                    <span>{example.steps.length} steps</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEdit(example)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
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
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 text-sm mb-2">{example.description}</p>
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-blue-400 text-sm">
                    <strong>Use Case:</strong> {example.useCase}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs font-medium mb-2">Workflow Steps:</p>
                <div className="space-y-1">
                  {example.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {stepIndex + 1}
                      </div>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {exampleAutomations.length === 0 && (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <Star className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No example automations yet. Add your first example to get started!</p>
        </div>
      )}
    </div>
  );
};



export default ExampleAutomationManager