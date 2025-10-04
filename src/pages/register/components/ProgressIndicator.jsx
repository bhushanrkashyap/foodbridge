import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, userType, className = '' }) => {
  const getStepLabels = () => {
    const baseSteps = [
      { id: 1, label: 'User Type', icon: 'UserCheck' },
      { id: 2, label: 'Basic Info', icon: 'User' },
      { id: 3, label: 'Organization', icon: 'Building' },
      { id: 4, label: 'Documents', icon: 'FileText' },
      { id: 5, label: 'Terms', icon: 'Shield' }
    ];

    // Customize step 3 label based on user type
    if (userType === 'volunteer') {
      baseSteps[2].label = 'Preferences';
      baseSteps[2].icon = 'Settings';
    } else if (userType === 'restaurant') {
      baseSteps[2].label = 'Restaurant';
      baseSteps[2].icon = 'ChefHat';
    } else if (userType === 'ngo') {
      baseSteps[2].label = 'Organization';
      baseSteps[2].icon = 'Heart';
    }

    return baseSteps;
  };

  const steps = getStepLabels();
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={`progress-indicator ${className}`}>
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-smooth"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-primary">
            {steps?.[currentStep - 1]?.label}
          </span>
        </div>
      </div>
      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-8">
          {steps?.map((step, index) => {
            const isCompleted = step?.id < currentStep;
            const isCurrent = step?.id === currentStep;
            const isUpcoming = step?.id > currentStep;

            return (
              <React.Fragment key={step?.id}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isCurrent
                        ? 'bg-primary/10 border-primary text-primary' :'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <Icon name={step?.icon} size={20} />
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-sm font-medium mt-2 transition-colors ${
                      isCompleted || isCurrent
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step?.label}
                  </span>

                  {/* Step Number */}
                  <span className="text-xs text-muted-foreground mt-1">
                    {step?.id}
                  </span>
                </div>
                {/* Connector Line */}
                {index < steps?.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 relative">
                    <div className="absolute inset-0 bg-border" />
                    <div
                      className={`absolute inset-0 bg-primary transition-all duration-300 ${
                        step?.id < currentStep ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-muted/50 rounded-full px-4 py-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 && "Let's get started with your role selection"}
              {currentStep === 2 && "Tell us about yourself"}
              {currentStep === 3 && "Organization details for verification"}
              {currentStep === 4 && "Upload required documents"}
              {currentStep === 5 && "Almost done! Review terms and create account"}
            </span>
          </div>
        </div>
      </div>
      {/* Estimated Time */}
      <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
        <Icon name="Timer" size={12} className="mr-1" />
        <span>
          Estimated time remaining: {Math.max(0, (totalSteps - currentStep) * 2)} minutes
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;