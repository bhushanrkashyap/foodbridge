import React from 'react';
import Icon from '../../../components/AppIcon';

const FoodInformation = ({ foodData }) => {
  const {
    name,
    description,
    aiEnhancedDescription,
    ingredients,
    preparationMethod,
    quantity,
    servings,
    dietaryInfo,
    allergens,
    spiceLevel,
    nutritionalInfo
  } = foodData;

  const getDietaryIcon = (type) => {
    const icons = {
      vegetarian: 'Leaf',
      vegan: 'Sprout',
      'gluten-free': 'Shield',
      'dairy-free': 'ShieldX',
      halal: 'Star',
      kosher: 'Crown'
    };
    return icons?.[type] || 'Info';
  };

  const getSpiceLevelColor = (level) => {
    const colors = {
      mild: 'text-success',
      medium: 'text-warning',
      hot: 'text-error',
      'extra-hot': 'text-destructive'
    };
    return colors?.[level] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card p-6 rounded-lg shadow-soft">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
          {name}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        {/* AI Enhanced Description */}
        {aiEnhancedDescription && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <Icon name="Sparkles" size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">AI Analysis</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {aiEnhancedDescription}
            </p>
          </div>
        )}

        {/* Quantity & Servings */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center mb-1">
              <Icon name="Package" size={16} className="text-muted-foreground mr-2" />
              <span className="text-sm font-medium text-foreground">Quantity</span>
            </div>
            <p className="text-lg font-mono font-semibold text-primary">{quantity}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center mb-1">
              <Icon name="Users" size={16} className="text-muted-foreground mr-2" />
              <span className="text-sm font-medium text-foreground">Servings</span>
            </div>
            <p className="text-lg font-mono font-semibold text-primary">{servings}</p>
          </div>
        </div>
      </div>
      {/* Dietary Information */}
      <div className="bg-card p-6 rounded-lg shadow-soft">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Dietary Information
        </h3>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {dietaryInfo?.map((diet) => (
            <span
              key={diet}
              className="inline-flex items-center px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium"
            >
              <Icon name={getDietaryIcon(diet)} size={14} className="mr-1" />
              {diet?.charAt(0)?.toUpperCase() + diet?.slice(1)}
            </span>
          ))}
        </div>

        {/* Spice Level */}
        <div className="flex items-center mb-4">
          <Icon name="Flame" size={16} className="text-muted-foreground mr-2" />
          <span className="text-sm font-medium text-foreground mr-2">Spice Level:</span>
          <span className={`text-sm font-medium capitalize ${getSpiceLevelColor(spiceLevel)}`}>
            {spiceLevel}
          </span>
        </div>

        {/* Allergen Warnings */}
        {allergens?.length > 0 && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mr-2" />
              <span className="text-sm font-medium text-warning">Allergen Warning</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allergens?.map((allergen) => (
                <span
                  key={allergen}
                  className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-medium"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Ingredients & Preparation */}
      <div className="bg-card p-6 rounded-lg shadow-soft">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Ingredients & Preparation
        </h3>

        {/* Ingredients */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="List" size={14} className="mr-2" />
            Ingredients
          </h4>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">{ingredients}</p>
          </div>
        </div>

        {/* Preparation Method */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="ChefHat" size={14} className="mr-2" />
            Preparation Method
          </h4>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">{preparationMethod}</p>
          </div>
        </div>
      </div>
      {/* Nutritional Information */}
      {nutritionalInfo && (
        <div className="bg-card p-6 rounded-lg shadow-soft">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Nutritional Information
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(nutritionalInfo)?.map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-mono font-semibold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodInformation;