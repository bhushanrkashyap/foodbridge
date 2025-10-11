import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, loading: externalLoading, error: externalError }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(null);
  const navigate = useNavigate();

  // Mock credentials for different user roles
  const mockCredentials = {
    'donor@foodbridge.com': { password: 'donor123', role: 'donor', name: 'Restaurant Manager' },
    'recipient@foodbridge.com': { password: 'recipient123', role: 'recipient', name: 'NGO Coordinator' },
    'admin@foodbridge.com': { password: 'admin123', role: 'admin', name: 'System Admin' }
  };

  const loading = externalLoading || internalLoading;
  const error = externalError || internalError;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors?.[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password or show modal
    console.log('Forgot password clicked');
  };

  // Use parent's onSubmit handler (mock authentication)
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If parent provides onSubmit, use it
    if (onSubmit) {
      await onSubmit(formData);
      return;
    }

    // Otherwise, handle authentication directly
    setInternalLoading(true);
    setInternalError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { email, password, rememberMe } = formData;
      const user = mockCredentials?.[email?.toLowerCase()];

      if (!user || user?.password !== password) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }

      // Simulate successful authentication
      const authToken = `mock_jwt_token_${Date.now()}`;
      const userData = {
        id: Math.floor(Math.random() * 1000),
        email: email,
        name: user?.name,
        role: user?.role,
        verified: true,
        lastLogin: new Date()?.toISOString()
      };

      // Store authentication data
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userRole', user?.role);
      localStorage.setItem('userType', user?.role);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect based on user role
      const dashboardPath = user?.role === 'recipient' ? '/recipient-dashboard' : '/donor-dashboard';
      navigate(dashboardPath, { replace: true });

    } catch (err) {
      setInternalError(err?.message);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-elevated p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Utensils" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your FoodBridge account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center">
            <Icon name="AlertCircle" size={16} className="text-error mr-2 flex-shrink-0" />
            <span className="text-error text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={formErrors?.email}
            required
            className="mb-4"
          />

          <div className="relative mb-4">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData?.password}
              onChange={handleInputChange}
              error={formErrors?.password}
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

          <div className="flex items-center justify-between mb-6">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              size="sm"
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-smooth"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={loading}
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            New to FoodBridge?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;