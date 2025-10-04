import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VolunteerCoordination = ({ pickupLocation, estimatedDeliveryTime }) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Mock volunteer data
  const availableVolunteers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      completedPickups: 156,
      vehicleType: "Car",
      capacity: "50 servings",
      distance: "2.3 km",
      estimatedArrival: "15 mins",
      isAvailable: true,
      specializations: ["Food Safety", "Quick Delivery"],
      lastActive: "2 mins ago"
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      completedPickups: 203,
      vehicleType: "Bike",
      capacity: "30 servings",
      distance: "1.8 km",
      estimatedArrival: "12 mins",
      isAvailable: true,
      specializations: ["Express Delivery", "Local Area Expert"],
      lastActive: "Active now"
    },
    {
      id: 3,
      name: "Mohammed Ali",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      rating: 4.7,
      completedPickups: 89,
      vehicleType: "Van",
      capacity: "100 servings",
      distance: "3.1 km",
      estimatedArrival: "20 mins",
      isAvailable: false,
      specializations: ["Bulk Transport", "Temperature Control"],
      lastActive: "30 mins ago"
    }
  ];

  const handleVolunteerSelect = (volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  const handleSchedulePickup = () => {
    if (selectedVolunteer) {
      setShowScheduleModal(true);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={12}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      'Car': 'Car',
      'Bike': 'Bike',
      'Van': 'Truck'
    };
    return icons?.[vehicleType] || 'Car';
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow-soft overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Volunteer Coordination
            </h3>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Est. delivery: {estimatedDeliveryTime}
              </span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center text-sm text-primary">
              <Icon name="MapPin" size={16} className="mr-2" />
              <span className="font-medium">Pickup Location:</span>
            </div>
            <div className="text-sm text-foreground mt-1">
              {pickupLocation?.address}, {pickupLocation?.area}
            </div>
          </div>
        </div>

        {/* Available Volunteers */}
        <div className="p-6">
          <h4 className="text-sm font-heading font-semibold text-foreground mb-4">
            Available Volunteers ({availableVolunteers?.filter(v => v?.isAvailable)?.length})
          </h4>

          <div className="space-y-4">
            {availableVolunteers?.map((volunteer) => (
              <div
                key={volunteer?.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  volunteer?.isAvailable
                    ? selectedVolunteer?.id === volunteer?.id
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50' :'border-border bg-muted/30 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => volunteer?.isAvailable && handleVolunteerSelect(volunteer)}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Image
                      src={volunteer?.avatar}
                      alt={`${volunteer?.name} profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {volunteer?.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-foreground">{volunteer?.name}</h5>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            {renderStars(volunteer?.rating)}
                            <span className="ml-1 font-mono">{volunteer?.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{volunteer?.completedPickups} pickups</span>
                        </div>
                      </div>
                      
                      {volunteer?.isAvailable && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-success">
                            {volunteer?.estimatedArrival}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {volunteer?.distance} away
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Icon name={getVehicleIcon(volunteer?.vehicleType)} size={14} className="mr-1" />
                        {volunteer?.vehicleType}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Icon name="Package" size={14} className="mr-1" />
                        {volunteer?.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {volunteer?.lastActive}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {volunteer?.specializations?.map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedVolunteer?.id === volunteer?.id && volunteer?.isAvailable && (
                    <div className="flex items-center">
                      <Icon name="CheckCircle" size={20} className="text-primary" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Button
              variant="default"
              fullWidth
              iconName="Calendar"
              iconPosition="left"
              onClick={handleSchedulePickup}
              disabled={!selectedVolunteer}
            >
              Schedule Pickup with {selectedVolunteer?.name || 'Selected Volunteer'}
            </Button>
          </div>

          {/* Emergency Contact */}
          <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-center text-sm text-warning font-medium mb-1">
              <Icon name="Phone" size={14} className="mr-2" />
              Emergency Coordination
            </div>
            <div className="text-xs text-foreground">
              For urgent pickup needs, call our coordination center: 
              <span className="font-mono font-medium ml-1">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
      {/* Schedule Pickup Modal */}
      {showScheduleModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-elevated max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <Icon name="Calendar" size={20} className="text-primary mr-3" />
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Schedule Pickup
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Image
                  src={selectedVolunteer?.avatar}
                  alt={selectedVolunteer?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-foreground">{selectedVolunteer?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedVolunteer?.vehicleType} • {selectedVolunteer?.capacity}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Pickup Time
                  </label>
                  <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>ASAP ({selectedVolunteer?.estimatedArrival})</option>
                    <option>In 30 minutes</option>
                    <option>In 1 hour</option>
                    <option>In 2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Special Instructions
                </label>
                <textarea
                  placeholder="Any special handling or delivery instructions..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  setShowScheduleModal(false);
                  // Handle pickup scheduling
                }}
              >
                Confirm Pickup
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VolunteerCoordination;