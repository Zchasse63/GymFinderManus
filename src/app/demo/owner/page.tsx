'use client';

import { useState } from 'react';
import GymOwnerDashboard from '@/components/admin/GymOwnerDashboard';

export default function OwnerDemoPage() {
  // Mock user data
  const user = {
    name: 'Gym Owner',
    email: 'owner@fitlife247.com',
    role: 'Gym Owner',
    avatar: 'https://ui-avatars.com/api/?name=Gym+Owner&background=8B5CF6&color=fff'
  };
  
  // Mock gym data
  const gym = {
    id: 'gym1',
    name: 'FitLife 24/7',
    location: 'Tampa, FL',
    description: 'FitLife 24/7 is a premium fitness center offering state-of-the-art equipment, personal training, and a variety of amenities. Our facility is open 24 hours a day, 7 days a week to accommodate your busy schedule.',
    photos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    ],
    rating: 4.8,
    reviewCount: 128,
    amenities: [
      { id: '24hour', name: '24-Hour Access', isAvailable: true },
      { id: 'towel', name: 'Towel Service', isAvailable: true },
      { id: 'sauna', name: 'Sauna', isAvailable: true },
      { id: 'hottub', name: 'Hot Tub', isAvailable: false },
      { id: 'coldplunge', name: 'Cold Plunge', isAvailable: true },
      { id: 'wifi', name: 'WiFi', isAvailable: true },
      { id: 'cafe', name: 'Cafe', isAvailable: false },
      { id: 'coworking', name: 'Co-Working Space', isAvailable: false }
    ],
    hours: [
      { day: 'Monday', open: '00:00', close: '23:59' },
      { day: 'Tuesday', open: '00:00', close: '23:59' },
      { day: 'Wednesday', open: '00:00', close: '23:59' },
      { day: 'Thursday', open: '00:00', close: '23:59' },
      { day: 'Friday', open: '00:00', close: '23:59' },
      { day: 'Saturday', open: '00:00', close: '23:59' },
      { day: 'Sunday', open: '00:00', close: '23:59' }
    ]
  };
  
  return (
    <GymOwnerDashboard user={user} gym={gym} />
  );
}
