import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileSettings, setProfileSettings] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    school: user?.school || '',
    branch: user?.branch || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newFollowers: true,
    newComments: true,
    newDownloads: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: 'friends',
    showActivity: true,
    dataSharing: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'english',
    fontSize: 'medium',
    compactMode: false
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const settingsSections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Lock }
  ];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      showMessage('success', 'Profile settings saved successfully!');
    }, 1000);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showMessage('success', 'Notification preferences updated!');
    }, 1000);
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showMessage('success', 'Privacy settings updated!');
    }, 1000);
  };

  const handleSaveAppearance = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showMessage('success', 'Appearance settings saved!');
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      showMessage('error', 'New passwords do not match!');
      return;
    }

    if (passwordSettings.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long!');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordSettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully!');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      logout();
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Full Name</label>
          <input
            type="text"
            value={profileSettings.fullName}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, fullName: e.target.value }))}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            value={profileSettings.email}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
            className="form-input"
            disabled
          />
        </div>
        <div>
          <label className="form-label">School</label>
          <input
            type="text"
            value={profileSettings.school}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, school: e.target.value }))}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Branch</label>
          <input
            type="text"
            value={profileSettings.branch}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, branch: e.target.value }))}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input
            type="tel"
            value={profileSettings.phone}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Location</label>
          <input
            type="text"
            value={profileSettings.location}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
            className="form-input"
          />
        </div>
      </div>
      <div>
        <label className="form-label">Bio</label>
        <textarea
          value={profileSettings.bio}
          onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
          className="form-input form-textarea"
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <div className="loading mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Profile
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about your account' },
          { key: 'newFollowers', label: 'New Followers', description: 'Get notified when someone follows you' },
          { key: 'newComments', label: 'New Comments', description: 'Get notified when someone comments on your notes' },
          { key: 'newDownloads', label: 'New Downloads', description: 'Get notified when someone downloads your notes' },
          { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity' },
          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive product updates and promotions' }
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{label}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[key]}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Push Notifications</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveNotifications}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <div className="loading mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Notifications
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="form-label">Profile Visibility</label>
          <select
            value={privacySettings.profileVisibility}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
            className="form-select"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        {[
          { key: 'showEmail', label: 'Show Email Address', description: 'Allow others to see your email address' },
          { key: 'showPhone', label: 'Show Phone Number', description: 'Allow others to see your phone number' },
          { key: 'showActivity', label: 'Show Activity Status', description: 'Allow others to see when you\'re online' }
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{label}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings[key]}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}

        <div>
          <label className="form-label">Who Can Message You</label>
          <select
            value={privacySettings.allowMessages}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowMessages: e.target.value }))}
            className="form-select"
          >
            <option value="everyone">Everyone</option>
            <option value="friends">Friends Only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Security</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Data Sharing</h4>
            <p className="text-sm text-gray-600">Allow anonymous usage data collection for product improvement</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataSharing: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSavePrivacy}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <div className="loading mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Privacy
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Theme</label>
          <select
            value={appearanceSettings.theme}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, theme: e.target.value }))}
            className="form-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div>
          <label className="form-label">Language</label>
          <select
            value={appearanceSettings.language}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
            className="form-select"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
        </div>
        <div>
          <label className="form-label">Font Size</label>
          <select
            value={appearanceSettings.fontSize}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontSize: e.target.value }))}
            className="form-select"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Compact Mode</h4>
            <p className="text-sm text-gray-600">Use more compact layout</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appearanceSettings.compactMode}
              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveAppearance}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <div className="loading mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Appearance
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
      <div className="space-y-4">
        <div>
          <label className="form-label">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordSettings.currentPassword}
              onChange={(e) => setPasswordSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="form-input pr-12"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="form-label">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={passwordSettings.newPassword}
              onChange={(e) => setPasswordSettings(prev => ({ ...prev, newPassword: e.target.value }))}
              className="form-input pr-12"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            value={passwordSettings.confirmPassword}
            onChange={(e) => setPasswordSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="form-input"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <div className="loading mr-2"></div>
              Updating...
            </>
          ) : (
            <>
              <Lock size={20} className="mr-2" />
              Change Password
            </>
          )}
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
              <p className="text-red-600 text-sm">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="btn btn-danger"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'account':
        return renderAccountSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        lg: { flexDirection: 'row' },
        gap: '24px'
      }}>
        {/* Sidebar */}
        <div style={{
          lg: { width: '320px' }
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f3f4f6'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Settings
            </h2>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      border: 'none',
                      cursor: 'pointer',
                      background: activeSection === section.id
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'transparent',
                      color: activeSection === section.id ? 'white' : '#374151'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== section.id) {
                        e.target.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== section.id) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontWeight: '500' }}>{section.label}</span>
                  </button>
                );
              })}
            </nav>

            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fef2f2';
                }}
              >
                <LogOut size={20} />
                <span style={{ fontWeight: '500' }}>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f3f4f6'
          }}>
            {/* Message */}
            {message.text && (
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: message.type === 'success' 
                  ? '#f0fdf4' 
                  : '#fef2f2',
                border: message.type === 'success' 
                  ? '1px solid #bbf7d0' 
                  : '1px solid #fecaca',
                color: message.type === 'success' 
                  ? '#15803d' 
                  : '#991b1b'
              }}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span style={{ fontWeight: '500' }}>{message.text}</span>
              </div>
            )}

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
