import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmailConfirmationPage: React.FC = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  console.log('EmailConfirmationPage rendered!');

  // Memoize URL parameters
  const urlParams = useMemo(() => ({
    token: searchParams.get('token'),
    type: searchParams.get('type')
  }), [searchParams]);

  // Memoize the confirmation handler
  const handleEmailConfirmation = useCallback(async (token?: string) => {
    if (loading) return;
    
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
          setTimeout(() => {
            navigate('/login');
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
            setTimeout(() => {
              navigate('/login');
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
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }
      } catch (refreshError) {
        console.log('Session refresh failed:', refreshError);
      }
      
      // If we reach here, email is not confirmed
      setMessage('Email confirmation status checked. If your email is confirmed, you can now sign in. If not, please check your email and click the confirmation link again.');
      
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
    }
  }, [loading, navigate]);

  // Initialize only once - STRICT control
  useEffect(() => {
    if (hasInitialized) {
      console.log('Already initialized, skipping...');
      return;
    }
    
    console.log('EmailConfirmationPage initializing...');
    setHasInitialized(true);
    
    console.log('URL params - token:', urlParams.token, 'type:', urlParams.type);
    
    if (urlParams.token && urlParams.type === 'signup') {
      console.log('Found confirmation token, attempting to confirm...');
      handleEmailConfirmation(urlParams.token);
    } else {
      // No token, show manual confirmation option
      setMessage('Please click the button below to check your email confirmation status.');
    }
  }, [hasInitialized, urlParams.token, urlParams.type, handleEmailConfirmation]);

  // Memoize the success content
  const successContent = useMemo(() => (
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
  ), []);

  // Memoize the main content
  const mainContent = useMemo(() => (
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
          {message || 'Checking your email confirmation status...'}
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
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
              <span>Check Email Status</span>
            </>
          )}
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>After confirmation, you can sign in to access your dashboard.</p>
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
  ), [message, error, loading, handleEmailConfirmation, navigate]);

  // Early return for confirmed state
  if (confirmed) {
    return successContent;
  }

  return mainContent;
});

EmailConfirmationPage.displayName = 'EmailConfirmationPage';

export default EmailConfirmationPage;
