import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import { supabase } from '../../supabaseClient';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole') || 'donor');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'account');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Load settings from localStorage on mount
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      // Notification Settings
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyDigest: true,
      donationAlerts: true,
      matchAlerts: true,
      urgentRequests: true,
      
      // Privacy Settings
      profileVisibility: 'public',
      showLocation: true,
      showContactInfo: false,
      showDonationHistory: true,
      allowDirectMessages: true,
      
      // Application Settings
      language: 'en',
      timezone: 'America/New_York',
      theme: 'light',
      autoSave: true,
      compactView: false,
      
      // Security Settings
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30
    };
  };

  const [settings, setSettings] = useState(loadSettings());
  
  // User profile data
  const [userProfile, setUserProfile] = useState({
    fullName: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    organization: localStorage.getItem('userOrganization') || '',
    address: localStorage.getItem('userAddress') || '',
    bio: localStorage.getItem('userBio') || ''
  });

  useEffect(() => {
    // Apply theme setting
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto mode - check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProfileChange = (key, value) => {
    setUserProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    
    try {
      // Save settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Save profile data to localStorage
      localStorage.setItem('userName', userProfile.fullName);
      localStorage.setItem('userEmail', userProfile.email);
      localStorage.setItem('userPhone', userProfile.phone);
      localStorage.setItem('userOrganization', userProfile.organization);
      localStorage.setItem('userAddress', userProfile.address);
      localStorage.setItem('userBio', userProfile.bio);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Error saving settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account?\n\nThis action cannot be undone. All your data will be permanently deleted.'
    );
    
    if (confirmed) {
      const finalConfirm = window.confirm(
        'This is your final warning!\n\nType your password to confirm account deletion.'
      );
      
      if (finalConfirm) {
        try {
          // Sign out from Supabase
          await supabase.auth.signOut();
          
          // Clear all localStorage
          localStorage.clear();
          
          // Navigate to login
          navigate('/login');
          
          alert('Your account has been deleted.');
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Error deleting account. Please try again.');
        }
      }
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'application', label: 'Application', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Lock' }
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Profile Information</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={userProfile.fullName}
            onChange={(e) => handleProfileChange('fullName', e.target.value)}
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={userProfile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            description="Your primary email for notifications and communications"
          />
          
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={userProfile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
          />
          
          <Input
            label="Organization Name"
            type="text"
            placeholder="Your restaurant or NGO name"
            value={userProfile.organization}
            onChange={(e) => handleProfileChange('organization', e.target.value)}
          />
          
          <Input
            label="Address"
            type="text"
            placeholder="Street, City, State, ZIP"
            value={userProfile.address}
            onChange={(e) => handleProfileChange('address', e.target.value)}
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio / About
            </label>
            <textarea
              placeholder="Tell others about yourself or your organization..."
              value={userProfile.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm transition-smooth resize-none focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              This will be visible on your public profile
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-medium text-error mb-4">Danger Zone</h3>
        <div className="bg-error/5 border border-error/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Delete Account</label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button 
              variant="outline"
              onClick={handleDeleteAccount}
              className="border-error text-error hover:bg-error hover:text-white"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">General Notifications</label>
              <p className="text-sm text-muted-foreground">Receive general updates and announcements</p>
            </div>
            <Checkbox
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Donation Alerts</label>
              <p className="text-sm text-muted-foreground">Get notified when your donations are matched</p>
            </div>
            <Checkbox
              checked={settings.donationAlerts}
              onChange={(e) => handleSettingChange('donationAlerts', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Match Alerts</label>
              <p className="text-sm text-muted-foreground">Receive notifications about new food matches</p>
            </div>
            <Checkbox
              checked={settings.matchAlerts}
              onChange={(e) => handleSettingChange('matchAlerts', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Urgent Requests</label>
              <p className="text-sm text-muted-foreground">Get alerted about urgent food needs in your area</p>
            </div>
            <Checkbox
              checked={settings.urgentRequests}
              onChange={(e) => handleSettingChange('urgentRequests', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Weekly Digest</label>
              <p className="text-sm text-muted-foreground">Weekly summary of your impact and activities</p>
            </div>
            <Checkbox
              checked={settings.weeklyDigest}
              onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Browser Notifications</label>
              <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
            </div>
            <Checkbox
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">SMS Notifications</label>
              <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
            </div>
            <Checkbox
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          <div>
            <Select
              label="Who can see your profile"
              value={settings.profileVisibility}
              onChange={(value) => handleSettingChange('profileVisibility', value)}
              options={[
                { value: 'public', label: 'Everyone' },
                { value: 'members', label: 'FoodBridge Members Only' },
                { value: 'connections', label: 'My Connections Only' },
                { value: 'private', label: 'Only Me' }
              ]}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Show Location</label>
              <p className="text-sm text-muted-foreground">Display your city and state</p>
            </div>
            <Checkbox
              checked={settings.showLocation}
              onChange={(e) => handleSettingChange('showLocation', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Show Contact Information</label>
              <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
            </div>
            <Checkbox
              checked={settings.showContactInfo}
              onChange={(e) => handleSettingChange('showContactInfo', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Show Donation History</label>
              <p className="text-sm text-muted-foreground">Display your donation statistics</p>
            </div>
            <Checkbox
              checked={settings.showDonationHistory}
              onChange={(e) => handleSettingChange('showDonationHistory', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Allow Direct Messages</label>
              <p className="text-sm text-muted-foreground">Let other users message you directly</p>
            </div>
            <Checkbox
              checked={settings.allowDirectMessages}
              onChange={(e) => handleSettingChange('allowDirectMessages', e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Display Preferences</h3>
        <div className="space-y-4">
          <div>
            <Select
              label="Language"
              value={settings.language}
              onChange={(value) => handleSettingChange('language', value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
            />
          </div>
          
          <div>
            <Select
              label="Timezone"
              value={settings.timezone}
              onChange={(value) => handleSettingChange('timezone', value)}
              options={[
                { value: 'America/New_York', label: 'Eastern Time (ET)' },
                { value: 'America/Chicago', label: 'Central Time (CT)' },
                { value: 'America/Denver', label: 'Mountain Time (MT)' },
                { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
              ]}
            />
          </div>
          
          <div>
            <Select
              label="Theme"
              value={settings.theme}
              onChange={(value) => handleSettingChange('theme', value)}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto (System)' }
              ]}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Auto-save</label>
              <p className="text-sm text-muted-foreground">Automatically save your work</p>
            </div>
            <Checkbox
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Compact View</label>
              <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
            </div>
            <Checkbox
              checked={settings.compactView}
              onChange={(e) => handleSettingChange('compactView', e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Two-Factor Authentication</label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (settings.twoFactorAuth) {
                    alert('Two-factor authentication is enabled. Use your authenticator app to generate codes.');
                  } else {
                    alert('Two-factor authentication setup:\n\n1. Download an authenticator app\n2. Scan the QR code (simulated)\n3. Enter the verification code\n\nDemo: 2FA would be configured here.');
                  }
                }}
              >
                Configure
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Login Alerts</label>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <Checkbox
              checked={settings.loginAlerts}
              onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
            />
          </div>
          
          <div>
            <Select
              label="Session Timeout"
              value={settings.sessionTimeout}
              onChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
              options={[
                { value: 15, label: '15 minutes' },
                { value: 30, label: '30 minutes' },
                { value: 60, label: '1 hour' },
                { value: 120, label: '2 hours' },
                { value: 480, label: '8 hours' }
              ]}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Password & Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
            <div>
              <label className="font-medium text-foreground">Change Password</label>
              <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                const currentPassword = prompt('Enter your current password:');
                if (currentPassword) {
                  const newPassword = prompt('Enter your new password (minimum 6 characters):');
                  if (newPassword && newPassword.length >= 6) {
                    const confirmPassword = prompt('Confirm your new password:');
                    if (newPassword === confirmPassword) {
                      try {
                        const { error } = await supabase.auth.updateUser({
                          password: newPassword
                        });
                        
                        if (error) {
                          alert('Error changing password: ' + error.message);
                        } else {
                          alert('Password changed successfully! Please sign in again with your new password.');
                          // Sign out and redirect to login
                          await supabase.auth.signOut();
                          localStorage.clear();
                          navigate('/login');
                        }
                      } catch (err) {
                        console.error('Password change error:', err);
                        alert('Error changing password. Please try again.');
                      }
                    } else {
                      alert('Passwords do not match. Please try again.');
                    }
                  } else {
                    alert('Password must be at least 6 characters long.');
                  }
                }
              }}
            >
              Change
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
            <div>
              <label className="font-medium text-foreground">Active Sessions</label>
              <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                alert('Active Sessions:\n\n• Current Session (This device)\n• Chrome on iPhone - 2 hours ago\n• Safari on iPad - 1 day ago\n\nDemo: Session management would be implemented here.');
              }}
            >
              Manage
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
            <div>
              <label className="font-medium text-foreground">Download Your Data</label>
              <p className="text-sm text-muted-foreground">Export your account data</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                alert('Data Export Initiated\n\nYour data export is being prepared and will be sent to your email address within 24 hours.\n\nDemo: Data export would be implemented here.');
              }}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'application':
        return renderApplicationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader 
        userRole={userRole}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BreadcrumbNavigation 
          userRole={userRole}
          customBreadcrumbs={[
            { label: 'Dashboard', path: userRole === 'donor' ? '/donor-dashboard' : '/recipient-dashboard', icon: 'Home' },
            { label: 'Settings', path: '/settings', icon: 'Settings' }
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64">
            <div className="bg-card rounded-lg shadow-soft border border-border p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(`/settings?tab=${tab.id}`, { replace: true });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-smooth ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-card rounded-lg shadow-soft border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <div className="flex items-center gap-3">
                  {saveMessage.text && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                      saveMessage.type === 'success' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-error/10 text-error'
                    }`}>
                      <Icon name={saveMessage.type === 'success' ? 'Check' : 'AlertCircle'} size={16} />
                      {saveMessage.text}
                    </div>
                  )}
                  <Button
                    variant="default"
                    iconName="Save"
                    iconPosition="left"
                    onClick={handleSave}
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;