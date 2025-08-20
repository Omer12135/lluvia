import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Globe,
  Clock,
  AlertTriangle,
  Copy
} from 'lucide-react';

interface TestResult {
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
  duration?: number;
  timestamp: number;
}

const WebhookTester: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [testData, setTestData] = useState({
    event_type: 'automation_created',
    timestamp: new Date().toISOString(),
    automation_name: 'Gmail to Slack Integration',
    automation_description: 'Send Slack notifications for important emails',
    trigger_name: 'Gmail Trigger',
    trigger_category: 'Email',
    actions_count: 2,
    actions: ['Slack Message', 'Google Sheets Update'],
    user_id: 'user_123',
    user_email: 'test@lluvia.ai',
    user_name: 'Test User',
    user_plan: 'pro',
    source: 'lluvia-ai-platform',
    webhook_id: `webhook_${Date.now()}`,
    automation_id: `automation_${Date.now()}`
  });

  const webhookUrl = 'https://lluviaomer.app.n8n.cloud/webhook/lluvia';

  const testWebhook = async (method: 'GET' | 'POST') => {
    const testKey = `${method.toLowerCase()}_test`;
    setTesting(true);
    
    const startTime = Date.now();
    
    try {
      let response: Response;
      
      if (method === 'POST') {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LLUVIA-AI-Platform/1.0'
          },
          body: JSON.stringify(testData)
        });
      } else {
        // GET request with query parameters
        const params = new URLSearchParams({
          event_type: testData.event_type,
          automation_name: testData.automation_name,
          automation_description: testData.automation_description,
          trigger_name: testData.trigger_name,
          user_id: testData.user_id,
          user_email: testData.user_email,
          user_name: testData.user_name,
          user_plan: testData.user_plan,
          timestamp: testData.timestamp
        });
        
        response = await fetch(`${webhookUrl}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'User-Agent': 'LLUVIA-AI-Platform/1.0'
          }
        });
      }

      const duration = Date.now() - startTime;
      let responseData;
      
      // Read response text only once
      const responseText = await response.text();
      
      // Enhanced debugging
      console.log('🔍 ===== WEBHOOK TEST DEBUG =====');
      console.log('📤 Method:', method);
      console.log('📤 URL:', method === 'POST' ? webhookUrl : `${webhookUrl}?${new URLSearchParams(testData as any).toString()}`);
      console.log('📤 Payload:', JSON.stringify(testData, null, 2));
      console.log('📡 Response Status:', response.status);
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('📡 Response Text (First 500 chars):', responseText.substring(0, 500));
      console.log('📡 Response Length:', responseText.length);
      
      if (responseText.toLowerCase().includes('<html>')) {
        console.log('⚠️ WARNING: Received HTML response - N8N webhook might not be active');
      }
      
      console.log('🔍 ============================');
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = responseText || 'Empty response';
      }

      const result: TestResult = {
        success: response.ok,
        status: response.status,
        data: responseData,
        duration,
        timestamp: Date.now()
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
      }

      setTestResults(prev => ({ ...prev, [testKey]: result }));

    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: Date.now()
      };

      setTestResults(prev => ({ ...prev, [testKey]: result }));
    } finally {
      setTesting(false);
    }
  };

  const testAllWebhooks = async () => {
    setTesting(true);
    await testWebhook('POST');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    await testWebhook('GET');
    setTesting(false);
  };

  const copyTestData = () => {
    navigator.clipboard.writeText(JSON.stringify(testData, null, 2));
  };

  const getStatusIcon = (result?: TestResult) => {
    if (!result) return <Clock className="w-5 h-5 text-gray-400" />;
    if (result.success) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (result?: TestResult) => {
    if (!result) return 'text-gray-400 bg-gray-500/20';
    if (result.success) return 'text-green-400 bg-green-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Webhook Connectivity Test</h3>
          <p className="text-gray-400">Test your N8n webhook endpoints to ensure they're working correctly</p>
        </div>
        <button
          onClick={testAllWebhooks}
          disabled={testing}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-purple-500/25"
        >
          {testing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span>{testing ? 'Testing...' : 'Test All Webhooks'}</span>
        </button>
      </div>

      {/* Webhook URL Display */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Webhook Endpoint</span>
          </h4>
          <button
            onClick={() => navigator.clipboard.writeText(webhookUrl)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Copy URL"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-black/30 rounded-xl p-4">
          <code className="text-purple-300 text-sm break-all">{webhookUrl}</code>
        </div>
      </div>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* POST Test */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(testResults.post_test)}
              <div>
                <h4 className="text-lg font-semibold text-white">POST Request</h4>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                  POST
                </span>
              </div>
            </div>
            <button
              onClick={() => testWebhook('POST')}
              disabled={testing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>Test</span>
            </button>
          </div>

          {testResults.post_test && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(testResults.post_test)}`}>
                  {testResults.post_test.success ? 'SUCCESS' : 'FAILED'}
                </span>
              </div>
              
              {testResults.post_test.status && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">HTTP Status:</span>
                  <span className="text-white">{testResults.post_test.status}</span>
                </div>
              )}
              
              {testResults.post_test.duration && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Response Time:</span>
                  <span className="text-white">{testResults.post_test.duration}ms</span>
                </div>
              )}

              {testResults.post_test.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{testResults.post_test.error}</span>
                  </div>
                </div>
              )}

              {testResults.post_test.data && (
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-2">Response Data:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(testResults.post_test.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* GET Test */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(testResults.get_test)}
              <div>
                <h4 className="text-lg font-semibold text-white">GET Request</h4>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                  GET
                </span>
              </div>
            </div>
            <button
              onClick={() => testWebhook('GET')}
              disabled={testing}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>Test</span>
            </button>
          </div>

          {testResults.get_test && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(testResults.get_test)}`}>
                  {testResults.get_test.success ? 'SUCCESS' : 'FAILED'}
                </span>
              </div>
              
              {testResults.get_test.status && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">HTTP Status:</span>
                  <span className="text-white">{testResults.get_test.status}</span>
                </div>
              )}
              
              {testResults.get_test.duration && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Response Time:</span>
                  <span className="text-white">{testResults.get_test.duration}ms</span>
                </div>
              )}

              {testResults.get_test.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{testResults.get_test.error}</span>
                  </div>
                </div>
              )}

              {testResults.get_test.data && (
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-2">Response Data:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(testResults.get_test.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Test Data */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Test Payload</h4>
          <button
            onClick={copyTestData}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
        </div>
        <div className="bg-black/30 rounded-xl p-4">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
        <div className="mt-4">
          <textarea
            value={JSON.stringify(testData, null, 2)}
            onChange={(e) => {
              try {
                setTestData(JSON.parse(e.target.value));
              } catch {
                // Invalid JSON, don't update
              }
            }}
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
            placeholder="Edit test data (JSON format)"
          />
        </div>
      </div>
    </div>
  );
};

export default WebhookTester;
