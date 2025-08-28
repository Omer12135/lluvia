import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Download,
  MoreVertical,
  Play,
  AlertTriangle,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { automationService, Database } from '../lib/supabase';

type AutomationRequest = Database['public']['Tables']['automation_requests']['Row'];

const AutomationHistory: React.FC = () => {
  const { user } = useAuth();
  const [automations, setAutomations] = useState<AutomationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch automations from Supabase
  const fetchAutomations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await automationService.getUserAutomations(user.id);
      setAutomations(data);
    } catch (err) {
      console.error('Error fetching automations:', err);
      setError('Otomasyonlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, [user]);

  // Get unique categories and statuses
  const categories = useMemo(() => {
    const cats = [...new Set(automations.map(a => a.automation_name.split(' ')[0] || 'Uncategorized'))];
    return ['all', ...cats];
  }, [automations]);

  const statuses = useMemo(() => {
    const stats = [...new Set(automations.map(a => a.status))];
    return ['all', ...stats];
  }, [automations]);

  // Filtered and sorted automations
  const filteredAndSortedAutomations = useMemo(() => {
    let filtered = automations.filter(automation => {
      const matchesCategory = selectedCategory === 'all' || 
                             automation.automation_name.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || automation.status === selectedStatus;
      const matchesSearch = automation.automation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           automation.automation_description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesSearch;
    });

    // Sort automations
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'name':
          comparison = a.automation_name.localeCompare(b.automation_name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [automations, selectedCategory, selectedStatus, searchTerm, sortBy, sortOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'sent':
        return <Play className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'running':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'pending':
        return 'text-gray-400 bg-gray-500/20';
      case 'sent':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'failed':
        return 'Başarısız';
      case 'running':
        return 'Çalışıyor';
      case 'pending':
        return 'Beklemede';
      case 'sent':
        return 'Gönderildi';
      default:
        return status;
    }
  };

  const exportAutomationsToCSV = () => {
    const csvContent = [
      ['Otomasyon Adı', 'Açıklama', 'Durum', 'Oluşturulma Tarihi', 'Güncellenme Tarihi'],
      ...filteredAndSortedAutomations.map(automation => [
        automation.automation_name,
        automation.automation_description,
        getStatusText(automation.status),
        new Date(automation.created_at).toLocaleDateString('tr-TR'),
        new Date(automation.updated_at).toLocaleDateString('tr-TR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otomasyonlar-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400">Otomasyon geçmişini görüntülemek için giriş yapın</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-white mb-2">Otomasyon Geçmişi</h1>
            <p className="text-gray-300">Tüm otomasyon isteklerinizi görüntüleyin ve yönetin</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportAutomationsToCSV}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Dışa Aktar</span>
            </button>
            <button
              onClick={fetchAutomations}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Otomasyon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tüm Kategoriler' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Durum</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tüm Durumlar' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Tarih</option>
                <option value="name">İsim</option>
                <option value="status">Durum</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Sıra</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span>{sortOrder === 'asc' ? 'Artan' : 'Azalan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Automations List */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-400">Otomasyonlar yükleniyor...</p>
            </div>
          ) : filteredAndSortedAutomations.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Henüz otomasyon oluşturmadınız</p>
              <p className="text-gray-500 text-sm mt-2">İlk otomasyonunuzu oluşturmak için Automation Creator'ı kullanın</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Otomasyon</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Durum</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Oluşturulma</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Güncellenme</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredAndSortedAutomations.map((automation) => (
                    <motion.tr
                      key={automation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{automation.automation_name}</p>
                          <p className="text-gray-400 text-sm mt-1">{automation.automation_description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(automation.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                            {getStatusText(automation.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          <p className="text-sm">{new Date(automation.created_at).toLocaleDateString('tr-TR')}</p>
                          <p className="text-gray-400 text-xs">{new Date(automation.created_at).toLocaleTimeString('tr-TR')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          <p className="text-sm">{new Date(automation.updated_at).toLocaleDateString('tr-TR')}</p>
                          <p className="text-gray-400 text-xs">{new Date(automation.updated_at).toLocaleTimeString('tr-TR')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Detayları Görüntüle"
                          >
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-gray-400">
          Toplam {filteredAndSortedAutomations.length} otomasyon gösteriliyor
          {searchTerm && ` (${automations.length} toplam)`}
        </div>
      </motion.div>
    </div>
  );
};

export default AutomationHistory;