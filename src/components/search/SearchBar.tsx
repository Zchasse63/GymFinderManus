'use client';

import { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };
  
  const clearSearch = () => {
    setSearchValue('');
    setIsExpanded(false);
  };
  
  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <MapPin className="search-icon h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search for gyms in your area..." 
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsExpanded(true)}
          />
          {searchValue && (
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-md z-10">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Recent Searches</div>
              <div className="space-y-1">
                {['Tampa, Florida', 'Miami Beach, FL', 'Orlando, FL'].map((location, index) => (
                  <button
                    key={index}
                    className="flex items-center w-full p-2 text-sm hover:bg-muted rounded-md"
                    onClick={() => {
                      setSearchValue(location);
                      onSearch(location);
                      setIsExpanded(false);
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
