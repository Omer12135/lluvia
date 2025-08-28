import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
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
  Lock,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Phone,
  Globe,
  Crown,
  UserCheck,
  UserX,
  Clock,
  Star,
  Settings
} from 'lucide-react';
import { userService, Database } from '../../lib/supabase';

type User = Database['public']['Tables']['user_profiles']['Row'];

interface UserManagementProps {
  onNavigate: (section: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesProvider = filterProvider === 'all' || user.auth_provider === filterProvider;
      
      return matchesSearch && matchesPlan && matchesStatus && matchesProvider;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof User];
      let bValue = b[sortBy as keyof User];
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(userId, updates);
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? updatedUser : user
      ));
      setShowUserModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Kullanıcı güncellenirken hata oluştu');
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.user_id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Kullanıcı silinirken hata oluştu');
    }
  };

  const handleUserSuspend = async (userId: string) => {
    try {
      await userService.updateUser(userId, { status: 'suspended' });
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, status: 'suspended' } : user
      ));
    } catch (err) {
      console.error('Error suspending user:', err);
      setError('Kullanıcı askıya alınırken hata oluştu');
    }
  };

  const handleUserActivate = async (userId: string) => {
    try {
      await userService.updateUser(userId, { status: 'active' });
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, status: 'active' } : user
      ));
    } catch (err) {
      console.error('Error activating user:', err);
      setError('Kullanıcı aktifleştirilirken hata oluştu');
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'custom':
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'github':
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Mail className="w-4 h-4 text-green-500" />;
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['ID', 'Email', 'Name', 'Plan', 'Status', 'Provider', 'Created At', 'Automations Used', 'Automations Limit'],
      ...filteredUsers.map(user => [
        user.user_id,
        user.email,
        user.name,
        user.plan,
        user.status,
        user.auth_provider,
        new Date(user.created_at).toLocaleDateString('tr-TR'),
        user.automations_used.toString(),
        user.automations_limit.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Kullanıcı Yönetimi</h1>
            <p className="text-gray-300">Tüm kullanıcıları görüntüle, düzenle ve yönet</p>
        </div>
          <div className="flex items-center space-x-4">
          <button
              onClick={exportUsers}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
              <Download className="w-4 h-4" />
              <span>Dışa Aktar</span>
          </button>
          <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

        {/* Error Message */}
        {error && (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
        </motion.div>
        )}

        {/* Filters */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Arama</label>
          <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
                  placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              </div>
          </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Plan</label>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
                <option value="all">Tüm Planlar</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="custom">Custom</option>
          </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Durum</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="suspended">Askıya Alınmış</option>
                <option value="pending">Beklemede</option>
          </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Sağlayıcı</label>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
                <option value="all">Tüm Sağlayıcılar</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="github">GitHub</option>
          </select>
            </div>
        </div>
      </div>

      {/* Users Table */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Durum</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Otomasyonlar</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Kayıt Tarihi</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Kullanıcılar yükleniyor...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                <motion.tr
                      key={user.user_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                      <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                      </div>
                      <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {getProviderIcon(user.auth_provider)}
                              <span className="text-gray-400 text-xs">{user.auth_provider}</span>
                          </div>
                      </div>
                    </div>
                  </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getPlanIcon(user.plan)}
                          <span className="text-white capitalize">{user.plan}</span>
                        </div>
                  </td>
                      <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <span className={`text-sm capitalize ${
                            user.status === 'active' ? 'text-green-400' :
                            user.status === 'suspended' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {user.status === 'active' ? 'Aktif' :
                             user.status === 'suspended' ? 'Askıya Alınmış' :
                             'Beklemede'}
                          </span>
                    </div>
                  </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          <p className="font-medium">{user.automations_used} / {user.automations_limit}</p>
                          <p className="text-gray-400 text-sm">
                            {user.automations_limit === -1 ? 'Sınırsız' : `${Math.round((user.automations_used / user.automations_limit) * 100)}% kullanım`}
                          </p>
                    </div>
                  </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          <p className="text-sm">{new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
                          <p className="text-gray-400 text-xs">{new Date(user.created_at).toLocaleTimeString('tr-TR')}</p>
                    </div>
                  </td>
                      <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                              setEditingUser(user);
                          setShowUserModal(true);
                        }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Düzenle"
                      >
                            <Edit className="w-4 h-4 text-white" />
                      </button>
                      
                      {user.status === 'active' ? (
                        <button
                              onClick={() => handleUserSuspend(user.user_id)}
                              className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                              title="Askıya Al"
                            >
                              <UserX className="w-4 h-4 text-white" />
                        </button>
                      ) : (
                        <button
                              onClick={() => handleUserActivate(user.user_id)}
                              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                              title="Aktifleştir"
                            >
                              <UserCheck className="w-4 h-4 text-white" />
                        </button>
                      )}
                      
                      <button
                            onClick={() => handleUserDelete(user.user_id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </div>

        {/* User Count */}
        <div className="mt-6 text-center text-gray-400">
          Toplam {filteredUsers.length} kullanıcı gösteriliyor
            </div>
          </motion.div>
    </div>
  );
};

export default UserManagement;
