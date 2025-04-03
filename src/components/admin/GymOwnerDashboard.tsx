'use client';

import { useState } from 'react';
import { 
  Dumbbell, 
  BarChart2, 
  Settings, 
  MessageSquare, 
  Edit,
  LogOut,
  Search,
  Camera,
  Clock,
  Users,
  Star,
  Plus,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface GymOwnerDashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  gym: {
    id: string;
    name: string;
    location: string;
    description: string;
    photos: string[];
    rating: number;
    reviewCount: number;
    amenities: {
      id: string;
      name: string;
      isAvailable: boolean;
    }[];
    hours: {
      day: string;
      open: string;
      close: string;
    }[];
  };
}

export default function GymOwnerDashboard({ user, gym }: GymOwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for reviews
  const reviews = [
    {
      id: 'review1',
      userName: 'John Smith',
      rating: 4,
      date: '2025-03-29',
      content: 'Great gym with excellent equipment. The staff is very friendly and helpful.',
      status: 'published'
    },
    {
      id: 'review2',
      userName: 'Sarah Williams',
      rating: 5,
      date: '2025-03-25',
      content: 'Best gym in Tampa! Love the clean facilities and variety of equipment.',
      status: 'published'
    },
    {
      id: 'review3',
      userName: 'Mike Johnson',
      rating: 3,
      date: '2025-03-20',
      content: 'Decent gym but can get crowded during peak hours. Could use more squat racks.',
      status: 'published'
    },
    {
      id: 'review4',
      userName: 'David Brown',
      rating: 2,
      date: '2025-03-15',
      content: 'Equipment needs maintenance. Several machines were out of order during my visit.',
      status: 'pending'
    }
  ];
  
  // Mock data for messages
  const messages = [
    {
      id: 'message1',
      userName: 'Emily Davis',
      date: '2025-03-30',
      subject: 'Membership Inquiry',
      content: 'Hi, I\'m interested in your monthly membership options. Do you offer any student discounts?',
      isRead: false
    },
    {
      id: 'message2',
      userName: 'Robert Wilson',
      date: '2025-03-28',
      subject: 'Personal Training',
      content: 'Hello, I\'d like to schedule a consultation with one of your personal trainers. What\'s the process?',
      isRead: true
    },
    {
      id: 'message3',
      userName: 'Jennifer Lee',
      date: '2025-03-25',
      subject: 'Group Classes',
      content: 'Do you offer any yoga or pilates classes? If so, what\'s the schedule like?',
      isRead: true
    }
  ];
  
  // Mock data for analytics
  const analytics = {
    viewsThisMonth: 1245,
    viewsLastMonth: 980,
    searchAppearances: 3567,
    clickThroughRate: 8.2,
    averageRating: 4.2,
    totalReviews: 87,
    popularTimes: [
      { day: 'Monday', hour: '6-7 PM', count: 45 },
      { day: 'Tuesday', hour: '5-6 PM', count: 38 },
      { day: 'Wednesday', hour: '6-7 PM', count: 42 },
      { day: 'Thursday', hour: '5-6 PM', count: 40 },
      { day: 'Friday', hour: '4-5 PM', count: 35 },
      { day: 'Saturday', hour: '10-11 AM', count: 50 },
      { day: 'Sunday', hour: '11 AM-12 PM', count: 32 }
    ]
  };
  
  // Filter reviews based on search query
  const filteredReviews = reviews.filter(review => 
    review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter messages based on search query
  const filteredMessages = messages.filter(message => 
    message.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = 'bg-gray-100 text-gray-800';
    let icon = null;
    
    switch (status) {
      case 'published':
        bgColor = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 text-yellow-800';
        icon = <Clock className="h-4 w-4 mr-1" />;
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
          <p className="text-sm text-gray-500">Gym Owner Dashboard</p>
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
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('profile')}
            >
              <Dumbbell className="h-5 w-5" />
              <span>Gym Profile</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'reviews' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('reviews')}
            >
              <Star className="h-5 w-5" />
              <span>Reviews</span>
            </button>
            
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-md ${activeTab === 'messages' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
              {messages.filter(m => !m.isRead).length > 0 && (
                <span className="ml-auto bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
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
              {activeTab === 'profile' && 'Gym Profile'}
              {activeTab === 'reviews' && 'Reviews & Ratings'}
              {activeTab === 'messages' && 'Messages'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'settings' && 'Account Settings'}
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
          {/* Gym Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">Gym Information</h3>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">Basic Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gym Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={gym.name}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={gym.location}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={gym.description}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">Photos</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {gym.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img 
                          src={photo} 
                          alt={`${gym.name} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="p-2 bg-white rounded-full text-red-600">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <button className="flex flex-col items-center text-gray-500">
                        <Camera className="h-8 w-8 mb-2" />
                        <span className="text-sm">Add Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">Amenities</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {gym.amenities.map((amenity) => (
                      <label key={amenity.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={amenity.isAvailable}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>{amenity.name}</span>
                      </label>
                    ))}
                    
                    <div className="flex items-center space-x-2 text-primary">
                      <Plus className="h-5 w-5" />
                      <span>Add Amenity</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-lg font-medium mb-4">Business Hours</h4>
                  
                  <div className="space-y-4">
                    {gym.hours.map((hour, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-24">
                          <span className="font-medium">{hour.day}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            defaultValue={hour.open}
                          />
                          <span>to</span>
                          <input
                            type="time"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            defaultValue={hour.close}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Reviews & Ratings</h3>
                  <p className="text-sm text-gray-500">
                    Overall Rating: <span className="font-medium">{gym.rating}</span>/5 ({gym.reviewCount} reviews)
                  </p>
                </div>
                
                <div>
                  <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="all">All Reviews</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{review.userName}</h4>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      
                      <StatusBadge status={review.status} />
                    </div>
                    
                    <p className="text-gray-700 mb-4">{review.content}</p>
                    
                    <div className="flex space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">Messages</h3>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Compose Message
                </button>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {filteredMessages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`p-6 ${index < filteredMessages.length - 1 ? 'border-b' : ''} ${!message.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{message.subject}</h4>
                        <p className="text-sm text-gray-500">
                          From: {message.userName} • {message.date}
                        </p>
                      </div>
                      
                      {!message.isRead && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-4">{message.content}</p>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">
                        Reply
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                        Mark as {message.isRead ? 'Unread' : 'Read'}
                      </button>
                    </div>
                  </div>
                ))}
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
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Profile Views</h4>
                  <p className="text-3xl font-bold">{analytics.viewsThisMonth}</p>
                  <p className="text-green-600 text-sm mt-2">
                    ↑ {Math.round((analytics.viewsThisMonth - analytics.viewsLastMonth) / analytics.viewsLastMonth * 100)}% from last month
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Search Appearances</h4>
                  <p className="text-3xl font-bold">{analytics.searchAppearances}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Click-through rate: {analytics.clickThroughRate}%
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Average Rating</h4>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold">{analytics.averageRating}</p>
                    <Star className="h-6 w-6 text-yellow-400 ml-2" />
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Based on {analytics.totalReviews} reviews
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Most Popular Time</h4>
                  <p className="text-3xl font-bold">{analytics.popularTimes[0].hour}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    on {analytics.popularTimes[0].day}s
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Popular Times</h4>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">Chart placeholder</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Visitor Demographics</h4>
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
                <h3 className="text-lg font-medium">Account Settings</h3>
              </div>
              
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">Personal Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={user.name}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={user.email}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue="(813) 555-1234"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">Password</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-b">
                  <h4 className="text-lg font-medium mb-4">Notification Settings</h4>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Email notifications for new reviews</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Email notifications for new messages</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Email notifications for analytics reports</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-6">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                    Save Changes
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
