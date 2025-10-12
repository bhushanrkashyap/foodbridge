import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const DashboardNavigation = ({ userRole = 'donor', className = '' }) => {
  const location = useLocation();

  const getDashboardSections = () => {
    switch (userRole) {
      case 'donor':
        return [
          {
            id: 'overview',
            label: 'Overview',
            icon: 'BarChart3',
            path: '/donor-dashboard',
            description: 'Dashboard metrics and summary'
          },
          {
            id: 'active-posts',
            label: 'Active Posts',
            icon: 'Package',
            path: '/donor-dashboard?section=active',
            description: 'Your current food listings'
          },
          {
            id: 'matches',
            label: 'Matches',
            icon: 'Users',
            path: '/donor-dashboard?section=matches',
            description: 'AI-matched recipients'
          },
          {
            id: 'history',
            label: 'History',
            icon: 'Clock',
            path: '/donor-dashboard?section=history',
            description: 'Past donations and impact'
          }
        ];
      case 'recipient':
        return [
          {
            id: 'overview',
            label: 'Overview',
            icon: 'BarChart3',
            path: '/recipient-dashboard',
            description: 'Dashboard metrics and summary'
          },
          {
            id: 'available-food',
            label: 'Available Food',
            icon: 'Search',
            path: '/recipient-dashboard?section=available',
            description: 'Browse available donations'
          },
          {
            id: 'requests',
            label: 'My Requests',
            icon: 'Heart',
            path: '/recipient-dashboard?section=requests',
            description: 'Your food requests'
          },
          {
            id: 'received',
            label: 'Received',
            icon: 'CheckCircle',
            path: '/recipient-dashboard?section=received',
            description: 'Completed donations'
          }
        ];
      default:
        return [];
    }
  };

  const sections = getDashboardSections();
  const currentSection = new URLSearchParams(location.search)?.get('section') || 'overview';

  const handleSectionClick = (sectionId) => {
    // Emit custom event for dashboard section change
    window.dispatchEvent(new CustomEvent('dashboardSectionChange', {
      detail: { section: sectionId, userRole }
    }));
  };

  return (
    <nav className={`dashboard-navigation ${className}`}>
      {/* Desktop Sidebar Navigation - Fixed/Sticky */}
      <div className="hidden lg:block w-64 bg-card border-r border-border fixed left-0 top-16 bottom-0 overflow-y-auto z-30">
        <div className="p-6">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-6">
            {userRole === 'donor' ? 'Donor Hub' : 'Recipient Hub'}
          </h2>
          
          <div className="space-y-2">
            {sections?.map((section) => {
              const isActive = currentSection === section?.id?.replace(/.*-/, '');
              
              return (
                <Link
                  key={section?.id}
                  to={section?.path}
                  onClick={() => handleSectionClick(section?.id)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-smooth group ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon 
                    name={section?.icon} 
                    size={18} 
                    className={`mr-3 ${isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{section?.label}</div>
                    <div className={`text-xs mt-1 ${
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {section?.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-accent rounded-full ml-2"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2">
              {userRole === 'donor' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Posts</span>
                    <span className="font-mono font-medium text-foreground">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Donated</span>
                    <span className="font-mono font-medium text-success">847 lbs</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Requests</span>
                    <span className="font-mono font-medium text-foreground">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Received</span>
                    <span className="font-mono font-medium text-success">234 lbs</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-card border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          {sections?.map((section) => {
            const isActive = currentSection === section?.id?.replace(/.*-/, '');
            
            return (
              <Link
                key={section?.id}
                to={section?.path}
                onClick={() => handleSectionClick(section?.id)}
                className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium transition-smooth border-b-2 ${
                  isActive
                    ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon 
                  name={section?.icon} 
                  size={16} 
                  className="mr-2"
                />
                {section?.label}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Mobile Stats Bar */}
      <div className="lg:hidden bg-muted/50 px-4 py-2 border-b border-border">
        <div className="flex justify-around text-center">
          {userRole === 'donor' ? (
            <>
              <div>
                <div className="text-xs text-muted-foreground">Active</div>
                <div className="font-mono font-medium text-sm">12</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Donated</div>
                <div className="font-mono font-medium text-sm text-success">847 lbs</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Impact</div>
                <div className="font-mono font-medium text-sm text-primary">156 meals</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-xs text-muted-foreground">Requests</div>
                <div className="font-mono font-medium text-sm">3</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Received</div>
                <div className="font-mono font-medium text-sm text-success">234 lbs</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Saved</div>
                <div className="font-mono font-medium text-sm text-primary">89 meals</div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;