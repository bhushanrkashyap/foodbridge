import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIDescriptionEnhancer = ({ currentDescription, onDescriptionUpdate, foodName, foodType }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedDescription, setEnhancedDescription] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const handleEnhanceDescription = async () => {
    if (!currentDescription || currentDescription?.length < 10) {
      return;
    }

    setIsEnhancing(true);
    
    try {
      // Simulate AI enhancement (replace with actual Gemini API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhanced = generateEnhancedDescription(currentDescription, foodName, foodType);
      setEnhancedDescription(enhanced);
      setShowComparison(true);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateEnhancedDescription = (original, name, type) => {
    // Mock AI enhancement logic
    const enhancements = {
      'prepared-meals': `Freshly prepared ${name || 'meal'} made with quality ingredients. This ${type?.replace('-', ' ')} is ready to serve and maintains excellent taste and nutritional value. Perfect for immediate consumption or reheating. Prepared following food safety standards with proper temperature control.`,
      'fresh-produce': `Fresh, high-quality ${name || 'produce'} sourced from reliable suppliers. These ${type?.replace('-', ' ')} items are in excellent condition, properly stored, and ideal for immediate use. Rich in nutrients and perfect for healthy meal preparation.`,
      'packaged-goods': `Well-preserved ${name || 'packaged items'} in original packaging. These ${type?.replace('-', ' ')} maintain their quality and are suitable for extended storage. All items are within expiry dates and stored under proper conditions.`,
      'default': `Quality ${name || 'food item'} available for donation. This ${type || 'food'} has been properly stored and maintained according to food safety standards. Suitable for immediate distribution to those in need.`
    };

    const baseEnhancement = enhancements?.[type] || enhancements?.default;
    return `${baseEnhancement}\n\nOriginal details: ${original}`;
  };

  const handleAcceptEnhancement = () => {
    onDescriptionUpdate(enhancedDescription);
    setShowComparison(false);
    setEnhancedDescription('');
  };

  const handleRejectEnhancement = () => {
    setShowComparison(false);
    setEnhancedDescription('');
  };

  if (!currentDescription || currentDescription?.length < 10) {
    return (
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground">
              AI Description Enhancement
            </h3>
            <p className="text-xs text-muted-foreground">
              Add a basic description (minimum 10 characters) to enable AI enhancement
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showComparison ? (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-heading font-semibold text-foreground">
                  AI-Powered Description Enhancement
                </h3>
                <p className="text-xs text-muted-foreground">
                  Improve your description for better matching with recipients
                </p>
              </div>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleEnhanceDescription}
              loading={isEnhancing}
              iconName="Wand2"
              iconPosition="left"
              disabled={isEnhancing}
            >
              {isEnhancing ? 'Enhancing...' : 'Enhance Description'}
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Icon name="Check" size={12} className="mr-1 text-success" />
                Better matching accuracy
              </span>
              <span className="flex items-center">
                <Icon name="Check" size={12} className="mr-1 text-success" />
                Professional formatting
              </span>
              <span className="flex items-center">
                <Icon name="Check" size={12} className="mr-1 text-success" />
                Detailed food information
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="bg-primary/5 px-4 py-3 border-b border-border">
            <h3 className="text-sm font-heading font-semibold text-foreground flex items-center">
              <Icon name="Sparkles" size={16} className="mr-2 text-primary" />
              AI Enhanced Description
            </h3>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Original vs Enhanced Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Original Description
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-foreground">
                  {currentDescription}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-heading font-semibold text-success mb-2 uppercase tracking-wide">
                  AI Enhanced Description
                </h4>
                <div className="bg-success/5 border border-success/20 rounded-lg p-3 text-sm text-foreground">
                  {enhancedDescription}
                </div>
              </div>
            </div>
            
            {/* Enhancement Benefits */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="text-xs font-heading font-semibold text-foreground mb-2">
                Improvements Made:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Icon name="Check" size={12} className="mr-2 text-success" />
                  Added food safety details
                </span>
                <span className="flex items-center">
                  <Icon name="Check" size={12} className="mr-2 text-success" />
                  Enhanced nutritional information
                </span>
                <span className="flex items-center">
                  <Icon name="Check" size={12} className="mr-2 text-success" />
                  Improved professional tone
                </span>
                <span className="flex items-center">
                  <Icon name="Check" size={12} className="mr-2 text-success" />
                  Better matching keywords
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="default"
                onClick={handleAcceptEnhancement}
                iconName="Check"
                iconPosition="left"
                className="flex-1"
              >
                Use Enhanced Description
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectEnhancement}
                iconName="X"
                iconPosition="left"
                className="flex-1"
              >
                Keep Original
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDescriptionEnhancer;