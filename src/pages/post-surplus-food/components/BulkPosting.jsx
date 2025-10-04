import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkPosting = ({ formData, onFormChange, errors }) => {
  const [bulkItems, setBulkItems] = useState([
    { id: 1, name: '', quantity: '', unit: 'kg', enabled: true }
  ]);

  const quantityUnits = [
    { value: 'kg', label: 'kg' },
    { value: 'grams', label: 'g' },
    { value: 'liters', label: 'L' },
    { value: 'pieces', label: 'pcs' },
    { value: 'plates', label: 'plates' },
    { value: 'packets', label: 'packets' },
    { value: 'boxes', label: 'boxes' },
    { value: 'bags', label: 'bags' }
  ];

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const handleBulkToggle = (checked) => {
    handleInputChange('isBulkPosting', checked);
    if (checked) {
      handleInputChange('bulkItems', bulkItems);
    } else {
      handleInputChange('bulkItems', []);
    }
  };

  const addBulkItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      quantity: '',
      unit: 'kg',
      enabled: true
    };
    const updatedItems = [...bulkItems, newItem];
    setBulkItems(updatedItems);
    handleInputChange('bulkItems', updatedItems);
  };

  const removeBulkItem = (itemId) => {
    const updatedItems = bulkItems?.filter(item => item?.id !== itemId);
    setBulkItems(updatedItems);
    handleInputChange('bulkItems', updatedItems);
  };

  const updateBulkItem = (itemId, field, value) => {
    const updatedItems = bulkItems?.map(item =>
      item?.id === itemId ? { ...item, [field]: value } : item
    );
    setBulkItems(updatedItems);
    handleInputChange('bulkItems', updatedItems);
  };

  const toggleItemEnabled = (itemId) => {
    const updatedItems = bulkItems?.map(item =>
      item?.id === itemId ? { ...item, enabled: !item?.enabled } : item
    );
    setBulkItems(updatedItems);
    handleInputChange('bulkItems', updatedItems);
  };

  const getTotalQuantity = () => {
    return bulkItems?.filter(item => item?.enabled && item?.quantity)?.reduce((total, item) => {
        const qty = parseFloat(item?.quantity) || 0;
        return total + qty;
      }, 0);
  };

  const getEnabledItemsCount = () => {
    return bulkItems?.filter(item => item?.enabled && item?.name?.trim())?.length;
  };

  return (
    <div className="space-y-6">
      {/* Bulk Posting Toggle */}
      <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg p-4 border border-accent/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Package" size={20} className="text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-heading font-semibold text-foreground">
              Bulk Food Posting
            </h3>
            <p className="text-xs text-muted-foreground">
              Post multiple food items at once for large donations
            </p>
          </div>
          <Checkbox
            checked={formData?.isBulkPosting || false}
            onChange={(e) => handleBulkToggle(e?.target?.checked)}
            label=""
          />
        </div>
      </div>
      {/* Bulk Items Configuration */}
      {formData?.isBulkPosting && (
        <div className="space-y-6 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="List" size={16} className="text-primary" />
              <h4 className="text-sm font-heading font-semibold text-foreground">
                Food Items List
              </h4>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addBulkItem}
              iconName="Plus"
              iconPosition="left"
            >
              Add Item
            </Button>
          </div>

          {/* Bulk Items List */}
          <div className="space-y-4">
            {bulkItems?.map((item, index) => (
              <div
                key={item?.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  item?.enabled
                    ? 'border-border bg-card' :'border-muted bg-muted/30 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    checked={item?.enabled}
                    onChange={() => toggleItemEnabled(item?.id)}
                    label=""
                  />
                  <span className="text-sm font-heading font-semibold text-foreground">
                    Item #{index + 1}
                  </span>
                  {bulkItems?.length > 1 && (
                    <button
                      onClick={() => removeBulkItem(item?.id)}
                      className="ml-auto p-1 text-error hover:bg-error/10 rounded transition-smooth"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Food Item Name"
                      type="text"
                      placeholder="e.g., Vegetable Curry, Fresh Bread"
                      value={item?.name}
                      onChange={(e) => updateBulkItem(item?.id, 'name', e?.target?.value)}
                      disabled={!item?.enabled}
                      required={item?.enabled}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Quantity"
                      type="number"
                      placeholder="0"
                      value={item?.quantity}
                      onChange={(e) => updateBulkItem(item?.id, 'quantity', e?.target?.value)}
                      disabled={!item?.enabled}
                      required={item?.enabled}
                      min="1"
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Unit
                      </label>
                      <select
                        value={item?.unit}
                        onChange={(e) => updateBulkItem(item?.id, 'unit', e?.target?.value)}
                        disabled={!item?.enabled}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                      >
                        {quantityUnits?.map(unit => (
                          <option key={unit?.value} value={unit?.value}>
                            {unit?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h5 className="text-sm font-heading font-semibold text-foreground mb-3">
              Bulk Posting Summary
            </h5>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-card rounded-lg p-3">
                <div className="text-lg font-heading font-bold text-primary">
                  {bulkItems?.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Items</div>
              </div>
              
              <div className="bg-card rounded-lg p-3">
                <div className="text-lg font-heading font-bold text-success">
                  {getEnabledItemsCount()}
                </div>
                <div className="text-xs text-muted-foreground">Enabled Items</div>
              </div>
              
              <div className="bg-card rounded-lg p-3">
                <div className="text-lg font-heading font-bold text-accent">
                  {getTotalQuantity()?.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Total Quantity</div>
              </div>
              
              <div className="bg-card rounded-lg p-3">
                <div className="text-lg font-heading font-bold text-warning">
                  {Math.ceil(getTotalQuantity() * 2.5)}
                </div>
                <div className="text-xs text-muted-foreground">Est. Servings</div>
              </div>
            </div>
          </div>

          {/* Bulk Posting Options */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h5 className="text-sm font-heading font-semibold text-foreground mb-3">
              Bulk Posting Options
            </h5>
            
            <div className="space-y-3">
              <Checkbox
                label="Create separate posts for each item"
                description="Each food item will be posted individually for better matching"
                checked={formData?.bulkOptions?.separatePosts || false}
                onChange={(e) => handleInputChange('bulkOptions', {
                  ...formData?.bulkOptions,
                  separatePosts: e?.target?.checked
                })}
              />
              
              <Checkbox
                label="Apply same location to all items"
                description="Use the pickup location for all bulk items"
                checked={formData?.bulkOptions?.sameLocation || true}
                onChange={(e) => handleInputChange('bulkOptions', {
                  ...formData?.bulkOptions,
                  sameLocation: e?.target?.checked
                })}
              />
              
              <Checkbox
                label="Use AI enhancement for all descriptions"
                description="Automatically enhance descriptions for better matching"
                checked={formData?.bulkOptions?.useAIForAll || false}
                onChange={(e) => handleInputChange('bulkOptions', {
                  ...formData?.bulkOptions,
                  useAIForAll: e?.target?.checked
                })}
              />
              
              <Checkbox
                label="Notify recipients about bulk availability"
                description="Send special notifications for large donations"
                checked={formData?.bulkOptions?.notifyBulk || true}
                onChange={(e) => handleInputChange('bulkOptions', {
                  ...formData?.bulkOptions,
                  notifyBulk: e?.target?.checked
                })}
              />
            </div>
          </div>

          {/* Bulk Posting Benefits */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h5 className="text-sm font-heading font-semibold text-foreground mb-3">
              Benefits of Bulk Posting
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={12} className="text-success" />
                <span>Save time posting multiple items</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Target" size={12} className="text-success" />
                <span>Better matching for large donations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={12} className="text-success" />
                <span>Reach multiple recipients efficiently</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={12} className="text-success" />
                <span>Maximize donation impact</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkPosting;