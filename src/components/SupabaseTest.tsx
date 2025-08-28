import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test 1: Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      let result = `Environment Variables:\n`;
      result += `URL: ${url}\n`;
      result += `Key exists: ${!!key}\n`;
      result += `Key length: ${key?.length}\n\n`;
      
      // Test 2: Try to get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      result += `Session Test:\n`;
      result += `Session: ${sessionData.session ? 'Found' : 'None'}\n`;
      result += `Error: ${sessionError?.message || 'None'}\n\n`;
      
      // Test 3: Try to query user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      result += `Database Test:\n`;
      result += `Profiles query: ${profileError ? 'Failed' : 'Success'}\n`;
      result += `Error: ${profileError?.message || 'None'}\n`;
      
      setTestResult(result);
    } catch (error) {
      setTestResult(`Test failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      
      <button
        onClick={testSupabaseConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {testResult && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;
