import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ notifications = [], onMarkAsRead, onMarkAllAsRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match':
        return 'Users';
      case 'pickup':
        return 'Truck';
      case 'expiry':
        return 'Clock';
      case 'completion':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'match':
        return 'text-primary';
      case 'pickup':
        return 'text-warning';
      case 'expiry':
        return 'text-error';
      case 'completion':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;
  const displayNotifications = isExpanded ? notifications : notifications?.slice(0, 3);

  if (notifications?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft text-center">
        <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-foreground" />
          <h3 className="font-heading font-semibold text-foreground">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>
      {/* Notifications List */}
      <div className="divide-y divide-border">
        {displayNotifications?.map((notification) => (
          <div
            key={notification?.id}
            className={`p-4 hover:bg-muted/50 transition-smooth ${
              !notification?.read ? 'bg-primary/5' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getNotificationColor(notification?.type)}`}>
                <Icon name={getNotificationIcon(notification?.type)} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${!notification?.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {notification?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification?.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification?.timestamp)}
                    </span>
                    {!notification?.read && (
                      <button
                        onClick={() => onMarkAsRead(notification?.id)}
                        className="w-2 h-2 bg-primary rounded-full hover:bg-primary/80 transition-smooth"
                        title="Mark as read"
                      />
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {notification?.actionLabel && notification?.actionUrl && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => window.location.href = notification?.actionUrl}
                    >
                      {notification?.actionLabel}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More/Less */}
      {notifications?.length > 3 && (
        <div className="p-4 border-t border-border text-center">
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : `Show ${notifications?.length - 3} More`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;