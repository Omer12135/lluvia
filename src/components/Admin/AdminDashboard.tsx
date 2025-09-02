import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Shield, 
  Settings,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Crown,
  Star,
  Globe,
  Mail,
  Github,
  Smartphone,
  Lock,
  Eye
} from 'lucide-react';
import { userService, automationService } from '../../lib/supabase';
import AdminBlogManager from './AdminBlogManager';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  freeUsers: number;
  proUsers: number;
  customUsers: number;
  emailUsers: number;
  googleUsers: number;
  githubUsers: number;
  verifiedUsers: number;
  twoFactorUsers: number;
  totalAutomations: number;
  activeAutomations: number;
  monthlyRevenue: number;
  systemUptime: number;
}

interface AdminDashboardProps {
  onNavigate: (section: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    pendingUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    customUsers: 0,
    emailUsers: 0,
    googleUsers: 0,
    githubUsers: 0,
    verifiedUsers: 0,
    twoFactorUsers: 0,
    totalAutomations: 0,
    activeAutomations: 0,
    monthlyRevenue: 0,
    systemUptime: 99.9
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Kullanıcı istatistiklerini getir
      const userStats = await userService.getUserStats();
      
      // Otomasyon istatistiklerini getir
      const allAutomations = await automationService.getAllAutomations();
      const activeAutomations = allAutomations.filter(a => a.status === 'completed' || a.status === 'running').length;

      // Aylık gelir hesapla
      const monthlyRevenue = (userStats.proUsers * 39) + (userStats.customUsers * 497);

      const newStats: SystemStats = {
        ...userStats,
        totalAutomations: allAutomations.length,
        activeAutomations,
        monthlyRevenue,
        systemUptime: 99.9
      };

      setStats(newStats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('İstatistikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue', 
    trend = null,
    subtitle = null 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
    trend?: { value: number; isPositive: boolean } | null;
    subtitle?: string | null;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500'
    };

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6 text-white" />
            </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
              <span>{trend.value}%</span>
          </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-300 text-sm">{title}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      </div>
      </motion.div>
    );
  };

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    color = 'blue',
    onClick 
  }: {
    title: string;
    description: string;
    icon: any;
    color?: string;
    onClick: () => void;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      red: 'bg-red-500 hover:bg-red-600',
      indigo: 'bg-indigo-500 hover:bg-indigo-600'
    };

    return (
            <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl cursor-pointer transition-all hover:border-white/30"
      >
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} w-fit mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </motion.div>
    );
  };

  // Blog yönetimi sekmesini render et
  if (currentSection === 'blog') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors mb-4"
            >
              <BarChart3 className="w-4 h-4" />
              <span>← Dashboard'a Dön</span>
            </button>
          </div>
          <AdminBlogManager />
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
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Sistem genelinde kullanıcı ve otomasyon yönetimi</p>
                          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Son güncelleme</p>
              <p className="text-white text-sm">{lastUpdated.toLocaleTimeString('tr-TR')}</p>
                        </div>
            <button
              onClick={fetchStats}
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
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers}
            icon={Users}
            color="blue"
            subtitle={`${stats.activeUsers} aktif`}
          />
          <StatCard
            title="Aylık Gelir"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="green"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Toplam Otomasyon"
            value={stats.totalAutomations}
            icon={Zap}
            color="purple"
            subtitle={`${stats.activeAutomations} aktif`}
          />
          <StatCard
            title="Sistem Uptime"
            value={`${stats.systemUptime}%`}
            icon={Activity}
            color="indigo"
          />
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Plan Dağılımı"
            value={`${stats.proUsers} Pro`}
            icon={Crown}
            color="orange"
            subtitle={`${stats.freeUsers} Free, ${stats.customUsers} Custom`}
          />
          <StatCard
            title="Kimlik Doğrulama"
            value={`${stats.emailUsers} Email`}
            icon={Mail}
            color="blue"
            subtitle={`${stats.googleUsers} Google, ${stats.githubUsers} GitHub`}
          />
          <StatCard
            title="Güvenlik"
            value={`${stats.verifiedUsers} Doğrulanmış`}
            icon={Shield}
            color="green"
            subtitle={`${stats.twoFactorUsers} 2FA aktif`}
                          />
                        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Kullanıcı Yönetimi"
              description="Kullanıcıları görüntüle, düzenle ve yönet"
              icon={Users}
              color="blue"
              onClick={() => onNavigate('users')}
            />
            <QuickActionCard
              title="Otomasyon Yönetimi"
              description="Otomasyon isteklerini ve durumlarını takip et"
              icon={Zap}
              color="purple"
              onClick={() => onNavigate('automations')}
            />
            <QuickActionCard
              title="Blog Yönetimi"
              description="Blog yazılarını oluştur ve düzenle"
              icon={BarChart3}
              color="green"
              onClick={() => setCurrentSection('blog')}
            />
            <QuickActionCard
              title="Sistem Ayarları"
              description="Platform ayarlarını ve konfigürasyonları yönet"
              icon={Settings}
              color="orange"
              onClick={() => onNavigate('settings')}
            />
            <QuickActionCard
              title="Webhook Yönetimi"
              description="Webhook bağlantılarını test et ve yönet"
              icon={Globe}
              color="indigo"
              onClick={() => onNavigate('webhooks')}
            />
            <QuickActionCard
              title="Güvenlik Ayarları"
              description="Güvenlik politikalarını ve erişim kontrollerini yönet"
              icon={Lock}
              color="red"
              onClick={() => onNavigate('security')}
            />
                      </div>
                    </div>
                    
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Son Aktiviteler</h2>
                      <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <UserCheck className="w-4 h-4 text-white" />
                        </div>
              <div className="flex-1">
                <p className="text-white font-medium">Yeni kullanıcı kaydı</p>
                <p className="text-gray-400 text-sm">demo@lluvia.ai hesabı oluşturuldu</p>
                        </div>
              <span className="text-gray-400 text-sm">2 dk önce</span>
                        </div>
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
                        </div>
              <div className="flex-1">
                <p className="text-white font-medium">Yeni otomasyon oluşturuldu</p>
                <p className="text-gray-400 text-sm">Gmail to Slack otomasyonu</p>
                      </div>
              <span className="text-gray-400 text-sm">15 dk önce</span>
                    </div>
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Crown className="w-4 h-4 text-white" />
                  </div>
              <div className="flex-1">
                <p className="text-white font-medium">Plan yükseltmesi</p>
                <p className="text-gray-400 text-sm">pro@lluvia.ai Free'dan Pro'ya geçti</p>
                </div>
              <span className="text-gray-400 text-sm">1 saat önce</span>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;