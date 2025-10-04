import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const foodCategories = [
    { id: 'vegetables', label: 'Fresh Vegetables', count: 23 },
    { id: 'fruits', label: 'Fresh Fruits', count: 18 },
    { id: 'grains', label: 'Grains & Cereals', count: 15 },
    { id: 'dairy', label: 'Dairy Products', count: 12 },
    { id: 'meat', label: 'Meat & Poultry', count: 8 },
    { id: 'bakery', label: 'Bakery Items', count: 21 },
    { id: 'prepared', label: 'Prepared Meals', count: 34 },
    { id: 'canned', label: 'Canned Goods', count: 16 }
  ];

  const dietaryRestrictions = [
    { id: 'vegetarian', label: 'Vegetarian', count: 45 },
    { id: 'vegan', label: 'Vegan', count: 28 },
    { id: 'gluten-free', label: 'Gluten Free', count: 19 },
    { id: 'dairy-free', label: 'Dairy Free', count: 22 },
    { id: 'nut-free', label: 'Nut Free', count: 31 },
    { id: 'halal', label: 'Halal', count: 26 }
  ];

  const urgencyLevels = [
    { id: 'high', label: 'High Priority', count: 12, color: 'text-error' },
    { id: 'medium', label: 'Medium Priority', count: 28, color: 'text-warning' },
    { id: 'low', label: 'Low Priority', count: 35, color: 'text-success' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (categoryId) => {
    const currentCategories = localFilters?.categories || [];
    const newCategories = currentCategories?.includes(categoryId)
      ? currentCategories?.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    handleFilterChange('categories', newCategories);
  };

  const handleDietaryToggle = (restrictionId) => {
    const currentRestrictions = localFilters?.dietaryRestrictions || [];
    const newRestrictions = currentRestrictions?.includes(restrictionId)
      ? currentRestrictions?.filter(id => id !== restrictionId)
      : [...currentRestrictions, restrictionId];
    handleFilterChange('dietaryRestrictions', newRestrictions);
  };

  const handleUrgencyToggle = (urgencyId) => {
    const currentUrgency = localFilters?.urgency || [];
    const newUrgency = currentUrgency?.includes(urgencyId)
      ? currentUrgency?.filter(id => id !== urgencyId)
      : [...currentUrgency, urgencyId];
    handleFilterChange('urgency', newUrgency);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      categories: [],
      dietaryRestrictions: [],
      urgency: [],
      distance: 50,
      minQuantity: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.search) count++;
    if (localFilters?.categories?.length) count += localFilters?.categories?.length;
    if (localFilters?.dietaryRestrictions?.length) count += localFilters?.dietaryRestrictions?.length;
    if (localFilters?.urgency?.length) count += localFilters?.urgency?.length;
    if (localFilters?.distance !== 50) count++;
    if (localFilters?.minQuantity) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-heading font-semibold text-foreground">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-mono">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-muted rounded transition-smooth lg:hidden"
          >
            <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
          </button>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search for specific food items..."
              value={localFilters?.search || ''}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Distance Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pickup Distance: {localFilters?.distance || 50} km
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={localFilters?.distance || 50}
              onChange={(e) => handleFilterChange('distance', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>

          {/* Minimum Quantity */}
          <div>
            <Input
              type="number"
              label="Minimum Quantity"
              placeholder="Enter minimum quantity needed"
              value={localFilters?.minQuantity || ''}
              onChange={(e) => handleFilterChange('minQuantity', e?.target?.value)}
            />
          </div>

          {/* Food Categories */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Food Categories</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {foodCategories?.map((category) => (
                <div key={category?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={category?.label}
                    checked={localFilters?.categories?.includes(category?.id) || false}
                    onChange={() => handleCategoryToggle(category?.id)}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {category?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Dietary Requirements</h4>
            <div className="space-y-2">
              {dietaryRestrictions?.map((restriction) => (
                <div key={restriction?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={restriction?.label}
                    checked={localFilters?.dietaryRestrictions?.includes(restriction?.id) || false}
                    onChange={() => handleDietaryToggle(restriction?.id)}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {restriction?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Levels */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Priority Level</h4>
            <div className="space-y-2">
              {urgencyLevels?.map((urgency) => (
                <div key={urgency?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={
                      <span className={urgency?.color}>
                        {urgency?.label}
                      </span>
                    }
                    checked={localFilters?.urgency?.includes(urgency?.id) || false}
                    onChange={() => handleUrgencyToggle(urgency?.id)}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {urgency?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;