'use client';

import { useState } from 'react';
import { Star, MapPin, Clock, Dumbbell, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface GymCardProps {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  features: string[];
  price?: string;
  imageSrc: string;
  isFeatured?: boolean;
}

export default function GymCard({
  id,
  name,
  location,
  distance,
  rating,
  reviewCount,
  features,
  price,
  imageSrc,
  isFeatured = false
}: GymCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <div className="gym-card">
      <div className="gym-image-container">
        <Link href={`/gym/${id}`}>
          <Image 
            src={imageSrc} 
            alt={name}
            fill
            className="gym-image"
          />
        </Link>
        
        <button 
          className="gym-favorite"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
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
        
        <div className="gym-features">
          {features.map((feature, index) => (
            <span key={index} className="gym-feature">
              {feature}
            </span>
          ))}
        </div>
        
        {price && (
          <div className="gym-price">
            {price}
          </div>
        )}
      </div>
    </div>
  );
}
