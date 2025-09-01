import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Key,
  Save,
  Edit
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: 'john.doe@example.com'
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-300">Manage your account information.</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Account Information
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <Mail className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-gray-400 text-sm">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  defaultValue={profileData.email}
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-full"
                />
              ) : (
                <p className="text-white">{profileData.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <Key className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-gray-400 text-sm">Password</p>
              <p className="text-white">••••••••</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm transition-colors">
              Change
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white hover:from-blue-600 hover:to-cyan-700 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
