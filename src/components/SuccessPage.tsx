import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [sessionId] = useState(searchParams.get('session_id'));

  useEffect(() => {
    // If no user is logged in, redirect to home
    if (!user) {
      navigate('/');
      return;
    }

    // If no session_id, this might be a direct access
    if (!sessionId) {
      console.warn('No session_id found in URL parameters');
    }
  }, [user, sessionId, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Thank you for your purchase! Your subscription has been activated and you now have access to all premium features.
          </p>
        </motion.div>

        {/* Session Info */}
        {sessionId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10"
          >
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CreditCard className="w-4 h-4" />
              <span>Transaction ID: {sessionId.slice(-8)}</span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <p className="text-xs text-gray-500">
            You will receive a confirmation email shortly. If you have any questions, please contact our support team.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;