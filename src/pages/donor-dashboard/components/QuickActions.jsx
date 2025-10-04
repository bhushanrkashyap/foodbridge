import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'post-food',
      label: 'Post Surplus Food',
      description: 'Share surplus food with those in need',
      icon: 'Plus',
      color: 'primary',
      path: '/post-surplus-food',
      variant: 'default'
    },
    {
      id: 'view-details',
      label: 'Food Details',
      description: 'View and manage your food listings',
      icon: 'Package',
      color: 'secondary',
      path: '/food-details',
      variant: 'outline'
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      description: 'Track your donation impact',
      icon: 'BarChart3',
      color: 'accent',
      path: '/donor-dashboard?section=analytics',
      variant: 'outline'
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'Communicate with recipients',
      icon: 'MessageCircle',
      color: 'success',
      path: '/donor-dashboard?section=messages',
      variant: 'outline'
    }
  ];

  const handleActionClick = (action) => {
    navigate(action?.path);
    
    // Track action for analytics
    window.dispatchEvent(new CustomEvent('quickActionClick', {
      detail: { 
        action: action.id, 
        label: action.label,
        fromDashboard: true
      }
    }));
  };

  return (
    <div className={`quick-actions ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className="bg-card border border-border rounded-lg p-4 shadow-soft hover:shadow-elevated transition-smooth group cursor-pointer"
            onClick={() => handleActionClick(action)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg bg-${action?.color}/10 text-${action?.color} group-hover:bg-${action?.color}/20 transition-smooth`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground text-sm group-hover:text-primary transition-smooth">
                  {action?.label}
                </h3>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
              {action?.description}
            </p>
            
            <Button
              variant={action?.variant}
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              fullWidth
              onClick={(e) => {
                e?.stopPropagation();
                handleActionClick(action);
              }}
            >
              {action?.id === 'post-food' ? 'Post Now' : 'View'}
            </Button>
          </div>
        ))}
      </div>
      {/* Emergency Action */}
      <div className="mt-6 bg-error/5 border border-error/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-error/10 text-error">
              <Icon name="AlertTriangle" size={20} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground text-sm">
                Emergency Food Donation
              </h3>
              <p className="text-xs text-muted-foreground">
                For urgent surplus food that needs immediate pickup
              </p>
            </div>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            iconName="Zap"
            iconPosition="left"
            onClick={() => navigate('/post-surplus-food?urgent=true')}
          >
            Emergency Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;