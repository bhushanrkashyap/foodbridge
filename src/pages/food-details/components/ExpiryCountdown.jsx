import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ExpiryCountdown = ({ expiryDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()?.getTime();
      const expiry = new Date(expiryDate)?.getTime();
      const difference = expiry - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setIsExpired(true);
        setTimeLeft({});
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  const getUrgencyLevel = () => {
    if (isExpired) return 'expired';
    
    const totalHours = (timeLeft?.days * 24) + timeLeft?.hours;
    if (totalHours <= 2) return 'critical';
    if (totalHours <= 6) return 'urgent';
    if (totalHours <= 24) return 'moderate';
    return 'normal';
  };

  const getUrgencyStyles = () => {
    const urgency = getUrgencyLevel();
    const styles = {
      expired: {
        bg: 'bg-destructive/10',
        border: 'border-destructive/30',
        text: 'text-destructive',
        icon: 'AlertCircle'
      },
      critical: {
        bg: 'bg-error/10',
        border: 'border-error/30',
        text: 'text-error',
        icon: 'Clock'
      },
      urgent: {
        bg: 'bg-warning/10',
        border: 'border-warning/30',
        text: 'text-warning',
        icon: 'Clock'
      },
      moderate: {
        bg: 'bg-accent/10',
        border: 'border-accent/30',
        text: 'text-accent',
        icon: 'Clock'
      },
      normal: {
        bg: 'bg-success/10',
        border: 'border-success/30',
        text: 'text-success',
        icon: 'Clock'
      }
    };
    return styles?.[urgency];
  };

  const styles = getUrgencyStyles();
  const urgency = getUrgencyLevel();

  const formatDate = (date) => {
    return new Date(date)?.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`${styles?.bg} border ${styles?.border} rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Icon name={styles?.icon} size={18} className={`${styles?.text} mr-2`} />
          <span className="font-medium text-foreground">
            {isExpired ? 'Expired' : 'Expires'}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles?.bg} ${styles?.text}`}>
          {urgency?.toUpperCase()}
        </span>
      </div>
      <div className="text-sm text-muted-foreground mb-3">
        {formatDate(expiryDate)}
      </div>
      {!isExpired ? (
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${styles?.text}`}>
              {timeLeft?.days || 0}
            </div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${styles?.text}`}>
              {timeLeft?.hours || 0}
            </div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${styles?.text}`}>
              {timeLeft?.minutes || 0}
            </div>
            <div className="text-xs text-muted-foreground">Min</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${styles?.text}`}>
              {timeLeft?.seconds || 0}
            </div>
            <div className="text-xs text-muted-foreground">Sec</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <div className={`text-lg font-semibold ${styles?.text}`}>
            This food has expired
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Not recommended for consumption
          </div>
        </div>
      )}
      {/* Urgency Message */}
      {urgency === 'critical' && !isExpired && (
        <div className="mt-3 text-xs text-error font-medium">
          ⚡ Immediate pickup required!
        </div>
      )}
      {urgency === 'urgent' && !isExpired && (
        <div className="mt-3 text-xs text-warning font-medium">
          ⏰ Pickup needed within hours
        </div>
      )}
    </div>
  );
};

export default ExpiryCountdown;