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
        author: user.name || user.email || 'Admin',
        authorId: user.id || '',
        imageUrl: formData.imageUrl || undefined,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        readTime: formData.readTime,
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
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
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
          <p className="text-sm sm:text-base text-gray-400">Manage and publish blog posts</p>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
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
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-start space-x-4">
                {/* Image */}
                {post.imageUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold text-white truncate">{post.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'text-green-400 bg-green-500/20' 
                        : 'text-yellow-400 bg-yellow-500/20'
                    }`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{post.likes}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
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
            className="text-center py-12 bg-white/5 rounded-lg border border-white/10"
          >
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Blog Posts Yet</h4>
            <p className="text-gray-400">Start creating your first blog post!</p>
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
                  <label className="block text-white font-medium mb-2">Featured Image</label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                            setSelectedImage(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 text-white" />
                        )}
                        <span className="text-white">
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Or enter image URL..."
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
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
