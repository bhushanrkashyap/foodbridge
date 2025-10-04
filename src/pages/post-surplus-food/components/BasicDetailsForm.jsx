import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BasicDetailsForm = ({ formData, onFormChange, errors }) => {
  const foodTypeOptions = [
    { value: 'prepared-meals', label: 'Prepared Meals' },
    { value: 'fresh-produce', label: 'Fresh Produce' },
    { value: 'packaged-goods', label: 'Packaged Goods' },
    { value: 'dairy-products', label: 'Dairy Products' },
    { value: 'bakery-items', label: 'Bakery Items' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'frozen-items', label: 'Frozen Items' },
    { value: 'dry-goods', label: 'Dry Goods' }
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

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default BasicDetailsForm;