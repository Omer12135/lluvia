import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Eye,
  UserPlus,
  Crown,
  Star,
  Users
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StripeOrder {
  id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  customer_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface StripeCustomer {
  id: number;
  user_id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  plan: string;
  status: string;
  created_at: string;
}

const StripePaymentManager: React.FC = () => {
  const [orders, setOrders] = useState<StripeOrder[]>([]);
  const [customers, setCustomers] = useState<StripeCustomer[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<StripeOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('stripe_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('stripe_customers')
        .select('*');

      if (customersError) throw customersError;

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, email, name, plan, status, created_at');

      if (profilesError) throw profilesError;

      setOrders(ordersData || []);
      setCustomers(customersData || []);
      setUserProfiles(profilesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get user info for a customer
  const getUserForCustomer = (customerId: string) => {
    const customer = customers.find(c => c.customer_id === customerId);
    if (!customer) return null;
    
    return userProfiles.find(p => p.user_id === customer.user_id);
  };


  // Filter orders
  const filteredOrders = orders.filter(order => {
    const user = getUserForCustomer(order.customer_id);
    const matchesSearch = 
      order.checkout_session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.payment_intent_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPlan = filterStatus === 'all' || (user?.plan === filterPlan);
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'canceled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
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

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Session ID', 'Customer ID', 'Email', 'Amount', 'Status', 'Plan', 'Date'],
      ...filteredOrders.map(order => {
        const user = getUserForCustomer(order.customer_id);
        return [
          order.checkout_session_id,
          order.customer_id,
          user?.email || 'N/A',
          formatAmount(order.amount_total, order.currency),
          order.status,
          user?.plan || 'N/A',
          new Date(order.created_at).toLocaleDateString('tr-TR')
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stripe-orders-${new Date().toISOString().split('T')[0]}.csv`;
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
            <h1 className="text-3xl font-bold text-white mb-2">Stripe Ödeme Yönetimi</h1>
            <p className="text-gray-300">Stripe ödemelerini görüntüle ve yönet</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportOrders}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Dışa Aktar</span>
            </button>
            <button
              onClick={fetchData}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Ödeme</p>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Başarılı Ödeme</p>
                <p className="text-2xl font-bold text-white">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Gelir</p>
                <p className="text-2xl font-bold text-white">
                  {formatAmount(
                    orders
                      .filter(o => o.status === 'completed')
                      .reduce((sum, o) => sum + o.amount_total, 0),
                    'usd'
                  )}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Yeni Kullanıcı</p>
                <p className="text-2xl font-bold text-white">
                  {customers.length}
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Session ID, Customer ID veya Email ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Durum</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="completed">Tamamlandı</option>
                <option value="pending">Beklemede</option>
                <option value="canceled">İptal Edildi</option>
              </select>
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
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Ödeme Bilgileri</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Miktar</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Durum</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Tarih</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Ödemeler yükleniyor...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      Ödeme bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const user = getUserForCustomer(order.customer_id);
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-white">
                            <p className="font-medium text-sm">{order.checkout_session_id.substring(0, 20)}...</p>
                            <p className="text-gray-400 text-xs">{order.customer_id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white">
                            <p className="font-medium">{user?.name || 'N/A'}</p>
                            <p className="text-gray-400 text-sm">{user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white">
                            <p className="font-medium">{formatAmount(order.amount_total, order.currency)}</p>
                            <p className="text-gray-400 text-sm">{order.currency.toUpperCase()}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-sm capitalize ${
                              order.status === 'completed' ? 'text-green-400' :
                              order.status === 'pending' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {order.status === 'completed' ? 'Tamamlandı' :
                               order.status === 'pending' ? 'Beklemede' :
                               'İptal Edildi'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getPlanIcon(user?.plan || 'free')}
                            <span className="text-white capitalize">{user?.plan || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white">
                            <p className="text-sm">{new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                            <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleTimeString('tr-TR')}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Detayları Görüntüle"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Count */}
        <div className="mt-6 text-center text-gray-400">
          Toplam {filteredOrders.length} ödeme gösteriliyor
        </div>
      </motion.div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Ödeme Detayları</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Session ID</label>
                  <div className="text-white text-sm font-mono">{selectedOrder.checkout_session_id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Intent ID</label>
                  <div className="text-white text-sm font-mono">{selectedOrder.payment_intent_id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Customer ID</label>
                  <div className="text-white text-sm font-mono">{selectedOrder.customer_id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="text-white capitalize">{selectedOrder.status}</span>
                  </div>
                </div>
              </div>

              {/* Amount Info */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ödeme Bilgileri</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Toplam Miktar</div>
                    <div className="text-2xl font-bold text-white">{formatAmount(selectedOrder.amount_total, selectedOrder.currency)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Ara Toplam</div>
                    <div className="text-2xl font-bold text-white">{formatAmount(selectedOrder.amount_subtotal, selectedOrder.currency)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Para Birimi</div>
                    <div className="text-2xl font-bold text-white">{selectedOrder.currency.toUpperCase()}</div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              {(() => {
                const user = getUserForCustomer(selectedOrder.customer_id);
                return user ? (
                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Kullanıcı Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">İsim</label>
                        <div className="text-white">{user.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <div className="text-white">{user.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
                        <div className="flex items-center space-x-2">
                          {getPlanIcon(user.plan)}
                          <span className="text-white capitalize">{user.plan}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                        <div className="text-white capitalize">{user.status}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-white/20">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StripePaymentManager;
