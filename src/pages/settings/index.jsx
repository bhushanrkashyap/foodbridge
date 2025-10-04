import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole') || 'donor');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'notifications');

  const [settings, setSettings] = useState({
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
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'application', label: 'Application', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Lock' }
  ];

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
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const currentPassword = prompt('Enter your current password:');
                if (currentPassword) {
                  const newPassword = prompt('Enter your new password:');
                  if (newPassword && newPassword.length >= 6) {
                    const confirmPassword = prompt('Confirm your new password:');
                    if (newPassword === confirmPassword) {
                      alert('Password changed successfully!');
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
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'application':
        return renderApplicationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderNotificationSettings();
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
                <Button
                  variant="default"
                  icon={<Icon name="Save" />}
                  iconPosition="left"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
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