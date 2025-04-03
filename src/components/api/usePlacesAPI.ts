'use client';

import { useState, useEffect } from 'react';

// Google Places API key
const PLACES_API_KEY = 'AIzaSyD-tj15E8SDAQ8vNgoDVjsgkSgfOKpUABw';
// Geocoding API key
const GEOCODING_API_KEY = 'Kynq3-Mszx0hkcIVzpYPnCrxIOo=';

interface PlacesServiceProps {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
  onResults: (results: any[]) => void;
  onError: (error: string) => void;
}

export default function usePlacesAPI() {
  // Load Google Maps JavaScript API
  const loadGoogleMapsAPI = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps JavaScript API'));
      };
      
      document.head.appendChild(script);
    });
  };

  // Search for gyms using Places API
  const searchGyms = async (params: PlacesServiceProps) => {
    try {
      await loadGoogleMapsAPI();
      
      // Create a dummy div for PlacesService (required by the API)
      const dummyElement = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(dummyElement);
      
      // Convert location string to coordinates using Geocoding API
      const coordinates = await geocodeLocation(params.location);
      
      if (!coordinates) {
        params.onError('Could not geocode location');
        return;
      }
      
      const request = {
        location: new window.google.maps.LatLng(coordinates.lat, coordinates.lng),
        radius: params.radius || 5000, // Default 5km radius
        type: params.type || 'gym',
        keyword: params.keyword || 'fitness'
      };
      
      service.nearbySearch(request, (results: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          params.onResults(results);
        } else {
          params.onError(`Places API error: ${status}`);
        }
      });
    } catch (error) {
      params.onError(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Get detailed information about a specific gym
  const getGymDetails = async (placeId: string) => {
    try {
      await loadGoogleMapsAPI();
      
      // Create a dummy div for PlacesService
      const dummyElement = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(dummyElement);
      
      return new Promise((resolve, reject) => {
        service.getDetails(
          { placeId, fields: ['name', 'formatted_address', 'geometry', 'rating', 'photos', 'opening_hours', 'website', 'formatted_phone_number', 'reviews', 'price_level'] },
          (result: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(result);
            } else {
              reject(`Places API error: ${status}`);
            }
          }
        );
      });
    } catch (error) {
      throw new Error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Geocode a location string to coordinates
  const geocodeLocation = async (location: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${PLACES_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };
  
  return {
    searchGyms,
    getGymDetails,
    geocodeLocation
  };
}
