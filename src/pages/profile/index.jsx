import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole') || 'donor');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Green Valley Restaurant',
    role: userRole,
    profileImage: null,
    bio: 'Passionate about reducing food waste and helping the community.',
    location: 'San Francisco, CA',
    joinedDate: '2024-01-15',
    // Stats
    totalDonations: userRole === 'donor' ? 127 : 0,
    totalReceived: userRole === 'recipient' ? 89 : 0,
    impactScore: 485,
    carbonSaved: '2.3 tonnes'
  });

  const [editData, setEditData] = useState({ ...profileData });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProfileData({ ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('profileImage', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    {
      label: userRole === 'donor' ? 'Total Donations' : 'Meals Received',
      value: userRole === 'donor' ? profileData.totalDonations : profileData.totalReceived,
      icon: userRole === 'donor' ? 'Package' : 'Utensils',
      color: 'primary'
    },
    {
      label: 'Impact Score',
      value: profileData.impactScore,
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      label: 'Carbon Saved',
      value: profileData.carbonSaved,
      icon: 'Leaf',
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader 
        userRole={userRole}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BreadcrumbNavigation 
          userRole={userRole}
          customBreadcrumbs={[
            { label: 'Dashboard', path: userRole === 'donor' ? '/donor-dashboard' : '/recipient-dashboard', icon: 'Home' },
            { label: 'Profile', path: '/profile', icon: 'User' }
          ]}
        />

        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-card rounded-lg shadow-soft border border-border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-primary/20">
                  {(isEditing ? editData.profileImage : profileData.profileImage) ? (
                    <Image
                      src={isEditing ? editData.profileImage : profileData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                      <Icon name="User" size={32} />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Icon name="Camera" size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? editData.fullName : profileData.fullName}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {isEditing ? editData.organization : profileData.organization}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {isEditing ? editData.location : profileData.location}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Icon name="Calendar" size={14} />
                  Joined {new Date(profileData.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    icon={<Icon name="Edit3" />}
                    iconPosition="left"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      icon={<Icon name="Save" />}
                      iconPosition="left"
                      onClick={handleSave}
                      loading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg shadow-soft border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                    stat.color === 'success' ? 'bg-success/10 text-success' :
                    'bg-accent/10 text-accent'
                  }`}>
                    <Icon name={stat.icon} size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Profile Details */}
          <div className="bg-card rounded-lg shadow-soft border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Profile Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Full Name"
                  value={isEditing ? editData.fullName : profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={isEditing ? editData.email : profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Input
                  label="Phone Number"
                  value={isEditing ? editData.phone : profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Input
                  label="Organization"
                  value={isEditing ? editData.organization : profileData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Input
                  label="Location"
                  value={isEditing ? editData.location : profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Select
                  label="Account Type"
                  value={isEditing ? editData.role : profileData.role}
                  onChange={(value) => handleInputChange('role', value)}
                  disabled={true} // Role shouldn't be editable
                  options={[
                    { value: 'donor', label: 'Food Donor' },
                    { value: 'recipient', label: 'Food Recipient' },
                    { value: 'volunteer', label: 'Volunteer' }
                  ]}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                value={isEditing ? editData.bio : profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Tell us about yourself and your mission..."
              />
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card rounded-lg shadow-soft border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Account Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive updates about your donations and matches</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/settings?tab=notifications')}
                >
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/settings?tab=privacy')}
                >
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/settings?tab=security')}
                >
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-error">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently remove your account and all data</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('Account deletion requested. You will receive an email to confirm this action.');
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;