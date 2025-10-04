import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PickupLocation = ({ locationData }) => {
  const [showFullMap, setShowFullMap] = useState(false);
  
  const {
    address,
    coordinates,
    landmarks,
    accessInstructions,
    parkingInfo,
    contactPerson,
    availableTimeSlots,
    specialInstructions
  } = locationData;

  const toggleMapView = () => {
    setShowFullMap(!showFullMap);
  };

  const formatTimeSlot = (slot) => {
    return `${slot?.start} - ${slot?.end}`;
  };

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates?.lat},${coordinates?.lng}`;
  };

  return (
    <div className="bg-card rounded-lg shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Pickup Location
          </h3>
          <button
            onClick={toggleMapView}
            className="flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Icon name={showFullMap ? "Minimize2" : "Maximize2"} size={14} className="mr-1" />
            {showFullMap ? "Minimize" : "View Map"}
          </button>
        </div>

        <div className="flex items-start space-x-3">
          <Icon name="MapPin" size={18} className="text-primary mt-1" />
          <div>
            <div className="font-medium text-foreground mb-1">{address?.name}</div>
            <div className="text-sm text-muted-foreground">
              {address?.street}, {address?.area}
            </div>
            <div className="text-sm text-muted-foreground">
              {address?.city}, {address?.state} - {address?.pincode}
            </div>
          </div>
        </div>
      </div>
      {/* Map */}
      <div className={`relative bg-muted ${showFullMap ? 'h-80' : 'h-48'} transition-all duration-300`}>
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={address?.name}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=16&output=embed`}
          className="border-0"
        />
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 bg-white shadow-soft rounded-lg text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Icon name="Navigation" size={14} className="mr-2" />
            Directions
          </a>
        </div>
      </div>
      {/* Location Details */}
      <div className="p-6 space-y-6">
        {/* Landmarks */}
        {landmarks?.length > 0 && (
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Landmark" size={16} className="mr-2" />
              Nearby Landmarks
            </h4>
            <div className="space-y-2">
              {landmarks?.map((landmark, index) => (
                <div key={index} className="flex items-center text-sm text-muted-foreground">
                  <Icon name="MapPin" size={12} className="mr-2 text-accent" />
                  {landmark}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Access Instructions */}
        <div>
          <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Route" size={16} className="mr-2" />
            Access Instructions
          </h4>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">
              {accessInstructions}
            </p>
          </div>
        </div>

        {/* Parking Information */}
        <div>
          <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Car" size={16} className="mr-2" />
            Parking Information
          </h4>
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">
              {parkingInfo}
            </p>
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
            <Icon name="User" size={16} className="mr-2" />
            Contact Person
          </h4>
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">{contactPerson?.name}</div>
                <div className="text-sm text-muted-foreground">{contactPerson?.role}</div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <Icon name="Phone" size={16} />
                </button>
                <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  <Icon name="MessageCircle" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Clock" size={16} className="mr-2" />
            Available Pickup Times
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableTimeSlots?.map((slot, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border text-sm ${
                  slot?.available
                    ? 'bg-success/10 border-success/30 text-success' :'bg-muted border-border text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formatTimeSlot(slot)}</span>
                  <Icon 
                    name={slot?.available ? "CheckCircle" : "XCircle"} 
                    size={14} 
                  />
                </div>
                {slot?.note && (
                  <div className="text-xs mt-1 opacity-80">{slot?.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        {specialInstructions && (
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center">
              <Icon name="AlertCircle" size={16} className="mr-2" />
              Special Instructions
            </h4>
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
              <p className="text-sm text-foreground leading-relaxed">
                {specialInstructions}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupLocation;