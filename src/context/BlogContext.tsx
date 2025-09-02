import React, { createContext, useContext, useState, useEffect } from 'react';
import { blogService, BlogPost as SupabaseBlogPost } from '../services/blogService';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  readTime: number; // dakika cinsinden
  views: number;
  likes: number;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
}

interface BlogContextType {
  blogPosts: BlogPost[];
  publishedPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'slug'>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  publishBlogPost: (id: string) => Promise<void>;
  unpublishBlogPost: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  incrementLikes: (id: string) => Promise<void>;
  getBlogPostById: (id: string) => BlogPost | undefined;
  getPostsByCategory: (category: string) => BlogPost[];
  getPostsByAuthor: (authorId: string) => BlogPost[];
  searchPosts: (query: string) => BlogPost[];
  refreshPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

// Supabase BlogPost'u local BlogPost'a dönüştür
const convertSupabaseToLocal = (supabasePost: SupabaseBlogPost): BlogPost => {
  return {
    id: supabasePost.id,
    title: supabasePost.title,
    content: supabasePost.content,
    excerpt: supabasePost.excerpt,
    author: supabasePost.author_name,
    authorId: supabasePost.author_id,
    imageUrl: supabasePost.image_url,
    category: supabasePost.category,
    tags: supabasePost.tags,
    status: supabasePost.status,
    createdAt: new Date(supabasePost.created_at),
    updatedAt: new Date(supabasePost.updated_at),
    publishedAt: supabasePost.published_at ? new Date(supabasePost.published_at) : undefined,
    readTime: supabasePost.read_time,
    views: supabasePost.views,
    likes: supabasePost.likes,
    slug: supabasePost.slug,
    metaTitle: supabasePost.meta_title,
    metaDescription: supabasePost.meta_description,
    metaKeywords: supabasePost.meta_keywords,
  };
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase'den blog yazılarını yükle
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabasePosts = await blogService.getAllPosts();
      const localPosts = supabasePosts.map(convertSupabaseToLocal);
      setBlogPosts(localPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    loadPosts();
  }, []);

  // Yayınlanmış yazıları filtrele
  const publishedPosts = blogPosts.filter(post => post.status === 'published');

  const addBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'slug'>) => {
    try {
      const supabasePostData = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        author_id: postData.authorId,
        author_name: postData.author,
        image_url: postData.imageUrl,
        category: postData.category,
        tags: postData.tags,
        status: postData.status,
        read_time: postData.readTime,
        meta_title: postData.metaTitle,
        meta_description: postData.metaDescription,
        meta_keywords: postData.metaKeywords,
      };

      const newSupabasePost = await blogService.createPost(supabasePostData);
      const newLocalPost = convertSupabaseToLocal(newSupabasePost);
      setBlogPosts(prev => [...prev, newLocalPost]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add post');
      throw err;
    }
  };

  const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const supabaseUpdates: any = {};
      
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.content) supabaseUpdates.content = updates.content;
      if (updates.excerpt) supabaseUpdates.excerpt = updates.excerpt;
      if (updates.author) supabaseUpdates.author_name = updates.author;
      if (updates.authorId) supabaseUpdates.author_id = updates.authorId;
      if (updates.imageUrl !== undefined) supabaseUpdates.image_url = updates.imageUrl;
      if (updates.category) supabaseUpdates.category = updates.category;
      if (updates.tags) supabaseUpdates.tags = updates.tags;
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.readTime) supabaseUpdates.read_time = updates.readTime;
      if (updates.metaTitle) supabaseUpdates.meta_title = updates.metaTitle;
      if (updates.metaDescription) supabaseUpdates.meta_description = updates.metaDescription;
      if (updates.metaKeywords) supabaseUpdates.meta_keywords = updates.metaKeywords;

      const updatedSupabasePost = await blogService.updatePost(id, supabaseUpdates);
      const updatedLocalPost = convertSupabaseToLocal(updatedSupabasePost);
      
      setBlogPosts(prev => prev.map(post => 
        post.id === id ? updatedLocalPost : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      throw err;
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      await blogService.deletePost(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      throw err;
    }
  };

  const publishBlogPost = async (id: string) => {
    try {
      const updatedSupabasePost = await blogService.publishPost(id);
      const updatedLocalPost = convertSupabaseToLocal(updatedSupabasePost);
      
      setBlogPosts(prev => prev.map(post => 
        post.id === id ? updatedLocalPost : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish post');
      throw err;
    }
  };

  const unpublishBlogPost = async (id: string) => {
    try {
      const updatedSupabasePost = await blogService.unpublishPost(id);
      const updatedLocalPost = convertSupabaseToLocal(updatedSupabasePost);
      
      setBlogPosts(prev => prev.map(post => 
        post.id === id ? updatedLocalPost : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish post');
      throw err;
    }
  };

  const incrementViews = async (id: string) => {
    try {
      await blogService.incrementViews(id);
      setBlogPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, views: post.views + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  const incrementLikes = async (id: string) => {
    try {
      await blogService.incrementLikes(id);
      setBlogPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error incrementing likes:', err);
    }
  };

  const getBlogPostById = (id: string) => {
    return blogPosts.find(post => post.id === id);
  };

  const getPostsByCategory = (category: string) => {
    return publishedPosts.filter(post => post.category === category);
  };

  const getPostsByAuthor = (authorId: string) => {
    return blogPosts.filter(post => post.authorId === authorId);
  };

  const searchPosts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return publishedPosts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const refreshPosts = async () => {
    await loadPosts();
  };

  const value: BlogContextType = {
    blogPosts,
    publishedPosts,
    loading,
    error,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    publishBlogPost,
    unpublishBlogPost,
    incrementViews,
    incrementLikes,
    getBlogPostById,
    getPostsByCategory,
    getPostsByAuthor,
    searchPosts,
    refreshPosts,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
