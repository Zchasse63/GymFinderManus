'use client';

import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox API token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemNoYXNzZTg5IiwiYSI6ImNtOHhocTAyYzAzcHcya29rNHE5cjc1OXIifQ.jvCmzRpBw3F2Jzm9EoRBjg';

interface UseMapboxProps {
  initialCenter?: [number, number]; // [longitude, latitude]
  initialZoom?: number;
}

export default function useMapboxAPI({ 
  initialCenter = [-82.4572, 27.9506], // Default to Tampa, FL
  initialZoom = 12 
}: UseMapboxProps = {}) {
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  
  // Initialize Mapbox
  const initializeMap = (container: HTMLElement) => {
    if (mapInstance) return mapInstance;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: initialZoom
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    setMapInstance(map);
    return map;
  };
  
  // Clean up map and markers
  const cleanupMap = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
    
    if (mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
    }
  };
  
  // Add markers to the map
  const addMarkers = (
    locations: Array<{
      id: string;
      coordinates: [number, number]; // [longitude, latitude]
      popupContent?: string;
      element?: HTMLElement;
    }>,
    onClick?: (id: string) => void
  ) => {
    if (!mapInstance) return;
    
    // Remove existing markers
    markers.forEach(marker => marker.remove());
    
    // Add new markers
    const newMarkers = locations.map(location => {
      // Create marker element
      const el = location.element || document.createElement('div');
      if (!location.element) {
        el.className = 'map-marker';
        el.innerHTML = `<div class="w-6 h-6 flex items-center justify-center"></div>`;
      }
      
      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .addTo(mapInstance);
      
      // Add popup if content provided
      if (location.popupContent) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(location.popupContent);
        
        marker.setPopup(popup);
      }
      
      // Add click event if callback provided
      if (onClick) {
        el.addEventListener('click', () => {
          onClick(location.id);
        });
      }
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Fit map to show all markers if there are any
    if (newMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      locations.forEach(location => {
        bounds.extend(location.coordinates);
      });
      
      mapInstance.fitBounds(bounds, {
        padding: 50
      });
    }
    
    return newMarkers;
  };
  
  // Fly to a specific location
  const flyTo = (coordinates: [number, number], zoom: number = 14) => {
    if (!mapInstance) return;
    
    mapInstance.flyTo({
      center: coordinates,
      zoom,
      essential: true
    });
  };
  
  // Get directions between two points
  const getDirections = async (
    start: [number, number],
    end: [number, number],
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        return data.routes[0];
      }
      
      return null;
    } catch (error) {
      console.error('Directions error:', error);
      return null;
    }
  };
  
  // Draw a route on the map
  const drawRoute = (route: any) => {
    if (!mapInstance || !route) return;
    
    // Remove existing route if it exists
    if (mapInstance.getSource('route')) {
      mapInstance.removeLayer('route');
      mapInstance.removeSource('route');
    }
    
    mapInstance.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route.geometry
      }
    });
    
    mapInstance.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#8B5CF6', // Vibrant purple
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  };
  
  return {
    initializeMap,
    cleanupMap,
    addMarkers,
    flyTo,
    getDirections,
    drawRoute,
    mapInstance
  };
}
