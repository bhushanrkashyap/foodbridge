import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">FoodBridge</span>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">Back to App</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to your questions and get support for using FoodBridge
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg border border-border p-6">
            <Icon name="MessageCircle" size={32} className="text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Contact Support</h3>
            <p className="text-muted-foreground mb-4">Get help from our support team</p>
            <Button variant="outline" fullWidth>Email Support</Button>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-6">
            <Icon name="Book" size={32} className="text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">User Guide</h3>
            <p className="text-muted-foreground mb-4">Learn how to use FoodBridge</p>
            <Button variant="outline" fullWidth>View Guide</Button>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">How do I post surplus food?</h3>
              <p className="text-muted-foreground">Navigate to your dashboard and click "Post Surplus Food". Fill in the details about your available food including photos, quantity, and pickup location.</p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">How does the matching system work?</h3>
              <p className="text-muted-foreground">Our AI algorithm matches donations based on location, dietary requirements, quantity needed, and organizational capacity to ensure efficient food distribution.</p>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Is the platform free to use?</h3>
              <p className="text-muted-foreground">Yes, FoodBridge is completely free for both food donors and recipient organizations. Our mission is to eliminate barriers to food sharing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;