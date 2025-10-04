import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ userRole = 'donor', customBreadcrumbs = null, className = '' }) => {
  const location = useLocation();

  const getPageTitle = (pathname, userRole) => {
    const routes = {
      '/donor-dashboard': 'Donor Dashboard',
      '/recipient-dashboard': 'Recipient Dashboard',
      '/post-surplus-food': 'Post Surplus Food',
      '/food-details': 'Food Details',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/login': 'Sign In',
      '/register': 'Sign Up'
    };

    return routes?.[pathname] || 'Dashboard';
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    // Always start with dashboard as home
    const dashboardPath = userRole === 'recipient' ? '/recipient-dashboard' : '/donor-dashboard';
    const dashboardLabel = userRole === 'recipient' ? 'Recipient Hub' : 'Donor Hub';
    
    breadcrumbs?.push({
      label: dashboardLabel,
      path: dashboardPath,
      icon: 'Home',
      isHome: true
    });

    // Don't show breadcrumbs on auth pages
    if (['login', 'register']?.includes(pathSegments?.[0])) {
      return [];
    }

    // Don't show breadcrumbs if we're already on dashboard
    if (location?.pathname === dashboardPath) {
      return [];
    }

    // Add current page
    const currentPageTitle = getPageTitle(location?.pathname, userRole);
    if (currentPageTitle !== 'Dashboard') {
      breadcrumbs?.push({
        label: currentPageTitle,
        path: location?.pathname,
        icon: getPageIcon(location?.pathname),
        isCurrent: true
      });
    }

    return breadcrumbs;
  };

  const getPageIcon = (pathname) => {
    const iconMap = {
      '/post-surplus-food': 'Plus',
      '/food-details': 'Package',
      '/profile': 'User',
      '/settings': 'Settings'
    };
    return iconMap?.[pathname] || 'ChevronRight';
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if no breadcrumbs or only one item
  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className={`breadcrumb-navigation ${className}`} aria-label="Breadcrumb">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs?.map((crumb, index) => (
          <React.Fragment key={crumb?.path}>
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground flex-shrink-0" 
              />
            )}
            
            <div className="flex items-center min-w-0">
              {crumb?.isCurrent ? (
                <span className="flex items-center text-foreground font-medium truncate">
                  <Icon 
                    name={crumb?.icon} 
                    size={14} 
                    className="mr-1.5 flex-shrink-0" 
                  />
                  <span className="truncate">{crumb?.label}</span>
                </span>
              ) : (
                <Link
                  to={crumb?.path}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-smooth truncate group"
                >
                  <Icon 
                    name={crumb?.icon} 
                    size={14} 
                    className="mr-1.5 flex-shrink-0 group-hover:text-primary transition-smooth" 
                  />
                  <span className="truncate group-hover:underline">{crumb?.label}</span>
                </Link>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Mobile Simplified Version */}
      <div className="sm:hidden mt-2">
        <Link
          to={breadcrumbs?.[0]?.path || '/'}
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name="ArrowLeft" size={12} className="mr-1" />
          Back to {breadcrumbs?.[0]?.label || 'Dashboard'}
        </Link>
      </div>
      {/* Context Information */}
      {location?.search && (
        <div className="mt-2 text-xs text-muted-foreground font-caption">
          {(() => {
            const params = new URLSearchParams(location.search);
            const section = params?.get('section');
            if (section) {
              const sectionLabels = {
                'active': 'Active Posts',
                'matches': 'AI Matches',
                'history': 'Donation History',
                'available': 'Available Food',
                'requests': 'My Requests',
                'received': 'Received Donations'
              };
              return `Viewing: ${sectionLabels?.[section] || section}`;
            }
            return null;
          })()}
        </div>
      )}
    </nav>
  );
};

export default BreadcrumbNavigation;