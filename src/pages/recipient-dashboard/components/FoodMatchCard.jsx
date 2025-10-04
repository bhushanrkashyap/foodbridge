import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FoodMatchCard = ({ match, onAccept, onReject }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const rejectReasons = [
    "Dietary restrictions don't match",
    "Pickup location too far",
    "Insufficient quantity needed",
    "Already have similar food",
    "Timing doesn't work",
    "Other"
  ];

  const handleAccept = () => {
    onAccept(match?.id);
  };

  const handleReject = (reason) => {
    onReject(match?.id, reason);
    setShowRejectReason(false);
    setSelectedReason('');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-elevated transition-smooth overflow-hidden">
      {/* Header with donor info */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Store" size={20} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">{match?.donorName}</h3>
              <p className="text-sm text-muted-foreground">{match?.donorType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(match?.urgency)}`}>
              {match?.urgency} priority
            </span>
            <div className="text-right">
              <div className={`text-lg font-mono font-bold ${getCompatibilityColor(match?.compatibilityScore)}`}>
                {match?.compatibilityScore}%
              </div>
              <div className="text-xs text-muted-foreground">match</div>
            </div>
          </div>
        </div>
      </div>
      {/* Food details */}
      <div className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={match?.foodImage}
              alt={match?.foodName}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-semibold text-foreground mb-2">{match?.foodName}</h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{match?.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Icon name="Package" size={16} className="mr-2" />
                <span>{match?.quantity} {match?.unit}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Icon name="Clock" size={16} className="mr-2" />
                <span>Expires {match?.expiryTime}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Icon name="MapPin" size={16} className="mr-2" />
                <span>{match?.distance} km away</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Icon name="Users" size={16} className="mr-2" />
                <span>~{match?.estimatedMeals} meals</span>
              </div>
            </div>

            {/* Food categories */}
            <div className="flex flex-wrap gap-2 mt-3">
              {match?.categories?.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pickup details */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Icon name="MapPin" size={16} className="mr-2" />
              <span>{match?.pickupAddress}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Icon name="Clock" size={16} className="mr-2" />
              <span>Available until {match?.availableUntil}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {!showRejectReason ? (
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={() => setShowRejectReason(true)}
              className="flex-1"
            >
              Pass
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={handleAccept}
              className="flex-1"
            >
              Accept Match
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Why are you passing on this match?</p>
            <div className="grid grid-cols-1 gap-2">
              {rejectReasons?.map((reason, index) => (
                <button
                  key={index}
                  onClick={() => handleReject(reason)}
                  className="text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
                >
                  {reason}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRejectReason(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodMatchCard;