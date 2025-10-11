import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { supabase } from '../../../supabaseClient';

const BasicDetailsForm = ({ formData, onFormChange, donationId, errors, analysis, imageUrl }) => {
  const foodTypeOptions = [
  { value: 'prepared-meals', label: 'Prepared Meals' },
  { value: 'non-perishable', label: 'Non-Perishable' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'fresh-produce', label: 'Fresh Produce' },
  { value: 'bakery-items', label: 'Bakery Items' },
];

  const quantityUnitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'grams', label: 'Grams (g)' },
    { value: 'liters', label: 'Liters (L)' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'plates', label: 'Plates/Servings' },
    { value: 'packets', label: 'Packets' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'bags', label: 'Bags' }
  ];

  const [loading, setLoading] = useState(false);

  const handleInputChange = async (field, value) => {
    const newData = { ...formData, [field]: value };
    onFormChange(newData);
    if (donationId) {
      await supabase
        .from('donations')
        .update({ [field]: value })
        .eq('id', donationId);
    }
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

  // Submit handler to send data to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use imageUrl prop from PhotoUpload.jsx
    const donationData = {
      image_url: imageUrl || '',
      food_name: formData.foodName,
      food_type: formData.foodType,
      quantity: Number(formData.quantity),
      unit: formData.quantityUnit,
      estimated_servings: Number(formData.estimatedServings),
      expiry_datetime: formData.expiryDateTime,
      description: formData.description, // <-- store food description
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('donations')
      .insert([donationData]);

    setLoading(false);

    if (error) {
      alert('Error posting donation: ' + error.message);
    } else {
      alert('Donation posted successfully!');
      // Optionally reset form or navigate
    }
  };

  // Only render warning if not fresh
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
    <form className="space-y-6" onSubmit={handleSubmit}>
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
          />
          <Select
            label="Unit"
            placeholder="Select unit"
            options={quantityUnitOptions}
            value={formData?.quantityUnit || ''}
            onChange={(value) => handleInputChange('quantityUnit', value)}
            error={errors?.quantityUnit}
            required
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
      />
      {/* Removed Post Donation button */}
    </form>
  );
};

export default BasicDetailsForm;