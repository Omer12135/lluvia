import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Eye, Calendar, CreditCard, User, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SubscriptionData {
  id: number;
  customer_id: string;
  subscription_id: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

const SubscriptionViewer: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');

      // Service role key ile tüm subscription'ları çek
      const { data, error: fetchError } = await supabase
        .from('stripe_subscriptions')
        .select(`
          *,
          stripe_customers!inner(
            user_id,
            user_profiles!inner(
              email,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching subscriptions:', fetchError);
        setError('Subscription verileri alınırken hata oluştu');
        return;
      }

      // Veriyi düzenle
      const formattedData = data?.map(item => ({
        ...item,
        user_email: item.stripe_customers?.user_profiles?.email,
        user_name: item.stripe_customers?.user_profiles?.name
      })) || [];

      setSubscriptions(formattedData);
    } catch (error) {
      console.error('Error in fetchSubscriptions:', error);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'canceled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'past_due':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlanName = (priceId: string | null) => {
    switch (priceId) {
      case 'price_basic_plan':
        return 'Basic Plan ($1)';
      case 'price_1Rs2mPK4TeoPEcnVVGOmeNcs':
        return 'Pro Plan ($39)';
      default:
        return priceId || 'Unknown Plan';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Stripe Subscriptions</h2>
          <p className="text-gray-400">Tüm Stripe subscription kayıtları</p>
        </div>
        <button
          onClick={fetchSubscriptions}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-white">Yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Durum</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ödeme Yöntemi</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Başlangıç</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Bitiş</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Oluşturulma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Henüz subscription kaydı bulunmuyor
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((subscription) => (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">
                            {subscription.user_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {subscription.user_email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          {getPlanName(subscription.price_id)}
                        </div>
                        <div className="text-sm text-gray-400">
                          ID: {subscription.subscription_id || 'One-time Payment'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(subscription.status)}`}>
                          {getStatusIcon(subscription.status)}
                          <span className="capitalize">{subscription.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {subscription.payment_method_brand ? (
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-white">
                              {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(subscription.current_period_start)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(subscription.current_period_end)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(subscription.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Toplam {subscriptions.length} subscription kaydı
        </p>
      </div>
    </div>
  );
};

export default SubscriptionViewer;
