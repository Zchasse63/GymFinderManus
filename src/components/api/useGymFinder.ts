'use client';

import { useEffect, useState } from 'react';
import usePlacesAPI from '@/components/api/usePlacesAPI';
import useMapboxAPI from '@/components/api/useMapboxAPI';

interface GymData {
  id: string;
  placeId?: string;
  name: string;
  location: string;
  distance: string;
  coordinates: [number, number]; // [longitude, latitude]
  rating: number;
  reviewCount: number;
  price?: string;
  hours: string;
  imageSrc: string;
  amenities: {
    id: string;
    name: string;
  }[];
  isFeatured?: boolean;
}

export default function useGymFinder() {
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState('Tampa, FL');
  
  const placesAPI = usePlacesAPI();
  const mapboxAPI = useMapboxAPI();
  
  // Search for gyms in a location
  const searchGyms = async (location: string, filters?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    setCurrentLocation(location);
    
    try {
      // Search for gyms using Places API
      await placesAPI.searchGyms({
        location,
        radius: filters?.radius || 5000,
        keyword: filters?.keyword || 'gym fitness',
        onResults: (results) => {
          // Transform Places API results to our GymData format
          const transformedGyms = results.map((place: any) => {
            // Extract place details
            const { 
              place_id, 
              name, 
              vicinity, 
              geometry, 
              rating = 0, 
              user_ratings_total = 0,
              photos,
              opening_hours
            } = place;
            
            // Calculate distance (would be more accurate with user's precise location)
            const distance = '1.2 miles away'; // Placeholder
            
            // Get coordinates in the format Mapbox expects [lng, lat]
            const coordinates: [number, number] = [
              geometry.location.lng(),
              geometry.location.lat()
            ];
            
            // Get photo URL if available
            const imageSrc = photos && photos.length > 0
              ? photos[0].getUrl({ maxWidth: 500, maxHeight: 500 })
              : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60';
            
            // Get hours if available
            const hours = opening_hours?.isOpen() 
              ? 'Open now' 
              : 'Closed';
            
            // Create gym data object
            return {
              id: place_id,
              placeId: place_id,
              name,
              location: vicinity,
              distance,
              coordinates,
              rating,
              reviewCount: user_ratings_total,
              hours,
              imageSrc,
              // We'll need to fetch detailed information to get these
              amenities: [
                { id: 'gym', name: 'Gym' }
              ],
              isFeatured: rating >= 4.5 // Mark high-rated gyms as featured
            };
          });
          
          setGyms(transformedGyms);
          setLoading(false);
        },
        onError: (errorMsg) => {
          setError(errorMsg);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(`Error searching for gyms: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };
  
  // Get detailed information about a specific gym
  const getGymDetails = async (placeId: string) => {
    try {
      const details = await placesAPI.getGymDetails(placeId);
      
      // Transform the details to our format
      // This would include extracting amenities from the place details
      // For now, we'll return a placeholder
      
      return details;
    } catch (err) {
      throw new Error(`Error getting gym details: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  // Filter gyms based on category and amenities
  const filterGyms = (
    category: string | null, 
    filters: Record<string, string[]>
  ) => {
    // This would be more sophisticated in a real app
    // For now, we'll just return the gyms we have
    
    return gyms;
  };
  
  // Show gyms on map
  const showGymsOnMap = (container: HTMLElement, gymsToShow: GymData[]) => {
    const map = mapboxAPI.initializeMap(container);
    
    // Add markers for each gym
    mapboxAPI.addMarkers(
      gymsToShow.map(gym => ({
        id: gym.id,
        coordinates: gym.coordinates,
        popupContent: `
          <div class="p-2">
            <h3 class="font-medium">${gym.name}</h3>
            <p class="text-sm">${gym.location}</p>
            <div class="flex items-center mt-1">
              <span class="text-xs font-medium bg-yellow-400 text-white px-1 rounded">
                ${gym.rating}
              </span>
              <span class="text-xs ml-1">★</span>
              <span class="text-xs ml-1">(${gym.reviewCount})</span>
            </div>
          </div>
        `
      })),
      (gymId) => {
        // Handle marker click
        console.log(`Gym selected: ${gymId}`);
        // This would typically open a preview or navigate to the gym details page
      }
    );
    
    return map;
  };
  
  // Get directions to a gym
  const getDirectionsToGym = async (
    userLocation: [number, number],
    gymId: string,
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ) => {
    const gym = gyms.find(g => g.id === gymId);
    
    if (!gym) {
      throw new Error('Gym not found');
    }
    
    const route = await mapboxAPI.getDirections(
      userLocation,
      gym.coordinates,
      mode
    );
    
    return route;
  };
  
  // Draw directions on map
  const showDirectionsOnMap = (route: any) => {
    if (!mapboxAPI.mapInstance) {
      throw new Error('Map not initialized');
    }
    
    mapboxAPI.drawRoute(route);
  };
  
  return {
    gyms,
    loading,
    error,
    currentLocation,
    searchGyms,
    getGymDetails,
    filterGyms,
    showGymsOnMap,
    getDirectionsToGym,
    showDirectionsOnMap
  };
}
