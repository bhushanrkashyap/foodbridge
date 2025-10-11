import React from 'react';
import Icon from '../../../components/AppIcon';

const UserTypeSelection = ({ selectedType, onTypeSelect, className = '' }) => {
  const userTypes = [
    {
      id: 'donor',
      label: 'Donor',
      description: 'Manage surplus food from restaurants, cafes, and food service businesses',
      icon: 'ChefHat',
      features: ['Post surplus food', 'Track donations', 'Manage inventory', 'View impact metrics'],
      color: 'bg-primary/10 border-primary text-primary'
    },
    {
      id: 'recipient',
      label: 'Recipient',
      description: 'Coordinate food distribution for NGOs, shelters, and community organizations',
      icon: 'Heart',
      features: ['Browse available food', 'Manage requests', 'Coordinate pickups', 'Track beneficiaries'],
      color: 'bg-success/10 border-success text-success'
    }
  ];

  return (
    <div className={`user-type-selection ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Choose Your Role
        </h2>
        <p className="text-muted-foreground">
          Select how you'd like to contribute to reducing food waste
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {userTypes?.map((type) => (
          <div
            key={type?.id}
            onClick={() => onTypeSelect(type?.id)}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-elevated ${
              selectedType === type?.id
                ? `${type?.color} shadow-soft`
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            {/* Selection Indicator */}
            {selectedType === type?.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} color="white" />
              </div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              selectedType === type?.id ? 'bg-white/20' : 'bg-muted'
            }`}>
              <Icon 
                name={type?.icon} 
                size={24} 
                className={selectedType === type?.id ? 'text-current' : 'text-muted-foreground'} 
              />
            </div>

            {/* Content */}
            <h3 className={`text-lg font-heading font-semibold mb-2 ${
              selectedType === type?.id ? 'text-current' : 'text-foreground'
            }`}>
              {type?.label}
            </h3>
            
            <p className={`text-sm mb-4 ${
              selectedType === type?.id ? 'text-current/80' : 'text-muted-foreground'
            }`}>
              {type?.description}
            </p>

            {/* Features */}
            <ul className="space-y-2">
              {type?.features?.map((feature, index) => (
                <li key={index} className="flex items-center text-xs">
                  <Icon 
                    name="Check" 
                    size={12} 
                    className={`mr-2 flex-shrink-0 ${
                      selectedType === type?.id ? 'text-current' : 'text-success'
                    }`} 
                  />
                  <span className={selectedType === type?.id ? 'text-current/80' : 'text-muted-foreground'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelection;