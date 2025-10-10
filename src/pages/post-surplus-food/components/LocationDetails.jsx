import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LocationDetails = ({ formData, onFormChange, errors }) => {
  const stateOptions = [
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'delhi', label: 'Delhi' }
  ];

  const timeSlotOptions = [
    { value: 'morning', label: 'Morning (6:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (12:00 PM - 6:00 PM)' },
    { value: 'evening', label: 'Evening (6:00 PM - 10:00 PM)' },
    { value: 'flexible', label: 'Flexible Timing' }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Location Detection */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-center">
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
      </div>
      {/* Address Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Street Address */}
        <Input
          label="Street Address"
          type="text"
          placeholder="Building name, street name"
          value={formData?.pickupAddress?.street || ''}
          onChange={(e) => handleInputChange('pickupAddress', {
            ...formData?.pickupAddress,
            street: e?.target?.value
          })}
          error={errors?.pickupAddress?.street}
          required
          className="md:col-span-2"
        />

        {/* Area/Locality */}
        <Input
          label="Area/Locality"
          type="text"
          placeholder="Area, locality, or landmark"
          value={formData?.pickupAddress?.area || ''}
          onChange={(e) => handleInputChange('pickupAddress', {
            ...formData?.pickupAddress,
            area: e?.target?.value
          })}
          error={errors?.pickupAddress?.area}
          required
        />

        {/* City */}
        <Input
          label="City"
          type="text"
          placeholder="City name"
          value={formData?.pickupAddress?.city || ''}
          onChange={(e) => handleInputChange('pickupAddress', {
            ...formData?.pickupAddress,
            city: e?.target?.value
          })}
          error={errors?.pickupAddress?.city}
          required
        />

        {/* State */}
        <Select
          label="State"
          placeholder="Select state"
          options={stateOptions}
          value={formData?.pickupAddress?.state || ''}
          onChange={(value) => handleInputChange('pickupAddress', {
            ...formData?.pickupAddress,
            state: value
          })}
          error={errors?.pickupAddress?.state}
          required
          searchable
        />

        {/* PIN Code */}
        <Input
          label="PIN Code"
          type="text"
          placeholder="6-digit PIN code"
          value={formData?.pickupAddress?.pincode || ''}
          onChange={(e) => handleInputChange('pickupAddress', {
            ...formData?.pickupAddress,
            pincode: e?.target?.value
          })}
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
      {/* Contact Information */}
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
          placeholder="+91 XXXXX XXXXX"
          value={formData?.contactPhone || ''}
          onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
          error={errors?.contactPhone}
          required
          pattern="[+][9][1][0-9]{10}"
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
    </div>
  );
};

export default LocationDetails;