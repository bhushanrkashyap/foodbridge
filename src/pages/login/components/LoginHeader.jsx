import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <header className="w-full bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Utensils" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">
              FoodBridge
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              About
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              How It Works
            </Link>
            <Link
              to="/impact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              Impact
            </Link>
          </nav>

          {/* Register Link */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              New to FoodBridge?
            </span>
            <Link
              to="/register"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;