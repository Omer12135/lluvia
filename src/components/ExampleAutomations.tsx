import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Mail, 
  Database, 
  MessageSquare, 
  Calendar,
  ShoppingCart,
  Users,
  FileText,
  Star,
  Play
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';
import { useAuth } from '../context/AuthContext';

const ExampleAutomations: React.FC = () => {
  const { addAutomation, exampleAutomations } = useAutomation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Mail': <Mail className="w-6 h-6 text-blue-500" />,
      'Database': <Database className="w-6 h-6 text-green-500" />,
      'MessageSquare': <MessageSquare className="w-6 h-6 text-purple-500" />,
      'Calendar': <Calendar className="w-6 h-6 text-orange-500" />,
      'ShoppingCart': <ShoppingCart className="w-6 h-6 text-pink-500" />,
      'Users': <Users className="w-6 h-6 text-cyan-500" />,
      'FileText': <FileText className="w-6 h-6 text-yellow-500" />,
      'Star': <Star className="w-6 h-6 text-yellow-500" />
    };
    return iconMap[iconName] || <Star className="w-6 h-6 text-gray-500" />;
  };

  const categories = Array.from(new Set(exampleAutomations.map(example => example.category)));

  const filteredExamples = selectedCategory === 'All' 
    ? exampleAutomations 
    : exampleAutomations.filter(example => example.category === selectedCategory);

  const useExample = (example: any) => {
    // Check if user can create more automations
    if (!user) return;
    
    const userAutomations = automations.filter(a => a.userId === user.id);
    const canCreate = user.plan === 'pro' || userAutomations.length < user.automationsLimit;
    
    if (!canCreate) {
      showNotification(`You have reached your automation limit (${user.automationsLimit}). Please upgrade your plan.`, 'error');
      return;
    }

    addAutomation({
      name: example.name,
      description: example.description,
      status: 'pending',
      userId: user.id
    });
    
    showNotification(`"${example.name}" added to your automations!`, 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Example Automations</h3>
        <p className="text-gray-400">Get inspired by these popular automation templates</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === 'All' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExamples.map((example, index) => (
          <motion.div
            key={example.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getIconComponent(example.icon)}
                <div>
                  <h4 className="text-lg font-semibold text-white">{example.name}</h4>
                  <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                    {example.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{example.popularity}%</span>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {example.description}
            </p>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-400 mb-2">Workflow Steps:</h5>
              <div className="space-y-1">
                {example.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {stepIndex + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-lg p-3 mb-4">
              <p className="text-blue-400 text-sm">
                <strong>Use Case:</strong> {example.useCase}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => useExample(example)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Copy className="w-4 h-4" />
                <span>Use Template</span>
              </button>
              
              <button 
                onClick={() => {
                  // Show preview modal or detailed view
                  alert(`Preview: ${example.name}\n\n${example.description}\n\nSteps:\n${example.steps.join('\n')}`);
                }}
                className="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white hover:scale-105 rounded-lg transition-all duration-200"
                title="Preview Automation"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popular Templates Section */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-6 border border-purple-500/20">
        <h4 className="text-xl font-bold text-white mb-2">🔥 Most Popular This Week</h4>
        <p className="text-gray-400 mb-4">Join thousands of users who are already using these automations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exampleAutomations.slice(0, 3).map((example) => (
            <div key={example.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                {getIconComponent(example.icon)}
                <span className="font-medium text-white">{example.name}</span>
              </div>
              <p className="text-gray-400 text-xs mb-3">{example.description}</p>
              <button
                onClick={() => useExample(example)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExampleAutomations;