import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MessageCircle, 
  BookOpen,
  MapPin,
  GraduationCap,
  Award,
  TrendingUp,
  UserMinus,
  Loader
} from 'lucide-react';
import apiService from '../services/apiService';
import Toast from '../components/Toast';

const Friends = () => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    followingCount: 0,
    followersCount: 0,
    totalNotesShared: 0,
    avgRating: 0
  });

  const showToast = (message, type) => {
    setToast({ message, type, id: Date.now() });
  };

  const removeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch following, followers, and all users in parallel
      const [followingRes, followersRes, usersRes] = await Promise.all([
        apiService.getMyFollowing(),
        apiService.getMyFollowers(),
        apiService.getAllUsers()
      ]);
      
      if (followingRes.success) {
        setFollowing(followingRes.data || []);
        setStats(prev => ({ ...prev, followingCount: followingRes.total || 0 }));
      }
      
      if (followersRes.success) {
        setFollowers(followersRes.data || []);
        setStats(prev => ({ ...prev, followersCount: followersRes.total || 0 }));
      }
      
      // Process all users and mark if they are being followed
      if (usersRes.success) {
        const followingIds = new Set((followingRes.data || []).map(u => u._id));
        const processedUsers = (usersRes.data || []).map(user => ({
          ...user,
          isFollowing: followingIds.has(user._id)
        }));
        setAllUsers(processedUsers);
      }
      
      const connectedUsers = [...(followingRes.data || []), ...(followersRes.data || [])];
      const totalNotes = connectedUsers.reduce((sum, user) => sum + (user.stats?.notesUploaded || 0), 0);
      const avgRating = connectedUsers.length > 0 
        ? connectedUsers.reduce((sum, user) => sum + (user.stats?.averageRating || 0), 0) / connectedUsers.length 
        : 0;
      
      setStats(prev => ({
        ...prev,
        totalNotesShared: totalNotes,
        avgRating: avgRating.toFixed(1)
      }));
    } catch (error) {
      console.error('Failed to fetch friends data:', error);
      showToast('Failed to load friends data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await apiService.followUser(userId);
      if (response.success) {
        showToast('Followed successfully!', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('Failed to follow user', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnfollow = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await apiService.unfollowUser(userId);
      if (response.success) {
        showToast('Unfollowed successfully', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('Failed to unfollow user', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getAvatar = (user) => {
    if (user?.avatar) return user.avatar;
    const name = user?.fullName || user?.username || 'U';
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = (user) => {
    return user?.fullName || user?.username || 'Unknown User';
  };

  const filteredAllUsers = allUsers.filter(user =>
    getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.school || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.branch || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFollowing = following.filter(user =>
    getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.school || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.branch || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFollowers = followers.filter(user =>
    getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.school || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.branch || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserCard = ({ user, isFollowing, onAction }) => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            {getAvatar(user)}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
              {getDisplayName(user)}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => onAction(user._id)}
          disabled={actionLoading[user._id]}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: isFollowing ? '#fef2f2' : '#667eea',
            color: isFollowing ? '#ef4444' : 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {actionLoading[user._id] ? (
            <Loader size={16} className="spin" />
          ) : isFollowing ? (
            <>
              <UserMinus size={16} />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Follow
            </>
          )}
        </button>
      </div>

      <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px', lineHeight: '1.5' }}>
        {user.bio || 'No bio available'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GraduationCap size={16} />
          {user.school || 'Unknown School'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} />
          {user.branch || 'Unknown Branch'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
            {user.stats?.notesUploaded || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Notes</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
            {user.stats?.followers || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Followers</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
            {(user.stats?.averageRating || 0).toFixed(1)}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Rating</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          flex: 1,
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          background: 'white',
          color: '#374151',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <MessageCircle size={16} />
          Message
        </button>
        <button style={{
          flex: 1,
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          background: 'white',
          color: '#374151',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <BookOpen size={16} />
          View Notes
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px', color: '#667eea' }} />
          <p>Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Friends Network
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Connect with fellow students and expand your learning network
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Users style={{ color: '#3b82f6', margin: '0 auto 12px' }} size={32} />
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stats.followingCount}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Following</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <TrendingUp style={{ color: '#10b981', margin: '0 auto 12px' }} size={32} />
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stats.followersCount}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Followers</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <BookOpen style={{ color: '#8b5cf6', margin: '0 auto 12px' }} size={32} />
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stats.totalNotesShared}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Notes Shared</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Award style={{ color: '#f59e0b', margin: '0 auto 12px' }} size={32} />
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stats.avgRating}</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Rating</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'all' ? '#667eea' : '#f3f4f6',
                color: activeTab === 'all' ? 'white' : '#374151'
              }}
            >
              All Users ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('following')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'following' ? '#667eea' : '#f3f4f6',
                color: activeTab === 'following' ? 'white' : '#374151'
              }}
            >
              Following ({stats.followingCount})
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'followers' ? '#667eea' : '#f3f4f6',
                color: activeTab === 'followers' ? 'white' : '#374151'
              }}
            >
              Followers ({stats.followersCount})
            </button>
          </div>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 44px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {activeTab === 'all' ? (
            filteredAllUsers.length > 0 ? (
              filteredAllUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  isFollowing={user.isFollowing}
                  onAction={user.isFollowing ? handleUnfollow : handleFollow}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
                <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  {searchTerm ? 'No users found matching your search' : "No users available"}
                </p>
              </div>
            )
          ) : activeTab === 'following' ? (
            filteredFollowing.length > 0 ? (
              filteredFollowing.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  isFollowing={true}
                  onAction={handleUnfollow}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
                <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  {searchTerm ? 'No users found matching your search' : "You haven't followed anyone yet"}
                </p>
              </div>
            )
          ) : (
            filteredFollowers.length > 0 ? (
              filteredFollowers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  isFollowing={following.some(f => f._id === user._id)}
                  onAction={following.some(f => f._id === user._id) ? handleUnfollow : handleFollow}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
                <Users size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                  {searchTerm ? 'No users found matching your search' : "No followers yet"}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Friends;
