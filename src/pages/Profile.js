import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Star, 
  Download, 
  Users, 
  Edit,
  Camera,
  Save,
  X,
  Upload
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    notesUploaded: 0,
    notesDownloaded: 0,
    totalViews: 0,
    totalDownloads: 0,
    averageRating: 0,
    followers: 0,
    following: 0,
    badges: []
  });

  useEffect(() => {
    setEditedUser({
      fullName: user?.fullName || '',
      email: user?.email || '',
      school: user?.school || '',
      branch: user?.branch || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });

    // Simulate loading user stats
    setUserStats({
      notesUploaded: user?.stats?.notesUploaded || 24,
      notesDownloaded: user?.stats?.notesDownloaded || 156,
      totalViews: 3421,
      totalDownloads: 1876,
      averageRating: user?.stats?.ratings || 4.8,
      followers: 89,
      following: 67,
      badges: [
        { name: 'Rising Star', icon: '🌟', description: 'Uploaded 10+ notes this month' },
        { name: 'Top Contributor', icon: '🏆', description: '1000+ total downloads' },
        { name: 'Helpful Peer', icon: '💝', description: 'Received 50+ positive ratings' },
        { name: 'Active Learner', icon: '📚', description: '30 days login streak' }
      ]
    });
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      fullName: user?.fullName || '',
      email: user?.email || '',
      school: user?.school || '',
      branch: user?.branch || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  const recentNotes = [
    {
      id: 1,
      title: 'Advanced Calculus Notes',
      subject: 'Mathematics',
      uploadDate: '2024-03-10',
      downloads: 156,
      rating: 4.8,
      views: 892
    },
    {
      id: 2,
      title: 'Physics Lab Manual',
      subject: 'Physics',
      uploadDate: '2024-03-08',
      downloads: 89,
      rating: 4.6,
      views: 445
    },
    {
      id: 3,
      title: 'Chemistry Formula Sheet',
      subject: 'Chemistry',
      uploadDate: '2024-03-05',
      downloads: 234,
      rating: 4.9,
      views: 1234
    }
  ];

  const achievements = [
    { title: 'Notes Uploaded', value: userStats.notesUploaded, icon: BookOpen, color: 'text-blue-600' },
    { title: 'Downloads Received', value: userStats.totalDownloads, icon: Download, color: 'text-green-600' },
    { title: 'Followers', value: userStats.followers, icon: Users, color: 'text-purple-600' },
    { title: 'Average Rating', value: userStats.averageRating.toFixed(1), icon: Star, color: 'text-yellow-600' }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
        ))}
        {halfStar === 1 && <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} style={{ color: '#d1d5db' }} />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: 'white',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'white',
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                {user?.avatar || (user?.fullName || 'User').charAt(0).toUpperCase()}
              </div>
              <button style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: 'white',
                color: '#667eea',
                padding: '6px',
                borderRadius: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}>
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {user?.fullName}
              </h1>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                marginBottom: '12px'
              }}>
                {user?.email}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px',
                opacity: 0.8,
                flexWrap: 'wrap'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} />
                  {user?.school || 'Not specified'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={16} />
                  {user?.branch || 'Not specified'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={16} />
                  Joined {user?.joinDate || 'Recently'}
                </span>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <Edit size={20} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                  }}
                >
                  <Save size={20} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <X size={20} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <div key={index} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f3f4f6',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                margin: '0 auto 16px'
              }}>
                <Icon size={24} />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {achievement.value}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {achievement.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {['overview', 'notes', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === tab ? '#f9fafb' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab ? '600' : '500',
                color: activeTab === tab ? '#667eea' : '#6b7280',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px' }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Profile Overview
              </h2>
              {isEditing ? (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedUser.fullName || ''}
                      onChange={(e) => setEditedUser({...editedUser, fullName: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
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
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedUser.email || ''}
                      onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
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
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      School
                    </label>
                    <input
                      type="text"
                      value={editedUser.school || ''}
                      onChange={(e) => setEditedUser({...editedUser, school: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
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
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Branch
                    </label>
                    <input
                      type="text"
                      value={editedUser.branch || ''}
                      onChange={(e) => setEditedUser({...editedUser, branch: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
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
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <User style={{ color: '#6b7280' }} size={20} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Full Name</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {user?.fullName || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Mail style={{ color: '#6b7280' }} size={20} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Email</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {user?.email || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <Phone style={{ color: '#6b7280' }} size={20} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Phone</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {user?.phone || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <MapPin style={{ color: '#6b7280' }} size={20} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>School</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {user?.school || 'Not specified'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <BookOpen style={{ color: '#6b7280' }} size={20} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Branch</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {user?.branch || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                My Notes
              </h2>
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {recentNotes.map((note) => (
                  <div key={note.id} style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {note.title}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {note.subject} • Uploaded on {note.uploadDate}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {renderStars(note.rating)}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Download size={14} />
                          {note.downloads} downloads
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BookOpen size={14} />
                          {note.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Recent Activity
              </h2>
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#dbeafe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1d4ed8'
                  }}>
                    <Upload size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      Uploaded new note
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Advanced Calculus Notes • 2 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
