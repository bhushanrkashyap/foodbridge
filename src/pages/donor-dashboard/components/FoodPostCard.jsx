import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FoodPostCard = ({ post, onViewDetails, onExtendExpiry, onMarkCollected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'matched':
        return 'bg-primary text-primary-foreground';
      case 'expired':
        return 'bg-error text-error-foreground';
      case 'collected':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeRemaining = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffHours = Math.ceil((expiry - now) / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Expired';
    if (diffHours < 24) return `${diffHours}h left`;
    const days = Math.ceil(diffHours / 24);
    return `${days}d left`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-smooth">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post?.image}
          alt={post?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post?.status)}`}>
            {post?.status?.charAt(0)?.toUpperCase() + post?.status?.slice(1)}
          </span>
        </div>
        {post?.matchCount > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            {post?.matchCount} matches
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-semibold text-foreground text-lg line-clamp-1">
            {post?.title}
          </h3>
          <div className={`flex items-center space-x-1 ${getUrgencyColor(post?.urgency)}`}>
            <Icon name="Clock" size={14} />
            <span className="text-xs font-medium">{post?.urgency}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {post?.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{post?.quantity}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{post?.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{formatTimeRemaining(post?.expiryTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Tag" size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{post?.category}</span>
          </div>
          
          {/* AI Optimization Data - Only show if available */}
          {post?.distance !== undefined && post?.distance !== null && !isNaN(post.distance) && (
            <>
              <div className="flex items-center space-x-2 col-span-2 pt-2 border-t border-border">
                <Icon name="Navigation" size={14} className="text-primary" />
                <span className="text-primary font-semibold">{Number(post.distance).toFixed(2)} km away</span>
                {post?.travelTimeMinutes && (
                  <span className="text-xs text-muted-foreground">• {post.travelTimeMinutes} min travel</span>
                )}
              </div>
              {post?.priorityScore !== undefined && post?.priorityScore !== null && (
                <div className="flex items-center space-x-2 col-span-2">
                  <Icon name="TrendingUp" size={14} className="text-success" />
                  <span className="text-success font-semibold">Priority: {Number(post.priorityScore).toFixed(1)}</span>
                  {post?.timeUntilExpiryMinutes && (
                    <span className="text-xs text-muted-foreground">
                      ({post.timeUntilExpiryMinutes} min left)
                    </span>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* Show message if location data is missing */}
          {(post?.distance === undefined || post?.distance === null || isNaN(post.distance)) && (
            <div className="flex items-center space-x-2 col-span-2 pt-2 border-t border-border">
              <Icon name="MapPin" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground italic">
                📍 Click 'View Details' to calculate distance & feasibility
              </span>
            </div>
          )}
        </div>

        {/* Match Info */}
        {post?.status === 'matched' && post?.recipient && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{post?.recipient?.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning" />
                <span className="text-sm font-medium text-foreground">{post?.matchScore}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pickup scheduled: {new Date(post.pickupTime)?.toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(post?.id)}
            className="flex-1"
          >
            View Details
          </Button>
          
          {post?.status === 'matched' && (
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              onClick={() => onMarkCollected(post?.id)}
            >
              Collected
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodPostCard;