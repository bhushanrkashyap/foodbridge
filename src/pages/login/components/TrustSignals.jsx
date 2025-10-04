import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: "FSSAI Certified",
      icon: "Shield",
      description: "Food Safety & Standards Authority of India"
    },
    {
      id: 2,
      name: "ISO 22000",
      icon: "Award",
      description: "Food Safety Management System"
    },
    {
      id: 3,
      name: "NGO Verified",
      icon: "CheckCircle",
      description: "Verified by Government of India"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Akshaya Patra Foundation",
      role: "NGO Partner",
      content: "FoodBridge has revolutionized how we receive surplus food donations. The AI matching system ensures we get exactly what our beneficiaries need.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Restaurant Manager",
      content: "We\'ve reduced our food waste by 80% since joining FoodBridge. It\'s amazing to see our surplus food helping those in need.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const impactStats = [
    {
      label: "Food Saved",
      value: "2.3M kg",
      icon: "Package",
      color: "text-success"
    },
    {
      label: "Meals Served",
      value: "890K+",
      icon: "Users",
      color: "text-primary"
    },
    {
      label: "CO₂ Prevented",
      value: "1.2K tons",
      icon: "Leaf",
      color: "text-accent"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Impact Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          Our Impact So Far
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {impactStats?.map((stat) => (
            <div key={stat?.label} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3`}>
                  <Icon name={stat?.icon} size={16} className={stat?.color} />
                </div>
                <span className="text-sm text-muted-foreground">{stat?.label}</span>
              </div>
              <span className={`font-mono font-bold ${stat?.color}`}>{stat?.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          Trusted & Certified
        </h3>
        <div className="space-y-3">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="flex items-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                <Icon name={cert?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground text-sm">{cert?.name}</div>
                <div className="text-xs text-muted-foreground">{cert?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 text-center">
          What Our Partners Say
        </h3>
        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="border-l-3 border-accent pl-4">
              <p className="text-sm text-muted-foreground mb-2 italic">
                "{testimonial?.content}"
              </p>
              <div className="flex items-center">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <div className="font-medium text-foreground text-xs">{testimonial?.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial?.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start">
          <Icon name="Lock" size={16} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-foreground text-sm mb-1">Secure Platform</div>
            <p className="text-xs text-muted-foreground">
              Your data is protected with enterprise-grade security. We never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;