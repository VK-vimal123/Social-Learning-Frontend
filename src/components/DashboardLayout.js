import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  Search, 
  Users, 
  User, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  BookOpen,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload Notes' },
    { path: '/browse', icon: Search, label: 'Browse Notes' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '280px' : '0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        background: 'white',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px 16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <BookOpen style={{ color: '#667eea' }} size={28} />
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
              }}>
                Notes Exchange
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
              <X size={20} />
            </button>
          </div>
        </div>

        <nav style={{
          padding: '16px'
        }}>
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              paddingLeft: '12px'
            }}>
              Main Menu
            </div>
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActivePath(item.path) ? '#667eea' : '#6b7280',
                    background: isActivePath(item.path) ? '#eef2ff' : 'transparent',
                    marginBottom: '4px',
                    transition: 'all 0.2s ease',
                    fontWeight: isActivePath(item.path) ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath(item.path)) {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.color = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath(item.path)) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6b7280';
                    }
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '14px' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              paddingLeft: '12px'
            }}>
              Other
            </div>
            {menuItems.slice(4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActivePath(item.path) ? '#667eea' : '#6b7280',
                    background: isActivePath(item.path) ? '#eef2ff' : 'transparent',
                    marginBottom: '4px',
                    transition: 'all 0.2s ease',
                    fontWeight: isActivePath(item.path) ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActivePath(item.path)) {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.color = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath(item.path)) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6b7280';
                    }
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '14px' }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#fef2f2',
              color: '#dc2626',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fef2f2';
            }}
          >
            <LogOut size={20} />
            <span style={{ fontSize: '14px' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '0' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main style={{
          padding: '24px',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
