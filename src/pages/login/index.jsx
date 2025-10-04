import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import LoginHeader from './components/LoginHeader';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock credentials for different user roles
  const mockCredentials = {
    'donor@foodbridge.com': { password: 'donor123', role: 'donor', name: 'Restaurant Manager' },
    'recipient@foodbridge.com': { password: 'recipient123', role: 'recipient', name: 'NGO Coordinator' },
    'admin@foodbridge.com': { password: 'admin123', role: 'admin', name: 'System Admin' }
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      // Redirect to appropriate dashboard
      const dashboardPath = userRole === 'recipient' ? '/recipient-dashboard' : '/donor-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (formData) => {
    setLoading(true);
    setError(null);

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
      localStorage.setItem('userData', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect based on user role
      const dashboardPath = user?.role === 'recipient' ? '/recipient-dashboard' : '/donor-dashboard';
      navigate(dashboardPath, { replace: true });

    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LoginHeader />
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Login Form */}
            <div className="order-2 lg:order-1">
              <div className="max-w-md mx-auto lg:mx-0">
                <LoginForm
                  onSubmit={handleLogin}
                  loading={loading}
                  error={error}
                />

                {/* Demo Credentials Info */}
                <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
                  <h4 className="font-medium text-foreground text-sm mb-2">Demo Credentials:</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div><strong>Donor:</strong> donor@foodbridge.com / donor123</div>
                    <div><strong>Recipient:</strong> recipient@foodbridge.com / recipient123</div>
                    <div><strong>Admin:</strong> admin@foodbridge.com / admin123</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trust Signals */}
            <div className="order-1 lg:order-2">
              <div className="max-w-md mx-auto lg:mx-0">
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              © {new Date()?.getFullYear()} FoodBridge. Reducing food waste, fighting hunger.
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-foreground transition-smooth">Privacy Policy</Link>
              <a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a>
              <Link to="/help-center" className="hover:text-foreground transition-smooth">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;