import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Mail, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Validate username
      if (!username.trim()) {
        setMessage({ type: 'error', text: 'Username cannot be empty' });
        return;
      }

      if (username.length < 3) {
        setMessage({ type: 'error', text: 'Username must be at least 3 characters long' });
        return;
      }

      // Update profile
      await updateProfile({ username: username.trim() });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Validate passwords
      if (!currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required' });
        return;
      }

      if (!newPassword) {
        setMessage({ type: 'error', text: 'New password is required' });
        return;
      }

      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      // Update password
      await updateProfile({ 
        currentPassword, 
        newPassword 
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password. Please check your current password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-2xl"
          >
            <SettingsIcon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            <h1 className="text-lg sm:text-3xl font-bold text-white">Settings</h1>
            <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          <p className="text-sm sm:text-xl text-gray-300">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Profile Settings</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Email Address <span className="text-gray-400">(Cannot be changed)</span>
                </label>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Username <span className="text-blue-400">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    maxLength={30}
                  />
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">{username.length}/30 characters</p>
              </div>

              {/* Update Profile Button */}
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading || !username.trim() || username === user?.username}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Profile</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Password Settings */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl">
                <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Password Settings</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-red-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                  New Password <span className="text-green-400">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-green-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                  Confirm New Password <span className="text-green-400">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-green-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Update Password Button */}
              <button
                onClick={handleUpdatePassword}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === 'success' 
                ? 'bg-green-600/20 border border-green-500/30' 
                : 'bg-red-600/20 border border-red-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${
              message.type === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {message.text}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
