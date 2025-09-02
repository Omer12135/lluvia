import { supabase } from '../lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  image_url?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  read_time: number;
  views: number;
  likes: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  image_url?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  read_time: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

// Generate SEO-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Blog post service functions
export const blogService = {
  // Get all blog posts (for admin)
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    return data || [];
  },

  // Get published blog posts (for public)
  async getPublishedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching published blog posts:', error);
      throw error;
    }

    return data || [];
  },

  // Get blog post by ID
  async getPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }

    return data;
  },

  // Get blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }

    return data;
  },

  // Create new blog post
  async createPost(postData: CreateBlogPostData): Promise<BlogPost> {
    // Generate slug from title
    const slug = generateSlug(postData.title);
    
    const postDataWithSlug = {
      ...postData,
      slug,
      published_at: postData.status === 'published' ? new Date().toISOString() : null
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postDataWithSlug])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data;
  },

  // Update blog post
  async updatePost(id: string, updates: Partial<CreateBlogPostData>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data;
  },

  // Delete blog post
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Publish blog post
  async publishPost(id: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error publishing blog post:', error);
      throw error;
    }

    return data;
  },

  // Unpublish blog post
  async unpublishPost(id: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ 
        status: 'draft',
        published_at: null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error unpublishing blog post:', error);
      throw error;
    }

    return data;
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .update({ views: supabase.sql`views + 1` })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  // Increment likes
  async incrementLikes(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .update({ likes: supabase.sql`likes + 1` })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing likes:', error);
      throw error;
    }
  },

  // Search blog posts
  async searchPosts(query: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }

    return data || [];
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }

    return data || [];
  },

  // Get posts by author
  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts by author:', error);
      throw error;
    }

    return data || [];
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const categories = [...new Set(data?.map(post => post.category) || [])];
    return categories;
  },

  // Get all tags
  async getTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    const allTags = data?.flatMap(post => post.tags || []) || [];
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags;
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  // Delete image from Supabase Storage
  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

