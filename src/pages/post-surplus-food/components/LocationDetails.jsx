import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const LocationDetails = ({ formData, onFormChange, donationId, errors, onNextStep }) => {
  const stateOptions = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' }
  ];

  const timeSlotOptions = [
    { value: 'Morning (6–12 AM)', label: 'Morning (6–12 AM)' },
    { value: 'Afternoon (12–6 PM)', label: 'Afternoon (12–6 PM)' },
    { value: 'Evening (6–10 PM)', label: 'Evening (6–10 PM)' },
    { value: 'Flexible Timing', label: 'Flexible Timing' }
  ];

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    onFormChange(newData);
  };

  // Save location details to Supabase on Next Step
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

    // ✅ Clean and validate phone number before sending
    let cleanedPhone = null;
    if (formData?.contactPhone && formData.contactPhone.trim() !== '') {
      const digits = formData.contactPhone.replace(/\D/g, '').slice(-10);
      cleanedPhone = digits.length === 10 ? digits : null;
    }

    // Prepare data for update
    const locationData = {
      pickup_state: formData?.pickupAddress?.state || '',
      pickup_pin_code: formData?.pickupAddress?.pincode || '',
      preferred_pickup_time: formData?.preferredPickupTime || '',
      pickup_street_address: formData?.pickupAddress?.street || '',
      pickup_area: formData?.pickupAddress?.area || '',
      pickup_city: formData?.pickupAddress?.city || '',
      pickup_instructions: formData?.pickupInstructions || '',
      contact_person_name: formData?.contactPerson || '',
      contact_phone: cleanedPhone
    };

    const { error } = await supabase
      .from('donations')
      .update(locationData)
      .eq('id', donationId);

    setLoading(false);

    if (error) {
      setErrorMessage('Error saving location details: ' + error.message);
    } else {
      setSuccessMessage('Location details saved successfully! You can now proceed to the next step.');
      setNextStepDisabled(true);
      // Don't auto-navigate, let user click "Next Page" manually
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        {/* Location Section Header */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="MapPin" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-semibold text-foreground">
                Pickup Location
              </h3>
              <p className="text-xs text-muted-foreground">
                Add your pickup address
              </p>
            </div>
          </div>
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Street Address"
            type="text"
            placeholder="Building name, street name"
            value={formData?.pickupAddress?.street || ''}
            onChange={(e) =>
              handleInputChange('pickupAddress', {
                ...formData?.pickupAddress,
                street: e?.target?.value
              })
            }
            error={errors?.pickupAddress?.street}
            required
            className="md:col-span-2"
          />

          <Input
            label="Area/Locality"
            type="text"
            placeholder="Area, locality, or landmark"
            value={formData?.pickupAddress?.area || ''}
            onChange={(e) =>
              handleInputChange('pickupAddress', {
                ...formData?.pickupAddress,
                area: e?.target?.value
              })
            }
            error={errors?.pickupAddress?.area}
            required
          />

          <Input
            label="City"
            type="text"
            placeholder="City name"
            value={formData?.pickupAddress?.city || ''}
            onChange={(e) =>
              handleInputChange('pickupAddress', {
                ...formData?.pickupAddress,
                city: e?.target?.value
              })
            }
            error={errors?.pickupAddress?.city}
            required
          />

          <Select
            label="State"
            placeholder="Select state"
            options={stateOptions}
            value={formData?.pickupAddress?.state || ''}
            onChange={(value) =>
              handleInputChange('pickupAddress', {
                ...formData?.pickupAddress,
                state: value
              })
            }
            error={errors?.pickupAddress?.state}
            required
            searchable
          />

          <Input
            label="PIN Code"
            type="text"
            placeholder="6-digit PIN code"
            value={formData?.pickupAddress?.pincode || ''}
            onChange={(e) =>
              handleInputChange('pickupAddress', {
                ...formData?.pickupAddress,
                pincode: e?.target?.value
              })
            }
            error={errors?.pickupAddress?.pincode}
            required
            pattern="[0-9]{6}"
            maxLength="6"
          />
        </div>

        {/* Pickup Instructions */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Pickup Instructions
          </label>
          <textarea
            placeholder="Special instructions for pickup (e.g., gate number, contact person, best time to call)..."
            value={formData?.pickupInstructions || ''}
            onChange={(e) => handleInputChange('pickupInstructions', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm transition-smooth resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Help recipients find and collect the food easily
          </p>
        </div>

        {/* Preferred Pickup Time */}
        <Select
          label="Preferred Pickup Time"
          placeholder="Select preferred time slot"
          options={timeSlotOptions}
          value={formData?.preferredPickupTime || ''}
          onChange={(value) => handleInputChange('preferredPickupTime', value)}
          error={errors?.preferredPickupTime}
          description="When would be the best time for pickup?"
        />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Contact Person"
            type="text"
            placeholder="Name of contact person"
            value={formData?.contactPerson || ''}
            onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
            error={errors?.contactPerson}
            required
          />

          <Input
            label="Contact Phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX or 9876543210"
            value={formData?.contactPhone || ''}
            onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
            error={errors?.contactPhone}
            required
            pattern="[0-9+ ]{10,15}"
            title="Enter a valid phone number (10 digits, with or without +91)"
          />
        </div>

        {/* Map Preview */}
        {formData?.pickupAddress?.latitude && formData?.pickupAddress?.longitude && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border">
              <h4 className="text-sm font-heading font-semibold text-foreground">
                Pickup Location Preview
              </h4>
            </div>
            <div className="h-48">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Pickup Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${formData?.pickupAddress?.latitude},${formData?.pickupAddress?.longitude}&z=16&output=embed`}
              />
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

export default LocationDetails;
