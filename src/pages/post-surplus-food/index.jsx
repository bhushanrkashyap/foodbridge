import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
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
  const [donationId, setDonationId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

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

  const handleNext = async () => {
    // Simply navigate to next step - data is saved by individual Save buttons
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, steps?.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepComplete = (stepName) => {
    // Auto-advance to next step after component saves
    setCurrentStep(prev => Math.min(prev + 1, steps?.length));
  };

  const handleSubmit = async () => {
    if (!donationId) {
      setErrors({ submit: 'Please complete the basic details step first.' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verify the donation exists and has all required data
      const { data: donation, error: fetchError } = await supabase
        .from('donations')
        .select('*')
        .eq('id', donationId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!donation) {
        throw new Error('Donation not found');
      }
      
      // Validate required fields
      if (!donation.food_name || !donation.food_type || !donation.quantity || 
          !donation.unit || !donation.expiry_datetime) {
        setErrors({ submit: 'Please complete all required fields before submitting.' });
        setIsSubmitting(false);
        return;
      }
      
      // Update status to 'successful' to mark as posted
      const { error: updateError } = await supabase
        .from('donations')
        .update({ status: 'successful' })
        .eq('id', donationId);

      console.log('=== DONATION SUBMISSION ===');
      console.log('Donation ID:', donationId);
      console.log('Update Error:', updateError);
      console.log('Status set to: successful');

      if (updateError) {
        console.error('❌ Failed to update status:', updateError);
        // If update fails, set status to 'unsuccessful'
        await supabase
          .from('donations')
          .update({ status: 'unsuccessful' })
          .eq('id', donationId);
        throw updateError;
      }

      console.log('✅ Successfully posted food donation:', donationId);
      
      // Verify the update
      const { data: verifyData } = await supabase
        .from('donations')
        .select('id, food_name, status')
        .eq('id', donationId)
        .single();
      
      console.log('📋 Verification - Donation in DB:', verifyData);      // Navigate to donor dashboard with success message
      navigate('/donor-dashboard?success=food-posted');
      
    } catch (error) {
      console.error('Submission failed:', error);
      
      // Try to update status to 'unsuccessful' on error
      try {
        await supabase
          .from('donations')
          .update({ status: 'unsuccessful' })
          .eq('id', donationId);
      } catch (statusError) {
        console.error('Failed to update status:', statusError);
      }
      
      setErrors({ submit: 'Failed to post food donation: ' + (error.message || 'Please try again.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <PhotoUpload
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={5}
              onAnalysisChange={(analysis) => {
                if (analysis?.image_url) {
                  setImageUrl(analysis.image_url);
                }
              }}
            />
            <BasicDetailsForm
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
              donationId={donationId}
              imageUrl={imageUrl}
              onNextStep={handleStepComplete}
              onDonationIdChange={setDonationId}
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
              donationId={donationId}
              onNextStep={handleStepComplete}
            />
            <CategorySelection
              selectedCategories={formData?.selectedCategories}
              onCategoriesChange={(categories) => setFormData({ ...formData, selectedCategories: categories })}
              autoSuggestedTags={autoSuggestedTags}
              donationId={donationId}
              onNextStep={handleStepComplete}
            />
          </div>
        );
        
      case 3:
        return (
          <LocationDetails
            formData={formData}
            onFormChange={setFormData}
            errors={errors}
            donationId={donationId}
            onNextStep={handleStepComplete}
          />
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <DietaryInformation
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
              donationId={donationId}
            />
            <UrgencyIndicator
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
              donationId={donationId}
              onNextStep={handleStepComplete}
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
              donationId={donationId}
              onNextStep={handleStepComplete}
            />
            <BulkPosting
              formData={formData}
              onFormChange={setFormData}
              errors={errors}
              donationId={donationId}
            />
            
            {/* Final Submit Button */}
            <div className="bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-6 border-2 border-success/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-success-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-foreground">
                    Ready to Post Your Donation!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Review your details and submit to start helping those in need
                  </p>
                </div>
              </div>
              
              <Button
                variant="success"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || !donationId}
                iconName="Send"
                iconPosition="left"
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Posting Food...' : 'Post Food Donation'}
              </Button>
              
              {!donationId && (
                <p className="mt-3 text-xs text-error text-center">
                  Please complete Step 1 (Basic Details) before submitting
                </p>
              )}
            </div>
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
              Previous Step
            </Button>

            {currentStep < steps?.length && (
              <Button
                variant="default"
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next Page
              </Button>
            )}
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