import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Globe,
  AlertTriangle,
  Copy,
  Eye,
  Bug
} from 'lucide-react';

const N8NDebugger: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const webhookUrls = [
    'https://lluviaomer.app.n8n.cloud/webhook/lluvia',
    'https://lluviaomer.app.n8n.cloud/webhook-test/lluvia',
    'https://lluviaomer.app.n8n.cloud/webhook/test',
    'https://lluviaomer.app.n8n.cloud/webhook/automation',
    'https://lluviaomer.app.n8n.cloud/webhook/lluvia-webhook'
  ];

  const testPayload = {
    event_type: 'automation_created',
    timestamp: new Date().toISOString(),
    automation_name: 'Debug Test Automation',
    automation_description: 'Testing N8N webhook connectivity',
    trigger_name: 'Debug Trigger',
    user_id: 'debug_user',
    user_email: 'debug@lluvia.ai',
    test: true
  };

  const testAllWebhooks = async () => {
    setTesting(true);
    setResults([]);
    
    for (const url of webhookUrls) {
      try {
        console.log(`🔍 Testing webhook: ${url}`);
        
        const startTime = Date.now();
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LLUVIA-DEBUG/1.0'
          },
          body: JSON.stringify(testPayload)
        });

        const duration = Date.now() - startTime;
        const responseText = await response.text();
        
        const result = {
          url,
          status: response.status,
          statusText: response.statusText,
          duration,
          headers: Object.fromEntries(response.headers.entries()),
          responseText: responseText.substring(0, 1000), // First 1000 chars
          responseLength: responseText.length,
          isHtml: responseText.toLowerCase().includes('<html>'),
          success: response.ok,
          timestamp: new Date().toISOString()
        };

        console.log(`📡 Result for ${url}:`, result);
        setResults(prev => [...prev, result]);
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        const result = {
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
          timestamp: new Date().toISOString()
        };
        
        console.error(`❌ Error testing ${url}:`, error);
        setResults(prev => [...prev, result]);
      }
    }
    
    setTesting(false);
  };

  const copyResult = (result: any) => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
            <Bug className="w-6 h-6" />
            <span>N8N Webhook Debugger</span>
          </h3>
          <p className="text-gray-400">Test multiple N8N webhook endpoints to find the correct one</p>
        </div>
        <button
          onClick={testAllWebhooks}
          disabled={testing}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-red-500/25"
        >
          {testing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span>{testing ? 'Testing...' : 'Test All Webhooks'}</span>
        </button>
      </div>

      {/* Test Payload Display */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h4 className="text-lg font-semibold text-white mb-4">Test Payload</h4>
        <div className="bg-black/30 rounded-xl p-4">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(testPayload, null, 2)}
          </pre>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border ${
              result.success ? 'border-green-500/30' : 'border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <h4 className="text-lg font-semibold text-white">{result.url}</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.status || 'ERROR'}
                    </span>
                    {result.duration && (
                      <span className="text-gray-400">{result.duration}ms</span>
                    )}
                    {result.isHtml && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                        HTML Response
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyResult(result)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy Result"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">Response Details:</p>
                  <div className="bg-black/30 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-white">{result.status} {result.statusText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Content Length:</span>
                      <span className="text-white">{result.responseLength || 0} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Content-Type:</span>
                      <span className="text-white">{result.headers?.['content-type'] || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {result.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{result.error}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">Response Preview:</p>
                <div className="bg-black/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {result.responseText || 'No response content'}
                  </pre>
                </div>
              </div>
            </div>

            {result.success && !result.isHtml && (
              <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>✅ This webhook appears to be working correctly!</span>
                </div>
              </div>
            )}

            {result.isHtml && (
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>⚠️ Webhook returned HTML - Check N8N workflow configuration</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {results.length === 0 && !testing && (
        <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl border border-white/10">
          <Bug className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Debug</h3>
          <p className="text-gray-400">Click "Test All Webhooks" to start debugging N8N connectivity</p>
        </div>
      )}
    </div>
  );
};

export default N8NDebugger;
