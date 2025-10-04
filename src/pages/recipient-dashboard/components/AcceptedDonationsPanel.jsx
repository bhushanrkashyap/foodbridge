import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AcceptedDonationsPanel = ({ donations, onSchedulePickup, onUpdateStatus }) => {
  const [selectedDonation, setSelectedDonation] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-warning/10 text-warning border-warning/20';
      case 'scheduled': return 'bg-primary/10 text-primary border-primary/20';
      case 'in-transit': return 'bg-accent/10 text-accent border-accent/20';
      case 'delivered': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return 'Clock';
      case 'scheduled': return 'Calendar';
      case 'in-transit': return 'Truck';
      case 'delivered': return 'CheckCircle';
      case 'cancelled': return 'XCircle';
      default: return 'Package';
    }
  };

  const formatTimeRemaining = (pickupTime) => {
    const now = new Date();
    const pickup = new Date(pickupTime);
    const diff = pickup - now;
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Package" size={20} className="text-muted-foreground" />
          <h3 className="font-heading font-semibold text-foreground">Accepted Donations</h3>
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full font-mono">
            {donations?.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      {/* Donations List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {donations?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="font-heading font-medium text-foreground mb-2">No Accepted Donations</h4>
            <p className="text-sm text-muted-foreground">
              Accepted food donations will appear here for pickup coordination.
            </p>
          </div>
        ) : (
          donations?.map((donation) => (
            <div key={donation?.id} className="p-4 hover:bg-muted/30 transition-smooth">
              <div className="flex items-start space-x-3">
                <Image
                  src={donation?.foodImage}
                  alt={donation?.foodName}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-heading font-medium text-foreground truncate">
                        {donation?.foodName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        from {donation?.donorName}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(donation?.status)}`}>
                      <Icon name={getStatusIcon(donation?.status)} size={12} className="mr-1 inline" />
                      {donation?.status?.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Icon name="Package" size={12} className="mr-1" />
                      {donation?.quantity} {donation?.unit}
                    </div>
                    <div className="flex items-center">
                      <Icon name="MapPin" size={12} className="mr-1" />
                      {donation?.distance} km away
                    </div>
                    {donation?.scheduledPickup && (
                      <>
                        <div className="flex items-center">
                          <Icon name="Calendar" size={12} className="mr-1" />
                          {new Date(donation.scheduledPickup)?.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Clock" size={12} className="mr-1" />
                          {formatTimeRemaining(donation?.scheduledPickup)}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action buttons based on status */}
                  <div className="flex gap-2">
                    {donation?.status === 'accepted' && (
                      <Button
                        variant="outline"
                        size="xs"
                        iconName="Calendar"
                        iconPosition="left"
                        onClick={() => onSchedulePickup(donation?.id)}
                      >
                        Schedule Pickup
                      </Button>
                    )}
                    
                    {donation?.status === 'scheduled' && (
                      <>
                        <Button
                          variant="outline"
                          size="xs"
                          iconName="MapPin"
                          iconPosition="left"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Phone"
                          onClick={() => window.open(`tel:${donation?.donorPhone}`)}
                        >
                          Call Donor
                        </Button>
                      </>
                    )}
                    
                    {donation?.status === 'in-transit' && (
                      <Button
                        variant="default"
                        size="xs"
                        iconName="CheckCircle"
                        iconPosition="left"
                        onClick={() => onUpdateStatus(donation?.id, 'delivered')}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    
                    {donation?.status === 'delivered' && (
                      <div className="flex items-center text-xs text-success">
                        <Icon name="CheckCircle" size={12} className="mr-1" />
                        Completed on {new Date(donation.deliveredAt)?.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Volunteer assignment */}
                  {donation?.status === 'scheduled' && donation?.assignedVolunteer && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <Icon name="User" size={12} className="mr-1" />
                        Assigned to: {donation?.assignedVolunteer?.name}
                        <span className="ml-2">•</span>
                        <Icon name="Phone" size={12} className="ml-2 mr-1" />
                        {donation?.assignedVolunteer?.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Quick Stats Footer */}
      {donations?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-mono font-bold text-warning">
                {donations?.filter(d => d?.status === 'accepted')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-primary">
                {donations?.filter(d => d?.status === 'scheduled')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Scheduled</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-accent">
                {donations?.filter(d => d?.status === 'in-transit')?.length}
              </div>
              <div className="text-xs text-muted-foreground">In Transit</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-success">
                {donations?.filter(d => d?.status === 'delivered')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Delivered</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptedDonationsPanel;