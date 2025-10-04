import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TermsAndPrivacySection = ({ 
  formData, 
  onFormChange, 
  errors, 
  onSubmit, 
  isSubmitting,
  className = '' 
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleTermsChange = (checked) => {
    onFormChange('acceptTerms', checked);
  };

  const handleMarketingChange = (checked) => {
    onFormChange('acceptMarketing', checked);
  };

  const handleNewsletterChange = (checked) => {
    onFormChange('acceptNewsletter', checked);
  };

  return (
    <div className={`terms-privacy-section ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Terms & Privacy
        </h2>
        <p className="text-muted-foreground">
          Please review and accept our terms to complete registration
        </p>
      </div>
      <div className="space-y-6">
        {/* Terms of Service */}
        <div className="bg-card border border-border rounded-lg p-6">
          <Checkbox
            label="I agree to the Terms of Service and Community Guidelines"
            description="Required to create your FoodBridge account"
            checked={formData?.acceptTerms || false}
            onChange={(e) => handleTermsChange(e?.target?.checked)}
            error={errors?.acceptTerms}
            required
          />
          
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <button
              type="button"
              onClick={() => setShowTerms(!showTerms)}
              className="text-primary hover:underline flex items-center"
            >
              <Icon name="FileText" size={14} className="mr-1" />
              Read Terms of Service
            </button>
            <button
              type="button"
              className="text-primary hover:underline flex items-center"
            >
              <Icon name="Users" size={14} className="mr-1" />
              Community Guidelines
            </button>
          </div>

          {showTerms && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-foreground mb-2">Terms of Service Summary</h4>
              <ul className="space-y-1 text-xs">
                <li>• You must provide accurate information during registration</li>
                <li>• Food donors are responsible for food safety and quality</li>
                <li>• Recipients must use donated food for intended beneficiaries</li>
                <li>• Platform facilitates connections but doesn't guarantee food quality</li>
                <li>• Users must comply with local food safety regulations</li>
                <li>• Misuse of platform may result in account suspension</li>
                <li>• FoodBridge reserves right to verify user information</li>
                <li>• Platform is provided "as-is" without warranties</li>
              </ul>
            </div>
          )}
        </div>

        {/* Privacy Policy */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-foreground mb-2">
                Privacy & Data Protection
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                We protect your personal information and comply with Indian data protection laws.
              </p>
              
              <button
                type="button"
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="text-primary hover:underline text-sm flex items-center"
              >
                <Icon name="Eye" size={14} className="mr-1" />
                View Privacy Policy
              </button>

              {showPrivacy && (
                <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground max-h-48 overflow-y-auto">
                  <h4 className="font-semibold text-foreground mb-2">Privacy Policy Highlights</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• We collect only necessary information for platform functionality</li>
                    <li>• Your data is encrypted and stored securely in India</li>
                    <li>• We don't sell your personal information to third parties</li>
                    <li>• Location data is used only for food matching purposes</li>
                    <li>• You can request data deletion at any time</li>
                    <li>• We comply with IT Act 2000 and data protection regulations</li>
                    <li>• Cookies are used to improve user experience</li>
                    <li>• You have right to access and correct your data</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optional Preferences */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Settings" size={18} className="mr-2" />
            Communication Preferences
          </h3>
          
          <div className="space-y-4">
            <Checkbox
              label="Send me marketing communications about new features"
              description="Occasional updates about platform improvements and success stories"
              checked={formData?.acceptMarketing || false}
              onChange={(e) => handleMarketingChange(e?.target?.checked)}
            />
            
            <Checkbox
              label="Subscribe to FoodBridge newsletter"
              description="Monthly newsletter with impact reports and community highlights"
              checked={formData?.acceptNewsletter || false}
              onChange={(e) => handleNewsletterChange(e?.target?.checked)}
            />
          </div>
        </div>

        {/* Data Usage Information */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={18} className="text-primary mt-1 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="font-semibold text-foreground mb-1">
                How We Use Your Information
              </h4>
              <p className="text-muted-foreground">
                Your registration data helps us match food donations effectively, verify user authenticity, 
                and provide personalized platform experience. We use AI to analyze food descriptions and 
                location data for optimal matching while keeping your personal information secure.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border">
          <Button
            variant="default"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!formData?.acceptTerms || isSubmitting}
            onClick={onSubmit}
            iconName="UserPlus"
            iconPosition="left"
          >
            {isSubmitting ? 'Creating Account...' : 'Create FoodBridge Account'}
          </Button>
          
          <p className="text-center text-xs text-muted-foreground mt-4">
            By creating an account, you acknowledge that you have read and understood our 
            Terms of Service and Privacy Policy, and agree to receive account-related communications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacySection;