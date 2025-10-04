import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentMatchCard = ({ match, onContact, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
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

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft hover:shadow-elevated transition-smooth">
      <div className="flex items-start space-x-3">
        {/* Recipient Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-semibold text-foreground text-sm truncate">
              {match?.recipientName}
            </h4>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(match?.matchedAt)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {match?.recipientType} • {match?.location}
          </p>

          {/* Food Item */}
          <div className="bg-muted/50 rounded-lg p-2 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-background rounded overflow-hidden">
                <Image
                  src={match?.foodImage}
                  alt={match?.foodTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {match?.foodTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {match?.quantity} • {match?.category}
                </p>
              </div>
            </div>
          </div>

          {/* Status and Match Score */}
          <div className="flex items-center justify-between mb-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match?.status)}`}>
              {match?.status?.charAt(0)?.toUpperCase() + match?.status?.slice(1)}
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={12} className="text-primary" />
              <span className="text-xs font-medium text-primary">{match?.matchScore}% match</span>
            </div>
          </div>

          {/* Pickup Info */}
          {match?.pickupTime && (
            <div className="flex items-center space-x-2 mb-3 text-xs text-muted-foreground">
              <Icon name="Calendar" size={12} />
              <span>Pickup: {new Date(match.pickupTime)?.toLocaleDateString()}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="xs"
              iconName="MessageCircle"
              onClick={() => onContact(match?.id)}
              className="flex-1"
            >
              Contact
            </Button>
            <Button
              variant="ghost"
              size="xs"
              iconName="Eye"
              onClick={() => onViewDetails(match?.id)}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentMatchCard;