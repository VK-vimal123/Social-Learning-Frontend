import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Download, 
  Users, 
  Star, 
  TrendingUp,
  Clock,
  Award,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/apiService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentNotes, setRecentNotes] = useState([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalDownloads: 0,
    totalFriends: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's recent notes
        const notesResponse = await apiService.getMyNotes({ limit: 4, sort: '-createdAt' });
        if (notesResponse.success) {
          const formattedNotes = notesResponse.data.map(note => ({
            id: note._id,
            title: note.title,
            subject: note.subject?.name || 'Unknown',
            author: note.uploadedBy?.fullName || 'Unknown',
            rating: note.stats.averageRating,
            downloads: note.stats.downloads,
            uploadTime: formatTimeAgo(note.createdAt),
            tags: note.tags || [],
            fileUrl: note.fileUrl,
            fileName: note.fileName
          }));
          setRecentNotes(formattedNotes);
        }

        // Set stats from user data
        if (user) {
          setStats({
            totalNotes: user.stats?.notesUploaded || 0,
            totalDownloads: user.stats?.totalDownloads || 0,
            totalFriends: user.stats?.followers || 0,
            averageRating: user.stats?.averageRating || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const quickActions = [
    { icon: Upload, label: 'Upload Note', color: 'bg-blue-500', href: '/upload' },
    { icon: BookOpen, label: 'Browse Notes', color: 'bg-green-500', href: '/browse' },
    { icon: Users, label: 'Find Friends', color: 'bg-purple-500', href: '/friends' },
    { icon: Star, label: 'My Ratings', color: 'bg-yellow-500', href: '/profile' }
  ];

  const statCards = [
    { 
      icon: BookOpen, 
      label: 'Notes Uploaded', 
      value: stats.totalNotes, 
      change: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Download, 
      label: 'Downloads', 
      value: stats.totalDownloads, 
      change: '+23%',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      icon: Users, 
      label: 'Friends', 
      value: stats.totalFriends, 
      change: '+8%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      icon: Star, 
      label: 'Average Rating', 
      value: stats.averageRating.toFixed(1), 
      change: '+0.3',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            Welcome back, {user?.fullName || 'User'}! 👋
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            marginBottom: '24px'
          }}>
            Ready to continue your learning journey? Here's what's happening today.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}>
              Upload Notes
            </button>
            <button style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}>
              Browse Notes
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BookOpen size={24} />
            </div>
            <TrendingUp style={{ color: '#10b981' }} size={20} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {stats.totalNotes}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Total Notes
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Download size={24} />
            </div>
            <TrendingUp style={{ color: '#10b981' }} size={20} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {stats.totalDownloads}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Total Downloads
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <TrendingUp style={{ color: '#10b981' }} size={20} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {stats.totalFriends}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Friends
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Star size={24} />
            </div>
            <TrendingUp style={{ color: '#10b981' }} size={20} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {stats.averageRating}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Average Rating
          </p>
        </div>
      </div>

      {/* Recent Notes Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827'
          }}>
            Recent Notes
          </h2>
          <button style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'none',
            border: '1px solid #e5e7eb',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.color = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.color = '#6b7280';
          }}>
            View All
          </button>
        </div>

        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {recentNotes.map((note) => (
            <div key={note.id} style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              transition: 'all 0.3s ease'
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
                    by {note.author} • {note.subject}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  background: '#fef3c7',
                  borderRadius: '6px'
                }}>
                  <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#92400e'
                  }}>
                    {note.rating}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {note.tags.map((tag, index) => (
                    <span key={index} style={{
                      padding: '4px 8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={14} />
                    {note.downloads}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    {note.uploadTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
