import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, unit, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = () => {
    const colors = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      accent: 'bg-accent/10 text-accent border-accent/20'
    };
    return colors?.[color] || colors?.primary;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${getChangeColor()}`}>
            <Icon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              size={16} 
              className="mr-1" 
            />
            {change}
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