import React, { useState, useRef } from 'react';
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
  Bold,
  Italic,
  Underline,
  Link,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Video,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table,
  Palette,
  Type,
  Minus,
  CheckSquare,
  Square,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useBlog, BlogPost } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';

const AdminBlogManager: React.FC = () => {
  const { user } = useAuth();
  const { 
    blogPosts, 
    addBlogPost, 
    updateBlogPost, 
    deleteBlogPost, 
    publishBlogPost, 
    unpublishBlogPost 
  } = useBlog();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textColor, setTextColorState] = useState('#ffffff');
  const [backgroundColor, setBackgroundColorState] = useState('#1f2937');
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [] as string[],
    readTime: 5,
    imageUrl: '',
    status: 'draft' as 'draft' | 'published'
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Rich Text Editor Functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const insertImage = (imageUrl: string) => {
    const img = `<img src="${imageUrl}" alt="Blog Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />`;
    document.execCommand('insertHTML', false, img);
    setShowImageModal(false);
    setUploadedImages(prev => [...prev, imageUrl]);
    contentRef.current?.focus();
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
      contentRef.current?.focus();
    }
  };

  const insertHeading = (level: number) => {
    const heading = `<h${level} style="margin: 20px 0 10px 0; font-weight: bold; color: ${textColor};">Heading ${level}</h${level}>`;
    document.execCommand('insertHTML', false, heading);
    contentRef.current?.focus();
  };

  const insertQuote = () => {
    const quote = `<blockquote style="border-left: 4px solid #3b82f6; padding-left: 20px; margin: 20px 0; font-style: italic; background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 8px;">Quote text here</blockquote>`;
    document.execCommand('insertHTML', false, quote);
    contentRef.current?.focus();
  };

  const insertCode = () => {
    const code = `<pre style="background: #1f2937; color: #10b981; padding: 15px; border-radius: 8px; overflow-x: auto; border: 1px solid #374151; margin: 15px 0;"><code>Your code here</code></pre>`;
    document.execCommand('insertHTML', false, code);
    contentRef.current?.focus();
  };

  const insertTable = () => {
    const table = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #374151;">
      <thead>
        <tr style="background: #374151;">
          <th style="padding: 12px; text-align: left; border: 1px solid #4b5563;">Header 1</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #4b5563;">Header 2</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #4b5563;">Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid #4b5563;">Data 1</td>
          <td style="padding: 12px; border: 1px solid #4b5563;">Data 2</td>
          <td style="padding: 12px; border: 1px solid #4b5563;">Data 3</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #4b5563;">Data 4</td>
          <td style="padding: 12px; border: 1px solid #4b5563;">Data 5</td>
          <td style="padding: 12px; border: 1px solid #4b5563;">Data 6</td>
        </tr>
      </tbody>
    </table>`;
    document.execCommand('insertHTML', false, table);
    contentRef.current?.focus();
  };

  const insertChecklist = () => {
    const checklist = `<div style="margin: 15px 0;">
      <div style="display: flex; align-items: center; margin: 8px 0;">
        <input type="checkbox" style="margin-right: 10px;" />
        <span>Checklist item 1</span>
      </div>
      <div style="display: flex; align-items: center; margin: 8px 0;">
        <input type="checkbox" style="margin-right: 10px;" />
        <span>Checklist item 2</span>
      </div>
      <div style="display: flex; align-items: center; margin: 8px 0;">
        <input type="checkbox" style="margin-right: 10px;" />
        <span>Checklist item 3</span>
      </div>
    </div>`;
    document.execCommand('insertHTML', false, checklist);
    contentRef.current?.focus();
  };

  const insertDivider = () => {
    const divider = `<hr style="border: none; height: 2px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); margin: 30px 0; border-radius: 1px;" />`;
    document.execCommand('insertHTML', false, divider);
    contentRef.current?.focus();
  };

  const setTextColor = (color: string) => {
    document.execCommand('foreColor', false, color);
    contentRef.current?.focus();
  };

  const setBackgroundColor = (color: string) => {
    document.execCommand('hiliteColor', false, color);
    contentRef.current?.focus();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setFormData(prev => ({ ...prev, content: contentRef.current?.innerHTML || '' }));
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
      status: 'draft'
    });
    setSelectedImage(null);
    setImagePreview('');
    setUploadedImages([]);
    setEditingId(null);
    setIsFullscreen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const postData = {
      ...formData,
      author: user.name || user.email || 'Admin',
      authorId: user.id || 'admin',
    };

    if (editingId) {
      updateBlogPost(editingId, postData);
    } else {
      addBlogPost(postData);
    }

    resetForm();
    setShowAddForm(false);
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
      status: post.status
    });
    setImagePreview(post.imageUrl || '');
    setEditingId(post.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      deleteBlogPost(id);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                      <span>{formatDate(post.createdAt)}</span>
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
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                {post.status === 'draft' ? (
                  <button
                    onClick={() => publishBlogPost(post.id)}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                    title="Yayınla"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => unpublishBlogPost(post.id)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                    title="Yayından Kaldır"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Sil"
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
              className="bg-gray-900 rounded-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
                  
                  {/* Rich Text Editor Toolbar */}
                  <div className="bg-white/10 border border-white/20 rounded-t-lg p-3">
                    {/* First Row - Basic Formatting */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => execCommand('bold')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('italic')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('underline')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Underline"
                      >
                        <Underline className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="w-px h-6 bg-white/20"></div>
                      
                      <button
                        type="button"
                        onClick={() => insertHeading(1)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Heading 1"
                      >
                        <Heading1 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading(2)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Heading 2"
                      >
                        <Heading2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading(3)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Heading 3"
                      >
                        <Heading3 className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Second Row - Lists and Alignment */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => execCommand('insertUnorderedList')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('insertOrderedList')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Numbered List"
                      >
                        <List className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={insertChecklist}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Checklist"
                      >
                        <CheckSquare className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="w-px h-6 bg-white/20"></div>
                      
                      <button
                        type="button"
                        onClick={() => execCommand('justifyLeft')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Align Left"
                      >
                        <AlignLeft className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('justifyCenter')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Align Center"
                      >
                        <AlignCenter className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand('justifyRight')}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Align Right"
                      >
                        <AlignRight className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Third Row - Special Elements */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={insertQuote}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Insert Quote"
                      >
                        <Quote className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={insertCode}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Insert Code"
                      >
                        <Code className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={insertTable}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Insert Table"
                      >
                        <Table className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={insertDivider}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Insert Divider"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="w-px h-6 bg-white/20"></div>
                      
                      <button
                        type="button"
                        onClick={() => setShowLinkModal(true)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Insert Link"
                      >
                        <Link className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowImageModal(true)}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title="Insert Image"
                      >
                        <Image className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Fourth Row - Colors and Fullscreen */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">Text:</span>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColorState(e.target.value)}
                          className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                          title="Text Color"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm">BG:</span>
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColorState(e.target.value)}
                          className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                          title="Background Color"
                        />
                      </div>
                      
                      <div className="w-px h-6 bg-white/20"></div>
                      
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/20 rounded transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Rich Text Editor Content */}
                  <div
                    ref={contentRef}
                    contentEditable
                    onInput={handleContentChange}
                    onBlur={handleContentChange}
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                    className={`w-full px-4 py-3 bg-white/10 border border-t-0 border-white/20 rounded-b-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-y-auto transition-all duration-300 ${
                      isFullscreen 
                        ? 'fixed inset-4 z-50 bg-gray-900 border-2 border-purple-500 rounded-xl shadow-2xl' 
                        : 'min-h-[300px]'
                    }`}
                    style={{ 
                      outline: 'none',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                    placeholder="Full content of the blog post..."
                  />
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
                        <Upload className="w-4 h-4 text-white" />
                                                 <span className="text-white">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
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

                {/* Status */}
                <div>
                  <label className="block text-white font-medium mb-2">Durum</label>
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
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                                         <span>{editingId ? 'Update' : 'Save'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLinkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Insert Link</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Link Text</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Link text..."
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">URL</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Insert Image</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        insertImage(input.value);
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Or Upload Image</label>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                    <Upload className="w-4 h-4 text-white" />
                    <span className="text-white">Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            insertImage(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div>
                    <label className="block text-white font-medium mb-2">Uploaded Images ({uploadedImages.length})</label>
                    <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-white/20"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => insertImage(imageUrl)}
                              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                            >
                              Insert
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                    if (input?.value) {
                      insertImage(input.value);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Insert Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogManager;
