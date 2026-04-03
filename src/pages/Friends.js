import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MessageCircle, 
  Star, 
  BookOpen,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  TrendingUp,
  Filter
} from 'lucide-react';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);

  const mockFriends = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      email: 'sarah.j@university.edu',
      school: 'MIT',
      branch: 'Computer Science',
      bio: 'Passionate about AI and machine learning. Love sharing study materials!',
      joinDate: '2024-01-15',
      stats: {
        notesShared: 45,
        friendsCount: 89,
        averageRating: 4.8,
        totalDownloads: 1234
      },
      interests: ['AI', 'Machine Learning', 'Mathematics', 'Programming'],
      isOnline: true,
      lastActive: '2 min ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'MC',
      email: 'mike.chen@university.edu',
      school: 'Stanford',
      branch: 'Physics',
      bio: 'Physics enthusiast helping others understand complex concepts.',
      joinDate: '2024-01-20',
      stats: {
        notesShared: 32,
        friendsCount: 67,
        averageRating: 4.6,
        totalDownloads: 892
      },
      interests: ['Quantum Physics', 'Mathematics', 'Research'],
      isOnline: false,
      lastActive: '1 hour ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      avatar: 'ED',
      email: 'emily.d@university.edu',
      school: 'Harvard',
      branch: 'Chemistry',
      bio: 'Chemistry major creating comprehensive study guides and formula sheets.',
      joinDate: '2024-02-01',
      stats: {
        notesShared: 28,
        friendsCount: 54,
        averageRating: 4.9,
        totalDownloads: 756
      },
      interests: ['Organic Chemistry', 'Biochemistry', 'Lab Techniques'],
      isOnline: true,
      lastActive: '5 min ago'
    }
  ];

  const mockSuggestions = [
    {
      id: 4,
      name: 'Alex Kumar',
      avatar: 'AK',
      email: 'alex.k@university.edu',
      school: 'Berkeley',
      branch: 'Engineering',
      bio: 'Engineering student with expertise in mathematics and physics.',
      mutualFriends: 12,
      stats: {
        notesShared: 18,
        friendsCount: 43,
        averageRating: 4.5,
        totalDownloads: 432
      },
      interests: ['Engineering', 'Mathematics', 'Physics'],
      reason: 'Studying similar subjects'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      avatar: 'LW',
      email: 'lisa.w@university.edu',
      school: 'UCLA',
      branch: 'Biology',
      bio: 'Biology major specializing in molecular biology and genetics.',
      mutualFriends: 8,
      stats: {
        notesShared: 22,
        friendsCount: 61,
        averageRating: 4.7,
        totalDownloads: 543
      },
      interests: ['Biology', 'Genetics', 'Research'],
      reason: 'Friends with Sarah Johnson'
    },
    {
      id: 6,
      name: 'John Smith',
      avatar: 'JS',
      email: 'john.s@university.edu',
      school: 'Yale',
      branch: 'Medicine',
      bio: 'Medical student creating comprehensive anatomy and physiology notes.',
      mutualFriends: 15,
      stats: {
        notesShared: 35,
        friendsCount: 72,
        averageRating: 4.8,
        totalDownloads: 987
      },
      interests: ['Medicine', 'Anatomy', 'Physiology'],
      reason: 'Popular in your network'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setFriends(mockFriends);
      setSuggestedFriends(mockSuggestions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggestions = suggestedFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = (friendId) => {
    const friendToAdd = suggestedFriends.find(f => f.id === friendId);
    if (friendToAdd) {
      setFriends(prev => [...prev, { ...friendToAdd, isNewFriend: true }]);
      setSuggestedFriends(prev => prev.filter(f => f.id !== friendId));
    }
  };

  const handleRemoveFriend = (friendId) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="text-yellow-400 fill-current" />
        ))}
        {halfStar === 1 && <Star size={14} className="text-yellow-400 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const FriendCard = ({ friend, showAddButton = false, onAction }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="avatar avatar-lg">{friend.avatar}</div>
            {friend.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{friend.name}</h3>
            <p className="text-sm text-gray-600">{friend.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <GraduationCap size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">{friend.school}</span>
            </div>
          </div>
        </div>
        {showAddButton ? (
          <button
            onClick={() => onAction(friend.id)}
            className="btn btn-primary btn-sm"
          >
            <UserPlus size={16} className="mr-1" />
            Add Friend
          </button>
        ) : (
          <button
            onClick={() => onAction(friend.id)}
            className="btn btn-danger btn-sm"
          >
            Remove
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4">{friend.bio}</p>

      <div className="flex items-center space-x-2 mb-4">
        <MapPin size={14} className="text-gray-500" />
        <span className="text-sm text-gray-600">{friend.branch}</span>
        <span className="text-gray-400">•</span>
        <span className="text-sm text-gray-600">
          {friend.isOnline ? 'Online' : `Last active ${friend.lastActive}`}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {friend.interests.slice(0, 3).map((interest, index) => (
          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {interest}
          </span>
        ))}
        {friend.interests.length > 3 && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            +{friend.interests.length - 3} more
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">{friend.stats.notesShared}</div>
          <div className="text-xs text-gray-600">Notes Shared</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">{friend.stats.friendsCount}</div>
          <div className="text-xs text-gray-600">Friends</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        {renderStars(friend.stats.averageRating)}
        <span className="flex items-center">
          <BookOpen size={14} className="mr-1" />
          {friend.stats.totalDownloads} downloads
        </span>
      </div>

      <div className="flex space-x-2">
        <button className="btn btn-secondary btn-sm flex-1">
          <MessageCircle size={16} className="mr-1" />
          Message
        </button>
        <button className="btn btn-secondary btn-sm flex-1">
          <BookOpen size={16} className="mr-1" />
          View Notes
        </button>
      </div>

      {!showAddButton && friend.mutualFriends && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            {friend.mutualFriends} mutual friends
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading text-4xl text-primary mb-4"></div>
          <p className="text-gray-600">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Friends Network
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280'
        }}>
          Connect with fellow students and expand your learning network
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <Users style={{ color: '#3b82f6', marginBottom: '8px', margin: '0 auto 8px' }} size={32} />
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {friends.length}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Total Friends
          </div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <TrendingUp style={{ color: '#10b981', marginBottom: '8px', margin: '0 auto 8px' }} size={32} />
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            234
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Network Reach
          </div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <BookOpen style={{ color: '#8b5cf6', marginBottom: '8px', margin: '0 auto 8px' }} size={32} />
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            1,234
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Shared Notes
          </div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <Award style={{ color: '#f59e0b', marginBottom: '8px', margin: '0 auto 8px' }} size={32} />
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            4.7
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Avg Rating
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          md: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
          marginBottom: '24px',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveTab('friends')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'friends' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'transparent',
                color: activeTab === 'friends' ? 'white' : '#6b7280'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'friends') {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'friends') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              My Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'suggestions' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'transparent',
                color: activeTab === 'suggestions' ? 'white' : '#6b7280'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'suggestions') {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'suggestions') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              Suggestions ({suggestedFriends.length})
            </button>
          </div>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} size={20} />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
              }}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'friends' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onAction={handleRemoveFriend}
              />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredSuggestions.map((friend) => (
              <div key={friend.id} style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                border: '1px solid #f3f4f6'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginRight: '12px'
                  }}>
                    {friend.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {friend.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {friend.email}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <MapPin size={14} />
                  {friend.school}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <GraduationCap size={14} />
                  {friend.branch}
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  fontStyle: 'italic'
                }}>
                  {friend.mutualFriends} mutual friends
                </div>

                <button style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
                onClick={() => handleAddFriend(friend.id)}
                >
                  <UserPlus size={16} />
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Friends;
