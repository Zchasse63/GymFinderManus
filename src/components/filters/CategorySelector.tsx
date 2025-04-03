'use client';

import { useState } from 'react';
import { 
  Building2, 
  Store, 
  Dumbbell, 
  Waves, 
  Yoga, 
  Sparkles, 
  Bed, 
  Users, 
  Bike
} from 'lucide-react';

// Define gym category icons and labels
const gymCategories = [
  { id: 'corporate', name: 'Corporate', icon: <Building2 className="h-6 w-6" /> },
  { id: 'local', name: 'Local', icon: <Store className="h-6 w-6" /> },
  { id: 'crossfit', name: 'CrossFit', icon: <Dumbbell className="h-6 w-6" /> },
  { id: 'recovery', name: 'Recovery', icon: <Waves className="h-6 w-6" /> },
  { id: 'studio', name: 'Studio', icon: <Sparkles className="h-6 w-6" /> },
  { id: 'yoga', name: 'Yoga', icon: <Yoga className="h-6 w-6" /> },
  { id: 'pilates', name: 'Pilates', icon: <Bed className="h-6 w-6" /> },
  { id: 'group', name: 'Group', icon: <Users className="h-6 w-6" /> },
  { id: 'cycling', name: 'Cycling', icon: <Bike className="h-6 w-6" /> },
];

// Define filter options
const filterOptions = [
  { 
    id: 'amenities', 
    name: 'Amenities', 
    options: [
      { id: '24hour', label: '24-Hour Access' },
      { id: 'towel', label: 'Towel Service' },
      { id: 'sauna', label: 'Sauna' },
      { id: 'hottub', label: 'Hot Tub' },
      { id: 'coldplunge', label: 'Cold Plunge' },
      { id: 'cafe', label: 'Cafe' },
      { id: 'wifi', label: 'WiFi' },
      { id: 'coworking', label: 'Co-Working Space' },
    ] 
  },
  { 
    id: 'equipment', 
    name: 'Equipment', 
    options: [
      { id: 'freeweights', label: 'Free Weights' },
      { id: 'machines', label: 'Machines' },
      { id: 'cardio', label: 'Cardio Equipment' },
      { id: 'functional', label: 'Functional Training' },
      { id: 'olympic', label: 'Olympic Lifting' },
    ] 
  },
  { 
    id: 'services', 
    name: 'Services', 
    options: [
      { id: 'personaltraining', label: 'Personal Training' },
      { id: 'groupclasses', label: 'Group Classes' },
      { id: 'massage', label: 'Massage' },
      { id: 'childcare', label: 'Childcare' },
      { id: 'nutrition', label: 'Nutrition Coaching' },
    ] 
  },
  { 
    id: 'price', 
    name: 'Price', 
    options: [
      { id: 'budget', label: '$' },
      { id: 'moderate', label: '$$' },
      { id: 'premium', label: '$$$' },
      { id: 'luxury', label: '$$$$' },
    ] 
  },
];

interface CategorySelectorProps {
  onCategoryChange: (categoryId: string | null) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export default function CategorySelector({ onCategoryChange, onFilterChange }: CategorySelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);
  
  const toggleCategory = (categoryId: string) => {
    const newCategory = activeCategory === categoryId ? null : categoryId;
    setActiveCategory(newCategory);
    onCategoryChange(newCategory);
  };
  
  const toggleFilter = (filterId: string, optionId: string) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      
      const newFilters = {
        ...prev,
        [filterId]: updated
      };
      
      // If array is empty, remove the key
      if (updated.length === 0) {
        delete newFilters[filterId];
      }
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const toggleFilterMenu = (filterId: string) => {
    setShowFilterMenu(showFilterMenu === filterId ? null : filterId);
  };
  
  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, options) => count + options.length, 0);
  };
  
  return (
    <div className="border-b border-border pb-4">
      {/* Categories */}
      <div className="category-container">
        {gymCategories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => toggleCategory(category.id)}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            <span className="category-label">{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Filters */}
      <div className="filter-container">
        {filterOptions.map((filter) => (
          <div key={filter.id} className="relative">
            <button 
              className={`filter-button ${activeFilters[filter.id]?.length ? 'border-primary text-primary' : ''}`}
              onClick={() => toggleFilterMenu(filter.id)}
            >
              <span>{filter.name}</span>
              {activeFilters[filter.id]?.length > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFilters[filter.id].length}
                </span>
              )}
            </button>
            
            {showFilterMenu === filter.id && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border z-10">
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">{filter.name}</div>
                  <div className="space-y-1">
                    {filter.options.map((option) => (
                      <label key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.id]?.includes(option.id) || false}
                          onChange={() => toggleFilter(filter.id, option.id)}
                          className="rounded border-input"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
