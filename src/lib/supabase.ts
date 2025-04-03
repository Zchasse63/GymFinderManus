import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://ebkqhegzdlegzrcwamnp.supabase.co';
const supabaseAnonKey = 'sbp_5bb5e5b3afb78fffc390e159aca0ab33358b7e73';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Gym = {
  id: string;
  name: string;
  location: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  rating: number;
  review_count: number;
  price_range: string;
  hours: string;
  images: string[];
  created_at: string;
  updated_at: string;
  owner_id?: string;
  status: 'verified' | 'pending' | 'flagged';
  place_id?: string;
};

export type Amenity = {
  id: string;
  name: string;
  icon: string;
};

export type GymAmenity = {
  id: string;
  gym_id: string;
  amenity_id: string;
  is_available: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type GymCategory = {
  id: string;
  gym_id: string;
  category_id: string;
};

export type Review = {
  id: string;
  gym_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  status: 'published' | 'pending' | 'rejected';
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'gym_owner' | 'admin';
  avatar_url?: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  gym_id: string;
  user_id: string;
  rating: number;
  review: string;
  amenities_confirmed: Record<string, boolean>;
  amenities_missing: string[];
  is_accurate: boolean;
  inaccuracy_details?: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

// Helper functions for database operations
export const supabaseApi = {
  // Gym operations
  gyms: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('gyms')
        .select('*');
      
      if (error) throw error;
      return data as Gym[];
    },
    
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Gym;
    },
    
    getByLocation: async (location: string, radius: number = 5000) => {
      // In a real implementation, this would use PostGIS or similar for geospatial queries
      // For now, we'll just filter by location string
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .ilike('location', `%${location}%`);
      
      if (error) throw error;
      return data as Gym[];
    },
    
    create: async (gym: Omit<Gym, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('gyms')
        .insert([{
          ...gym,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0] as Gym;
    },
    
    update: async (id: string, updates: Partial<Gym>) => {
      const { data, error } = await supabase
        .from('gyms')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Gym;
    },
    
    delete: async (id: string) => {
      const { error } = await supabase
        .from('gyms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    
    getAmenities: async (gymId: string) => {
      const { data, error } = await supabase
        .from('gym_amenities')
        .select(`
          *,
          amenities (*)
        `)
        .eq('gym_id', gymId);
      
      if (error) throw error;
      return data;
    },
    
    getCategories: async (gymId: string) => {
      const { data, error } = await supabase
        .from('gym_categories')
        .select(`
          *,
          categories (*)
        `)
        .eq('gym_id', gymId);
      
      if (error) throw error;
      return data;
    },
    
    getReviews: async (gymId: string) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (id, name, avatar_url)
        `)
        .eq('gym_id', gymId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  },
  
  // Amenity operations
  amenities: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*');
      
      if (error) throw error;
      return data as Amenity[];
    }
  },
  
  // Category operations
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data as Category[];
    }
  },
  
  // Review operations
  reviews: {
    create: async (review: Omit<Review, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...review,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0] as Review;
    },
    
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          gyms (id, name, location)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    updateStatus: async (id: string, status: 'published' | 'pending' | 'rejected') => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Review;
    }
  },
  
  // Feedback operations
  feedback: {
    create: async (feedback: Omit<Feedback, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          ...feedback,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0] as Feedback;
    },
    
    getAll: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          gyms (id, name, location),
          users (id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  },
  
  // Message operations
  messages: {
    send: async (message: Omit<Message, 'id' | 'created_at' | 'is_read'>) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          ...message,
          is_read: false,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0] as Message;
    },
    
    getByUser: async (userId: string) => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, name, avatar_url)
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    markAsRead: async (id: string) => {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Message;
    }
  },
  
  // User operations
  users: {
    getCurrent: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as User;
    },
    
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as User;
    },
    
    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      return data as User[];
    },
    
    update: async (id: string, updates: Partial<User>) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as User;
    }
  },
  
  // Authentication operations
  auth: {
    signUp: async (email: string, password: string, name: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      // Create user record in users table
      if (data.user) {
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            name,
            role: 'user',
            created_at: new Date().toISOString()
          }]);
      }
      
      return data;
    },
    
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    },
    
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    },
    
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    }
  },
  
  // Storage operations
  storage: {
    uploadGymImage: async (gymId: string, file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${gymId}/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('gym-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('gym-images')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    },
    
    uploadAvatar: async (userId: string, file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    }
  }
};
