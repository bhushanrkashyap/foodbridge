import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const ImpactPage = () => {
  const [animatedStats, setAnimatedStats] = useState({
    meals: 0,
    carbon: 0,
    organizations: 0,
    cities: 0
  });

  const finalStats = {
    meals: 50000,
    carbon: 12.5,
    organizations: 1200,
    cities: 85
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setAnimatedStats(current => {
        const newStats = {};
        let allComplete = true;

        Object.keys(finalStats).forEach(key => {
          const target = finalStats[key];
          const current_val = current[key];
          const increment = target / steps;
          
          if (current_val < target) {
            newStats[key] = Math.min(current_val + increment, target);
            allComplete = false;
          } else {
            newStats[key] = target;
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return { ...current, ...newStats };
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const impactMetrics = [
    {
      title: 'Meals Rescued',
      value: Math.round(animatedStats.meals).toLocaleString(),
      suffix: '+',
      description: 'Nutritious meals saved from waste and distributed to those in need',
      icon: 'Utensils',
      color: 'success',
      trend: '+18% this month'
    },
    {
      title: 'CO₂ Prevented',
      value: animatedStats.carbon.toFixed(1),
      suffix: ' tonnes',
      description: 'Carbon emissions prevented through food waste reduction',
      icon: 'Leaf',
      color: 'accent',
      trend: '+25% this quarter'
    },
    {
      title: 'Organizations',
      value: Math.round(animatedStats.organizations).toLocaleString(),
      suffix: '+',
      description: 'Active partner organizations across the platform',
      icon: 'Building',
      color: 'primary',
      trend: '+12% this month'
    },
    {
      title: 'Cities Served',
      value: Math.round(animatedStats.cities),
      suffix: '',
      description: 'Cities and communities with active food sharing networks',
      icon: 'MapPin',
      color: 'secondary',
      trend: '+8 new cities'
    }
  ];

  const stories = [
    {
      title: 'Harbor Food Bank',
      location: 'Seattle, WA',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop',
      impact: '2,400 meals/month',
      story: 'Through FoodBridge, we\'ve been able to access fresh produce from local restaurants that would otherwise go to waste. This has allowed us to serve 40% more families.',
      quote: 'FoodBridge has revolutionized how we source and distribute food to our community.',
      author: 'Maria Rodriguez, Food Bank Director'
    },
    {
      title: 'Green Valley Restaurant',
      location: 'Portland, OR',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
      impact: '850 kg saved/month',
      story: 'As a restaurant committed to sustainability, FoodBridge helps us ensure our surplus food feeds people instead of filling landfills.',
      quote: 'We\'ve reduced our food waste by 85% while making a real difference in our community.',
      author: 'Chef David Kim, Owner'
    },
    {
      title: 'City Shelter Network',
      location: 'Denver, CO',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
      impact: '1,200 people served',
      story: 'The platform has connected us with local businesses, enabling us to provide more varied and nutritious meals to our residents.',
      quote: 'The quality and variety of food we can now offer has dramatically improved.',
      author: 'Jennifer Walsh, Shelter Manager'
    }
  ];

  const environmentalImpact = [
    {
      metric: 'Water Saved',
      value: '2.5M',
      unit: 'gallons',
      description: 'Water resources conserved by preventing food waste',
      icon: 'Droplets',
      equivalent: 'Equivalent to supplying 25 homes for a year'
    },
    {
      metric: 'Land Preserved',
      value: '850',
      unit: 'acres',
      description: 'Agricultural land saved from unnecessary production',
      icon: 'Trees',
      equivalent: 'Equal to 650 football fields'
    },
    {
      metric: 'Energy Saved',
      value: '45,000',
      unit: 'kWh',
      description: 'Energy conserved throughout the food supply chain',
      icon: 'Zap',
      equivalent: 'Powers 4 homes for an entire year'
    }
  ];

  const globalGoals = [
    {
      goal: 'Zero Hunger',
      number: '2',
      progress: 75,
      description: 'Contributing to UN Sustainable Development Goal 2 by ensuring access to nutritious food'
    },
    {
      goal: 'Responsible Consumption',
      number: '12',
      progress: 68,
      description: 'Supporting sustainable consumption patterns by reducing food waste'
    },
    {
      goal: 'Climate Action',
      number: '13',
      progress: 82,
      description: 'Taking urgent action to combat climate change through waste reduction'
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
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                About
              </Link>
              <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
                How It Works
              </Link>
              <Link to="/impact" className="text-sm font-medium text-primary">
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
                  Join the Impact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-success/5 via-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-success">Impact</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Every meal shared, every pound of food rescued, and every connection made through FoodBridge 
            creates a ripple effect of positive change. See how we're transforming communities together.
          </p>
        </div>
      </section>

      {/* Real-time Impact Metrics */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="bg-card rounded-lg shadow-elevated border border-border p-6 hover:shadow-elevated transition-smooth">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    metric.color === 'success' ? 'bg-success/10 text-success' :
                    metric.color === 'accent' ? 'bg-accent/10 text-accent' :
                    metric.color === 'primary' ? 'bg-primary/10 text-primary' :
                    'bg-secondary/10 text-secondary'
                  }`}>
                    <Icon name={metric.icon} size={24} />
                  </div>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    {metric.trend}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-1">
                  {metric.value}<span className="text-lg">{metric.suffix}</span>
                </h3>
                <p className="text-sm font-medium text-foreground mb-2">{metric.title}</p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real organizations, real impact. Hear from our partners about how FoodBridge 
              is transforming their ability to serve their communities.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <div key={index} className="bg-background rounded-lg border border-border overflow-hidden hover:shadow-elevated transition-smooth">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{story.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Icon name="MapPin" size={14} className="mr-1" />
                        {story.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">{story.impact}</div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{story.story}</p>
                  
                  <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
                    "{story.quote}"
                    <footer className="text-sm text-muted-foreground mt-2">
                      — {story.author}
                    </footer>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Environmental Impact</h2>
              <p className="text-lg text-muted-foreground">
                Every meal rescued creates a positive environmental impact. Here's how we're helping protect our planet.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {environmentalImpact.map((impact, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-8 text-center hover:shadow-elevated transition-smooth">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name={impact.icon} size={32} className="text-accent" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {impact.value}<span className="text-lg text-muted-foreground ml-1">{impact.unit}</span>
                  </h3>
                  <p className="text-lg font-medium text-foreground mb-3">{impact.metric}</p>
                  <p className="text-muted-foreground mb-4">{impact.description}</p>
                  
                  <div className="bg-accent/5 rounded-lg p-3">
                    <p className="text-sm text-accent font-medium">{impact.equivalent}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Climate Impact Visualization */}
            <div className="bg-gradient-to-r from-success/5 to-accent/5 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Climate Impact Equivalent</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-4">
                  <Icon name="Car" size={48} className="text-muted-foreground" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">500 Cars</div>
                    <div className="text-sm text-muted-foreground">removed from roads</div>
                  </div>
                </div>
                <div className="text-2xl text-muted-foreground">=</div>
                <div className="flex items-center gap-4">
                  <Icon name="Leaf" size={48} className="text-success" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">12.5 Tonnes</div>
                    <div className="text-sm text-muted-foreground">CO₂ prevented</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDG Alignment */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Global Goals Alignment</h2>
              <p className="text-lg text-muted-foreground">
                Our work directly contributes to the United Nations Sustainable Development Goals, 
                creating measurable progress toward a better world.
              </p>
            </div>

            <div className="space-y-8">
              {globalGoals.map((goal, index) => (
                <div key={index} className="bg-background rounded-lg border border-border p-6">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      {goal.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">{goal.goal}</h3>
                      <p className="text-muted-foreground">{goal.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{goal.progress}%</div>
                      <div className="text-sm text-muted-foreground">Progress</div>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-1000"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Feed */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Impact Happening Now</h2>
            <p className="text-lg text-muted-foreground mb-12">
              See the real-time impact being created by our community across the platform.
            </p>

            <div className="bg-card rounded-lg border border-border p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Icon name="Package" className="text-primary" />
                    <span className="text-foreground">Fresh produce donated by Metro Grocery</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2 minutes ago</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Icon name="Users" className="text-success" />
                    <span className="text-foreground">45 meals prepared at Community Kitchen</span>
                  </div>
                  <span className="text-sm text-muted-foreground">5 minutes ago</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Icon name="Truck" className="text-accent" />
                    <span className="text-foreground">Volunteer pickup completed in downtown</span>
                  </div>
                  <span className="text-sm text-muted-foreground">8 minutes ago</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Heart" className="text-error" />
                    <span className="text-foreground">New partnership formed with City Shelter</span>
                  </div>
                  <span className="text-sm text-muted-foreground">12 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-success/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Be Part of the Solution</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every action counts. Join our growing community and help us create even greater impact 
            for our planet and our communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register?type=donor">
              <Button
                variant="default"
                size="lg"
                icon={<Icon name="Store" />}
                iconPosition="left"
              >
                Start Donating Food
              </Button>
            </Link>
            <Link to="/register?type=recipient">
              <Button
                variant="outline"
                size="lg"
                icon={<Icon name="Users" />}
                iconPosition="left"
              >
                Join as Recipient
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Together, we can eliminate food waste and build stronger, more sustainable communities.
          </p>
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

export default ImpactPage;