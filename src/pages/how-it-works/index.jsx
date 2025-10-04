import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const HowItWorksPage = () => {
  const [activeRole, setActiveRole] = useState('donor');

  const donorSteps = [
    {
      step: 1,
      title: 'Post Your Surplus Food',
      description: 'Upload photos and details of your available food including quantity, expiry time, and pickup location.',
      icon: 'Camera',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop'
    },
    {
      step: 2,
      title: 'AI Finds Perfect Matches',
      description: 'Our smart algorithm instantly matches your donation with nearby organizations based on their needs and capacity.',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
    },
    {
      step: 3,
      title: 'Coordinate Pickup',
      description: 'Communicate directly with recipients to arrange convenient pickup times and special instructions.',
      icon: 'Truck',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    },
    {
      step: 4,
      title: 'Track Your Impact',
      description: 'See real-time metrics on meals provided, CO₂ saved, and communities helped through your donations.',
      icon: 'BarChart3',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
    }
  ];

  const recipientSteps = [
    {
      step: 1,
      title: 'Browse Available Food',
      description: 'Search and filter donations by location, food type, quantity, and dietary requirements in real-time.',
      icon: 'Search',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop'
    },
    {
      step: 2,
      title: 'Request Food Items',
      description: 'Submit requests for food that matches your organization\'s needs and beneficiary requirements.',
      icon: 'Hand',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
    },
    {
      step: 3,
      title: 'Arrange Collection',
      description: 'Coordinate with donors to schedule pickup times that work for both parties, including volunteer coordination.',
      icon: 'Calendar',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
    },
    {
      step: 4,
      title: 'Distribute to Community',
      description: 'Efficiently distribute received food to your beneficiaries and report impact metrics back to the platform.',
      icon: 'Users',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop'
    }
  ];

  const features = [
    {
      title: 'AI-Powered Matching',
      description: 'Smart algorithms consider location, dietary needs, quantity, and urgency to find perfect matches.',
      icon: 'Brain',
      benefits: ['95% match accuracy', 'Instant notifications', 'Reduced food waste']
    },
    {
      title: 'Real-Time Tracking',
      description: 'Monitor every step from posting to delivery with live updates and impact metrics.',
      icon: 'Activity',
      benefits: ['Live status updates', 'Impact measurement', 'Quality assurance']
    },
    {
      title: 'Secure Communication',
      description: 'Built-in messaging system for safe coordination between donors and recipients.',
      icon: 'MessageSquare',
      benefits: ['End-to-end encryption', 'Photo sharing', 'Scheduling tools']
    },
    {
      title: 'Impact Analytics',
      description: 'Comprehensive reporting on environmental and social impact of your contributions.',
      icon: 'TrendingUp',
      benefits: ['CO₂ reduction metrics', 'Meals provided count', 'Community reach']
    }
  ];

  const faqs = [
    {
      question: 'Is there a cost to use FoodBridge?',
      answer: 'FoodBridge is completely free for both donors and recipients. Our mission is to eliminate barriers to food sharing.'
    },
    {
      question: 'How do you ensure food safety?',
      answer: 'We require all users to follow food safety guidelines, provide food handling training resources, and use time-sensitive matching to ensure freshness.'
    },
    {
      question: 'What types of organizations can receive food?',
      answer: 'Registered nonprofits, shelters, food banks, community kitchens, schools, and other qualifying organizations serving vulnerable populations.'
    },
    {
      question: 'How quickly can food be matched?',
      answer: 'Our AI matching system works in real-time. Most donations are matched within minutes of posting, with pickup typically arranged within hours.'
    },
    {
      question: 'Can I donate prepared/cooked food?',
      answer: 'Yes! We accept fresh prepared foods following local health department guidelines. Our platform includes specific protocols for prepared food donations.'
    },
    {
      question: 'How do you verify recipient organizations?',
      answer: 'All recipient organizations go through a verification process including documentation review, background checks, and compliance with food safety standards.'
    }
  ];

  const currentSteps = activeRole === 'donor' ? donorSteps : recipientSteps;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">FoodBridge</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                About
              </Link>
              <Link to="/how-it-works" className="text-sm font-medium text-primary">
                How It Works
              </Link>
              <Link to="/impact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                Impact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            How <span className="text-primary">FoodBridge</span> Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Our platform makes it simple and efficient to connect surplus food with those who need it. 
            Here's how we're revolutionizing food sharing.
          </p>

          {/* Role Toggle */}
          <div className="inline-flex bg-muted p-1 rounded-lg mb-8">
            <button
              onClick={() => setActiveRole('donor')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-smooth ${
                activeRole === 'donor'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Store" size={18} className="mr-2" />
              I'm a Donor
            </button>
            <button
              onClick={() => setActiveRole('recipient')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-smooth ${
                activeRole === 'recipient'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Users" size={18} className="mr-2" />
              I'm a Recipient
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {activeRole === 'donor' ? 'For Food Donors' : 'For Food Recipients'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {activeRole === 'donor'
                  ? 'Transform your surplus food into community impact with just a few simple steps.'
                  : 'Access fresh, nutritious food for your community through our streamlined platform.'
                }
              </p>
            </div>

            <div className="space-y-16">
              {currentSteps.map((step, index) => (
                <div
                  key={step.step}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={step.icon} size={24} className="text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                    
                    {step.step === 1 && (
                      <Link to="/register">
                        <Button
                          variant="default"
                          icon={<Icon name="ArrowRight" />}
                          iconPosition="right"
                        >
                          Get Started Now
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Image */}
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground">
                Advanced technology that makes food sharing simple, safe, and impactful.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-background rounded-lg p-6 border border-border hover:shadow-elevated transition-smooth">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={feature.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-muted-foreground">
                        <Icon name="Check" size={14} className="text-success mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about using FoodBridge.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-6">
                Still have questions? We're here to help.
              </p>
              <Button
                variant="outline"
                icon={<Icon name="MessageCircle" />}
                iconPosition="left"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Make an Impact?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using FoodBridge to reduce waste and fight hunger.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=donor">
              <Button
                variant="default"
                size="lg"
                icon={<Icon name="Store" />}
                iconPosition="left"
              >
                Donate Food
              </Button>
            </Link>
            <Link to="/register?type=recipient">
              <Button
                variant="outline"
                size="lg"
                icon={<Icon name="Users" />}
                iconPosition="left"
              >
                Receive Food
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Heart" size={20} color="white" />
                </div>
                <span className="text-xl font-bold text-foreground">FoodBridge</span>
              </div>
              <p className="text-muted-foreground">
                Connecting surplus food with those who need it most.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-smooth">About Us</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground transition-smooth">How It Works</Link></li>
                <li><Link to="/impact" className="hover:text-foreground transition-smooth">Our Impact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help-center" className="hover:text-foreground transition-smooth">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-smooth">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-foreground transition-smooth">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                  <Icon name="Twitter" size={20} />
                </button>
                <button className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                  <Icon name="Facebook" size={20} />
                </button>
                <button className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                  <Icon name="Linkedin" size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 FoodBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorksPage;