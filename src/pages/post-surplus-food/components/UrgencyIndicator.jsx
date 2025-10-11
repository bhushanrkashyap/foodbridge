import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../supabaseClient';

const UrgencyIndicator = ({ formData, onFormChange, errors, donationId, onNextStep }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const urgencyLevels = [
    {
      value: 'Low Priority',
      label: 'Low Priority',
      description: 'Can wait 24+ hours',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: 'Clock'
    },
    {
      value: 'Medium Priority',
      label: 'Medium Priority',
      description: 'Should be picked up within 12-24 hours',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: 'Clock3'
    },
    {
      value: 'High Priority',
      label: 'High Priority',
      description: 'Needs pickup within 6-12 hours',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: 'Clock9'
    },
    {
      value: 'Urgent',
      label: 'Urgent',
      description: 'Must be picked up within a few hours',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: 'AlertCircle'
    }
  ];

  const reasonOptions = [
    { value: 'expiring-soon', label: 'Food expiring soon' },
    { value: 'end-of-day', label: 'End of business day' },
    { value: 'event-ended', label: 'Event/function ended' },
    { value: 'overproduction', label: 'Overproduction' },
    { value: 'cancelled-order', label: 'Cancelled order' },
    { value: 'storage-issue', label: 'Storage space issue' },
    { value: 'other', label: 'Other reason' }
  ];

  useEffect(() => {
    if (formData?.expiryDateTime) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const expiry = new Date(formData.expiryDateTime);
        const diff = expiry - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining({ hours, minutes, total: diff });
        } else {
          setTimeRemaining({ hours: 0, minutes: 0, total: 0 });
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [formData?.expiryDateTime]);

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const handleUrgencySelect = (urgencyLevel) => {
    handleInputChange('urgencyLevel', urgencyLevel);
  };

  const getAutoSuggestedUrgency = () => {
    if (!timeRemaining) return null;
    
    const hoursLeft = timeRemaining?.hours;
    
    if (hoursLeft <= 6) return 'Urgent';
    if (hoursLeft <= 12) return 'High Priority';
    if (hoursLeft <= 24) return 'Medium Priority';
    return 'Low Priority';
  };

  const suggestedUrgency = getAutoSuggestedUrgency();

  // Next Step button handler
  const handleNextStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!donationId) {
      setErrorMessage('Donation ID not found. Please complete the basic details step first.');
      setLoading(false);
      return;
    }

    // Prepare data for update
    const updateData = {
      urgency_level: formData?.urgencyLevel || null,
      donation_reason: formData?.donationReason || null,
      urgency_notes: formData?.urgencyNotes || null,
      dietary_type: formData?.dietaryType || null,
      spice_level: formData?.spiceLevel || null,
      allergens: formData?.allergens || [],
      additional_notes: formData?.dietaryNotes || null
    };

    const { error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', donationId);

    setLoading(false);

    if (error) {
      setErrorMessage('Error saving urgency details: ' + error.message);
    } else {
      setSuccessMessage('Urgency details saved successfully! You can now proceed to the next step.');
      setNextStepDisabled(true);
      // Don't auto-navigate, let user click "Next Page" manually
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        {/* Time Remaining Display */}
        {timeRemaining && (
          <div className={`rounded-lg p-4 border-2 ${
            timeRemaining?.hours <= 2 
              ? 'bg-red-50 border-red-200' 
              : timeRemaining?.hours <= 6 
              ? 'bg-orange-50 border-orange-200'
              : timeRemaining?.hours <= 12
              ? 'bg-yellow-50 border-yellow-200' :'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                timeRemaining?.hours <= 2 
                  ? 'bg-red-100' 
                  : timeRemaining?.hours <= 6 
                  ? 'bg-orange-100'
                  : timeRemaining?.hours <= 12
                  ? 'bg-yellow-100' :'bg-green-100'
              }`}>
                <Icon 
                  name={timeRemaining?.hours <= 2 ? 'AlertTriangle' : 'Clock'} 
                  size={24} 
                  className={
                    timeRemaining?.hours <= 2 
                      ? 'text-red-600' 
                      : timeRemaining?.hours <= 6 
                      ? 'text-orange-600'
                      : timeRemaining?.hours <= 12
                      ? 'text-yellow-600' :'text-green-600'
                  } 
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  {timeRemaining?.total > 0 ? (
                    <>
                      {timeRemaining?.hours}h {timeRemaining?.minutes}m remaining
                    </>
                  ) : (
                    'Food has expired'
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {timeRemaining?.total > 0 ? 'Until expiry time' : 'Please update expiry time'}
                </p>
              </div>
              
              {suggestedUrgency && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">AI Suggested</div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    urgencyLevels?.find(u => u?.value === suggestedUrgency)?.color
                  }`}>
                    {urgencyLevels?.find(u => u?.value === suggestedUrgency)?.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Urgency Level Selection */}
        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
            Urgency Level
            <span className="text-error ml-1">*</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Select the urgency level to help prioritize your donation
          </p>
          
          <div className="space-y-3">
            {urgencyLevels?.map((level) => {
              const isSelected = formData?.urgencyLevel === level?.value;
              const isSuggested = suggestedUrgency === level?.value;
              
              return (
                <button
                  key={level?.value}
                  onClick={() => handleUrgencySelect(level?.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? `${level?.color} border-current shadow-soft`
                      : 'bg-card border-border hover:border-primary/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={level?.icon} 
                      size={20} 
                      className={isSelected ? 'text-current' : 'text-muted-foreground'} 
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-heading font-semibold text-sm ${
                          isSelected ? 'text-current' : 'text-foreground'
                        }`}>
                          {level?.label}
                        </span>
                        {isSuggested && !isSelected && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            AI Suggested
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        isSelected ? 'text-current/80' : 'text-muted-foreground'
                      }`}>
                        {level?.description}
                      </p>
                    </div>
                    
                    {isSelected && (
                      <div className="w-5 h-5 bg-current rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {errors?.urgencyLevel && (
            <p className="mt-2 text-xs text-error">{errors?.urgencyLevel}</p>
          )}
        </div>
        {/* Reason for Donation */}
        <Select
          label="Reason for Donation"
          placeholder="Why is this food available for donation?"
          options={reasonOptions}
          value={formData?.donationReason || ''}
          onChange={(value) => handleInputChange('donationReason', value)}
          error={errors?.donationReason}
          description="This helps recipients understand the context"
        />
        {/* Additional Urgency Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Urgency Notes
          </label>
          <textarea
            placeholder="Any additional information about timing, special handling requirements, or urgency factors..."
            value={formData?.urgencyNotes || ''}
            onChange={(e) => handleInputChange('urgencyNotes', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm transition-smooth resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Provide context that might help recipients prioritize this donation
          </p>
        </div>
        {/* Urgency Impact Preview */}
        {formData?.urgencyLevel && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-heading font-semibold text-foreground mb-2">
              Impact of Selected Urgency Level
            </h4>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={12} className="text-primary" />
                <span>Higher urgency = faster matching with recipients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Bell" size={12} className="text-primary" />
                <span>Urgent items get priority notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={12} className="text-primary" />
                <span>Location-based matching prioritized for urgent items</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Save & Continue Button */}
        <Button
          variant="primary"
          onClick={handleNextStep}
          loading={loading}
          disabled={loading || nextStepDisabled}
          className="w-full mt-6"
          iconName="Save"
          iconPosition="left"
        >
          {loading ? 'Saving...' : nextStepDisabled ? 'Saved ✓' : 'Save'}
        </Button>
        
        {successMessage && (
          <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded text-success text-center font-semibold">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-3 bg-error/10 border border-error/30 rounded text-error text-center font-semibold">
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
};

export default UrgencyIndicator;