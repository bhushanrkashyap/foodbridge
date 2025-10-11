import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignalsSection = ({ className = '' }) => {
  const certifications = [
    {
      id: 'iso',
      name: 'ISO 27001',
      description: 'Information Security Management',
      icon: 'Shield'
    },
    {
      id: 'fssai',
      name: 'FSSAI Approved',
      description: 'Food Safety Standards Authority',
      icon: 'CheckCircle'
    },
    {
      id: 'startup-india',
      name: 'Startup India',
      description: 'Government of India Recognition',
      icon: 'Award'
    },
    {
      id: 'gdpr',
      name: 'GDPR Compliant',
      description: 'Data Protection & Privacy',
      icon: 'Lock'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Restaurant Manager, Spice Garden",
      location: "Mumbai, Maharashtra",
      content: `FoodBridge has transformed how we handle surplus food. Instead of wastage, we now help feed 50+ families daily. The AI matching is incredibly accurate.`,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      impact: "2,400 meals donated"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "NGO Coordinator, Hope Foundation",
      location: "Delhi, NCR",
      content: `The platform's real-time matching has made our food distribution 3x more efficient. We can now serve more beneficiaries with consistent supply.`,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      impact: "1,800 people served monthly"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Volunteer Coordinator",
      location: "Bangalore, Karnataka",
      content: `As a volunteer, the route optimization and pickup scheduling features save us hours every day. More time helping, less time coordinating.`,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      impact: "500+ deliveries completed"
    }
  ];

  const stats = [
    {
      value: "2.3M+",
      label: "Meals Saved",
      icon: "Utensils",
      color: "text-success"
    },
    {
      value: "15,000+",
      label: "Active Users",
      icon: "Users",
      color: "text-primary"
    },
    {
      value: "850+",
      label: "Partner Organizations",
      icon: "Building",
      color: "text-accent"
    },
    {
      value: "98%",
      label: "Match Success Rate",
      icon: "Target",
      color: "text-warning"
    }
  ];

  return (
    <div className={`trust-signals-section ${className}`}>
      {/* Platform Statistics */}
      <div className="bg-card rounded-lg p-6 mb-8 border border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          Join India's Leading Food Waste Reduction Platform
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat) => (
            <div key={stat?.label} className="text-center">
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
              <div className={`text-xl sm:text-2xl font-heading font-bold ${stat?.color} leading-tight`}>
                {stat?.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div className="bg-card rounded-lg p-6 mb-8 border border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          Trusted & Certified Platform
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="text-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Icon name={cert?.icon} size={18} className="text-primary" />
              </div>
              <div className="font-medium text-sm text-foreground leading-tight">
                {cert?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {cert?.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* User Testimonials */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground text-center mb-6">
          What Our Community Says
        </h3>
        
        {testimonials?.map((testimonial) => (
          <div key={testimonial?.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-start space-x-4">
              <Image
                src={testimonial?.avatar}
                alt={testimonial?.name}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">
                      {testimonial?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial?.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial?.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    {[...Array(testimonial?.rating)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-foreground mb-3 leading-relaxed">
                  "{testimonial?.content}"
                </p>
                
                <div className="flex items-center text-xs text-success">
                  <Icon name="TrendingUp" size={12} className="mr-1" />
                  Impact: {testimonial?.impact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Security & Privacy */}
      <div className="bg-muted/30 rounded-lg p-6 mt-8">
        <div className="flex items-center justify-center mb-4">
          <Icon name="Shield" size={24} className="text-primary mr-2" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Your Data is Safe & Secure
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Lock" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Database" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Secure Data Storage</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Icon name="UserCheck" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Verified Users Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignalsSection;