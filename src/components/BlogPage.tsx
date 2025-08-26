import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  ArrowLeft,
  User,
  Tag,
  Share2
} from 'lucide-react';
import { useBlog, BlogPost } from '../context/BlogContext';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const { publishedPosts, incrementViews, incrementLikes } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayCount, setDisplayCount] = useState(9);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Get unique categories
  const categories = ['all', ...new Set(publishedPosts.map(post => post.category))];

  // Filtered and searched posts
  const filteredPosts = publishedPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const displayedPosts = filteredPosts.slice(0, displayCount);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePostClick = (post: BlogPost) => {
    incrementViews(post.id);
    setSelectedPost(post);
  };

  const handleLike = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    incrementLikes(post.id);
  };

  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/blog"
                className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
                onClick={() => setSelectedPost(null)}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Blog</span>
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => handleLike(e, selectedPost)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>{selectedPost.likes}</span>
                </button>
                <button
                  onClick={(e) => handleShare(e, selectedPost)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Post Content */}
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                  {selectedPost.category}
                </span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedPost.publishedAt || selectedPost.createdAt)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPost.readTime} min read</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {selectedPost.title}
              </h1>

              <p className="text-xl text-gray-300 mb-6">
                {selectedPost.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedPost.author}</p>
                    <p className="text-gray-400 text-sm">Author</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedPost.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{selectedPost.likes} likes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {selectedPost.imageUrl && (
              <div className="mb-8">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </div>

            {/* Tags */}
            {selectedPost.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm">Blog</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Automation Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Latest automation trends, tips, and success stories from the automation world
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                {/* Image */}
                {post.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    <button className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Blog Posts Found</h3>
            <p className="text-gray-400">We'll have amazing content here soon!</p>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > displayCount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => setDisplayCount(prev => prev + 9)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>Load More</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Posts', value: publishedPosts.length, icon: BookOpen },
            { label: 'Categories', value: categories.length - 1, icon: Filter },
            { label: 'Total Views', value: publishedPosts.reduce((sum, post) => sum + post.views, 0), icon: Eye },
            { label: 'Total Likes', value: publishedPosts.reduce((sum, post) => sum + post.likes, 0), icon: Heart },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
