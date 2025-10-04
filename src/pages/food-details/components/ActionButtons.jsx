import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  foodData, 
  onAccept, 
  onRequestInfo, 
  onDecline,
  userCapacity = 50 
}) => {
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [requestedQuantity, setRequestedQuantity] = useState(foodData?.servings);
  const [declineReason, setDeclineReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptClick = () => {
    if (foodData?.servings > userCapacity) {
      setShowCapacityModal(true);
    } else {
      handleConfirmAccept();
    }
  };

  const handleConfirmAccept = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onAccept) {
        onAccept({
          foodId: foodData?.id,
          requestedQuantity,
          acceptedAt: new Date(),
          estimatedPickup: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
        });
      }
      setIsProcessing(false);
      setShowCapacityModal(false);
    }, 1500);
  };

  const handleDeclineClick = () => {
    setShowDeclineModal(true);
  };

  const handleConfirmDecline = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onDecline) {
        onDecline({
          foodId: foodData?.id,
          reason: declineReason,
          declinedAt: new Date()
        });
      }
      setIsProcessing(false);
      setShowDeclineModal(false);
    }, 1000);
  };

  const handleRequestInfo = () => {
    if (onRequestInfo) {
      onRequestInfo({
        foodId: foodData?.id,
        requestedAt: new Date()
      });
    }
  };

  const declineReasons = [
    'Quantity too large for our capacity',
    'Dietary restrictions not compatible',
    'Pickup time not suitable',
    'Already have sufficient food',
    'Location too far',
    'Other'
  ];

  return (
    <>
      <div className="bg-card rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Take Action
        </h3>

        {/* Primary Actions */}
        <div className="space-y-3 mb-6">
          <Button
            variant="default"
            fullWidth
            iconName="Heart"
            iconPosition="left"
            onClick={handleAcceptClick}
            disabled={isProcessing}
            loading={isProcessing && showCapacityModal}
            className="h-12"
          >
            Accept Donation
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={handleRequestInfo}
              disabled={isProcessing}
            >
              Request Info
            </Button>
            
            <Button
              variant="ghost"
              iconName="X"
              iconPosition="left"
              onClick={handleDeclineClick}
              disabled={isProcessing}
            >
              Decline
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Capacity:</span>
            <span className="font-mono font-medium text-foreground">{userCapacity} servings</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available:</span>
            <span className="font-mono font-medium text-primary">{foodData?.servings} servings</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Match:</span>
            <span className={`font-medium ${
              foodData?.servings <= userCapacity ? 'text-success' : 'text-warning'
            }`}>
              {foodData?.servings <= userCapacity ? 'Perfect Fit' : 'Partial Match'}
            </span>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-center space-x-4 text-sm">
            <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Share2" size={14} className="mr-1" />
              Share
            </button>
            <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Bookmark" size={14} className="mr-1" />
              Save
            </button>
            <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Flag" size={14} className="mr-1" />
              Report
            </button>
          </div>
        </div>
      </div>
      {/* Capacity Confirmation Modal */}
      {showCapacityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-elevated max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Icon name="AlertCircle" size={20} className="text-warning mr-3" />
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Confirm Capacity
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              This donation has {foodData?.servings} servings, but your capacity is {userCapacity} servings. 
              How many servings would you like to request?
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Requested Servings
              </label>
              <input
                type="number"
                min="1"
                max={Math.min(foodData?.servings, userCapacity)}
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(parseInt(e?.target?.value) || 1)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Maximum: {Math.min(foodData?.servings, userCapacity)} servings
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowCapacityModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={handleConfirmAccept}
                loading={isProcessing}
                disabled={isProcessing}
              >
                Confirm Accept
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-elevated max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Icon name="X" size={20} className="text-error mr-3" />
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Decline Donation
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Help us improve our matching by sharing why this donation isn't suitable:
            </p>

            <div className="mb-6">
              <div className="space-y-2">
                {declineReasons?.map((reason) => (
                  <label key={reason} className="flex items-center">
                    <input
                      type="radio"
                      name="declineReason"
                      value={reason}
                      checked={declineReason === reason}
                      onChange={(e) => setDeclineReason(e?.target?.value)}
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDeclineModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={handleConfirmDecline}
                loading={isProcessing}
                disabled={isProcessing || !declineReason}
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;