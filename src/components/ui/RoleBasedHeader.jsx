import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedHeader = ({ userRole = 'donor', isMenuOpen = false, onMenuToggle }) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getRoleConfig = () => {
    switch (userRole) {
      case 'donor':
        return {
          title: 'Donor Dashboard',
          primaryAction: { label: 'Post Food', path: '/post-surplus-food', icon: 'Plus' },
          dashboardPath: '/donor-dashboard'
        };
      case 'recipient':
        return {
          title: 'Recipient Dashboard',
          primaryAction: { label: 'Find Food', path: '/recipient-dashboard', icon: 'Search' },
          dashboardPath: '/recipient-dashboard'
        };
      default:
        return {
          title: 'Dashboard',
          primaryAction: { label: 'Dashboard', path: '/donor-dashboard', icon: 'Home' },
          dashboardPath: '/donor-dashboard'
        };
    }
  };

  const roleConfig = getRoleConfig();
  const isAuthPage = ['/login', '/register']?.includes(location?.pathname);

  const navigationItems = [
    { label: 'Dashboard', path: roleConfig?.dashboardPath, icon: 'LayoutDashboard' },
    { label: 'Food Details', path: '/food-details', icon: 'Package' },
    ...(userRole === 'donor' ? [
      { label: 'Post Food', path: '/post-surplus-food', icon: 'Plus' }
    ] : []),
    { label: 'Profile', path: '/profile', icon: 'User' }
  ];

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  if (isAuthPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Utensils" size={20} color="white" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">
                FoodBridge
              </span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={roleConfig?.dashboardPath} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Utensils" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">
              FoodBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to={roleConfig?.dashboardPath}
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                location?.pathname === roleConfig?.dashboardPath
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/food-details"
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                location?.pathname === '/food-details' ?'text-primary' :'text-muted-foreground'
              }`}
            >
              Food Details
            </Link>
            {userRole === 'donor' && (
              <Link
                to="/post-surplus-food"
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  location?.pathname === '/post-surplus-food' ?'text-primary' :'text-muted-foreground'
                }`}
              >
                Post Food
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Primary Action Button - Desktop */}
            <div className="hidden md:block">
              <Button
                variant="default"
                size="sm"
                iconName={roleConfig?.primaryAction?.icon}
                iconPosition="left"
                onClick={() => window.location.href = roleConfig?.primaryAction?.path}
              >
                {roleConfig?.primaryAction?.label}
              </Button>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-smooth">
              <Icon name="Bell" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileToggle}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated animate-slide-down">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Icon name="User" size={16} className="mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Icon name="Settings" size={16} className="mr-3" />
                      Settings
                    </Link>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        // Handle logout
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-muted transition-smooth"
                    >
                      <Icon name="LogOut" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-slide-down">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                    location?.pathname === item?.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={onMenuToggle}
                >
                  <Icon name={item?.icon} size={18} className="mr-3" />
                  {item?.label}
                </Link>
              ))}
              
              {/* Mobile Primary Action */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="default"
                  fullWidth
                  iconName={roleConfig?.primaryAction?.icon}
                  iconPosition="left"
                  onClick={() => {
                    window.location.href = roleConfig?.primaryAction?.path;
                    onMenuToggle();
                  }}
                >
                  {roleConfig?.primaryAction?.label}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default RoleBasedHeader;