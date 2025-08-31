import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing Supabase connection...');
      
      // Test 1: Basic connection
      addResult('📡 Testing basic connection...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        addResult(`❌ Auth error: ${authError.message}`);
      } else {
        addResult(`✅ Auth connection successful. User: ${user ? user.email : 'None'}`);
      }

      // Test 2: Check if user_profiles table exists
      addResult('📊 Testing user_profiles table access...');
      try {
        const { data: tableData, error: tableError } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);
        
        if (tableError) {
          addResult(`❌ Table access error: ${tableError.message}`);
          addResult(`🔍 Error code: ${tableError.code}`);
          
          // Check if it's a permissions issue
          if (tableError.message.includes('permission')) {
            addResult('⚠️ This looks like a permissions/RLS issue');
          }
        } else {
          addResult(`✅ Table access successful. Found ${tableData?.length || 0} rows`);
        }
      } catch (tableError: any) {
        addResult(`❌ Table test failed: ${tableError.message}`);
      }

      // Test 3: Check table structure
      addResult('🏗️ Testing table structure...');
      try {
        const { data: structureData, error: structureError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(0);
        
        if (structureError) {
          addResult(`❌ Structure check failed: ${structureError.message}`);
        } else {
          addResult('✅ Table structure check passed');
        }
      } catch (structureError: any) {
        addResult(`❌ Structure test failed: ${structureError.message}`);
      }

      // Test 4: Try to create a test profile (will fail but gives us info)
      addResult('🧪 Testing profile creation...');
      try {
        // First, try to authenticate as a test user
        addResult('🔐 Attempting to authenticate for insert test...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: 'testuser123@example.com',
          password: 'testpassword123'
        });
        
        if (authError) {
          addResult(`❌ Authentication failed: ${authError.message}`);
          addResult('ℹ️ This is expected - test user probably doesn\'t exist');
          
          // Try to create a test user first
          addResult('📝 Trying to create test user for insert test...');
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: 'testuser123@example.com',
            password: 'testpassword123',
            options: {
              data: { name: 'Test User' }
            }
          });
          
          if (signupError) {
            addResult(`❌ Test user creation failed: ${signupError.message}`);
          } else {
            addResult('✅ Test user created successfully');
            
            // Now try to insert profile
            const testUserId = signupData.user?.id || '00000000-0000-0000-0000-000000000000';
            const { data: insertData, error: insertError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: testUserId,
                email: 'testuser123@example.com',
                name: 'Test User',
                plan: 'free',
                automations_limit: 2,
                ai_messages_limit: 0
              })
              .select();
            
            if (insertError) {
              addResult(`❌ Insert test failed: ${insertError.message}`);
              addResult(`🔍 Insert error code: ${insertError.code}`);
            } else {
              addResult('✅ Insert test successful!');
            }
          }
        } else {
          addResult('✅ Authentication successful, testing insert...');
          
          // Try to insert profile as authenticated user
          const testUserId = authData.user?.id || '00000000-0000-0000-0000-000000000000';
          const { data: insertData, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: testUserId,
              email: 'testuser123@example.com',
              name: 'Test User',
              plan: 'free',
              automations_limit: 2,
              ai_messages_limit: 0
            })
            .select();
          
          if (insertError) {
            addResult(`❌ Insert test failed: ${insertError.message}`);
            addResult(`🔍 Insert error code: ${insertError.code}`);
          } else {
            addResult('✅ Insert test successful!');
          }
        }
      } catch (insertError: any) {
        addResult(`❌ Insert test exception: ${insertError.message}`);
      }

      // Test 5: Check RLS status manually
      addResult('🔒 Checking RLS status manually...');
      try {
        // Check if RLS is enabled on the table
        const { data: rlsData, error: rlsError } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1);
        
        if (rlsError) {
          addResult(`❌ RLS check failed: ${rlsError.message}`);
          addResult(`🔍 Error code: ${rlsError.code}`);
          
          if (rlsError.message.includes('row-level security policy')) {
            addResult('⚠️ RLS is enabled and blocking access');
          }
        } else {
          addResult('✅ RLS check passed - table is accessible');
        }
        
        // Try to check current user context
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          addResult(`👤 Current user: ${user.email} (${user.id})`);
        } else {
          addResult('👤 No authenticated user');
        }
      } catch (rlsError: any) {
        addResult(`❌ RLS check exception: ${rlsError.message}`);
      }

      addResult('🎯 Database test completed!');
      
    } catch (error: any) {
      addResult(`💥 Test failed with exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Supabase Database Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4">
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? '🔄 Testing...' : '🚀 Run Database Tests'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              🗑️ Clear Results
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {testResults.length === 0 ? (
            <p className="text-gray-400">No test results yet. Click "Run Database Tests" to start.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="bg-gray-700 rounded p-3 font-mono text-sm">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">What This Tests</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• 🔍 Basic Supabase connection</li>
            <li>• 📊 Access to user_profiles table</li>
            <li>• 🏗️ Table structure validation</li>
            <li>• 🧪 Profile creation permissions</li>
            <li>• 🔒 Row Level Security (RLS) status</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
          <div className="space-y-3 text-gray-300">
            <div>
              <strong>❌ Permission denied:</strong> RLS policies are blocking access
            </div>
            <div>
              <strong>❌ Table doesn't exist:</strong> Migration not applied or table name wrong
            </div>
            <div>
              <strong>❌ RLS function missing:</strong> Database functions not created
            </div>
            <div>
              <strong>❌ Connection failed:</strong> Check environment variables and Supabase URL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
