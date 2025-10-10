import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const OrganizationDetailsForm = ({ userType, formData, onFormChange, errors, className = '' }) => {
  const indianStates = [
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

  const restaurantTypes = [
    { value: 'fine-dining', label: 'Fine Dining Restaurant' },
    { value: 'casual-dining', label: 'Casual Dining Restaurant' },
    { value: 'fast-food', label: 'Fast Food Chain' },
    { value: 'cafe', label: 'Cafe/Coffee Shop' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'catering', label: 'Catering Service' },
    { value: 'hotel', label: 'Hotel Restaurant' },
    { value: 'cloud-kitchen', label: 'Cloud Kitchen' },
    { value: 'food-court', label: 'Food Court Outlet' },
    { value: 'other', label: 'Other Food Business' }
  ];

  const ngoTypes = [
    { value: 'hunger-relief', label: 'Hunger Relief Organization' },
    { value: 'homeless-shelter', label: 'Homeless Shelter' },
    { value: 'orphanage', label: 'Orphanage' },
    { value: 'old-age-home', label: 'Old Age Home' },
    { value: 'community-kitchen', label: 'Community Kitchen' },
    { value: 'disaster-relief', label: 'Disaster Relief Organization' },
    { value: 'educational', label: 'Educational Institution' },
    { value: 'healthcare', label: 'Healthcare Facility' },
    { value: 'religious', label: 'Religious Organization' },
    { value: 'other', label: 'Other NGO/Charity' }
  ];

  const availabilityOptions = [
    { value: 'weekdays', label: 'Weekdays (Mon-Fri)' },
    { value: 'weekends', label: 'Weekends (Sat-Sun)' },
    { value: 'daily', label: 'Daily' },
    { value: 'flexible', label: 'Flexible Schedule' }
  ];

  const getFormTitle = () => {
    switch (userType) {
      case 'restaurant': return 'Restaurant Details';
      case 'ngo': return 'Organization Details';
      default: return 'Organization Details';
    }
  };

  const getFormDescription = () => {
    switch (userType) {
      case 'restaurant': return 'Tell us about your restaurant to help match with the right recipients';
      case 'ngo': return 'Provide your organization details for verification and better matching';
      default: return 'Provide additional details about your organization';
    }
  };

  return (
    <div className={`organization-details-form ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-muted-foreground">
          {getFormDescription()}
        </p>
      </div>
      <div className="space-y-6">
        {/* Restaurant-specific fields */}
        {userType === 'restaurant' && (
          <>
            <Input
              label="Restaurant Name"
              type="text"
              placeholder="Enter your restaurant name"
              value={formData?.organizationName || ''}
              onChange={(e) => onFormChange('organizationName', e?.target?.value)}
              error={errors?.organizationName}
              required
            />

            <Select
              label="Restaurant Type"
              placeholder="Select restaurant type"
              options={restaurantTypes}
              value={formData?.businessType || ''}
              onChange={(value) => onFormChange('businessType', value)}
              error={errors?.businessType}
              required
            />

            <Input
              label="FSSAI License Number"
              type="text"
              placeholder="Enter FSSAI license number"
              value={formData?.licenseNumber || ''}
              onChange={(e) => onFormChange('licenseNumber', e?.target?.value)}
              error={errors?.licenseNumber}
              description="Food Safety and Standards Authority of India license"
              required
            />
          </>
        )}

        {/* NGO-specific fields */}
        {userType === 'ngo' && (
          <>
            <Input
              label="Organization Name"
              type="text"
              placeholder="Enter your organization name"
              value={formData?.organizationName || ''}
              onChange={(e) => onFormChange('organizationName', e?.target?.value)}
              error={errors?.organizationName}
              required
            />

            <Select
              label="Organization Type"
              placeholder="Select organization type"
              options={ngoTypes}
              value={formData?.organizationType || ''}
              onChange={(value) => onFormChange('organizationType', value)}
              error={errors?.organizationType}
              required
            />

            <Input
              label="Registration Number"
              type="text"
              placeholder="NGO/Trust registration number"
              value={formData?.registrationNumber || ''}
              onChange={(e) => onFormChange('registrationNumber', e?.target?.value)}
              error={errors?.registrationNumber}
              description="12A/80G registration or Trust deed number"
              required
            />

            <Input
              label="Beneficiaries Served"
              type="number"
              placeholder="Average number of people served daily"
              value={formData?.beneficiariesCount || ''}
              onChange={(e) => onFormChange('beneficiariesCount', e?.target?.value)}
              error={errors?.beneficiariesCount}
              required
            />
          </>
        )}

        {/* Common address fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            type="text"
            placeholder="Enter your city"
            value={formData?.city || ''}
            onChange={(e) => onFormChange('city', e?.target?.value)}
            error={errors?.city}
            required
          />

          <Select
            label="State"
            placeholder="Select state"
            options={indianStates}
            value={formData?.state || ''}
            onChange={(value) => onFormChange('state', value)}
            error={errors?.state}
            searchable
            required
          />
        </div>

        <Input
          label="Complete Address"
          type="text"
          placeholder="Enter complete address with pincode"
          value={formData?.address || ''}
          onChange={(e) => onFormChange('address', e?.target?.value)}
          error={errors?.address}
          required
        />

        <Input
          label="Pincode"
          type="text"
          placeholder="6-digit pincode"
          value={formData?.pincode || ''}
          onChange={(e) => onFormChange('pincode', e?.target?.value)}
          error={errors?.pincode}
          pattern="[0-9]{6}"
          maxLength={6}
          required
        />

        {/* Operating Hours (for restaurants and NGOs) */}
        {(userType === 'restaurant' || userType === 'ngo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Operating Hours From"
              type="time"
              value={formData?.operatingHoursFrom || ''}
              onChange={(e) => onFormChange('operatingHoursFrom', e?.target?.value)}
              error={errors?.operatingHoursFrom}
              required
            />

            <Input
              label="Operating Hours To"
              type="time"
              value={formData?.operatingHoursTo || ''}
              onChange={(e) => onFormChange('operatingHoursTo', e?.target?.value)}
              error={errors?.operatingHoursTo}
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetailsForm;