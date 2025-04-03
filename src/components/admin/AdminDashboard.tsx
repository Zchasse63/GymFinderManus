'use client';

import { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  BarChart2, 
  Settings, 
  Bell, 
  LogOut, 
  Search,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('gyms');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for gyms
  const gyms = [
    {
      id: 'gym1',
      name: 'FitLife 24/7',
      location: 'Tampa, FL',
      status: 'verified',
      lastUpdated: '2025-03-28',
      pendingReviews: 3
    },
    {
      id: 'gym2',
      name: 'CrossFit Tampa Bay',
      location: 'Tampa, FL',
      status: 'pending',
      lastUpdated: '2025-03-25',
      pendingReviews: 1
    },
    {
      id: 'gym3',
      name: 'Zen Yoga Studio',
      location: 'Tampa, FL',
      status: 'verified',
      lastUpdated: '2025-03-30',
      pendingReviews: 0
    },
    {
      id: 'gym4',
      name: 'Elite Fitness Center',
      location: 'Tampa, FL',
      status: 'flagged',
      lastUpdated: '2025-03-20',
      pendingReviews: 5
    }
  ];
  
  // Mock data for users
  const users = [
    {
      id: 'user1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'User',
      joinDate: '2025-01-15',
      reviewsSubmitted: 12
    },
    {
      id: 'user2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'Gym Owner',
      joinDate: '2025-02-10',
      reviewsSubmitted: 0
    },
    {
      id: 'user3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Admin',
      joinDate: '2024-12-05',
      reviewsSubmitted: 8
    }
  ];
  
  // Mock data for feedback
  const feedback = [
    {
      id: 'feedback1',
      gymName: 'FitLife 24/7',
      userName: 'John Smith',
      rating: 4,
      status: 'pending',
      submittedDate: '2025-03-29'
    },
    {
      id: 'feedback2',
      gymName: 'CrossFit Tampa Bay',
      userName: 'Mike Johnson',
      rating: 3,
      status: 'approved',
      submittedDate: '2025-03-27'
    },
    {
      id: 'feedback3',
      gymName: 'Elite Fitness Center',
      userName: 'Sarah Williams',
      rating: 2,
      status: 'rejected',
      submittedDate: '2025-03-25'
    },
    {
      id: 'feedback4',
      gymName: 'Elite Fitness Center',
      userName: 'David Brown',
      rating: 1,
      status: 'pending',
      submittedDate: '2025-03-30'
    }
  ];
  
  // Filter data based on search query
  const filteredGyms = gyms.filter(gym => 
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFeedback = feedback.filter(item => 
    item.gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    let icon = null;
    
    switch (status) {
      case 'verified':
        bgColor = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 text-yellow-800';
        icon = <AlertTriangle className="h-4 w-4 mr-1" />;
        break;
      case 'flagged':
        bgColor = 'bg-red-100 text-red-800';
        icon = <XCircle className="h-4 w-4 mr-1" />;
        break;
      case 'approved':
        bgColor = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'rejected':
        bgColor = 'bg-red-100 text-red-800';
        icon = <XCircle className="h-4 w-4 mr-1" />;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">GymFinder</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <img 
              src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)} 
              alt={user.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'gyms' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('gyms')}
            >
              <Dumbbell className="h-5 w-5" />
              <span>Gyms</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'feedback' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('feedback')}
            >
              <Bell className="h-5 w-5" />
              <span>Feedback</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'analytics' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Analytics</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t">
          <button className="flex items-center space-x-3 w-full p-3 rounded-md text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {activeTab === 'gyms' && 'Gym Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'feedback' && 'Feedback & Reviews'}
              {activeTab === 'analytics' && 'Analytics Dashboard'}
              {activeTab === 'settings' && 'System Settings'}
            </h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {/* Gyms Tab */}
          {activeTab === 'gyms' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">All Gyms</h3>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Add New Gym
                </button>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gym Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Reviews
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGyms.map((gym) => (
                      <tr key={gym.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{gym.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{gym.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={gym.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {gym.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {gym.pendingReviews > 0 ? (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              {gym.pendingReviews}
                            </span>
                          ) : (
                            '0'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">All Users</h3>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Add New User
                </button>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reviews
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'Gym Owner'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {user.reviewsSubmitted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">Feedback & Reviews</h3>
                <div>
                  <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mr-2">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                    Export Data
                  </button>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gym
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeedback.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.gymName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{item.userName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span>{item.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {item.submittedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-green-600 hover:text-green-800 mr-3">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium">Analytics Dashboard</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Total Gyms</h4>
                  <p className="text-3xl font-bold">124</p>
                  <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Total Users</h4>
                  <p className="text-3xl font-bold">1,893</p>
                  <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Reviews</h4>
                  <p className="text-3xl font-bold">3,542</p>
                  <p className="text-green-600 text-sm mt-2">↑ 15% from last month</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Avg. Rating</h4>
                  <p className="text-3xl font-bold">4.2</p>
                  <p className="text-red-600 text-sm mt-2">↓ 0.1 from last month</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Gym Categories</h4>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">Chart placeholder</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">User Activity</h4>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium">System Settings</h3>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">General Settings</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="GymFinder"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="admin@gymfinder.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Location
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="Tampa, FL"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">API Settings</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Places API Key
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="AIzaSyD-tj15E8SDAQ8vNgoDVjsgkSgfOKpUABw"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mapbox API Key
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="pk.eyJ1IjoiemNoYXNzZTg5IiwiYSI6ImNtOHhocTAyYzAzcHcya29rNHE5cjc1OXIifQ.jvCmzRpBw3F2Jzm9EoRBjg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
