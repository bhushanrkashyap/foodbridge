import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ActionFloatingButton from '../../components/ui/ActionFloatingButton';

// Import all components
import PhotoUpload from './components/PhotoUpload';
import BasicDetailsForm from './components/BasicDetailsForm';
import AIDescriptionEnhancer from './components/AIDescriptionEnhancer';
import CategorySelection from './components/CategorySelection';
import LocationDetails from './components/LocationDetails';
import DietaryInformation from './components/DietaryInformation';
import UrgencyIndicator from './components/UrgencyIndicator';
import RecurringDonation from './components/RecurringDonation';
import BulkPosting from './components/BulkPosting';

const PostSurplusFood = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [autoSuggestedTags, setAutoSuggestedTags] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Prevent browser back button from navigating away during form completion
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        // If user is on step 2 or later, go to previous step instead of browser back
        setCurrentStep(prev => prev - 1);
      } else {
        // If on step 1, confirm before leaving
        const confirmLeave = window.confirm('Are you sure you want to leave? Your progress will be lost.');
        if (confirmLeave) {
          navigate('/donor-dashboard');
        } else {
          // Push state back to prevent navigation
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    
    // Listen for back button
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, navigate]);

  const [formData, setFormData] = useState({
    // Basic Details
    foodName: '',
    foodType: '',
    quantity: '',
    quantityUnit: '',
    expiryDateTime: '',
    description: '',
    estimatedServings: '',
    
    // Location
    pickupAddress: {
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      latitude: null,
      longitude: null
    },
    pickupInstructions: '',
    preferredPickupTime: '',
    contactPerson: '',
    contactPhone: '',
    
    // Dietary Information
    dietaryType: '',
    spiceLevel: '',
    allergens: [],
    dietaryNotes: '',
    
    // Categories
    selectedCategories: [],
    
    // Urgency
    urgencyLevel: '',
    donationReason: '',
    urgencyNotes: '',
    
    // Recurring
    isRecurring: false,
    recurringSchedule: {},
    
    // Bulk
    isBulkPosting: false,
    bulkItems: [],
    bulkOptions: {}
  });

  const steps = [
    {
      id: 1,
      title: 'Photos & Basic Details',
      description: 'Upload photos and provide basic food information',
      icon: 'Camera',
      component: 'basic'
    },
    {
      id: 2,
      title: 'AI Enhancement & Categories',
      description: 'Enhance description and select food categories',
      icon: 'Sparkles',
      component: 'enhancement'
    },
    {
      id: 3,
      title: 'Location & Pickup',
      description: 'Set pickup location and contact details',
      icon: 'MapPin',
      component: 'location'
    },
    {
      id: 4,
      title: 'Dietary & Urgency',
      description: 'Specify dietary information and urgency level',
      icon: 'AlertCircle',
      component: 'dietary'
    },
    {
      id: 5,
      title: 'Advanced Options',
      description: 'Configure recurring donations and bulk posting',
      icon: 'Settings',
      component: 'advanced'
    }
  ];

  useEffect(() => {
    // Generate auto-suggested tags based on food type and description
    if (formData?.foodType && formData?.description) {
      const suggestions = generateAutoSuggestions(formData?.foodType, formData?.description);
      setAutoSuggestedTags(suggestions);
    }
  }, [formData?.foodType, formData?.description]);

  const generateAutoSuggestions = (foodType, description) => {
    const suggestions = [];
    const descLower = description?.toLowerCase();
    
    // AI-like suggestion logic
    if (descLower?.includes('vegetarian') || descLower?.includes('veg')) {
      suggestions?.push('vegetarian');
    }
    if (descLower?.includes('vegan')) {
      suggestions?.push('vegan');
    }
    if (descLower?.includes('spicy') || descLower?.includes('hot')) {
      suggestions?.push('spicy');
    }
    if (descLower?.includes('mild')) {
      suggestions?.push('mild');
    }
    if (descLower?.includes('fresh')) {
      suggestions?.push('fresh');
    }
    if (descLower?.includes('ready') || descLower?.includes('cooked')) {
      suggestions?.push('ready-to-eat');
    }
    if (foodType === 'prepared-meals') {
      suggestions?.push('requires-heating');
    }
    if (foodType === 'fresh-produce') {
      suggestions?.push('organic');
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData?.foodName) newErrors.foodName = 'Food name is required';
        if (!formData?.foodType) newErrors.foodType = 'Food type is required';
        if (!formData?.quantity) newErrors.quantity = 'Quantity is required';
        if (!formData?.quantityUnit) newErrors.quantityUnit = 'Unit is required';
        if (!formData?.expiryDateTime) newErrors.expiryDateTime = 'Expiry date is required';
        if (!formData?.description || formData?.description?.length < 20) {
          newErrors.description = 'Description must be at least 20 characters';
        }
        // Make food freshness analysis compulsory
        if (!analysisResult) {
          newErrors.analysis = 'Food freshness analysis is required. Please upload and analyze a photo of your food.';
        } else if (analysisResult.freshness?.toLowerCase().includes('expired')) {
          newErrors.analysis = 'Cannot proceed with expired food. Please select fresh food items only.';
        }
        break;
        
      case 2:
        // Categories are optional, but at least description should be enhanced
        break;
        
      case 3:
        if (!formData?.pickupAddress?.street) {
          newErrors.pickupAddress = { ...newErrors?.pickupAddress, street: 'Street address is required' };
        }
        if (!formData?.pickupAddress?.city) {
          newErrors.pickupAddress = { ...newErrors?.pickupAddress, city: 'City is required' };
        }
        if (!formData?.pickupAddress?.state) {
          newErrors.pickupAddress = { ...newErrors?.pickupAddress, state: 'State is required' };
        }
        if (!formData?.pickupAddress?.pincode) {
          newErrors.pickupAddress = { ...newErrors?.pickupAddress, pincode: 'PIN code is required' };
        }
        if (!formData?.contactPerson) newErrors.contactPerson = 'Contact person is required';
        if (!formData?.contactPhone) newErrors.contactPhone = 'Contact phone is required';
        break;
        
      case 4:
        if (!formData?.dietaryType) newErrors.dietaryType = 'Dietary type is required';
        if (!formData?.urgencyLevel) newErrors.urgencyLevel = 'Urgency level is required';
        break;
        
      case 5:
        // Advanced options are optional
        if (formData?.isRecurring && !formData?.recurringSchedule?.frequency) {
          newErrors.recurringSchedule = { frequency: 'Frequency is required for recurring donations' };
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    // Check if food is expired
    const isExpired = analysisResult && analysisResult.freshness?.toLowerCase().includes('expired');
    if (isExpired && currentStep === 1) {
      return; // Don't proceed if expired on step 1
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to top to show error messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      const submissionData = {
        ...formData,
        photos: photos,
        submittedAt: new Date()?.toISOString(),
        status: 'active',
        id: `food_${Date.now()}`
      };
      
      console.log('Submitted food donation:', submissionData);
      
      // Navigate to donor dashboard with success message
      navigate('/donor-dashboard?success=food-posted');
      
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ submit: 'Failed to post food donation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={5}
                onAnalysisChange={setAnalysisResult}
              />
              {errors?.analysis && (
                <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2">
                  <Icon name="AlertCircle" size={18} className="text-error flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-error font-medium">{errors?.analysis}</span>
                </div>
              )}
            </div>
            <BasicDetailsForm
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
              analysis={analysisResult}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8">
            <AIDescriptionEnhancer
              currentDescription={formData?.description}
              onDescriptionUpdate={(description) => setFormData({ ...formData, description })}
              foodName={formData?.foodName}
              foodType={formData?.foodType}
            />
            <CategorySelection
              selectedCategories={formData?.selectedCategories}
              onCategoriesChange={(categories) => setFormData({ ...formData, selectedCategories: categories })}
              autoSuggestedTags={autoSuggestedTags}
            />
          </div>
        );
        
      case 3:
        return (
          <LocationDetails
            formData={formData}
            onFormChange={setFormData}
            errors={errors}
          />
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <DietaryInformation
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
            />
            <UrgencyIndicator
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
            />
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-8">
            <RecurringDonation
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
            />
            <BulkPosting
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader
        userRole="donor"
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation userRole="donor" className="mb-6" />

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Plus" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Post Surplus Food
                </h1>
                <p className="text-muted-foreground">
                  Share your surplus food with those in need through AI-powered matching
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-heading font-semibold text-foreground">
                  Step {currentStep} of {steps?.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / steps?.length) * 100)}% Complete
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps?.length) * 100}%` }}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {steps?.map((step) => (
                  <div
                    key={step?.id}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      step?.id === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step?.id < currentStep
                        ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon 
                      name={step?.id < currentStep ? 'Check' : step?.icon} 
                      size={12} 
                    />
                    <span className="hidden sm:inline">{step?.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
                {steps?.[currentStep - 1]?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {steps?.[currentStep - 1]?.description}
              </p>
            </div>

            {renderStepContent()}

            {/* Error Display */}
            {errors?.submit && (
              <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors?.submit}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep < steps?.length ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  iconName="ChevronRight"
                  iconPosition="right"
                  disabled={currentStep === 1 && analysisResult && analysisResult.freshness?.toLowerCase().includes('expired')}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  iconName="Send"
                  iconPosition="left"
                >
                  {isSubmitting ? 'Posting Food...' : 'Post Food Donation'}
                </Button>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h3 className="text-sm font-heading font-semibold text-foreground mb-3">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Camera" size={12} className="text-primary" />
                <span>Take clear photos for better matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={12} className="text-primary" />
                <span>Set accurate expiry times</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={12} className="text-primary" />
                <span>Provide precise pickup location</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={12} className="text-primary" />
                <span>Include dietary information</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={12} className="text-primary" />
                <span>Set appropriate urgency level</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={12} className="text-primary" />
                <span>Keep contact details updated</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ActionFloatingButton userRole="donor" />
    </div>
  );
};

export default PostSurplusFood;