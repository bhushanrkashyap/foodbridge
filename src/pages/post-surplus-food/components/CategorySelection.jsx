import React from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../supabaseClient';

const CategorySelection = ({ selectedCategories, onCategoriesChange, autoSuggestedTags, donationId }) => {
  const foodCategories = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'non-vegetarian', label: 'Non-Vegetarian', icon: 'Beef', color: 'bg-red-100 text-red-800 border-red-200' },
    { id: 'dairy-free', label: 'Dairy Free', icon: 'Milk', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'gluten-free', label: 'Gluten Free', icon: 'Wheat', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'organic', label: 'Organic', icon: 'Flower2', color: 'bg-lime-100 text-lime-800 border-lime-200' },
    { id: 'spicy', label: 'Spicy', icon: 'Flame', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'mild', label: 'Mild', icon: 'Droplets', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    { id: 'ready-to-eat', label: 'Ready to Eat', icon: 'Clock', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'requires-heating', label: 'Requires Heating', icon: 'Zap', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'fresh', label: 'Fresh', icon: 'Sparkles', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { id: 'frozen', label: 'Frozen', icon: 'Snowflake', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  ];

  const updateTagsInSupabase = async (tags) => {
    if (!donationId) return; // donationId must be provided
    await supabase
      .from('donations')
      .update({ tags })
      .eq('id', donationId);
  };

  const handleCategoryToggle = async (categoryId) => {
    const updatedCategories = selectedCategories?.includes(categoryId)
      ? selectedCategories?.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onCategoriesChange(updatedCategories);

    // Update tags in Supabase
    await updateTagsInSupabase(updatedCategories);
  };

  const handleAcceptSuggestion = (tagId) => {
    if (!selectedCategories?.includes(tagId)) {
      onCategoriesChange([...selectedCategories, tagId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Suggested Tags */}
      {autoSuggestedTags && autoSuggestedTags?.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <h3 className="text-sm font-heading font-semibold text-foreground">
              AI Suggested Tags
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {autoSuggestedTags?.map((tagId) => {
              const category = foodCategories?.find(cat => cat?.id === tagId);
              if (!category || selectedCategories?.includes(tagId)) return null;
              
              return (
                <button
                  key={tagId}
                  onClick={() => handleAcceptSuggestion(tagId)}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border-2 border-dashed border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
                >
                  <Icon name={category?.icon} size={12} className="mr-1.5" />
                  {category?.label}
                  <Icon name="Plus" size={12} className="ml-1.5" />
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Click to add AI-suggested tags based on your food description
          </p>
        </div>
      )}
      {/* Category Selection */}
      <div>
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
          Food Categories & Tags
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Select all applicable categories to help recipients find suitable food
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {foodCategories?.map((category) => {
            const isSelected = selectedCategories?.includes(category?.id);
            const isSuggested = autoSuggestedTags?.includes(category?.id);
            
            return (
              <button
                key={category?.id}
                onClick={() => handleCategoryToggle(category?.id)}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? `${category?.color} border-current shadow-soft`
                    : 'bg-card border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={category?.icon} 
                    size={16} 
                    className={isSelected ? 'text-current' : 'text-muted-foreground'} 
                  />
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-current' : 'text-foreground'
                  }`}>
                    {category?.label}
                  </span>
                </div>
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-current rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                )}
                {/* AI Suggestion Indicator */}
                {isSuggested && !isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Sparkles" size={8} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Selected Categories Summary */}
      {selectedCategories?.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-heading font-semibold text-foreground mb-2">
            Selected Categories ({selectedCategories?.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories?.map((categoryId) => {
              const category = foodCategories?.find(cat => cat?.id === categoryId);
              if (!category) return null;
              
              return (
                <span
                  key={categoryId}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category?.color}`}
                >
                  <Icon name={category?.icon} size={12} className="mr-1" />
                  {category?.label}
                  <button
                    onClick={() => handleCategoryToggle(categoryId)}
                    className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-smooth"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelection;