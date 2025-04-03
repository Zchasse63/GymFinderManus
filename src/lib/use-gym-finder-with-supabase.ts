'use client';

import { useEffect, useState } from 'react';
import { supabaseApi, Gym, Category, Amenity } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export default function useGymFinderWithSupabase() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState('Tampa, FL');
  
  const { user } = useAuth();
  
  // Load categories and amenities on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, amenitiesData] = await Promise.all([
          supabaseApi.categories.getAll(),
          supabaseApi.amenities.getAll()
        ]);
        
        setCategories(categoriesData);
        setAmenities(amenitiesData);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(`Error loading initial data: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Search for gyms in a location
  const searchGyms = async (location: string, filters?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setCurrentLocation(location);
    
    try {
      const gymsData = await supabaseApi.gyms.getByLocation(location);
      setGyms(gymsData);
    } catch (err) {
      setError(`Error searching for gyms: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Get detailed information about a specific gym
  const getGymDetails = async (gymId: string) => {
    try {
      const [gymData, amenitiesData, categoriesData, reviewsData] = await Promise.all([
        supabaseApi.gyms.getById(gymId),
        supabaseApi.gyms.getAmenities(gymId),
        supabaseApi.gyms.getCategories(gymId),
        supabaseApi.gyms.getReviews(gymId)
      ]);
      
      return {
        ...gymData,
        amenities: amenitiesData,
        categories: categoriesData,
        reviews: reviewsData
      };
    } catch (err) {
      throw new Error(`Error getting gym details: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Filter gyms based on category and amenities
  const filterGyms = async (
    categoryId: string | null, 
    filters: Record<string, string[]>
  ) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would use Supabase filters
      // For now, we'll just filter the gyms we already have
      let filtered = [...gyms];
      
      // Apply category filter if specified
      if (categoryId) {
        filtered = filtered.filter(gym => {
          // This is a placeholder. In a real app, we would check if the gym has this category
          return Math.random() > 0.5; // Randomly filter for demo purposes
        });
      }
      
      // Apply amenity filters if specified
      if (filters.amenities?.length) {
        filtered = filtered.filter(gym => {
          // This is a placeholder. In a real app, we would check if the gym has these amenities
          return Math.random() > 0.3; // Randomly filter for demo purposes
        });
      }
      
      return filtered;
    } catch (err) {
      setError(`Error filtering gyms: ${err instanceof Error ? err.message : String(err)}`);
      return gyms;
    } finally {
      setLoading(false);
    }
  };
  
  // Submit feedback for a gym
  const submitFeedback = async (feedbackData: any) => {
    if (!user) {
      throw new Error('You must be logged in to submit feedback');
    }
    
    try {
      await supabaseApi.feedback.create({
        ...feedbackData,
        user_id: user.id
      });
      
      return true;
    } catch (err) {
      throw new Error(`Error submitting feedback: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Submit a review for a gym
  const submitReview = async (gymId: string, rating: number, content: string) => {
    if (!user) {
      throw new Error('You must be logged in to submit a review');
    }
    
    try {
      await supabaseApi.reviews.create({
        gym_id: gymId,
        user_id: user.id,
        rating,
        content,
        status: 'pending'
      });
      
      return true;
    } catch (err) {
      throw new Error(`Error submitting review: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Send verification email to gym
  const sendVerificationEmail = async (gymId: string, recipientEmail: string, message: string) => {
    if (!user) {
      throw new Error('You must be logged in to send verification emails');
    }
    
    try {
      // In a real implementation, this would send an email through a service
      // For now, we'll just create a message in the database
      await supabaseApi.messages.send({
        sender_id: user.id,
        recipient_id: user.id, // Placeholder, in a real app this would be the gym owner's ID
        subject: `Verification Request for Gym ID: ${gymId}`,
        content: message
      });
      
      return true;
    } catch (err) {
      throw new Error(`Error sending verification email: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // For gym owners: Get gyms owned by current user
  const getOwnedGyms = async () => {
    if (!user || user.role !== 'gym_owner') {
      throw new Error('You must be logged in as a gym owner to view owned gyms');
    }
    
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      return data as Gym[];
    } catch (err) {
      throw new Error(`Error getting owned gyms: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // For gym owners: Update gym information
  const updateGym = async (gymId: string, updates: Partial<Gym>) => {
    if (!user || (user.role !== 'gym_owner' && user.role !== 'admin')) {
      throw new Error('You must be logged in as a gym owner or admin to update gyms');
    }
    
    try {
      return await supabaseApi.gyms.update(gymId, updates);
    } catch (err) {
      throw new Error(`Error updating gym: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // For admins: Get all users
  const getAllUsers = async () => {
    if (!user || user.role !== 'admin') {
      throw new Error('You must be logged in as an admin to view all users');
    }
    
    try {
      return await supabaseApi.users.getAll();
    } catch (err) {
      throw new Error(`Error getting users: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // For admins: Update user role
  const updateUserRole = async (userId: string, role: 'user' | 'gym_owner' | 'admin') => {
    if (!user || user.role !== 'admin') {
      throw new Error('You must be logged in as an admin to update user roles');
    }
    
    try {
      return await supabaseApi.users.update(userId, { role });
    } catch (err) {
      throw new Error(`Error updating user role: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  return {
    gyms,
    categories,
    amenities,
    loading,
    error,
    currentLocation,
    searchGyms,
    getGymDetails,
    filterGyms,
    submitFeedback,
    submitReview,
    sendVerificationEmail,
    getOwnedGyms,
    updateGym,
    getAllUsers,
    updateUserRole
  };
}
