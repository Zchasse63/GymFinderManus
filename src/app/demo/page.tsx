'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/search/SearchBar';
import CategorySelector from '@/components/filters/CategorySelector';
import EnhancedGymCard from '@/components/gym/EnhancedGymCard';
import MapToggle from '@/components/map/MapToggle';
import MapView from '@/components/map/MapView';
import FeedbackModal from '@/components/feedback/FeedbackModal';

// Mock data for demonstration
const mockGyms = [
  {
    id: 'gym1',
    name: 'FitLife 24/7',
    location: 'Tampa, FL',
    distance: '0.5 miles away',
    coordinates: [-82.4572, 27.9506],
    rating: 4.8,
    reviewCount: 128,
    price: 'From $25/day',
    hours: 'Open 24 hours',
    imageSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    amenities: [
      { id: '24hour', name: '24-Hour' },
      { id: 'towel', name: 'Towels' },
      { id: 'sauna', name: 'Sauna' },
      { id: 'wifi', name: 'WiFi' }
    ],
    isFeatured: true
  },
  {
    id: 'gym2',
    name: 'CrossFit Tampa Bay',
    location: 'Tampa, FL',
    distance: '1.2 miles away',
    coordinates: [-82.4652, 27.9606],
    rating: 4.6,
    reviewCount: 95,
    price: 'From $30/day',
    hours: '6AM - 10PM',
    imageSrc: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    amenities: [
      { id: 'functional', name: 'Functional' },
      { id: 'personaltraining', name: 'Training' },
      { id: 'wifi', name: 'WiFi' }
    ]
  },
  {
    id: 'gym3',
    name: 'Zen Yoga Studio',
    location: 'Tampa, FL',
    distance: '0.8 miles away',
    coordinates: [-82.4502, 27.9486],
    rating: 4.9,
    reviewCount: 210,
    price: 'From $20/day',
    hours: '7AM - 9PM',
    imageSrc: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHlvZ2ElMjBzdHVkaW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    amenities: [
      { id: 'towel', name: 'Towels' },
      { id: 'wifi', name: 'WiFi' },
      { id: 'groupclasses', name: 'Classes' }
    ]
  },
  {
    id: 'gym4',
    name: 'Elite Fitness Center',
    location: 'Tampa, FL',
    distance: '1.5 miles away',
    coordinates: [-82.4702, 27.9556],
    rating: 4.7,
    reviewCount: 156,
    price: 'From $35/day',
    hours: '5AM - 11PM',
    imageSrc: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    amenities: [
      { id: 'sauna', name: 'Sauna' },
      { id: 'hottub', name: 'Hot Tub' },
      { id: 'coldplunge', name: 'Cold Plunge' },
      { id: 'cafe', name: 'Cafe' }
    ],
    isFeatured: true
  },
  {
    id: 'gym5',
    name: 'Recovery Zone',
    location: 'Tampa, FL',
    distance: '2.0 miles away',
    coordinates: [-82.4802, 27.9656],
    rating: 4.5,
    reviewCount: 78,
    price: 'From $40/day',
    hours: '8AM - 8PM',
    imageSrc: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlY292ZXJ5JTIwZ3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    amenities: [
      { id: 'massage', name: 'Massage' },
      { id: 'coldplunge', name: 'Cold Plunge' },
      { id: 'sauna', name: 'Sauna' }
    ]
  },
  {
    id: 'gym6',
    name: 'Local Strength Co.',
    location: 'Tampa, FL',
    distance: '0.7 miles away',
    coordinates: [-82.4592, 27.9526],
    rating: 4.4,
    reviewCount: 62,
    price: 'From $22/day',
    hours: '6AM - 10PM',
    imageSrc: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    amenities: [
      { id: 'freeweights', name: 'Free Weights' },
      { id: 'personaltraining', name: 'Training' },
      { id: 'wifi', name: 'WiFi' }
    ]
  }
];

export default function DemoPage() {
  const [isMapView, setIsMapView] = useState(false);
  const [filteredGyms, setFilteredGyms] = useState(mockGyms);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchLocation, setSearchLocation] = useState('Tampa, FL');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<{id: string, name: string} | null>(null);
  
  // Handle search
  const handleSearch = (location: string) => {
    setSearchLocation(location);
    // In a real app, this would trigger an API call to fetch gyms in the new location
    console.log(`Searching for gyms in ${location}`);
  };
  
  // Handle category change
  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    
    // Filter gyms based on category
    if (!categoryId) {
      setFilteredGyms(mockGyms);
    } else {
      // In a real app, this would be more sophisticated
      // For now, we'll just simulate filtering
      const filtered = mockGyms.filter((gym, index) => {
        // Map gym index to categories for demo purposes
        const categories = ['corporate', 'local', 'crossfit', 'recovery', 'studio', 'yoga'];
        return index % categories.length === categories.indexOf(categoryId) % categories.length;
      });
      
      setFilteredGyms(filtered);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    
    // Filter gyms based on filters
    if (Object.keys(filters).length === 0) {
      // If no filters, just apply category filter
      handleCategoryChange(activeCategory);
    } else {
      // In a real app, this would be more sophisticated
      // For now, we'll just simulate filtering
      let filtered = activeCategory ? 
        mockGyms.filter((gym, index) => {
          const categories = ['corporate', 'local', 'crossfit', 'recovery', 'studio', 'yoga'];
          return index % categories.length === categories.indexOf(activeCategory) % categories.length;
        }) : 
        [...mockGyms];
      
      // Apply amenity filters
      if (filters.amenities?.length) {
        filtered = filtered.filter(gym => 
          gym.amenities.some(amenity => 
            filters.amenities.includes(amenity.id)
          )
        );
      }
      
      setFilteredGyms(filtered);
    }
  };
  
  // Handle gym selection
  const handleGymSelect = (gymId: string) => {
    const gym = mockGyms.find(g => g.id === gymId);
    if (gym) {
      setSelectedGym({id: gym.id, name: gym.name});
      setFeedbackModalOpen(true);
    }
  };
  
  // Toggle map view
  const toggleMapView = () => {
    setIsMapView(!isMapView);
  };
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container py-4">
        {/* Search and Filters */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <CategorySelector 
          onCategoryChange={handleCategoryChange}
          onFilterChange={handleFilterChange}
        />
        
        {/* Main Content */}
        {isMapView ? (
          <div className="h-[calc(100vh-200px)] mt-4">
            <MapView 
              gyms={filteredGyms} 
              onGymSelect={handleGymSelect} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredGyms.map(gym => (
              <div key={gym.id} onClick={() => handleGymSelect(gym.id)} className="cursor-pointer">
                <EnhancedGymCard
                  id={gym.id}
                  name={gym.name}
                  location={gym.location}
                  distance={gym.distance}
                  rating={gym.rating}
                  reviewCount={gym.reviewCount}
                  price={gym.price}
                  hours={gym.hours}
                  imageSrc={gym.imageSrc}
                  amenities={gym.amenities}
                  isFeatured={gym.isFeatured}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Map Toggle Button */}
        <MapToggle 
          isMapView={isMapView} 
          toggleMapView={toggleMapView} 
        />
      </div>
      
      {/* Feedback Modal */}
      {selectedGym && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          gymId={selectedGym.id}
          gymName={selectedGym.name}
          gymEmail="contact@example.com"
        />
      )}
      
      {/* Demo Navigation */}
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <a 
          href="/demo/admin" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Admin Dashboard
        </a>
        <a 
          href="/demo/owner" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Gym Owner Dashboard
        </a>
      </div>
    </main>
  );
}
