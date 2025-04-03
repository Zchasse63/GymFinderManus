'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/search/SearchBar';
import CategorySelector from '@/components/filters/CategorySelector';
import EnhancedGymCard from '@/components/gym/EnhancedGymCard';
import MapToggle from '@/components/map/MapToggle';
import MapView from '@/components/map/MapView';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import useGymFinderWithSupabase from '@/lib/use-gym-finder-with-supabase';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const [isMapView, setIsMapView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<{id: string, name: string} | null>(null);
  
  const { 
    gyms, 
    categories, 
    amenities, 
    loading, 
    error, 
    currentLocation, 
    searchGyms, 
    filterGyms 
  } = useGymFinderWithSupabase();
  
  const { user } = useAuth();
  
  // Handle search
  const handleSearch = (location: string) => {
    searchGyms(location);
  };
  
  // Handle category change
  const handleCategoryChange = async (categoryId: string | null) => {
    setActiveCategory(categoryId);
    await filterGyms(categoryId, activeFilters);
  };
  
  // Handle filter change
  const handleFilterChange = async (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    await filterGyms(activeCategory, filters);
  };
  
  // Handle gym selection
  const handleGymSelect = (gymId: string) => {
    const gym = gyms.find(g => g.id === gymId);
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
          categories={categories}
          amenities={amenities}
          onCategoryChange={handleCategoryChange}
          onFilterChange={handleFilterChange}
        />
        
        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Main Content */}
        {!loading && !error && (
          <>
            {isMapView ? (
              <div className="h-[calc(100vh-200px)] mt-4">
                <MapView 
                  gyms={gyms} 
                  onGymSelect={handleGymSelect} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {gyms.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-700">No gyms found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  gyms.map(gym => (
                    <div key={gym.id} onClick={() => handleGymSelect(gym.id)} className="cursor-pointer">
                      <EnhancedGymCard
                        id={gym.id}
                        name={gym.name}
                        location={gym.location}
                        distance={`${(Math.random() * 3).toFixed(1)} miles away`} // Placeholder
                        rating={gym.rating || 0}
                        reviewCount={gym.review_count || 0}
                        price={gym.price_range || 'Price unavailable'}
                        hours={gym.hours || 'Hours unavailable'}
                        imageSrc={gym.images && gym.images.length > 0 
                          ? gym.images[0] 
                          : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
                        }
                        amenities={[]} // This would be populated from gym.amenities in a real implementation
                        isFeatured={Math.random() > 0.7} // Placeholder
                      />
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Map Toggle Button */}
            <MapToggle 
              isMapView={isMapView} 
              toggleMapView={toggleMapView} 
            />
          </>
        )}
      </div>
      
      {/* Feedback Modal */}
      {selectedGym && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          gymId={selectedGym.id}
          gymName={selectedGym.name}
          gymEmail="contact@example.com" // This would come from the gym data in a real implementation
        />
      )}
      
      {/* Auth Status */}
      <div className="fixed bottom-4 left-4 bg-white shadow-md rounded-md p-2 text-sm">
        {user ? (
          <span>Logged in as: {user.name} ({user.role})</span>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
      
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
