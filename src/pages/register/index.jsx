import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import all components
import UserTypeSelection from './components/UserTypeSelection';
import BasicInfoForm from './components/BasicInfoForm';
import OrganizationDetailsForm from './components/OrganizationDetailsForm';
import DocumentUploadForm from './components/DocumentUploadForm';
import TrustSignalsSection from './components/TrustSignalsSection';
import TermsAndPrivacySection from './components/TermsAndPrivacySection';
import ProgressIndicator from './components/ProgressIndicator';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    userType: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    businessType: '',
    organizationType: '',
    licenseNumber: '',
    registrationNumber: '',
    beneficiariesCount: '',
    availability: '',
    transportation: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    operatingHoursFrom: '',
    operatingHoursTo: '',
    acceptTerms: false,
    acceptMarketing: false,
    acceptNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const totalSteps = 5;

  // Mock credentials for testing
  const mockCredentials = {
    restaurant: {
      email: "restaurant@foodbridge.com",
      password: "Restaurant123!",
      phone: "9876543210"
    },
    ngo: {
      email: "ngo@foodbridge.com", 
      password: "NGO123!",
      phone: "9876543211"
    }
  };

  useEffect(() => {
    // Set page title
    document.title = 'Register - FoodBridge';
    
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.userType) {
          newErrors.userType = 'Please select your role';
        }
        break;

      case 2:
        if (!formData?.fullName?.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!formData?.email?.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData?.phone?.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/?.test(formData?.phone)) {
          newErrors.phone = 'Please enter a valid 10-digit mobile number';
        }
        if (!formData?.password) {
          newErrors.password = 'Password is required';
        } else if (formData?.password?.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData?.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData?.password !== formData?.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 3:
        if (formData?.userType === 'donor' || formData?.userType === 'restaurant') {
          if (!formData?.organizationName?.trim()) {
            newErrors.organizationName = 'Restaurant name is required';
          }
          if (!formData?.businessType) {
            newErrors.businessType = 'Please select restaurant type';
          }
          if (!formData?.licenseNumber?.trim()) {
            newErrors.licenseNumber = 'FSSAI license number is required';
          }
        } else if (formData?.userType === 'recipient' || formData?.userType === 'ngo') {
          if (!formData?.organizationName?.trim()) {
            newErrors.organizationName = 'Organization name is required';
          }
          if (!formData?.organizationType) {
            newErrors.organizationType = 'Please select organization type';
          }
          if (!formData?.registrationNumber?.trim()) {
            newErrors.registrationNumber = 'Registration number is required';
          }
          if (!formData?.beneficiariesCount) {
            newErrors.beneficiariesCount = 'Number of beneficiaries is required';
          }
        }
        
        // Common address validation
        if (!formData?.city?.trim()) {
          newErrors.city = 'City is required';
        }
        if (!formData?.state) {
          newErrors.state = 'Please select state';
        }
        if (!formData?.address?.trim()) {
          newErrors.address = 'Complete address is required';
        }
        if (!formData?.pincode?.trim()) {
          newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/?.test(formData?.pincode)) {
          newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }
        break;

      case 4:
        // Document validation would be handled in DocumentUploadForm
        break;

      case 5:
        if (!formData?.acceptTerms) {
          newErrors.acceptTerms = 'You must accept the Terms of Service to continue';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock registration success
      console.log('Registration data:', formData);
      
      // Store user type in localStorage for role-based routing
      localStorage.setItem('userType', formData?.userType);
      
      // Show success message and redirect
      alert(`Account created successfully! Welcome to FoodBridge.\n\nMock credentials for testing:\nEmail: ${mockCredentials?.[formData?.userType]?.email}\nPassword: ${mockCredentials?.[formData?.userType]?.password}`);
      
      // Redirect based on user type
      if (formData?.userType === 'donor' || formData?.userType === 'restaurant') {
        navigate('/donor-dashboard');
      } else if (formData?.userType === 'recipient' || formData?.userType === 'ngo') {
        navigate('/recipient-dashboard');
      } else {
        navigate('/donor-dashboard');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserTypeSelection
            selectedType={formData?.userType}
            onTypeSelect={(type) => handleFormChange('userType', type)}
          />
        );

      case 2:
        return (
          <BasicInfoForm
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );

      case 3:
        return (
          <OrganizationDetailsForm
            userType={formData?.userType}
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );

      case 4:
        return (
          <DocumentUploadForm
            userType={formData?.userType}
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
          />
        );

      case 5:
        return (
          <TermsAndPrivacySection
            formData={formData}
            onFormChange={handleFormChange}
            errors={errors}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader 
        userRole="guest"
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            userType={formData?.userType}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-soft border border-border p-6 lg:p-8">
                {renderStepContent()}

                {/* Navigation Buttons */}
                {currentStep < 5 && (
                  <div className="flex items-center justify-between pt-8 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      iconName="ChevronLeft"
                      iconPosition="left"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Save" size={14} />
                      <span>Progress auto-saved</span>
                    </div>

                    <Button
                      variant="default"
                      onClick={handleNext}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next Step
                    </Button>
                  </div>
                )}

                {/* Error Display */}
                {errors?.submit && (
                  <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                    <div className="flex items-center text-error">
                      <Icon name="AlertCircle" size={16} className="mr-2" />
                      <span className="text-sm">{errors?.submit}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Signals Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <TrustSignalsSection />
                
                {/* Already have account */}
                <div className="bg-card rounded-lg p-6 border border-border mt-6">
                  <div className="text-center">
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      Already have an account?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to access your FoodBridge dashboard
                    </p>
                    <Link to="/login">
                      <Button variant="outline" fullWidth iconName="LogIn" iconPosition="left">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Help & Support */}
                <div className="bg-muted/30 rounded-lg p-4 mt-6">
                  <div className="flex items-center mb-2">
                    <Icon name="HelpCircle" size={16} className="text-primary mr-2" />
                    <span className="text-sm font-medium text-foreground">Need Help?</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Our support team is here to help you get started
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="Mail" size={12} />
                    <span>support@foodbridge.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                    <Icon name="Phone" size={12} />
                    <span>+91-800-FOODBRIDGE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;