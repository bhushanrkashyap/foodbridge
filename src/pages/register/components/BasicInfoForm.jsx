import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BasicInfoForm = ({ formData, onFormChange, errors, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[0-9]/?.test(password)) strength++;
    if (/[^A-Za-z0-9]/?.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e?.target?.value;
    setPasswordStrength(calculatePasswordStrength(password));
    onFormChange('password', password);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-error';
      case 2: return 'bg-warning';
      case 3: return 'bg-accent';
      case 4:
      case 5: return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4:
      case 5: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className={`basic-info-form ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Basic Information
        </h2>
        <p className="text-muted-foreground">
          Tell us about yourself to get started
        </p>
      </div>
      <div className="space-y-6">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.fullName || ''}
          onChange={(e) => onFormChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={formData?.email || ''}
          onChange={(e) => onFormChange('email', e?.target?.value)}
          error={errors?.email}
          description="We'll use this for account verification and notifications"
          required
        />

        {/* Phone Number */}
        <div className="space-y-2">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            value={formData?.phone || ''}
            onChange={(e) => onFormChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="mr-1" />
            Indian mobile number without +91 prefix
          </div>
        </div>

        {/* Password */}
        <div className="space-y-3">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData?.password || ''}
              onChange={handlePasswordChange}
              error={errors?.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData?.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength >= 4 ? 'text-success' : 
                  passwordStrength >= 3 ? 'text-accent' :
                  passwordStrength >= 2 ? 'text-warning' : 'text-error'
                }`}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5]?.map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= passwordStrength ? getStrengthColor() : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Use 8+ characters with uppercase, lowercase, numbers, and symbols
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={formData?.confirmPassword || ''}
          onChange={(e) => onFormChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;