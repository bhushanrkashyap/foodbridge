import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const DonorInformation = ({ donorData }) => {
  const {
    name,
    type,
    avatar,
    rating,
    totalDonations,
    successRate,
    verificationBadges,
    location,
    operatingHours,
    contactInfo,
    description,
    joinedDate,
    lastActive
  } = donorData;

  const getBadgeIcon = (badge) => {
    const icons = {
      verified: 'CheckCircle',
      'food-safety': 'Shield',
      'eco-friendly': 'Leaf',
      'top-donor': 'Star',
      'quick-response': 'Zap'
    };
    return icons?.[badge] || 'Award';
  };

  const getBadgeColor = (badge) => {
    const colors = {
      verified: 'text-success bg-success/10',
      'food-safety': 'text-primary bg-primary/10',
      'eco-friendly': 'text-success bg-success/10',
      'top-donor': 'text-warning bg-warning/10',
      'quick-response': 'text-accent bg-accent/10'
    };
    return colors?.[badge] || 'text-muted-foreground bg-muted';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });
  };

  const getLastActiveText = (lastActive) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInHours = Math.floor((now - lastActiveDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `Active ${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Active ${diffInDays}d ago`;
  };

  return (
    <div className="bg-card rounded-lg shadow-soft overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-b border-border">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Image
              src={avatar}
              alt={`${name} profile`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-soft"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white flex items-center justify-center">
              <Icon name="Check" size={10} color="white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-heading font-bold text-foreground">{name}</h2>
              <span className="text-sm px-2 py-1 bg-muted rounded-full text-muted-foreground capitalize">
                {type}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(rating)}
                <span className="text-sm font-mono font-medium text-foreground ml-1">
                  {rating?.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {getLastActiveText(lastActive)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {verificationBadges?.map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
            >
              <Icon name={getBadgeIcon(badge)} size={12} className="mr-1" />
              {badge?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
            </span>
          ))}
        </div>
      </div>
      {/* Statistics */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-4">
          Donation Statistics
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary mb-1">
              {totalDonations}
            </div>
            <div className="text-xs text-muted-foreground">Total Donations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-success mb-1">
              {successRate}%
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-accent mb-1">
              {formatDate(joinedDate)}
            </div>
            <div className="text-xs text-muted-foreground">Member Since</div>
          </div>
        </div>
      </div>
      {/* Location & Contact */}
      <div className="p-6">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-4">
          Location & Contact
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">{location?.address}</div>
              <div className="text-xs text-muted-foreground">
                {location?.city}, {location?.state} - {location?.pincode}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <div className="text-sm text-foreground">
              <span className="font-medium">Operating Hours:</span> {operatingHours}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
            <div className="text-sm text-foreground font-mono">
              {contactInfo?.phone}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="Mail" size={16} className="text-muted-foreground" />
            <div className="text-sm text-foreground">
              {contactInfo?.email}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
            <Icon name="MessageCircle" size={14} className="mr-2" />
            Message
          </button>
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            <Icon name="Phone" size={14} className="mr-2" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorInformation;