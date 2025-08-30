import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onClose }) => {
  const { register, resendConfirmationEmail, loading, emailConfirmed } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check if email is confirmed and close modal
  useEffect(() => {
    if (emailConfirmed && registrationSuccess) {
      console.log('Email confirmed, closing modal and redirecting to dashboard');
      onClose();
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    }
  }, [emailConfirmed, registrationSuccess, onClose]);

  // Poll for email confirmation when showing success modal
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (registrationSuccess && !emailConfirmed) {
      console.log('Starting email confirmation polling in RegisterForm...');
      intervalId = setInterval(async () => {
        try {
          console.log('RegisterForm: Polling for email confirmation...');
          
          // Get current user from Supabase
          const { data: { user: currentUser }, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error('Error getting user in RegisterForm:', error);
            return;
          }
          
          console.log('RegisterForm: Current user from Supabase:', currentUser);
          console.log('RegisterForm: Email confirmed at:', currentUser?.email_confirmed_at);
          
          if (currentUser?.email_confirmed_at) {
            console.log('Email confirmed via polling in RegisterForm!');
            onClose();
            window.location.href = '/dashboard';
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Error polling email confirmation in RegisterForm:', error);
        }
      }, 2000); // Check every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [registrationSuccess, emailConfirmed, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await register(formData.email, formData.password, formData.name);
      setRegistrationSuccess(true);
      setUserEmail(formData.email);
      setError('');
    } catch (err) {
      console.error('Registration form error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String(err.message));
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
    }
  };

  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400">We've sent a confirmation email to activate your account</p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
            <p className="text-gray-400 mb-4">
              We've sent a confirmation email to <span className="text-white font-medium">{userEmail}</span>
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Please check your email and click the confirmation link to activate your account.
              <br />
              <span className="text-purple-400 font-medium">You'll be automatically redirected to the dashboard once confirmed!</span>
              <br />
              <span className="text-yellow-400 text-xs mt-2 block">
                💡 After confirming your email, refresh this page or wait a few seconds for automatic redirect.
              </span>
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => resendConfirmationEmail(userEmail)}
              disabled={loading}
              className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-400 py-3 px-4 rounded-lg font-medium hover:bg-purple-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Resend Confirmation Email</span>
                </>
              )}
            </button>


            
            <button
              type="button"
              onClick={() => {
                setRegistrationSuccess(false);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join LLUVIA AI and start automating your workflows</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterForm;