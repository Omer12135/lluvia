import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Zap,
  Moon,
  Sun,
  Monitor,
  Globe,
  Lock,
  Key,
  Trash2,
  Save
} from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections = [
    {
      title: 'General',
      icon: Settings,
      items: [
        { label: 'Theme', value: theme, type: 'select', options: ['light', 'dark', 'auto'] },
        { label: 'Language', value: 'English', type: 'select', options: ['English', 'Spanish', 'French'] },
        { label: 'Timezone', value: 'UTC+0', type: 'select', options: ['UTC+0', 'UTC+1', 'UTC+2'] }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', value: notifications, type: 'toggle' },
        { label: 'Push Notifications', value: true, type: 'toggle' },
        { label: 'Automation Alerts', value: true, type: 'toggle' }
      ]
    },
    {
      title: 'Automation',
      icon: Zap,
      items: [
        { label: 'Auto Save', value: autoSave, type: 'toggle' },
        { label: 'Execution Limit', value: '1000', type: 'input' },
        { label: 'Timeout (seconds)', value: '30', type: 'input' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Auth', value: false, type: 'toggle' },
        { label: 'Session Timeout', value: '24h', type: 'select', options: ['1h', '8h', '24h'] },
        { label: 'API Key Rotation', value: true, type: 'toggle' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-300">Manage your account preferences and automation settings.</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <Settings className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg mr-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <span className="text-white font-medium">{item.label}</span>
                    
                    {item.type === 'toggle' && (
                      <button
                        onClick={() => {
                          if (item.label === 'Email Notifications') setNotifications(!notifications);
                          if (item.label === 'Auto Save') setAutoSave(!autoSave);
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          item.value ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    )}
                    
                    {item.type === 'select' && (
                      <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white">
                        {item.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {item.type === 'input' && (
                      <input
                        type="text"
                        defaultValue={item.value}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white w-20 text-center"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end space-x-4"
      >
        <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
          Reset to Default
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white hover:from-blue-600 hover:to-cyan-700 transition-colors flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;
