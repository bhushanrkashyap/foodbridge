import React from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const DietaryInformation = ({ formData, onFormChange, errors }) => {
  const allergenOptions = [
    { id: 'nuts', label: 'Nuts', icon: 'Nut' },
    { id: 'dairy', label: 'Dairy', icon: 'Milk' },
    { id: 'eggs', label: 'Eggs', icon: 'Egg' },
    { id: 'soy', label: 'Soy', icon: 'Bean' },
    { id: 'wheat', label: 'Wheat/Gluten', icon: 'Wheat' },
    { id: 'seafood', label: 'Seafood', icon: 'Fish' },
    { id: 'sesame', label: 'Sesame', icon: 'Seed' },
    { id: 'mustard', label: 'Mustard', icon: 'Droplet' }
  ];

  const spiceLevelOptions = [
    { value: 'mild', label: 'Mild - No spice or very light' },
    { value: 'medium', label: 'Medium - Moderate spice level' },
    { value: 'hot', label: 'Hot - Spicy for most people' },
    { value: 'very-hot', label: 'Very Hot - Extremely spicy' },
    { value: 'not-applicable', label: 'Not Applicable' }
  ];

  const dietaryTypeOptions = [
    { value: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { value: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian', icon: 'Beef' },
    { value: 'eggetarian', label: 'Eggetarian', icon: 'Egg' }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const handleAllergenToggle = (allergenId) => {
    const currentAllergens = formData?.allergens || [];
    const updatedAllergens = currentAllergens?.includes(allergenId)
      ? currentAllergens?.filter(id => id !== allergenId)
      : [...currentAllergens, allergenId];
    
    handleInputChange('allergens', updatedAllergens);
  };

  const handleDietaryTypeChange = (type) => {
    handleInputChange('dietaryType', type);
  };

  return (
    <div className="space-y-6">
      {/* Dietary Type */}
      <div>
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
          Dietary Type
          <span className="text-error ml-1">*</span>
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Select the dietary category that best describes this food
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {dietaryTypeOptions?.map((option) => {
            const isSelected = formData?.dietaryType === option?.value;
            
            return (
              <button
                key={option?.value}
                onClick={() => handleDietaryTypeChange(option?.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon 
                    name={option?.icon} 
                    size={24} 
                    className={isSelected ? 'text-primary' : 'text-muted-foreground'} 
                  />
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {option?.label}
                  </span>
                </div>
                {isSelected && (
                  <div className="mt-2 w-4 h-4 mx-auto bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {errors?.dietaryType && (
          <p className="mt-2 text-xs text-error">{errors?.dietaryType}</p>
        )}
      </div>
      {/* Spice Level */}
      <Select
        label="Spice Level"
        placeholder="Select spice level"
        options={spiceLevelOptions}
        value={formData?.spiceLevel || ''}
        onChange={(value) => handleInputChange('spiceLevel', value)}
        error={errors?.spiceLevel}
        description="Help recipients choose food according to their spice tolerance"
      />
      {/* Allergen Information */}
      <div>
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
          Allergen Information
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Select all allergens present in this food item
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allergenOptions?.map((allergen) => {
            const isSelected = (formData?.allergens || [])?.includes(allergen?.id);
            
            return (
              <button
                key={allergen?.id}
                onClick={() => handleAllergenToggle(allergen?.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'border-warning bg-warning/5 text-warning' :'border-border hover:border-warning/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Icon 
                    name={allergen?.icon} 
                    size={20} 
                    className={isSelected ? 'text-warning' : 'text-muted-foreground'} 
                  />
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-warning' : 'text-foreground'
                  }`}>
                    {allergen?.label}
                  </span>
                </div>
                {isSelected && (
                  <div className="mt-1 w-3 h-3 mx-auto bg-warning rounded-full flex items-center justify-center">
                    <Icon name="AlertTriangle" size={8} className="text-warning-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {(formData?.allergens || [])?.length > 0 && (
          <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-heading font-semibold text-warning">
                Allergen Warning
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              This food contains: {(formData?.allergens || [])?.map(id => 
                allergenOptions?.find(a => a?.id === id)?.label
              )?.join(', ')}
            </p>
          </div>
        )}
      </div>
      {/* Additional Dietary Notes */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Additional Dietary Notes
        </label>
        <textarea
          placeholder="Any other dietary information, preparation methods, or special considerations..."
          value={formData?.dietaryNotes || ''}
          onChange={(e) => handleInputChange('dietaryNotes', e?.target?.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm transition-smooth resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Include information about cooking methods, ingredients, or any other relevant dietary details
        </p>
      </div>
      {/* Dietary Compliance Indicators */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-heading font-semibold text-foreground mb-3">
          Dietary Compliance Summary
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className={`p-2 rounded text-center text-xs ${
            formData?.dietaryType === 'vegetarian' || formData?.dietaryType === 'vegan'
              ? 'bg-green-100 text-green-800' :'bg-muted text-muted-foreground'
          }`}>
            <Icon name="Leaf" size={16} className="mx-auto mb-1" />
            Vegetarian Safe
          </div>
          
          <div className={`p-2 rounded text-center text-xs ${
            formData?.dietaryType === 'vegan' ?'bg-emerald-100 text-emerald-800' :'bg-muted text-muted-foreground'
          }`}>
            <Icon name="Sprout" size={16} className="mx-auto mb-1" />
            Vegan Safe
          </div>
          
          <div className={`p-2 rounded text-center text-xs ${
            !(formData?.allergens || [])?.includes('wheat')
              ? 'bg-blue-100 text-blue-800' :'bg-muted text-muted-foreground'
          }`}>
            <Icon name="Wheat" size={16} className="mx-auto mb-1" />
            Gluten Free
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietaryInformation;