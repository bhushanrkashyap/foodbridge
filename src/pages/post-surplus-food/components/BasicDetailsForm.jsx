import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../supabaseClient';

const BasicDetailsForm = ({ formData, onFormChange, donationId, errors, analysis, imageUrl, onNextStep, onDonationIdChange }) => {
  const foodTypeOptions = [
  { value: 'prepared-meals', label: 'Prepared Meals' },
  { value: 'non-perishable', label: 'Non-Perishable' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'fresh-produce', label: 'Fresh Produce' },
  { value: 'bakery-items', label: 'Bakery Items' },
];

  const quantityUnitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'l', label: 'Liters (L)' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'plates', label: 'Plates/Servings' },
    { value: 'packets', label: 'Packets' },
    { value: 'boxes', label: 'Boxes' }
  ];

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    onFormChange(newData);
  };

  const formatDateTimeForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d?.getFullYear();
    const month = String(d?.getMonth() + 1)?.padStart(2, '0');
    const day = String(d?.getDate())?.padStart(2, '0');
    const hours = String(d?.getHours())?.padStart(2, '0');
    const minutes = String(d?.getMinutes())?.padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (value) => {
    const date = new Date(value);
    handleInputChange('expiryDateTime', date?.toISOString());
  };

  // Store only basic details in Supabase on Next Step
  const handleNextStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Validate required fields before saving
    if (
      !formData.foodName ||
      !formData.foodType ||
      !formData.quantity ||
      !formData.quantityUnit ||
      !formData.estimatedServings ||
      !formData.expiryDateTime ||
      !formData.description
    ) {
      setErrorMessage('Please fill all required fields before proceeding.');
      setLoading(false);
      return;
    }

    const donationData = {
      image_url: imageUrl || '',
      food_name: formData.foodName,
      food_type: formData.foodType,
      quantity: Number(formData.quantity),
      unit: formData.quantityUnit,
      estimated_servings: Number(formData.estimatedServings),
      expiry_datetime: formData.expiryDateTime,
      description: formData.description,
      created_at: new Date().toISOString()
    };

    let result;
    if (donationId) {
      result = await supabase
        .from('donations')
        .update(donationData)
        .eq('id', donationId)
        .select('id');
    } else {
      result = await supabase
        .from('donations')
        .insert([donationData])
        .select('id')
        .single();
    }

    setLoading(false);

    if (result.error) {
      setErrorMessage('Error: ' + result.error.message);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Basic details saved successfully! You can now proceed to the next step.');
      setErrorMessage('');
      setNextStepDisabled(true);
      if (!donationId && result.data?.id && typeof onDonationIdChange === 'function') {
        onDonationIdChange(result.data.id);
      }
      // Don't auto-navigate, let user click "Next Page" manually
    }
  };

  // Only render warning if not fresh
  const isExpired = analysis && analysis.freshness?.toLowerCase().includes('expired');

  if (
    analysis &&
    (
      analysis.freshness?.toLowerCase() !== "fresh" ||
      analysis.freshness?.toLowerCase() === "n/a" ||
      (analysis.advice && analysis.advice.toLowerCase().includes("non-deliverable"))
    )
  ) {
    return (
      <div className="space-y-6">
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-error font-semibold">
          ⚠️ Warning: This food is not fresh or non-deliverable. You cannot post this item.
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Food Name */}
        <Input
          label="Food Name"
          type="text"
          placeholder="e.g., Vegetable Biryani, Fresh Tomatoes"
          value={formData?.foodName || ''}
          onChange={(e) => handleInputChange('foodName', e?.target?.value)}
          error={errors?.foodName}
          required
          className="md:col-span-2"
          disabled={isExpired}
        />

        {/* Food Type */}
        <Select
          label="Food Type"
          placeholder="Select food category"
          options={foodTypeOptions}
          value={formData?.foodType || ''}
          onChange={(value) => handleInputChange('foodType', value)}
          error={errors?.foodType}
          required
          disabled={isExpired}
        />

        {/* Quantity */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity"
            type="number"
            placeholder="0"
            value={formData?.quantity || ''}
            onChange={(e) => handleInputChange('quantity', e?.target?.value)}
            error={errors?.quantity}
            required
            min="1"
            disabled={isExpired}
          />
          <Select
            label="Unit"
            placeholder="Select unit"
            options={quantityUnitOptions}
            value={formData?.quantityUnit || ''}
            onChange={(value) => handleInputChange('quantityUnit', value)}
            error={errors?.quantityUnit}
            required
            disabled={isExpired}
          />
        </div>
      </div>
      {/* Expiry Date & Time */}
      <Input
        label="Expiry Date & Time"
        type="datetime-local"
        value={formatDateTimeForInput(formData?.expiryDateTime)}
        onChange={(e) => handleDateTimeChange(e?.target?.value)}
        error={errors?.expiryDateTime}
        required
        description="When does this food expire? (DD/MM/YYYY format)"
        min={new Date()?.toISOString()?.slice(0, 16)}
        disabled={isExpired}
      />
      {/* Initial Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Food Description
          <span className="text-error ml-1">*</span>
        </label>
        <textarea
          placeholder="Describe the food item, its condition, preparation method, and any special notes..."
          value={formData?.description || ''}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg text-sm transition-smooth resize-none ${
            errors?.description
              ? 'border-error focus:border-error focus:ring-error/20' :'border-border focus:border-primary focus:ring-primary/20'
          } focus:outline-none focus:ring-2`}
          required
          disabled={isExpired}
        />
        {errors?.description && (
          <p className="mt-1 text-xs text-error">{errors?.description}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Minimum 20 characters. You can enhance this description using AI after filling basic details.
        </p>
      </div>
      {/* Estimated Servings */}
      <Input
        label="Estimated Servings"
        type="number"
        placeholder="How many people can this feed?"
        value={formData?.estimatedServings || ''}
        onChange={(e) => handleInputChange('estimatedServings', e?.target?.value)}
        error={errors?.estimatedServings}
        description="Approximate number of people this food can serve"
        min="1"
        disabled={isExpired}
      />
      
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
    </form>
  );
};

export default BasicDetailsForm;