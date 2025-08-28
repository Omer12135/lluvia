import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

interface BlogContextType {
  blogPosts: BlogPost[];
  publishedPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  publishBlogPost: (id: string) => void;
  unpublishBlogPost: (id: string) => void;
  incrementViews: (id: string) => void;
  incrementLikes: (id: string) => void;
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

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local storage'dan blog yazılarını yükle
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      }));
      setBlogPosts(posts);
    }
  }, []);

  // Blog yazılarını local storage'a kaydet
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  // Yayınlanmış yazıları filtrele
  const publishedPosts = blogPosts.filter(post => post.status === 'published');

  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
    };
    setBlogPosts(prev => [...prev, newPost]);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, ...updates, updatedAt: new Date() }
        : post
    ));
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));
  };

  const publishBlogPost = (id: string) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, status: 'published', publishedAt: new Date(), updatedAt: new Date() }
        : post
    ));
  };

  const unpublishBlogPost = (id: string) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, status: 'draft', updatedAt: new Date() }
        : post
    ));
  };

  const incrementViews = (id: string) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, views: post.views + 1 }
        : post
    ));
  };

  const incrementLikes = (id: string) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
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
    setLoading(true);
    setError(null);
    try {
      // Local storage'dan yeniden yükle
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts).map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
        }));
        setBlogPosts(posts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh posts');
    } finally {
      setLoading(false);
    }
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
