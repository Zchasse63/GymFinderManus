'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, User, MapPin } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="nav-container">
      <div className="nav-inner">
        {/* Logo */}
        <div className="nav-logo">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">GymFinder</span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <div className="search-container">
            <MapPin className="search-icon h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search for gyms in your area..." 
              className="search-input"
            />
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="nav-links">
          <Link href="/explore" className="nav-link">
            Explore
          </Link>
          <Link href="/favorites" className="nav-link">
            Favorites
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <button className="btn btn-primary ml-4">
            List Your Gym
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* User Menu */}
        <div className="hidden md:flex items-center ml-4">
          <button className="flex items-center space-x-2 p-2 rounded-full border border-border hover:bg-muted">
            <Menu className="h-4 w-4" />
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Search - Shown below header on mobile */}
      <div className="md:hidden px-4 pb-4">
        <div className="search-container">
          <MapPin className="search-icon h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search for gyms in your area..." 
            className="search-input"
          />
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 border-t border-border bg-background">
          <nav className="flex flex-col space-y-3">
            <Link href="/explore" className="nav-link py-2">
              Explore
            </Link>
            <Link href="/favorites" className="nav-link py-2">
              Favorites
            </Link>
            <Link href="/about" className="nav-link py-2">
              About
            </Link>
            <button className="btn btn-primary w-full mt-2">
              List Your Gym
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
