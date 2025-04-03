'use client';

import { useState } from 'react';
import { Map, MapPin, List } from 'lucide-react';

interface MapToggleProps {
  isMapView: boolean;
  toggleMapView: () => void;
}

export default function MapToggle({ isMapView, toggleMapView }: MapToggleProps) {
  return (
    <button 
      className="map-toggle"
      onClick={toggleMapView}
      aria-label={isMapView ? "Show list" : "Show map"}
    >
      <div className="flex items-center space-x-2">
        {isMapView ? (
          <>
            <List className="h-4 w-4" />
            <span>Show list</span>
          </>
        ) : (
          <>
            <Map className="h-4 w-4" />
            <span>Show map</span>
          </>
        )}
      </div>
    </button>
  );
}
