import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  Upload,
  Users,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/apiService';
import Toast from '../components/Toast';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type, id: Date.now() });
  };

  const removeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // For now, we'll use mock notifications
      // In a real app, you would fetch from the backend
      setNotifications([
        { id: 1, text: 'Your note was rated 5 stars!', type: 'success', time: '2 hours ago' },
        { id: 2, text: 'New follower: John Doe', type: 'info', time: '5 hours ago' },
        { id: 3, text: 'Your note reached 100 downloads!', type: 'achievement', time: '1 day ago' }
      ]);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully!', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to logout. Please try again.', 'error');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Browse', href: '/browse', icon: BookOpen },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp }
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px'
          }}>
            {/* Logo and Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              {/* Logo */}
              <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                fontSize: '20px',
                fontWeight: '700',
                color: '#4f46e5'
              }}>
                <BookOpen size={28} />
                <span>LearnShare</span>
              </Link>

              {/* Desktop Navigation */}
              <nav style={{
                display: 'none',
                gap: '8px',
                '@media (min-width: 768px)': {
                  display: 'flex'
                }
              }}>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: isActive(item.href) ? '#4f46e5' : '#6b7280',
                        backgroundColor: isActive(item.href) ? '#eef2ff' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(item.href)) {
                          e.target.style.backgroundColor = '#f3f4f6';
                          e.target.style.color = '#374151';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.href)) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }
                      }}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
              display: 'none',
              flex: 1,
              maxWidth: '400px',
              margin: '0 32px',
              '@media (min-width: 768px)': {
                display: 'block'
              }
            }}>
              <div style={{
                position: 'relative'
              }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4f46e5';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                  }}
                />
              </div>
            </form>

            {/* Right Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    padding: '8px',
                    border: 'none',
                    background: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%'
                    }}></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '8px',
                    width: '320px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 100
                  }}>
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        Notifications
                      </h3>
                    </div>
                    <div style={{
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #f3f4f6',
                              cursor: 'pointer',
                              transition: 'backgroundColor 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            <p style={{
                              margin: 0,
                              fontSize: '14px',
                              color: '#374151',
                              lineHeight: '1.4'
                            }}>
                              {notification.text}
                            </p>
                            <p style={{
                              margin: '4px 0 0',
                              fontSize: '12px',
                              color: '#9ca3af'
                            }}>
                              {notification.time}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div style={{
                          padding: '24px 16px',
                          textAlign: 'center'
                        }}>
                          <p style={{
                            margin: 0,
                            fontSize: '14px',
                            color: '#9ca3af'
                          }}>
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {user?.fullName || user?.username || 'User'}
                  </span>
                  <ChevronDown size={16} style={{ color: '#6b7280' }} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '8px',
                    width: '200px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    padding: '8px'
                  }}>
                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '14px',
                        transition: 'backgroundColor 0.2s ease'
                      }}
                      onClick={() => setIsProfileOpen(false)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#374151',
                        fontSize: '14px',
                        transition: 'backgroundColor 0.2s ease'
                      }}
                      onClick={() => setIsProfileOpen(false)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <div style={{
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                      margin: '8px 0'
                    }}></div>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        borderRadius: '8px',
                        background: 'none',
                        color: '#dc2626',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'backgroundColor 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  '@media (min-width: 768px)': {
                    display: 'none'
                  }
                }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div style={{
              borderTop: '1px solid #e5e7eb',
              padding: '16px 0',
              '@media (min-width: 768px)': {
                display: 'none'
              }
            }}>
              <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: isActive(item.href) ? '#4f46e5' : '#6b7280',
                        backgroundColor: isActive(item.href) ? '#eef2ff' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      )}
    </>
  );
};

export default Header;
