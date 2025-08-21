import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Google,
  Lock,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Phone,
  Globe
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'custom';
  automationsUsed: number;
  automationsLimit: number;
  aiMessagesUsed: number;
  aiMessagesLimit: number;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  authProvider: 'email' | 'google' | 'github';
  phone?: string;
  country?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  status: 'active' | 'suspended' | 'pending';
}

interface UserManagementProps {
  users: User[];
  onUserUpdate: (userId: string, updates: Partial<User>) => void;
  onUserDelete: (userId: string) => void;
  onUserSuspend: (userId: string) => void;
  onUserActivate: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUserUpdate,
  onUserDelete,
  onUserSuspend,
  onUserActivate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesProvider = filterProvider === 'all' || user.authProvider === filterProvider;
      
      return matchesSearch && matchesPlan && matchesStatus && matchesProvider;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof User];
      let bValue = b[sortBy as keyof User];
      
      if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    pending: users.filter(u => u.status === 'pending').length,
    google: users.filter(u => u.authProvider === 'google').length,
    email: users.filter(u => u.authProvider === 'email').length,
    verified: users.filter(u => u.emailVerified).length,
    twoFactor: users.filter(u => u.twoFactorEnabled).length
  };

  const handlePasswordReset = async () => {
    setIsResetting(true);
    try {
      // Simulate password reset process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would:
      // 1. Send reset code to email
      // 2. Verify code
      // 3. Update password in database
      
      alert('Password reset email sent successfully!');
      setShowPasswordResetModal(false);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
    } catch (error) {
      alert('Failed to send password reset email');
    } finally {
      setIsResetting(false);
    }
  };

  const getAuthProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Google className="w-4 h-4 text-red-500" />;
      case 'github':
        return <Globe className="w-4 h-4 text-gray-500" />;
      default:
        return <Mail className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Suspended</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Unknown</span>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'custom':
        return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Custom</span>;
      case 'pro':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Pro</span>;
      case 'free':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Free</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-2xl font-bold text-white">User Management</h3>
          <p className="text-gray-400">Manage all registered users and their accounts</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPasswordResetModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Key className="w-4 h-4" />
            <span>Password Reset</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{stats.google}</p>
              <p className="text-gray-400 text-sm">Google Users</p>
            </div>
            <Google className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{stats.verified}</p>
              <p className="text-gray-400 text-sm">Verified</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="custom">Custom</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Providers</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="github">GitHub</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="lastLogin-desc">Last Login</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Auth</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-500 flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    {getPlanBadge(user.plan)}
                  </td>
                  
                  <td className="px-4 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      {getAuthProviderIcon(user.authProvider)}
                      <div className="flex flex-col">
                        <span className="text-sm text-white capitalize">{user.authProvider}</span>
                        <div className="flex items-center space-x-1">
                          {user.emailVerified && <CheckCircle className="w-3 h-3 text-green-500" />}
                          {user.twoFactorEnabled && <Shield className="w-3 h-3 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="text-white">{user.automationsUsed}/{user.automationsLimit} Automations</div>
                      <div className="text-gray-400">{user.aiMessagesUsed}/{user.aiMessagesLimit} AI Messages</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="text-white">{new Date(user.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-400">Last: {new Date(user.lastLogin).toLocaleDateString()}</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-white/10"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {user.status === 'active' ? (
                        <button
                          onClick={() => onUserSuspend(user.id)}
                          className="text-yellow-400 hover:text-yellow-300 p-1 rounded hover:bg-white/10"
                          title="Suspend User"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onUserActivate(user.id)}
                          className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-white/10"
                          title="Activate User"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                            onUserDelete(user.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-white/10"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Password Reset Modal */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-lg p-6 w-full max-w-md border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Password Reset</h3>
              <button
                onClick={() => setShowPasswordResetModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter user email"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reset Code (sent to email)
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
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
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordResetModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={isResetting || !resetEmail || !resetCode || !newPassword}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{isResetting ? 'Resetting...' : 'Reset Password'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
