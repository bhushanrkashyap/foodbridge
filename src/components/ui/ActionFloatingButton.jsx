import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ActionFloatingButton = ({ userRole = 'donor', className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const getRoleAction = () => {
    switch (userRole) {
      case 'donor':
        return {
          label: 'Post Food',
          icon: 'Plus',
          path: '/post-surplus-food',
          variant: 'default',
          description: 'Share surplus food with those in need'
        };
      case 'recipient':
        return {
          label: 'Find Food',
          icon: 'Search',
          path: '/recipient-dashboard?section=available',
          variant: 'default',
          description: 'Browse available food donations'
        };
      default:
        return {
          label: 'Dashboard',
          icon: 'Home',
          path: '/donor-dashboard',
          variant: 'default',
          description: 'Go to dashboard'
        };
    }
  };

  const action = getRoleAction();

  // Hide on auth pages and the target page itself
  const shouldHide = ['/login', '/register', action?.path]?.includes(location?.pathname);

  // Handle scroll behavior for better UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide button
        setIsVisible(false);
      } else {
        // Scrolling up - show button
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleClick = () => {
    navigate(action?.path);
    
    // Track action for analytics
    window.dispatchEvent(new CustomEvent('floatingActionClick', {
      detail: { 
        action: action.label, 
        userRole, 
        fromPath: location.pathname 
      }
    }));
  };

  if (shouldHide) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Main Action Button */}
      <div className={`transition-all duration-300 ease-smooth ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}>
        <Button
          variant={action?.variant}
          size="lg"
          iconName={action?.icon}
          iconPosition="left"
          onClick={handleClick}
          className="shadow-floating hover:shadow-elevated transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <span className="hidden sm:inline">{action?.label}</span>
          <span className="sm:hidden">
            <Icon name={action?.icon} size={20} />
          </span>
        </Button>
      </div>
      {/* Tooltip for mobile */}
      <div className="sm:hidden absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-soft whitespace-nowrap">
          {action?.description}
        </div>
      </div>
      {/* Secondary Actions (Context-aware) */}
      {location?.pathname?.includes('dashboard') && (
        <div className="absolute bottom-full right-0 mb-4 space-y-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
          {userRole === 'donor' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/food-details')}
              className="shadow-soft hover:shadow-elevated transition-all duration-200"
              title="View Food Details"
            >
              <Icon name="Package" size={18} />
            </Button>
          )}
          
          {userRole === 'recipient' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/recipient-dashboard?section=requests')}
              className="shadow-soft hover:shadow-elevated transition-all duration-200"
              title="My Requests"
            >
              <Icon name="Heart" size={18} />
            </Button>
          )}
        </div>
      )}
      {/* Notification Badge */}
      {userRole === 'donor' && location?.pathname === '/donor-dashboard' && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-mono">
          3
        </div>
      )}
      {userRole === 'recipient' && location?.pathname === '/recipient-dashboard' && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-success text-white text-xs rounded-full flex items-center justify-center font-mono">
          7
        </div>
      )}
    </div>
  );
};

export default ActionFloatingButton;