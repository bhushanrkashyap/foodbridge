import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * ProtectedRoute - Wraps routes that require authentication and specific roles
 * @param {string|string[]} requiredRole - Role(s) allowed to access this route ('donor', 'restaurant', 'ngo', 'recipient')
 * @param {ReactNode} children - Components to render if authorized
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    userRole: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First check for mock authentication (localStorage-based)
      const authToken = localStorage.getItem('authToken');
      const storedUserRole = localStorage.getItem('userRole');
      const storedUserType = localStorage.getItem('userType');
      
      if (authToken && (storedUserRole || storedUserType)) {
        // Mock authentication is active
        const roleMapping = {
          'restaurant': 'donor',
          'ngo': 'recipient',
          'donor': 'donor',
          'recipient': 'recipient'
        };
        
        const userRole = roleMapping[storedUserRole] || roleMapping[storedUserType] || storedUserRole || storedUserType;
        
        setAuthState({
          loading: false,
          authenticated: true,
          userRole
        });
        return;
      }

      // Check if user is logged in via Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setAuthState({ loading: false, authenticated: false, userRole: null });
        return;
      }

      // Try to get user role from users table (silently fail if table doesn't exist)
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, userType')
          .eq('email', session.user.email)
          .single();

        if (userError) {
          throw userError;
        }

        // Use role from database
        const userRole = userData?.role || userData?.userType || 'donor';
        setAuthState({
          loading: false,
          authenticated: true,
          userRole
        });
        return;
      } catch (dbError) {
        // Silently handle database errors (table doesn't exist, schema issues, etc.)
        // Fall back to localStorage
        const roleMapping = {
          'restaurant': 'donor',
          'ngo': 'recipient',
          'donor': 'donor',
          'recipient': 'recipient'
        };

        const storedUserType = localStorage.getItem('userType');
        const mappedRole = roleMapping[storedUserType] || storedUserType;

        setAuthState({
          loading: false,
          authenticated: true,
          userRole: mappedRole || 'donor'
        });
        return;
      }

    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState({ loading: false, authenticated: false, userRole: null });
    }
  };

  // Show loading state
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Map common role variations
    const roleMapping = {
      'restaurant': 'donor',
      'ngo': 'recipient',
      'donor': 'donor',
      'recipient': 'recipient'
    };

    const normalizedUserRole = roleMapping[authState.userRole] || authState.userRole;
    const normalizedAllowedRoles = allowedRoles.map(role => roleMapping[role] || role);

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      // Redirect to appropriate dashboard based on user's actual role
      const redirectPath = normalizedUserRole === 'donor' ? '/donor-dashboard' : '/recipient-dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
