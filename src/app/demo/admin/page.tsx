'use client';

import { useState } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminDemoPage() {
  // Mock user data
  const user = {
    name: 'Admin User',
    email: 'admin@gymfinder.com',
    role: 'Administrator',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=8B5CF6&color=fff'
  };
  
  return (
    <AdminDashboard user={user} />
  );
}
