import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const EmailConfirmationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already confirmed
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          return;
        }

        if (user?.email_confirmed_at) {
          console.log('Email already confirmed, redirecting to dashboard');
          setConfirmed(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking email confirmation:', error);
      }
    };

    checkEmailConfirmation();
  }, [navigate]);

  const handleConfirmEmail = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Manually confirming email...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('No user found');
      }

      console.log('Current user:', user);
      console.log('Email confirmed at:', user.email_confirmed_at);

      if (user.email_confirmed_at) {
        console.log('Email is confirmed!');
        setConfirmed(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Try to refresh the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user?.email_confirmed_at) {
          console.log('Email confirmed after session refresh!');
          setConfirmed(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setError('Email not yet confirmed. Please check your email and click the confirmation link again.');
        }
      }
    } catch (error) {
      console.error('Error confirming email:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
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
            Your email has been successfully confirmed. You're now being redirected to the dashboard.
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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirm Your Email</h1>
        <p className="text-gray-600 mb-6">
          You've clicked the email confirmation link. Click the button below to complete the confirmation process.
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleConfirmEmail}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Confirming...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Confirm Email</span>
            </>
          )}
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>After confirmation, you'll be automatically redirected to your dashboard.</p>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
          >
            <span>Back to Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailConfirmationPage;
