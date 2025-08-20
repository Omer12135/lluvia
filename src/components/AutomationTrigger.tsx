import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  Download,
  AlertCircle,
  Zap,
  Clock,
  FileText
} from 'lucide-react';
import { useAutomation } from '../context/AutomationContext';

const AutomationTrigger: React.FC = () => {
  const { automations, addAutomation, currentResult, setCurrentResult, isLoading, setIsLoading } = useAutomation();
  const [selectedAutomation, setSelectedAutomation] = useState<string>('');
  const [customInput, setCustomInput] = useState('');

  const triggerAutomation = async () => {
    if (!selectedAutomation && !customInput.trim()) {
      alert('Please select an automation or enter custom input');
      return;
    }

    setIsLoading(true);
    setCurrentResult(null);

    try {
      // Create automation record
      const automationName = selectedAutomation || 'Custom Automation';
      const newAutomation = {
        name: automationName,
        description: customInput || 'Triggered automation',
        status: 'running' as const
      };
      
      addAutomation(newAutomation);

      // Send request to N8n webhook
      const response = await fetch('https://n8n.myserver.com/webhook/execute/abc123', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automation: automationName,
          input: customInput,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setCurrentResult(result);

      // Update automation status
      setTimeout(() => {
        // This would normally update the specific automation, but for demo purposes
        // we'll just show success
      }, 1000);

    } catch (error) {
      console.error('Error triggering automation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setCurrentResult({
        error: true,
        message: 'Failed to trigger automation - Demo Mode',
        details: `Demo webhook endpoint: This is a demonstration. In production, this would connect to your N8n instance. Error: ${errorMessage}`,
        demoData: {
          processed: Math.floor(Math.random() * 100) + 50,
          success: true,
          executionTime: Math.floor(Math.random() * 5000) + 1000,
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    if (!currentResult) return;

    const dataStr = JSON.stringify(currentResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `automation-result-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const availableAutomations = [
    'Email Marketing Campaign',
    'CRM Data Synchronization', 
    'Slack Alert System',
    'Meeting Scheduler',
    'Order Processing',
    'Lead Management'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Trigger Automation</h3>
        <p className="text-gray-400">Execute your N8n automations and view results</p>
      </div>

      {/* Automation Selection */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
        <h4 className="text-lg font-semibold text-white">Select Automation</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableAutomations.map((automation) => (
            <motion.button
              key={automation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAutomation(automation)}
              className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                selectedAutomation === automation
                  ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedAutomation === automation ? 'bg-purple-500' : 'bg-white/10'
                }`}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-white">{automation}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
        <h4 className="text-lg font-semibold text-white">Custom Input (Optional)</h4>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter any additional data or parameters for your automation..."
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Trigger Button */}
      <div className="flex justify-center">
        <button
          onClick={triggerAutomation}
          disabled={isLoading}
          className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>Trigger Automation</span>
            </>
          )}
        </button>
      </div>

      {/* Result Display */}
      {currentResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {currentResult.error ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              <h4 className="text-lg font-semibold text-white">
                {currentResult.error ? 'Automation Failed' : 'Automation Result'}
              </h4>
            </div>
            
            {!currentResult.error && (
              <button
                onClick={downloadResult}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
            )}
          </div>

          <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {JSON.stringify(currentResult, null, 2)}
            </pre>
          </div>

          {!currentResult.error && (
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Completed at {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>JSON Format</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h5 className="font-semibold text-white mb-2">N8n Webhook Integration</h5>
            <p className="text-gray-300 text-sm">
              This interface connects directly to your N8n automation webhook at 
              <code className="bg-black/30 px-2 py-1 rounded text-blue-400 mx-1">
                https://n8n.myserver.com/webhook/execute/abc123
              </code>
              The results are displayed here and can be downloaded as JSON files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationTrigger;