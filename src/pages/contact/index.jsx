import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ContactPage = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team. We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">support@foodbridge.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="MapPin" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="text-muted-foreground">123 Mission Street<br />San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  placeholder="How can we help?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <Button 
                variant="default" 
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  alert('Thank you for your message! We will get back to you within 24 hours.');
                }}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;