'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, Send } from 'lucide-react';

interface FeedbackFormProps {
  gymId: string;
  gymName: string;
  onSubmit: (feedback: FeedbackData) => void;
  onCancel: () => void;
}

interface FeedbackData {
  gymId: string;
  rating: number;
  review: string;
  amenitiesConfirmed: Record<string, boolean>;
  amenitiesMissing: string[];
  isAccurate: boolean;
  inaccuracyDetails?: string;
}

export default function FeedbackForm({
  gymId,
  gymName,
  onSubmit,
  onCancel
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isAccurate, setIsAccurate] = useState<boolean | null>(null);
  const [inaccuracyDetails, setInaccuracyDetails] = useState('');
  const [amenitiesConfirmed, setAmenitiesConfirmed] = useState<Record<string, boolean>>({});
  const [newAmenity, setNewAmenity] = useState('');
  const [amenitiesMissing, setAmenitiesMissing] = useState<string[]>([]);
  
  // Sample amenities - in a real app, these would be passed in as props
  const amenities = [
    { id: '24hour', name: '24-Hour Access' },
    { id: 'towel', name: 'Towel Service' },
    { id: 'sauna', name: 'Sauna' },
    { id: 'hottub', name: 'Hot Tub' },
    { id: 'coldplunge', name: 'Cold Plunge' },
    { id: 'wifi', name: 'WiFi' }
  ];
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const toggleAmenityConfirmation = (amenityId: string) => {
    setAmenitiesConfirmed(prev => ({
      ...prev,
      [amenityId]: !prev[amenityId]
    }));
  };
  
  const addMissingAmenity = () => {
    if (newAmenity.trim()) {
      setAmenitiesMissing([...amenitiesMissing, newAmenity.trim()]);
      setNewAmenity('');
    }
  };
  
  const removeMissingAmenity = (index: number) => {
    setAmenitiesMissing(amenitiesMissing.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const feedbackData: FeedbackData = {
      gymId,
      rating,
      review,
      amenitiesConfirmed,
      amenitiesMissing,
      isAccurate: isAccurate === null ? true : isAccurate,
      inaccuracyDetails: isAccurate === false ? inaccuracyDetails : undefined
    };
    
    onSubmit(feedbackData);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Feedback for {gymName}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
              >
                <Star 
                  className={`h-8 w-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Review */}
        <div className="mb-6">
          <label htmlFor="review" className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            id="review"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Share your experience at this gym..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>
        
        {/* Information Accuracy */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Is the information accurate?</label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                isAccurate === true ? 'bg-green-100 text-green-800' : 'bg-gray-100'
              }`}
              onClick={() => setIsAccurate(true)}
            >
              <ThumbsUp className="h-5 w-5" />
              <span>Yes, it's accurate</span>
            </button>
            
            <button
              type="button"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                isAccurate === false ? 'bg-red-100 text-red-800' : 'bg-gray-100'
              }`}
              onClick={() => setIsAccurate(false)}
            >
              <ThumbsDown className="h-5 w-5" />
              <span>No, there are issues</span>
            </button>
          </div>
          
          {isAccurate === false && (
            <div className="mt-4">
              <label htmlFor="inaccuracy" className="block text-sm font-medium mb-2">Please explain the inaccuracies</label>
              <textarea
                id="inaccuracy"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What information is incorrect or missing?"
                value={inaccuracyDetails}
                onChange={(e) => setInaccuracyDetails(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>
        
        {/* Amenities Confirmation */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Confirm Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={amenitiesConfirmed[amenity.id] || false}
                  onChange={() => toggleAmenityConfirmation(amenity.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>{amenity.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Missing Amenities */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Add Missing Amenities</label>
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter an amenity not listed..."
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
            />
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              onClick={addMissingAmenity}
            >
              Add
            </button>
          </div>
          
          {amenitiesMissing.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {amenitiesMissing.map((amenity, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm">{amenity}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => removeMissingAmenity(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Report Button */}
        <div className="mb-6">
          <button
            type="button"
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <Flag className="h-4 w-4 mr-2" />
            <span>Report this gym</span>
          </button>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}
