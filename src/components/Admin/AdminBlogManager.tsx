import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  Eye as PreviewIcon,
  Settings,
  Globe,
  Hash,
  Type,
  Palette,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  CheckSquare,
  Square,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Loader2
} from 'lucide-react';
import { useBlog, BlogPost } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { blogService, CreateBlogPostData, generateSlug } from '../../services/blogService';

const AdminBlogManager: React.FC = () => {
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

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

  const categories = [
    'Otomasyon',
    'Teknoloji',
    'İş Süreçleri',
    'Verimlilik',
    'Yapay Zeka',
    'API Entegrasyonu',
    'E-ticaret',
    'Pazarlama',
    'Müşteri Hizmetleri',
    'Finans'
  ];

  // Örnek blog yazıları ekleme fonksiyonu
  const addSamplePosts = async () => {
    if (!user) return;

    const samplePosts = [
      {
        title: 'Otomasyon ile İş Süreçlerinizi Nasıl Hızlandırabilirsiniz?',
        content: `
          <h2>Otomasyonun İş Dünyasındaki Önemi</h2>
          <p>Günümüzde işletmeler, rekabet avantajı elde etmek için sürekli olarak verimliliklerini artırmaya çalışıyor. Bu noktada otomasyon, en güçlü araçlardan biri olarak öne çıkıyor.</p>
          
          <h3>Otomasyonun Faydaları</h3>
          <ul>
            <li><strong>Zaman Tasarrufu:</strong> Tekrarlayan görevler otomatikleştirilerek çalışanlar daha değerli işlere odaklanabilir</li>
            <li><strong>Hata Oranının Azalması:</strong> İnsan kaynaklı hatalar minimize edilir</li>
            <li><strong>Maliyet Düşüşü:</strong> Operasyonel maliyetler önemli ölçüde azalır</li>
            <li><strong>Ölçeklenebilirlik:</strong> İşletmeler daha kolay büyüyebilir</li>
          </ul>
          
          <h3>Hangi Süreçler Otomatikleştirilebilir?</h3>
          <p>Otomasyon için en uygun süreçler şunlardır:</p>
          <ol>
            <li>Veri girişi ve raporlama</li>
            <li>E-posta yanıtlama ve takip</li>
            <li>Müşteri hizmetleri</li>
            <li>Fatura ve ödeme işlemleri</li>
            <li>Stok yönetimi</li>
          </ol>
          
          <blockquote>
            <p>"Otomasyon, işletmelerin gelecekte ayakta kalması için kritik bir faktördür. Doğru uygulandığında, hem verimliliği artırır hem de çalışan memnuniyetini yükseltir."</p>
          </blockquote>
          
          <h3>Otomasyon Stratejisi Geliştirme</h3>
          <p>Başarılı bir otomasyon projesi için şu adımları takip edin:</p>
          <ol>
            <li><strong>Mevcut Süreçleri Analiz Edin:</strong> Hangi süreçlerin otomatikleştirilebileceğini belirleyin</li>
            <li><strong>Öncelikleri Belirleyin:</strong> En çok fayda sağlayacak süreçlerden başlayın</li>
            <li><strong>Doğru Araçları Seçin:</strong> İhtiyaçlarınıza uygun otomasyon platformunu seçin</li>
            <li><strong>Pilot Proje Başlatın:</strong> Küçük ölçekte test edin</li>
            <li><strong>Ölçeklendirin:</strong> Başarılı sonuçlar aldıktan sonra genişletin</li>
          </ol>
          
          <h3>Sonuç</h3>
          <p>Otomasyon, modern işletmelerin vazgeçilmez bir parçası haline gelmiştir. Doğru strateji ve araçlarla, işletmenizin verimliliğini ve karlılığını önemli ölçüde artırabilirsiniz.</p>
        `,
        excerpt: 'İş süreçlerinizi otomatikleştirerek verimliliğinizi nasıl artırabileceğinizi ve maliyetlerinizi nasıl düşürebileceğinizi öğrenin.',
        category: 'Otomasyon',
        tags: ['otomasyon', 'verimlilik', 'iş süreçleri', 'zaman tasarrufu'],
        readTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      },
      {
        title: 'Yapay Zeka Destekli Müşteri Hizmetleri Çözümleri',
        content: `
          <h2>Yapay Zeka ile Müşteri Deneyimini Dönüştürme</h2>
          <p>Yapay zeka teknolojileri, müşteri hizmetleri alanında devrim yaratıyor. Chatbot'lar, sesli asistanlar ve akıllı yönlendirme sistemleri ile müşteri deneyimi tamamen değişiyor.</p>
          
          <h3>AI Destekli Müşteri Hizmetlerinin Avantajları</h3>
          <ul>
            <li><strong>7/24 Hizmet:</strong> Müşteriler her zaman destek alabilir</li>
            <li><strong>Anında Yanıt:</strong> Bekleme süreleri ortadan kalkar</li>
            <li><strong>Kişiselleştirilmiş Deneyim:</strong> Her müşteriye özel çözümler</li>
            <li><strong>Maliyet Verimliliği:</strong> Operasyonel maliyetlerde %40'a varan düşüş</li>
          </ul>
          
          <h3>En Popüler AI Müşteri Hizmetleri Araçları</h3>
          <p>Günümüzde kullanılan başlıca AI destekli müşteri hizmetleri çözümleri:</p>
          <ol>
            <li><strong>Chatbot'lar:</strong> Temel soruları yanıtlayan akıllı botlar</li>
            <li><strong>Sesli Asistanlar:</strong> Telefon üzerinden AI destekli hizmet</li>
            <li><strong>Akıllı Yönlendirme:</strong> Müşteriyi doğru departmana yönlendirme</li>
            <li><strong>Duygu Analizi:</strong> Müşteri memnuniyetini ölçme</li>
          </ol>
          
          <blockquote>
            <p>"Yapay zeka, müşteri hizmetlerini sadece otomatikleştirmekle kalmaz, aynı zamanda daha insancıl ve kişiselleştirilmiş bir deneyim sunar."</p>
          </blockquote>
          
          <h3>Başarılı AI Müşteri Hizmetleri Stratejisi</h3>
          <p>AI destekli müşteri hizmetleri projenizi başarıyla uygulamak için:</p>
          <ol>
            <li><strong>Müşteri İhtiyaçlarını Analiz Edin:</strong> En sık sorulan soruları belirleyin</li>
            <li><strong>Doğru Platformu Seçin:</strong> İhtiyaçlarınıza uygun AI çözümünü seçin</li>
            <li><strong>İnsan-AI Dengesini Kurun:</strong> Karma bir yaklaşım benimseyin</li>
            <li><strong>Sürekli Öğrenme:</strong> AI sistemini sürekli geliştirin</li>
            <li><strong>Performansı Ölçün:</strong> Başarı metriklerini takip edin</li>
          </ol>
          
          <h3>Gelecek Trendleri</h3>
          <p>Müşteri hizmetlerinde AI'nın geleceği:</p>
          <ul>
            <li>Çok dilli AI asistanlar</li>
            <li>Görsel AI destekli hizmetler</li>
            <li>Proaktif müşteri hizmetleri</li>
            <li>Duygu tabanlı yanıtlar</li>
          </ul>
          
          <h3>Sonuç</h3>
          <p>Yapay zeka, müşteri hizmetlerinin geleceğini şekillendiriyor. Doğru uygulandığında, hem müşteri memnuniyetini artırır hem de operasyonel verimliliği yükseltir.</p>
        `,
        excerpt: 'Yapay zeka teknolojileri ile müşteri hizmetlerinizi nasıl dönüştürebileceğinizi ve müşteri memnuniyetini nasıl artırabileceğinizi keşfedin.',
        category: 'Yapay Zeka',
        tags: ['yapay zeka', 'müşteri hizmetleri', 'chatbot', 'AI'],
        readTime: 10,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      },
      {
        title: 'API Entegrasyonu ile Sistemlerinizi Birleştirin',
        content: `
          <h2>API Entegrasyonunun İşletmelere Sağladığı Faydalar</h2>
          <p>Modern işletmeler, farklı sistemler ve uygulamalar arasında veri akışını sağlamak için API entegrasyonlarına ihtiyaç duyuyor. Bu entegrasyonlar, iş süreçlerini optimize eder ve verimliliği artırır.</p>
          
          <h3>API Entegrasyonunun Temel Faydaları</h3>
          <ul>
            <li><strong>Veri Senkronizasyonu:</strong> Sistemler arası veri tutarlılığı</li>
            <li><strong>Otomatik İş Akışları:</strong> Manuel müdahale gerektirmeyen süreçler</li>
            <li><strong>Gerçek Zamanlı Bilgi:</strong> Anlık veri güncellemeleri</li>
            <li><strong>Maliyet Tasarrufu:</strong> Manuel veri girişi maliyetlerinin azalması</li>
          </ul>
          
          <h3>Yaygın API Entegrasyon Senaryoları</h3>
          <p>İşletmelerde en çok kullanılan API entegrasyonları:</p>
          <ol>
            <li><strong>E-ticaret ve Muhasebe:</strong> Satış verilerinin otomatik muhasebeye aktarılması</li>
            <li><strong>CRM ve Pazarlama:</strong> Müşteri verilerinin pazarlama araçlarına entegrasyonu</li>
            <li><strong>İnsan Kaynakları ve Bordro:</strong> Çalışan verilerinin otomatik senkronizasyonu</li>
            <li><strong>Envanter ve Tedarik:</strong> Stok seviyelerinin otomatik takibi</li>
          </ol>
          
          <blockquote>
            <p>"API entegrasyonları, işletmelerin dijital dönüşüm yolculuğunda kritik bir adımdır. Doğru uygulandığında, operasyonel verimliliği önemli ölçüde artırır."</p>
          </blockquote>
          
          <h3>Başarılı API Entegrasyon Stratejisi</h3>
          <p>API entegrasyon projenizi başarıyla tamamlamak için:</p>
          <ol>
            <li><strong>İhtiyaç Analizi:</strong> Hangi sistemlerin entegre edileceğini belirleyin</li>
            <li><strong>API Dokümantasyonu:</strong> Mevcut API'ları detaylı olarak inceleyin</li>
            <li><strong>Güvenlik Planlaması:</strong> Veri güvenliği önlemlerini alın</li>
            <li><strong>Test Stratejisi:</strong> Kapsamlı test planı hazırlayın</li>
            <li><strong>İzleme ve Bakım:</strong> Sürekli performans takibi yapın</li>
          </ol>
          
          <h3>API Güvenliği</h3>
          <p>API entegrasyonlarında güvenlik kritik öneme sahiptir:</p>
          <ul>
            <li>API anahtarlarının güvenli saklanması</li>
            <li>HTTPS protokolü kullanımı</li>
            <li>Rate limiting uygulanması</li>
            <li>Düzenli güvenlik denetimleri</li>
          </ul>
          
          <h3>Sonuç</h3>
          <p>API entegrasyonları, modern işletmelerin dijital dönüşüm sürecinde vazgeçilmez araçlardır. Doğru planlama ve uygulama ile işletmenizin verimliliğini ve rekabet gücünü artırabilirsiniz.</p>
        `,
        excerpt: 'API entegrasyonları ile sistemlerinizi nasıl birleştirebileceğinizi ve iş süreçlerinizi nasıl optimize edebileceğinizi öğrenin.',
        category: 'API Entegrasyonu',
        tags: ['API', 'entegrasyon', 'sistem', 'veri'],
        readTime: 7,
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }
    ];

    try {
      setIsSubmitting(true);
      
      for (const samplePost of samplePosts) {
        const postData = {
          title: samplePost.title,
          content: samplePost.content,
          excerpt: samplePost.excerpt,
          author: user.email || 'Admin',
          authorId: user.id || '',
          imageUrl: samplePost.imageUrl,
          category: samplePost.category,
          tags: samplePost.tags,
          status: 'published' as 'draft' | 'published',
          readTime: samplePost.readTime,
          metaTitle: samplePost.title,
          metaDescription: samplePost.excerpt,
          metaKeywords: samplePost.tags,
        };

        await addBlogPost(postData);
      }

      await refreshPosts();
      alert('Örnek blog yazıları başarıyla eklendi!');
    } catch (error) {
      console.error('Error adding sample posts:', error);
      alert('Örnek blog yazıları eklenirken hata oluştu!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // React Quill modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        link: linkHandler
      }
    },
    clipboard: {
      matchVisual: false,
      // HTML etiketlerini temizle ve sadece text olarak al
      onPaste: function(e: any) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();
        if (quill && range) {
          // HTML etiketlerini temizle
          const cleanText = cleanHtmlContent(text);
          quill.insertText(range.index, cleanText);
          
          // Cursor pozisyonunu güncelle
          setTimeout(() => {
            quill.setSelection({ index: range.index + cleanText.length, length: 0 });
          }, 10);
        }
      }
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
  ];

  // HTML etiketlerini temizleme fonksiyonu
  const cleanHtmlContent = (html: string): string => {
    // HTML etiketlerini kaldır ve sadece text içeriğini al
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Fazla boşlukları temizle ve satır sonlarını koru
    return text.replace(/\s+/g, ' ').trim();
  };









  // Image handler for Quill
  function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          setUploadingImage(true);
          const path = `blog-images/${Date.now()}-${file.name}`;
          const imageUrl = await blogService.uploadImage(file, path);
          
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          if (quill && range) {
            quill.insertEmbed(range.index, 'image', imageUrl);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Resim yüklenirken hata oluştu!');
        } finally {
          setUploadingImage(false);
        }
      }
    };
  }

  // Link handler for Quill
  function linkHandler() {
    const url = prompt('Link URL girin:');
    if (url) {
      const quill = quillRef.current?.getEditor();
      const range = quill?.getSelection();
      if (quill && range) {
        quill.insertText(range.index, url, 'link', url);
      }
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);
        const path = `blog-images/${Date.now()}-${file.name}`;
        const imageUrl = await blogService.uploadImage(file, path);
        setImagePreview(imageUrl);
        setFormData(prev => ({ ...prev, imageUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Resim yüklenirken hata oluştu!');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleMetaKeywordsInput = (value: string) => {
    const keywords = value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    setFormData(prev => ({ ...prev, metaKeywords: keywords }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: user.email || 'Admin',
        authorId: user.id || '',
        imageUrl: formData.imageUrl || undefined,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        readTime: formData.readTime,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
      };

      if (editingId) {
        await updateBlogPost(editingId, postData);
      } else {
        await addBlogPost(postData);
      }

      resetForm();
      setShowAddForm(false);
      await refreshPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Blog yazısı kaydedilirken hata oluştu!');
    } finally {
      setIsSubmitting(false);
    }
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
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Blog yazısı silinirken hata oluştu!');
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-white">Blog yazıları yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Blog Management</h3>
          <p className="text-sm sm:text-base text-gray-400">Manage and publish blog posts with beautiful design</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
          
          <button
            onClick={addSamplePosts}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            <span>Add Sample Posts</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <X className="w-5 h-5 text-red-500" />
            <div>
              <h4 className="text-red-400 font-medium">Error</h4>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blog Posts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    {post.status === 'published' ? 'Published' : 'Draft'}
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
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime} dk</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 text-gray-500 text-xs rounded">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                {post.status === 'draft' ? (
                  <button
                    onClick={() => publishBlogPost(post.id)}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                    title="Publish"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => unpublishBlogPost(post.id)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                    title="Unpublish"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full text-center py-16 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-purple-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">No Blog Posts Yet</h4>
              <p className="text-gray-400 mb-6">Start creating amazing content for your audience!</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddForm(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Post</span>
                </button>
                <button
                  onClick={addSamplePosts}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                  <span>Add Sample Posts</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

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
              className="bg-gray-900 rounded-xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Blog Post' : 'New Blog Post'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Blog post title..."
                    required
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-white font-medium mb-2">Excerpt *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Short summary of the blog post..."
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white font-medium mb-2">Content *</label>
                  
                  {/* React Quill Editor */}
                  <div className="bg-white/10 border border-white/20 rounded-lg overflow-hidden">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={formData.content}
                      onChange={(content: string) => {
                        // State'i güncelle
                        setFormData(prev => ({ ...prev, content }));
                      }}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your blog post content here..."
                      style={{
                        backgroundColor: 'transparent',
                        color: 'white'
                      }}
                    />
                  </div>
                  
                  {/* Custom Quill Styles */}
                  <style>{`
                    .ql-editor {
                      background: transparent !important;
                      color: white !important;
                      min-height: 300px;
                      font-size: 16px;
                      line-height: 1.6;
                    }
                    .ql-editor p {
                      margin-bottom: 1rem;
                    }
                    .ql-editor h1, .ql-editor h2, .ql-editor h3 {
                      color: white !important;
                      margin-top: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .ql-editor blockquote {
                      border-left: 4px solid #8b5cf6;
                      padding-left: 1rem;
                      margin: 1rem 0;
                      font-style: italic;
                      background: rgba(139, 92, 246, 0.1);
                      padding: 1rem;
                      border-radius: 0.5rem;
                    }
                    .ql-editor code {
                      background: #1f2937;
                      color: #10b981;
                      padding: 0.25rem 0.5rem;
                      border-radius: 0.25rem;
                      font-family: 'Courier New', monospace;
                    }
                    .ql-editor pre {
                      background: #1f2937;
                      color: #10b981;
                      padding: 1rem;
                      border-radius: 0.5rem;
                      overflow-x: auto;
                      border: 1px solid #374151;
                      margin: 1rem 0;
                    }
                    .ql-toolbar {
                      background: rgba(255, 255, 255, 0.1) !important;
                      border: none !important;
                      border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
                    }
                    .ql-toolbar button {
                      color: white !important;
                    }
                    .ql-toolbar button:hover {
                      color: #8b5cf6 !important;
                    }
                    .ql-toolbar .ql-active {
                      color: #8b5cf6 !important;
                    }
                    .ql-toolbar .ql-stroke {
                      stroke: white !important;
                    }
                    .ql-toolbar .ql-fill {
                      fill: white !important;
                    }
                    .ql-toolbar .ql-picker {
                      color: white !important;
                    }
                    .ql-toolbar .ql-picker-options {
                      background: #374151 !important;
                      border: 1px solid #4b5563 !important;
                    }
                    .ql-toolbar .ql-picker-item {
                      color: white !important;
                    }
                    .ql-toolbar .ql-picker-item:hover {
                      background: #4b5563 !important;
                    }
                  `}</style>
                </div>

                {/* Category and Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-gray-800">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Reading Time (minutes)</label>
                    <input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                      min="1"
                      max="60"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tag1, tag2, tag3..."
                  />
                  <p className="text-gray-400 text-sm mt-1">Separate tags with commas</p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Featured Image</span>
                  </label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-white/20 shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData(prev => ({ ...prev, imageUrl: '' }));
                              setSelectedImage(null);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Upload */}
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200">
                          {uploadingImage ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5 text-white" />
                          )}
                          <span className="text-white font-medium">
                            {uploadingImage ? 'Uploading...' : 'Upload Image File'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="text-gray-400 text-sm">Supported: JPG, PNG, GIF, WebP (Max 5MB)</p>
                      </div>
                      
                      {/* URL Input */}
                      <div className="space-y-2">
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="Or enter image URL..."
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <p className="text-gray-400 text-sm">Direct link to image (https://...)</p>
                      </div>
                    </div>
                    
                    {/* Image Preview Button */}
                    {formData.imageUrl && !imagePreview && (
                      <button
                        type="button"
                        onClick={() => setImagePreview(formData.imageUrl)}
                        className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
                      >
                        Preview Image
                      </button>
                    )}
                  </div>
                </div>

                {/* SEO Section */}
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    SEO Settings
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="SEO title for search engines..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Meta Description</label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="SEO description for search engines..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={formData.metaKeywords.join(', ')}
                        onChange={(e) => handleMetaKeywordsInput(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="keyword1, keyword2, keyword3..."
                      />
                      <p className="text-gray-400 text-sm mt-1">Separate keywords with commas</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-white font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Publish</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
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
                    <span>{editingId ? 'Update' : 'Save'}</span>
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
