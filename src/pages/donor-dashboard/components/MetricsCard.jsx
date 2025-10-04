import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, unit, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'accent':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return 'TrendingUp';
    if (changeType === 'decrease') return 'TrendingDown';
    return 'Minus';
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-success';
    if (changeType === 'decrease') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{change}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-heading font-bold text-foreground">
          {value}
          {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
        </h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default MetricsCard;