import React from 'react';

const SettingsPanel: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <p className="text-white">Settings panel coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
