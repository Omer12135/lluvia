import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  Heart, 
  Search,
  Filter,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  BookOpen,
  Tag,
  User,
  FileText,
  Link,
  Settings,
  Globe,
  Hash,
  Loader2,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useBlog, BlogPost } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { blogService } from '../../services/blogService';

const AdminBlogManager: React.FC = () => {
  console.log('🚀 AdminBlogManager - Modern Blog Manager Başlatılıyor...');
  
  const { user } = useAuth();
  const { 
    blogPosts, 
    loading,
    error,
    addBlogPost, 
    updateBlogPost, 
    deleteBlogPost, 
    publishBlogPost, 
    unpublishBlogPost,
    refreshPosts
  } = useBlog();

  // State Management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'settings'>('write');

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    readTime: 5,
    imageUrl: '',
    status: 'draft' as 'draft' | 'published',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [] as string[]
  });

  // Categories with emojis
  const categories = [
    { value: 'otomasyon', label: '🤖 Otomasyon', color: 'from-blue-500 to-cyan-500' },
    { value: 'teknoloji', label: '💻 Teknoloji', color: 'from-purple-500 to-pink-500' },
    { value: 'is-surecleri', label: '⚙️ İş Süreçleri', color: 'from-green-500 to-emerald-500' },
    { value: 'verimlilik', label: '📈 Verimlilik', color: 'from-orange-500 to-red-500' },
    { value: 'yapay-zeka', label: '🧠 Yapay Zeka', color: 'from-indigo-500 to-purple-500' },
    { value: 'dijital-donusum', label: '🌐 Dijital Dönüşüm', color: 'from-teal-500 to-blue-500' },
    { value: 'startup', label: '🚀 Startup', color: 'from-yellow-500 to-orange-500' },
    { value: 'inovasyon', label: '💡 İnovasyon', color: 'from-pink-500 to-rose-500' }
  ];

  // Quick Actions
  const quickActions = [
    { icon: Sparkles, label: 'AI Önerileri', action: () => generateAISuggestions() },
    { icon: Zap, label: 'Hızlı Şablon', action: () => loadQuickTemplate() },
    { icon: Target, label: 'SEO Optimize', action: () => optimizeSEO() },
    { icon: TrendingUp, label: 'Trend Analizi', action: () => analyzeTrends() }
  ];

  // Helper Functions
  const generateAISuggestions = () => {
    const suggestions = [
      '🤖 Otomasyon ile iş süreçlerinizi nasıl hızlandırabilirsiniz?',
      '💡 Yapay zeka teknolojilerinin işletmenize katkıları',
      '📈 Verimlilik artırma teknikleri ve araçları',
      '🚀 Startup\'lar için dijital dönüşüm stratejileri'
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setFormData(prev => ({ ...prev, title: randomSuggestion }));
  };

  const loadQuickTemplate = () => {
    setFormData(prev => ({
      ...prev,
      title: '🚀 Yeni Teknoloji Trendleri',
      content: `# Yeni Teknoloji Trendleri

Bu yazımızda, 2024'ün en önemli teknoloji trendlerini ele alacağız.

## 🤖 Yapay Zeka ve Makine Öğrenmesi

Yapay zeka teknolojileri her geçen gün daha da gelişiyor...

## 📱 Mobil Teknolojiler

Mobil uygulamalar ve responsive tasarım...

## ☁️ Bulut Teknolojileri

Bulut bilişim ve SaaS çözümleri...

## 🔒 Siber Güvenlik

Dijital güvenlik ve veri koruma...`,
      excerpt: '2024\'ün en önemli teknoloji trendlerini keşfedin ve işletmenizi geleceğe hazırlayın.',
      category: 'teknoloji',
      tags: ['teknoloji', 'trend', '2024', 'yapay-zeka'],
      readTime: 8
    }));
  };

  const optimizeSEO = () => {
    const title = formData.title;
    const excerpt = formData.excerpt;
    
    setFormData(prev => ({
      ...prev,
      metaTitle: title.length > 60 ? title.substring(0, 60) + '...' : title,
      metaDescription: excerpt.length > 160 ? excerpt.substring(0, 160) + '...' : excerpt,
      metaKeywords: [...new Set([...prev.tags, ...title.toLowerCase().split(' ').filter(word => word.length > 3)])]
    }));
  };

  const analyzeTrends = () => {
    alert('📊 Trend analizi özelliği yakında eklenecek!');
  };

  // Image Upload Handler
  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const path = `blog-images/${Date.now()}-${file.name}`;
      const imageUrl = await blogService.uploadImage(file, path);
      
      // Insert image into content at cursor position
      const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const imageTag = `\n\n<div style="text-align: center; margin: 20px 0;">
<img src="${imageUrl}" alt="Blog Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>\n\n`;
        
        const currentContent = formData.content;
        const newContent = currentContent.slice(0, cursorPos) + imageTag + currentContent.slice(cursorPos);
        setFormData(prev => ({ ...prev, content: newContent }));
        
        // Set cursor position after image
        setTimeout(() => {
          const newPos = cursorPos + imageTag.length;
          textarea.setSelectionRange(newPos, newPos);
          textarea.focus();
        }, 100);
      }
      
      alert('✅ Görsel başarıyla yüklendi ve içeriğe eklendi!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Görsel yüklenirken hata oluştu!');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Blog yazısı kaydediliyor...');
    
    // Test user for now
    const testUser = {
      id: 'test-user-id',
      email: 'admin@example.com'
    };

    try {
      setIsSubmitting(true);
      
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        author: testUser.email,
        authorId: testUser.id,
        imageUrl: formData.imageUrl?.trim() || undefined,
        category: formData.category.trim(),
        tags: formData.tags.filter(tag => tag.trim()),
        status: formData.status,
        readTime: formData.readTime || 5,
        metaTitle: formData.metaTitle?.trim() || formData.title.trim(),
        metaDescription: formData.metaDescription?.trim() || formData.excerpt.trim(),
        metaKeywords: formData.metaKeywords.filter(keyword => keyword.trim()),
      };

      if (editingId) {
        await updateBlogPost(editingId, postData);
        alert('✅ Blog yazısı başarıyla güncellendi!');
      } else {
        await addBlogPost(postData);
        alert('✅ Blog yazısı başarıyla oluşturuldu ve ana sayfada görünecek!');
      }

      resetForm();
      setShowAddForm(false);
      await refreshPosts();
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('❌ Blog yazısı kaydedilirken hata oluştu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: [],
      readTime: 5,
      imageUrl: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowPreview(false);
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      readTime: post.readTime,
      imageUrl: post.imageUrl || '',
      status: post.status,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      metaKeywords: post.metaKeywords || []
    });
    setImagePreview(post.imageUrl || '');
    setEditingId(post.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteBlogPost(id);
        await refreshPosts();
        alert('✅ Blog yazısı başarıyla silindi!');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('❌ Blog yazısı silinirken hata oluştu!');
      }
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Blog Yöneticisi Yükleniyor</h3>
          <p className="text-gray-400">Veriler hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <span>Modern Blog Yöneticisi</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-400">Yaratıcı ve etkileyici blog yazıları oluşturun</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Yazı</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {quickActions.map((action, index) => (
          <button
            key={action.label}
            onClick={action.action}
            className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-white/20 hover:from-white/10 hover:to-white/15 transition-all duration-300 group"
          >
            <action.icon className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white font-medium">{action.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Blog Posts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10 hover:border-white/20 hover:from-white/10 hover:to-white/15 transition-all duration-300 group"
          >
            {/* Image */}
            {post.imageUrl && (
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    post.status === 'published' 
                      ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                      : 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
                  }`}>
                    {post.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                {post.title}
              </h4>
              
              <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              
              {/* Category */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
                  {post.category}
                </span>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.createdAt.toString())}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Düzenle</span>
                </button>
                
                {post.status === 'draft' ? (
                  <button
                    onClick={() => publishBlogPost(post.id)}
                    className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg hover:bg-green-500/30 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Yayınla</span>
                  </button>
                ) : (
                  <button
                    onClick={() => unpublishBlogPost(post.id)}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-lg hover:bg-yellow-500/30 transition-colors flex items-center space-x-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Gizle</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  <span>{editingId ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}</span>
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">Başlık</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Blog yazısının başlığını girin..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-white font-medium mb-2">Özet</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Blog yazısının kısa özetini girin..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-medium mb-2">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Kategori seçin...</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white font-medium mb-2">İçerik</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Blog yazısının içeriğini girin..."
                    rows={12}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white font-medium mb-2">Kapak Görseli</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg cursor-pointer hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-200">
                        <Upload className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Görsel Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      <p className="text-gray-400 text-sm">📁 Dosya yükleyip Supabase'e kaydet</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="Görsel URL'si..."
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <p className="text-gray-400 text-sm">🔗 Direkt link ile görsel ekle</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-white font-medium mb-2">Durum</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
                  >
                    Temizle
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Kaydet</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogManager;
