import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../supabaseClient';

const RecurringDonation = ({ formData, onFormChange, errors, donationId, onNextStep }) => {
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly (Every 2 weeks)' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom Schedule' }
  ];

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const timeSlotOptions = [
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '22:00', label: '10:00 PM' }
  ];

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const handleRecurringToggle = (checked) => {
    handleInputChange('isRecurring', checked);
    if (!checked) {
      // Clear recurring-related fields
      handleInputChange('recurringSchedule', {});
    }
  };

  const handleScheduleChange = (field, value) => {
    handleInputChange('recurringSchedule', {
      ...formData?.recurringSchedule,
      [field]: value
    });
  };

  const handleDayToggle = (day) => {
    const currentDays = formData?.recurringSchedule?.selectedDays || [];
    const updatedDays = currentDays?.includes(day)
      ? currentDays?.filter(d => d !== day)
      : [...currentDays, day];
    
    handleScheduleChange('selectedDays', updatedDays);
  };

  // Save recurring donation details to Supabase on Next Step
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
    const recurringData = {
      is_recurring: !!formData?.isRecurring,
      recurring_frequency: formData?.recurringSchedule?.frequency || '',
      recurring_days: formData?.recurringSchedule?.selectedDays || [],
      recurring_posting_time: formData?.recurringSchedule?.postingTime || '',
      recurring_pickup_time: formData?.recurringSchedule?.pickupTime || '',
      recurring_typical_quantity: formData?.recurringSchedule?.typicalQuantity || '',
      recurring_duration: formData?.recurringSchedule?.duration || '',
      recurring_auto_post: !!formData?.recurringSchedule?.autoPost,
      recurring_confirm_before_post: !!formData?.recurringSchedule?.confirmBeforePost,
      recurring_use_ai_enhancement: !!formData?.recurringSchedule?.useAIEnhancement
    };

    const { error } = await supabase
      .from('donations')
      .update(recurringData)
      .eq('id', donationId);

    setLoading(false);

    if (error) {
      setErrorMessage('Error saving recurring donation details: ' + error.message);
    } else {
      setSuccessMessage('Recurring donation details saved successfully! You can now proceed to the next step.');
      setNextStepDisabled(true);
      // Don't auto-navigate, let user click "Next Page" manually
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        {/* Recurring Donation Toggle */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Repeat" size={20} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Recurring Donation
              </h3>
              <p className="text-xs text-muted-foreground">
                Set up automatic posting for regular surplus food patterns
              </p>
            </div>
            <Checkbox
              checked={formData?.isRecurring || false}
              onChange={(e) => handleRecurringToggle(e?.target?.checked)}
              label=""
            />
          </div>
        </div>
        {/* Recurring Schedule Configuration */}
        {formData?.isRecurring && (
          <div className="space-y-6 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Calendar" size={16} className="text-primary" />
              <h4 className="text-sm font-heading font-semibold text-foreground">
                Schedule Configuration
              </h4>
            </div>

            {/* Frequency Selection */}
            <Select
              label="Frequency"
              placeholder="How often do you have surplus food?"
              options={frequencyOptions}
              value={formData?.recurringSchedule?.frequency || ''}
              onChange={(value) => handleScheduleChange('frequency', value)}
              error={errors?.recurringSchedule?.frequency}
              required={formData?.isRecurring}
            />

            {/* Day Selection for Weekly/Bi-weekly */}
            {(formData?.recurringSchedule?.frequency === 'weekly' || 
              formData?.recurringSchedule?.frequency === 'bi-weekly') && (
              <div>
                <h5 className="text-sm font-medium text-foreground mb-3">
                  Select Days
                  <span className="text-error ml-1">*</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {dayOptions?.map((day) => {
                    const isSelected = (formData?.recurringSchedule?.selectedDays || [])?.includes(day?.value);
                    
                    return (
                      <button
                        key={day?.value}
                        onClick={() => handleDayToggle(day?.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {day?.label?.substring(0, 3)}
                        </div>
                        {isSelected && (
                          <div className="mt-1 w-3 h-3 mx-auto bg-primary rounded-full flex items-center justify-center">
                            <Icon name="Check" size={8} className="text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors?.recurringSchedule?.selectedDays && (
                  <p className="mt-2 text-xs text-error">{errors?.recurringSchedule?.selectedDays}</p>
                )}
              </div>
            )}

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Usual Posting Time"
                placeholder="When do you usually post?"
                options={timeSlotOptions}
                value={formData?.recurringSchedule?.postingTime || ''}
                onChange={(value) => handleScheduleChange('postingTime', value)}
                error={errors?.recurringSchedule?.postingTime}
                description="When should the system auto-post for you?"
              />

              <Select
                label="Pickup Time Window"
                placeholder="Best pickup time"
                options={timeSlotOptions}
                value={formData?.recurringSchedule?.pickupTime || ''}
                onChange={(value) => handleScheduleChange('pickupTime', value)}
                error={errors?.recurringSchedule?.pickupTime}
                description="When is pickup usually available?"
              />
            </div>

            {/* Quantity Estimation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Typical Quantity"
                type="number"
                placeholder="Average amount"
                value={formData?.recurringSchedule?.typicalQuantity || ''}
                onChange={(e) => handleScheduleChange('typicalQuantity', e?.target?.value)}
                error={errors?.recurringSchedule?.typicalQuantity}
                description="Estimated quantity per occurrence"
                min="1"
              />

              <Input
                label="Duration (weeks)"
                type="number"
                placeholder="How many weeks?"
                value={formData?.recurringSchedule?.duration || ''}
                onChange={(e) => handleScheduleChange('duration', e?.target?.value)}
                error={errors?.recurringSchedule?.duration}
                description="How long will this pattern continue?"
                min="1"
                max="52"
              />
            </div>

            {/* Auto-posting Settings */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="text-sm font-heading font-semibold text-foreground mb-3">
                Auto-posting Settings
              </h5>
              
              <div className="space-y-3">
                <Checkbox
                  label="Enable automatic posting"
                  description="System will create posts automatically based on your schedule"
                  checked={formData?.recurringSchedule?.autoPost || false}
                  onChange={(e) => handleScheduleChange('autoPost', e?.target?.checked)}
                />
                
                <Checkbox
                  label="Send confirmation before posting"
                  description="Get notified before each automatic post is created"
                  checked={formData?.recurringSchedule?.confirmBeforePost || false}
                  onChange={(e) => handleScheduleChange('confirmBeforePost', e?.target?.checked)}
                />
                
                <Checkbox
                  label="Use AI enhancement for recurring posts"
                  description="Automatically enhance descriptions for better matching"
                  checked={formData?.recurringSchedule?.useAIEnhancement || false}
                  onChange={(e) => handleScheduleChange('useAIEnhancement', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Schedule Preview */}
            {formData?.recurringSchedule?.frequency && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h5 className="text-sm font-heading font-semibold text-foreground mb-2">
                  Schedule Preview
                </h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Frequency:</strong> {frequencyOptions?.find(f => f?.value === formData?.recurringSchedule?.frequency)?.label}
                  </p>
                  {formData?.recurringSchedule?.selectedDays && formData?.recurringSchedule?.selectedDays?.length > 0 && (
                    <p>
                      <strong>Days:</strong> {formData?.recurringSchedule?.selectedDays?.map(day => 
                        dayOptions?.find(d => d?.value === day)?.label
                      )?.join(', ')}
                    </p>
                  )}
                  {formData?.recurringSchedule?.postingTime && (
                    <p>
                      <strong>Posting Time:</strong> {timeSlotOptions?.find(t => t?.value === formData?.recurringSchedule?.postingTime)?.label}
                    </p>
                  )}
                  {formData?.recurringSchedule?.duration && (
                    <p>
                      <strong>Duration:</strong> {formData?.recurringSchedule?.duration} weeks
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Benefits of Recurring Donations */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
            Benefits of Recurring Donations
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={12} className="text-success" />
              <span>Save time with automated posting</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={12} className="text-success" />
              <span>Build relationships with regular recipients</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={12} className="text-success" />
              <span>Increase donation impact consistency</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Bell" size={12} className="text-success" />
              <span>Recipients can plan ahead</span>
            </div>
          </div>
        </div>
        
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

export default RecurringDonation;