import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmailConfirmationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Use refs to prevent re-renders
  const hasInitialized = useRef(false);
  const isProcessing = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { forceSessionSync } = useAuth();

  console.log('EmailConfirmationPage rendered!');

  // Initialize only once - STRICT control with refs
  useEffect(() => {
    if (hasInitialized.current || isProcessing.current) {
      console.log('Already initialized or processing, skipping...');
      return;
    }
    
    console.log('EmailConfirmationPage initializing...');
    hasInitialized.current = true;
    isProcessing.current = true;
    
    // Check if we have confirmation parameters in URL
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    console.log('URL params - token:', token, 'type:', type);
    
    if (token && type === 'signup') {
      console.log('Found confirmation token, attempting to confirm...');
      handleEmailConfirmation(token);
    } else {
      // No token, show manual confirmation option
      setMessage('Please click the button below to confirm your email address.');
      isProcessing.current = false;
    }
  }, []); // Empty dependency array - only run once

  const handleEmailConfirmation = async (token?: string) => {
    if (loading || isProcessing.current) {
      console.log('Already processing, skipping...');
      return;
    }
    
    isProcessing.current = true;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Handling email confirmation...');
      
      if (token) {
        // We have a token, try to confirm email
        console.log('Confirming email with token...');
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });
        
        if (error) {
          throw error;
        }
        
        if (data.user?.email_confirmed_at) {
          console.log('Email confirmed successfully with token!');
          setConfirmed(true);
          
          // Email confirmation sonrası otomatik database sync
          console.log('Starting automatic database sync...');
          
          // 1. Session sync
          await forceSessionSync();
          
          // 2. Database changes otomatik algıla
          try {
            console.log('Checking database for user profile...');
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .single();
            
            if (profileError) {
              console.log('Profile not found, creating...');
              // Profile yoksa oluştur
              await supabase
                .from('user_profiles')
                .insert({
                  user_id: data.user.id,
                  email: data.user.email,
                  name: data.user.email?.split('@')[0] || 'User',
                  plan: 'free',
                  automations_limit: 2,
                  ai_messages_limit: 0
                });
            } else {
              console.log('Profile found:', profileData);
            }
          } catch (dbError) {
            console.error('Database sync error:', dbError);
          }
          
          // 3. Auth state otomatik güncelle
          console.log('Updating auth state...');
          
          // Güçlü session sync
          try {
            console.log('Performing strong session sync...');
            
            // 1. Session refresh
            await supabase.auth.refreshSession();
            
            // 2. Force auth state update
            await supabase.auth.getUser();
            
            // 3. Trigger auth state change event
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('Session updated successfully:', session.user.email);
              
              // 4. Force user profile fetch
              const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (profileError) {
                console.log('Profile fetch error, creating...');
                await supabase
                  .from('user_profiles')
                  .insert({
                    user_id: session.user.id,
                    email: session.user.email,
                    name: session.user.email?.split('@')[0] || 'User',
                    plan: 'free',
                    automations_limit: 2,
                    ai_messages_limit: 0
                  });
              } else {
                console.log('Profile fetched successfully:', profileData);
              }
            }
          } catch (syncError) {
            console.error('Strong session sync error:', syncError);
          }
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return;
        }
      }
      
      // Try to get current user (if session exists)
      console.log('Trying to get current user...');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!userError && user) {
          console.log('Current user found:', user);
          console.log('Email confirmed at:', user.email_confirmed_at);
          
          if (user.email_confirmed_at) {
            console.log('Email is confirmed!');
            setConfirmed(true);
            
            // Email confirmation sonrası otomatik database sync
            console.log('Starting automatic database sync for manual confirmation...');
            
            // 1. Session sync
            await forceSessionSync();
            
            // 2. Database changes otomatik algıla
            try {
              console.log('Checking database for user profile in manual confirmation...');
              const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
              
              if (profileError) {
                console.log('Profile not found in manual confirmation, creating...');
                // Profile yoksa oluştur
                await supabase
                  .from('user_profiles')
                  .insert({
                    user_id: user.id,
                    email: user.email,
                    name: user.email?.split('@')[0] || 'User',
                    plan: 'free',
                    automations_limit: 2,
                    ai_messages_limit: 0
                  });
              } else {
                console.log('Profile found in manual confirmation:', profileData);
              }
            } catch (dbError) {
              console.error('Database sync error in manual confirmation:', dbError);
            }
            
            // 3. Auth state otomatik güncelle
            console.log('Updating auth state for manual confirmation...');
            
            // Güçlü session sync for manual confirmation
            try {
              console.log('Performing strong session sync for manual confirmation...');
              
              // 1. Session refresh
              await supabase.auth.refreshSession();
              
              // 2. Force auth state update
              await supabase.auth.getUser();
              
              // 3. Trigger auth state change event
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                console.log('Session updated successfully for manual confirmation:', session.user.email);
                
                // 4. Force user profile fetch
                const { data: profileData, error: profileError } = await supabase
                  .from('user_profiles')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .single();
                
                if (profileError) {
                  console.log('Profile fetch error for manual confirmation, creating...');
                  await supabase
                    .from('user_profiles')
                    .insert({
                      user_id: session.user.id,
                      email: session.user.email,
                      name: session.user.email?.split('@')[0] || 'User',
                      plan: 'free',
                      automations_limit: 2,
                      ai_messages_limit: 0
                    });
                } else {
                  console.log('Profile fetched successfully for manual confirmation:', profileData);
                }
              }
            } catch (syncError) {
              console.error('Strong session sync error for manual confirmation:', syncError);
            }
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
            return;
          }
        }
      } catch (sessionError) {
        console.log('No active session found, this is normal for email confirmation');
      }
      
      // Try to refresh the session
      console.log('Trying to refresh session...');
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!sessionError && session?.user?.email_confirmed_at) {
          console.log('Email confirmed after session refresh!');
          setConfirmed(true);
          
          // Email confirmation sonrası otomatik database sync
          console.log('Starting automatic database sync after session refresh...');
          
          // 1. Session sync
          await forceSessionSync();
          
          // 2. Database changes otomatik algıla
          try {
            console.log('Checking database for user profile after session refresh...');
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (profileError) {
              console.log('Profile not found after session refresh, creating...');
              // Profile yoksa oluştur
              await supabase
                .from('user_profiles')
                .insert({
                  user_id: session.user.id,
                  email: session.user.email,
                  name: session.user.email?.split('@')[0] || 'User',
                  plan: 'free',
                  automations_limit: 2,
                  ai_messages_limit: 0
                });
            } else {
              console.log('Profile found after session refresh:', profileData);
            }
          } catch (dbError) {
            console.error('Database sync error after session refresh:', dbError);
          }
          
          // 3. Auth state otomatik güncelle
          console.log('Updating auth state after session refresh...');
          
          // Güçlü session sync after session refresh
          try {
            console.log('Performing strong session sync after session refresh...');
            
            // 1. Session refresh
            await supabase.auth.refreshSession();
            
            // 2. Force auth state update
            await supabase.auth.getUser();
            
            // 3. Trigger auth state change event
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('Session updated successfully after refresh:', session.user.email);
              
              // 4. Force user profile fetch
              const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (profileError) {
                console.log('Profile fetch error after refresh, creating...');
                await supabase
                  .from('user_profiles')
                  .insert({
                    user_id: session.user.id,
                    email: session.user.email,
                    name: session.user.email?.split('@')[0] || 'User',
                    plan: 'free',
                    automations_limit: 2,
                    ai_messages_limit: 0
                  });
              } else {
                console.log('Profile fetched successfully after refresh:', profileData);
              }
            }
          } catch (syncError) {
            console.error('Strong session sync error after refresh:', syncError);
          }
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return;
        }
      } catch (refreshError) {
        console.log('Session refresh failed:', refreshError);
      }
      
      // If we reach here, email is not confirmed
      setMessage('Email confirmation completed. If your email is confirmed, you can now sign in. If not, please check your email and click the confirmation link again.');
      
    } catch (error) {
      console.error('Error confirming email:', error);
      if (error instanceof Error) {
        if (error.message.includes('token')) {
          setError('Invalid or expired confirmation link. Please check your email for a fresh confirmation link.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An error occurred while confirming email.');
      }
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your email has been successfully confirmed. You're now being redirected to the login page.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-green-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <div className="mx-auto w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmation</h1>
        <p className="text-gray-600 mb-6">
          {message || 'Click the button below to confirm your email address.'}
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => handleEmailConfirmation()}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Confirm Email</span>
            </>
          )}
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>After confirming your email, you can sign in to access your dashboard.</p>
        </div>
        
        <div className="mt-4 space-y-2">
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
          >
            <span>Back to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailConfirmationPage;
