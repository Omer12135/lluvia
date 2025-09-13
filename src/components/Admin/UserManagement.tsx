import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Edit, 
  Trash2, 
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Crown,
  UserCheck,
  UserX,
  Clock,
  Star,
  Settings
} from 'lucide-react';
import { userService, Database } from '../../lib/supabase';

type User = Database['public']['Tables']['user_profiles']['Row'] & {
  plan: 'free' | 'basic' | 'pro' | 'custom';
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [sortBy] = useState<string>('created_at');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

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

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'basic' | 'custom' | 'pro') => {
    try {
      let automationsLimit = 1;
      let aiMessagesLimit = 0;

      // Plan'a göre limitleri belirle
      switch (newPlan) {
        case 'free':
          automationsLimit = 1;
          aiMessagesLimit = 0;
          break;
        case 'basic':
          automationsLimit = 10;
          aiMessagesLimit = 100;
          break;
        case 'custom': // Custom plan için özel limitler
          automationsLimit = 25;
          aiMessagesLimit = 500;
          break;
        case 'pro':
          automationsLimit = 50;
          aiMessagesLimit = 1000;
          break;
      }

      const updates = {
        plan: newPlan,
        automations_limit: automationsLimit,
        ai_messages_limit: aiMessagesLimit,
        updated_at: new Date().toISOString()
      };

      await userService.updateUser(userId, updates);
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { ...user, ...updates } : user
      ));
      
      console.log(`User ${userId} plan updated to ${newPlan} with ${automationsLimit} automations limit`);
    } catch (err) {
      console.error('Error updating user plan:', err);
      setError('Kullanıcı planı güncellenirken hata oluştu');
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'basic':
        return <Star className="w-4 h-4 text-blue-500" />;
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
            <option value="basic">Basic</option>
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
                          <select
                            value={user.plan}
                            onChange={(e) => handlePlanChange(user.user_id, e.target.value as 'free' | 'basic' | 'custom' | 'pro')}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="free">Free (1 otomasyon)</option>
                            <option value="basic">Basic (10 otomasyon)</option>
                            <option value="pro">Pro (50 otomasyon)</option>
                            <option value="custom">Custom (25 otomasyon)</option>
                          </select>
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

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Kullanıcı Detayları</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">İsim</label>
                  <div className="text-white">{selectedUser.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                  <div className="text-white capitalize">{selectedUser.status}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Auth Provider</label>
                  <div className="text-white">{selectedUser.auth_provider}</div>
                </div>
              </div>

              {/* Plan Management */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Plan Yönetimi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mevcut Plan</label>
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(selectedUser.plan)}
                      <span className="text-white capitalize">{selectedUser.plan}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Plan Değiştir</label>
                    <select
                      value={selectedUser.plan}
                      onChange={(e) => {
                        const newPlan = e.target.value as 'free' | 'basic' | 'custom' | 'pro';
                        handlePlanChange(selectedUser.user_id, newPlan);
                        setSelectedUser({ ...selectedUser, plan: newPlan });
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="free">Free Plan (1 otomasyon)</option>
                      <option value="basic">Basic Plan (10 otomasyon)</option>
                      <option value="pro">Pro Plan (50 otomasyon)</option>
                      <option value="custom">Custom Plan (25 otomasyon)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Limits Info */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Limit Bilgileri</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Otomasyon Limiti</div>
                    <div className="text-2xl font-bold text-white">{selectedUser.automations_limit}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Kullanılan Otomasyon</div>
                    <div className="text-2xl font-bold text-white">{selectedUser.automations_used}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">AI Mesaj Limiti</div>
                    <div className="text-2xl font-bold text-white">{selectedUser.ai_messages_limit}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-white/20">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
                      handleUserDelete(selectedUser.user_id);
                      setShowUserModal(false);
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Kullanıcıyı Sil
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
