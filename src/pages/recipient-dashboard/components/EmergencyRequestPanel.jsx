import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const EmergencyRequestPanel = ({ onSubmitRequest, activeRequests = [] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    urgencyLevel: 'high',
    beneficiaryCount: '',
    foodTypes: [],
    specialRequirements: '',
    pickupRadius: 10,
    timeframe: '2',
    contactPerson: '',
    contactPhone: '',
    additionalNotes: ''
  });

  const foodTypes = [
    { id: 'prepared-meals', label: 'Prepared Meals' },
    { id: 'fresh-produce', label: 'Fresh Produce' },
    { id: 'dairy', label: 'Dairy Products' },
    { id: 'grains', label: 'Grains & Cereals' },
    { id: 'canned-goods', label: 'Canned Goods' },
    { id: 'bakery', label: 'Bakery Items' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFoodTypeToggle = (typeId) => {
    setFormData(prev => ({
      ...prev,
      foodTypes: prev?.foodTypes?.includes(typeId)
        ? prev?.foodTypes?.filter(id => id !== typeId)
        : [...prev?.foodTypes, typeId]
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmitRequest(formData);
    setFormData({
      urgencyLevel: 'high',
      beneficiaryCount: '',
      foodTypes: [],
      specialRequirements: '',
      pickupRadius: 10,
      timeframe: '2',
      contactPerson: '',
      contactPhone: '',
      additionalNotes: ''
    });
    setIsFormOpen(false);
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'fulfilled': return 'text-primary';
      case 'expired': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="font-heading font-semibold text-foreground">Emergency Requests</h3>
          {activeRequests?.length > 0 && (
            <span className="px-2 py-1 bg-warning text-warning-foreground text-xs rounded-full font-mono">
              {activeRequests?.length} active
            </span>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          New Request
        </Button>
      </div>
      {/* Emergency Request Form */}
      {isFormOpen && (
        <div className="p-4 border-b border-border bg-warning/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Number of Beneficiaries"
                type="number"
                placeholder="e.g., 50"
                value={formData?.beneficiaryCount}
                onChange={(e) => handleInputChange('beneficiaryCount', e?.target?.value)}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Urgency Level
                </label>
                <select
                  value={formData?.urgencyLevel}
                  onChange={(e) => handleInputChange('urgencyLevel', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="critical">Critical (Immediate)</option>
                  <option value="high">High (Within 2 hours)</option>
                  <option value="medium">Medium (Within 6 hours)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Person"
                type="text"
                placeholder="Name of coordinator"
                value={formData?.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
                required
              />
              
              <Input
                label="Contact Phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData?.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Required Food Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {foodTypes?.map((type) => (
                  <Checkbox
                    key={type?.id}
                    label={type?.label}
                    checked={formData?.foodTypes?.includes(type?.id)}
                    onChange={() => handleFoodTypeToggle(type?.id)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pickup Radius: {formData?.pickupRadius} km
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={formData?.pickupRadius}
                  onChange={(e) => handleInputChange('pickupRadius', parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 km</span>
                  <span>50 km</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Needed Within (hours)
                </label>
                <select
                  value={formData?.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>
            </div>

            <Input
              label="Special Requirements"
              type="text"
              placeholder="Dietary restrictions, allergies, etc."
              value={formData?.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
            />

            <Input
              label="Additional Notes"
              type="text"
              placeholder="Any additional information for donors"
              value={formData?.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                iconName="Send"
                iconPosition="left"
              >
                Broadcast Request
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Active Requests List */}
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {activeRequests?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="AlertTriangle" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="font-heading font-medium text-foreground mb-2">No Active Requests</h4>
            <p className="text-sm text-muted-foreground">
              Emergency food requests will appear here when broadcasted.
            </p>
          </div>
        ) : (
          activeRequests?.map((request) => (
            <div key={request?.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request?.urgencyLevel)}`}>
                    {request?.urgencyLevel} priority
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(request?.status)}`}>
                    {request?.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(request.createdAt)?.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="flex items-center text-muted-foreground">
                  <Icon name="Users" size={16} className="mr-2" />
                  {request?.beneficiaryCount} beneficiaries
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Icon name="Clock" size={16} className="mr-2" />
                  Needed in {request?.timeframe}h
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Icon name="MapPin" size={16} className="mr-2" />
                  {request?.pickupRadius} km radius
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Icon name="Phone" size={16} className="mr-2" />
                  {request?.contactPerson}
                </div>
              </div>

              {request?.foodTypes?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {request?.foodTypes?.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {foodTypes?.find(ft => ft?.id === type)?.label || type}
                    </span>
                  ))}
                </div>
              )}

              {request?.responses && request?.responses?.length > 0 && (
                <div className="mt-3 p-2 bg-success/10 rounded text-sm">
                  <div className="flex items-center text-success">
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    {request?.responses?.length} donor(s) responded
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyRequestPanel;