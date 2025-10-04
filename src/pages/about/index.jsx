import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState('mission');

  const stats = [
    { number: '50,000+', label: 'Meals Saved', icon: 'Utensils' },
    { number: '1,200+', label: 'Partner Organizations', icon: 'Building' },
    { number: '85', label: 'Cities Served', icon: 'MapPin' },
    { number: '12.5', label: 'Tonnes CO₂ Prevented', icon: 'Leaf' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b812b950?w=300&h=300&fit=crop&crop=face',
      bio: 'Former sustainability consultant with 10+ years in food waste reduction.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Tech veteran passionate about using technology for social impact.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
      bio: 'PhD in Food Systems with expertise in non-profit collaboration.'
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'UX specialist focused on creating intuitive solutions for social good.'
    }
  ];

  const timeline = [
    { year: '2022', title: 'FoodBridge Founded', description: 'Started with a mission to eliminate food waste' },
    { year: '2023', title: 'First 1,000 Meals', description: 'Reached our first major milestone' },
    { year: '2023', title: 'Mobile App Launch', description: 'Extended our reach with mobile technology' },
    { year: '2024', title: 'AI Integration', description: 'Introduced smart matching algorithms' },
    { year: '2024', title: '50 Cities', description: 'Expanded to serve 50+ cities nationwide' },
    { year: '2025', title: 'Global Expansion', description: 'Launching in international markets' }
  ];

  const values = [
    {
      title: 'Sustainability',
      description: 'We believe in creating lasting environmental impact through food waste reduction.',
      icon: 'Leaf'
    },
    {
      title: 'Community',
      description: 'Building stronger communities by connecting those who have with those who need.',
      icon: 'Users'
    },
    {
      title: 'Innovation',
      description: 'Using cutting-edge technology to solve age-old problems of hunger and waste.',
      icon: 'Lightbulb'
    },
    {
      title: 'Transparency',
      description: 'Open communication and clear impact metrics drive everything we do.',
      icon: 'Eye'
    }
  ];

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
              <button
                onClick={() => setActiveSection('mission')}
                className={`text-sm font-medium transition-smooth ${
                  activeSection === 'mission' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveSection('team')}
                className={`text-sm font-medium transition-smooth ${
                  activeSection === 'team' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Our Team
              </button>
              <button
                onClick={() => setActiveSection('impact')}
                className={`text-sm font-medium transition-smooth ${
                  activeSection === 'impact' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Our Impact
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  Join Us
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
            About <span className="text-primary">FoodBridge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're on a mission to eliminate food waste while fighting hunger. 
            By connecting surplus food with those who need it most, we're building 
            a more sustainable and equitable food system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              icon={<Icon name="ArrowRight" />}
              iconPosition="right"
              onClick={() => setActiveSection('mission')}
            >
              Learn Our Story
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<Icon name="Users" />}
              iconPosition="left"
              onClick={() => setActiveSection('team')}
            >
              Meet the Team
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={stat.icon} size={32} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{stat.number}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      {activeSection === 'mission' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-8 text-center">Our Mission</h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">The Problem</h3>
                  <p className="text-muted-foreground mb-6">
                    Every year, millions of tons of perfectly good food go to waste while millions of people face food insecurity. 
                    This paradox represents one of the most pressing challenges of our time.
                  </p>
                  <p className="text-muted-foreground">
                    Restaurants, grocery stores, and farms often have surplus food that could feed families, 
                    but lack the connections and logistics to get it to those who need it most.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Icon name="AlertTriangle" size={64} className="text-warning mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-foreground mb-2">40% Food Waste</h4>
                  <p className="text-muted-foreground">
                    Nearly half of all food produced globally is wasted
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="bg-primary/5 rounded-lg p-8 text-center order-2 md:order-1">
                  <Icon name="Heart" size={64} className="text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-foreground mb-2">Smart Solutions</h4>
                  <p className="text-muted-foreground">
                    Technology-driven platform connecting surplus food with those in need
                  </p>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">Our Solution</h3>
                  <p className="text-muted-foreground mb-6">
                    FoodBridge uses intelligent matching algorithms, real-time logistics coordination, 
                    and community networks to bridge the gap between food surplus and food need.
                  </p>
                  <p className="text-muted-foreground">
                    Our platform makes it simple for businesses to donate surplus food and for 
                    organizations to access fresh, nutritious meals for their communities.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {values.map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name={value.icon} size={32} className="text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">{value.title}</h4>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Our Journey</h3>
                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <div className="w-20 text-right">
                        <span className="text-lg font-bold text-primary">{item.year}</span>
                      </div>
                      <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {activeSection === 'team' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-4 text-center">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
                We're a diverse group of passionate individuals united by our commitment to 
                creating positive social and environmental impact through technology.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-card rounded-lg border border-border p-6 text-center hover:shadow-elevated transition-smooth">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Join Our Team</h3>
                <p className="text-muted-foreground mb-8">
                  We're always looking for passionate individuals to join our mission.
                </p>
                <Button
                  variant="default"
                  icon={<Icon name="Users" />}
                  iconPosition="left"
                >
                  View Open Positions
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Impact Section */}
      {activeSection === 'impact' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-8 text-center">Our Impact</h2>
              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-success/5 border border-success/20 rounded-lg p-6 text-center">
                  <Icon name="Utensils" size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-foreground mb-2">50,000+</h3>
                  <p className="text-muted-foreground">Meals Redistributed</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                  <Icon name="Building" size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-foreground mb-2">1,200+</h3>
                  <p className="text-muted-foreground">Partner Organizations</p>
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
                  <Icon name="Leaf" size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-foreground mb-2">12.5</h3>
                  <p className="text-muted-foreground">Tonnes CO₂ Prevented</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 mb-16">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Environmental Impact</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Carbon Footprint Reduction</h4>
                    <p className="text-muted-foreground mb-4">
                      By preventing food waste, we've eliminated the equivalent of taking 500 cars off the road for a year.
                    </p>
                    <div className="bg-success/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-success">
                        <Icon name="Leaf" size={20} />
                        <span className="font-medium">12.5 tonnes CO₂ saved</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Resource Conservation</h4>
                    <p className="text-muted-foreground mb-4">
                      Our efforts have saved millions of gallons of water and thousands of acres of farmland.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Icon name="Droplets" size={20} />
                        <span className="font-medium">2.5M gallons water saved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Be Part of the Solution</h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Every meal shared, every pound of food rescued, and every organization that joins our platform 
                  multiplies our collective impact. Together, we can build a world without food waste.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register?type=donor">
                    <Button
                      variant="default"
                      icon={<Icon name="Heart" />}
                      iconPosition="left"
                    >
                      Become a Donor
                    </Button>
                  </Link>
                  <Link to="/register?type=recipient">
                    <Button
                      variant="outline"
                      icon={<Icon name="Users" />}
                      iconPosition="left"
                    >
                      Partner with Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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

export default AboutPage;