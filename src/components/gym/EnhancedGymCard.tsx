'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin, Star, Dumbbell, Droplet, Wifi } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface GymCardProps {
  id: string;
  name: string;
  location: string;
  distance: string;
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

export default function EnhancedGymCard({
  id,
  name,
  location,
  distance,
  rating,
  reviewCount,
  price,
  hours,
  imageSrc,
  amenities,
  isFeatured = false
}: GymCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // For demo purposes, we'll simulate multiple images
  const images = [imageSrc];
  
  // Get top 3 amenities to display
  const topAmenities = amenities.slice(0, 3);
  
  // Map amenity to icon
  const getAmenityIcon = (amenityId: string) => {
    switch (amenityId) {
      case '24hour':
        return <Clock className="gym-amenity-icon" />;
      case 'towel':
        return <Droplet className="gym-amenity-icon" />;
      case 'wifi':
        return <Wifi className="gym-amenity-icon" />;
      default:
        return <Dumbbell className="gym-amenity-icon" />;
    }
  };
  
  return (
    <div className="gym-card">
      <div className="gym-image-container">
        <Link href={`/gym/${id}`}>
          <img 
            src={images[currentImageIndex]} 
            alt={name}
            className="gym-image"
          />
        </Link>
        
        <button 
          className="gym-favorite"
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            className={`h-5 w-5 ${isFavorite ? 'text-primary' : 'text-white'}`}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        
        {isFeatured && (
          <div className="gym-badge">
            Featured
          </div>
        )}
      </div>
      
      <div className="gym-info">
        <div className="flex justify-between items-start">
          <h3 className="gym-name">{name}</h3>
          <div className="gym-rating">
            <Star className="gym-rating-star" />
            <span className="gym-rating-value">{rating}</span>
            <span className="gym-rating-count">({reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="gym-location">{location}</span>
          <span className="mx-1">•</span>
          <span>{distance}</span>
        </div>
        
        <div className="gym-hours">
          <Clock className="h-3 w-3 mr-1" />
          <span>{hours}</span>
        </div>
        
        {topAmenities.length > 0 && (
          <div className="gym-amenities">
            {topAmenities.map((amenity) => (
              <div key={amenity.id} className="gym-amenity">
                {getAmenityIcon(amenity.id)}
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {price && (
          <div className="gym-price">
            {price}
          </div>
        )}
      </div>
    </div>
  );
}
