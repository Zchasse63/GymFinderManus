'use client';

import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface CategoryProps {
  categories: {
    id: string;
    name: string;
    icon: React.ReactNode;
  }[];
  filters: {
    id: string;
    name: string;
    options: FilterOption[];
  }[];
}

export default function CategoryFilter({ categories, filters }: CategoryProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);
  
  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };
  
  const toggleFilter = (filterId: string, optionId: string) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      
      return {
        ...prev,
        [filterId]: updated
      };
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
        {categories.map((category) => (
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
        <button className="filter-button">
          <Filter className="filter-icon" />
          <span>Filters{getActiveFilterCount() > 0 ? ` (${getActiveFilterCount()})` : ''}</span>
        </button>
        
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <button 
              className={`filter-button ${activeFilters[filter.id]?.length ? 'border-primary text-primary' : ''}`}
              onClick={() => toggleFilterMenu(filter.id)}
            >
              <span>{filter.name}</span>
              <ChevronDown className="filter-icon ml-1" />
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
        
        <button className="filter-button ml-auto">
          <span>Display price</span>
        </button>
      </div>
    </div>
  );
}
