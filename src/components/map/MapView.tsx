'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// This would normally be in an environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemNoYXNzZTg5IiwiYSI6ImNtOHhocTAyYzAzcHcya29rNHE5cjc1OXIifQ.jvCmzRpBw3F2Jzm9EoRBjg';

interface MapViewProps {
  gyms: {
    id: string;
    name: string;
    location: string;
    coordinates: [number, number]; // [longitude, latitude]
    rating: number;
    imageSrc: string;
  }[];
  onGymSelect: (gymId: string) => void;
}

export default function MapView({ gyms, onGymSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeGymId, setActiveGymId] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ top: number; left: number } | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-77.0369, 38.9072], // Default to Washington DC
      zoom: 12
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Add markers for gyms
  useEffect(() => {
    if (!map.current || !gyms.length) return;
    
    // Wait for map to load
    map.current.on('load', () => {
      // Fit map to show all gyms
      const bounds = new mapboxgl.LngLatBounds();
      
      gyms.forEach(gym => {
        bounds.extend(gym.coordinates);
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'map-marker';
        el.innerHTML = `<div class="w-6 h-6 flex items-center justify-center">${gym.rating}</div>`;
        
        // Add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat(gym.coordinates)
          .addTo(map.current!);
        
        // Add click event to marker
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveGymId(gym.id);
          
          // Calculate position for preview
          const markerPosition = marker.getLngLat();
          const point = map.current!.project(markerPosition);
          
          setPreviewPosition({
            top: point.y - 150, // Position above marker
            left: point.x - 128 // Center horizontally (preview width is 256px)
          });
        });
      });
      
      map.current!.fitBounds(bounds, {
        padding: 50
      });
    });
  }, [gyms]);
  
  // Handle clicking away from preview
  useEffect(() => {
    const handleClickAway = () => {
      setActiveGymId(null);
      setPreviewPosition(null);
    };
    
    if (map.current && activeGymId) {
      map.current.on('click', handleClickAway);
    }
    
    return () => {
      if (map.current) {
        map.current.off('click', handleClickAway);
      }
    };
  }, [activeGymId]);
  
  // Get active gym data
  const activeGym = activeGymId ? gyms.find(gym => gym.id === activeGymId) : null;
  
  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="map-container" />
      
      {/* Gym preview */}
      {activeGym && previewPosition && (
        <div 
          className="map-preview"
          style={{
            top: `${previewPosition.top}px`,
            left: `${previewPosition.left}px`
          }}
          onClick={(e) => {
            e.stopPropagation();
            onGymSelect(activeGym.id);
          }}
        >
          <div className="flex space-x-2">
            <div className="w-16 h-16 rounded overflow-hidden">
              <img 
                src={activeGym.imageSrc} 
                alt={activeGym.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{activeGym.name}</h3>
              <p className="text-xs text-muted-foreground">{activeGym.location}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium bg-yellow-400 text-white px-1 rounded">
                  {activeGym.rating}
                </span>
                <span className="text-xs ml-1">★</span>
              </div>
              <button 
                className="text-xs text-primary mt-1 hover:underline"
                onClick={() => onGymSelect(activeGym.id)}
              >
                View details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
