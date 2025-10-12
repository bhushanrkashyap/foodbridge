import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../supabaseClient';
import { getDonationWithDistance } from '../../utils/nearestNeighborMatcher';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FoodDetailsSimple = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(true);
  const [foodData, setFoodData] = useState(null);
  const [donationWithDistance, setDonationWithDistance] = useState(null);
  const [recipientLocation, setRecipientLocation] = useState(null);
  const [acceptanceStatus, setAcceptanceStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch food donation details and calculate distance
  useEffect(() => {
    if (foodId && recipientLocation) {
      console.log('Fetching food details with AI optimization for ID:', foodId);
      fetchFoodDetailsWithAI();
    } else if (foodId) {
      console.log('Fetching food details without optimization for ID:', foodId);
      fetchFoodDetails();
    } else {
      console.log('No food ID provided');
      setIsLoading(false);
    }
  }, [foodId, recipientLocation]);

  // Get recipient's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const fetchFoodDetailsWithAI = async () => {
    setIsLoading(true);
    try {
      console.log('Using AI matcher to fetch donation with distance data...');
      const donationData = await getDonationWithDistance(foodId, recipientLocation);
      
      if (donationData) {
        console.log('✅ AI-optimized donation data:', donationData);
        setFoodData(donationData);
        setDonationWithDistance(donationData);
      } else {
        console.log('Could not optimize donation, falling back to basic fetch');
        await fetchFoodDetails();
      }
    } catch (error) {
      console.error('Error in fetchFoodDetailsWithAI:', error);
      await fetchFoodDetails();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFoodDetails = async () => {
    setIsLoading(true);
    try {
      console.log('Querying Supabase for donation ID:', foodId);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('id', foodId)
        .single();

      if (error) {
        console.error('Error fetching food details:', error);
        setIsLoading(false);
        return;
      }

      if (!data) {
        console.log('No data found for ID:', foodId);
        setIsLoading(false);
        return;
      }

      console.log('Fetched donation data:', data);
      setFoodData(data);
    } catch (error) {
      console.error('Error in fetchFoodDetails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRecipientLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('Recipient location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location if geolocation fails (Bangalore)
          setRecipientLocation({ lat: 12.9716, lng: 77.5946 });
        }
      );
    } else {
      setRecipientLocation({ lat: 12.9716, lng: 77.5946 });
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Check if delivery is possible within expiry time
  const checkDeliveryFeasibility = (donorLat, donorLng, recipientLat, recipientLng, expiryTime) => {
    const distance = calculateDistance(donorLat, donorLng, recipientLat, recipientLng);
    const distanceInKm = distance;
    const averageSpeedKMH = 20; // km/h
    const travelTimeHours = distanceInKm / averageSpeedKMH;
    const travelTimeMinutes = Math.ceil(travelTimeHours * 60);
    
    const now = new Date();
    const expiry = new Date(expiryTime);
    const timeUntilExpiryMinutes = Math.floor((expiry - now) / 1000 / 60);

    return {
      distance: distance.toFixed(2),
      travelTimeMinutes,
      timeUntilExpiryMinutes,
      isFeasible: travelTimeMinutes < timeUntilExpiryMinutes,
      distanceInKm: distance.toFixed(2)
    };
  };

  const handleAcceptDonation = async () => {
    if (!recipientLocation || !foodData) {
      alert('Unable to get location information. Please enable location services.');
      return;
    }

    setIsProcessing(true);

    // Use AI-calculated data if available, otherwise calculate manually
    let feasibility;
    let donorLat, donorLng;

    if (donationWithDistance && donationWithDistance.feasibility) {
      // Use pre-calculated AI optimization data
      console.log('Using AI-calculated feasibility data');
      feasibility = donationWithDistance.feasibility;
      donorLat = donationWithDistance.donorLocation.lat;
      donorLng = donationWithDistance.donorLocation.lng;
    } else {
      // Manual calculation fallback
      console.log('Calculating feasibility manually');
      donorLat = foodData.pickup_latitude;
      donorLng = foodData.pickup_longitude;

      // If coordinates are not available, try to geocode the address
      if (!donorLat || !donorLng) {
        const address = `${foodData.pickup_street_address}, ${foodData.pickup_area || ''}, ${foodData.pickup_city}, ${foodData.pickup_state}, ${foodData.pickup_pin_code}`;
        
        try {
          // Use Nominatim geocoding service (free OpenStreetMap service)
          const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
          const response = await fetch(geocodeUrl);
          const data = await response.json();
          
          if (data && data.length > 0) {
            donorLat = parseFloat(data[0].lat);
            donorLng = parseFloat(data[0].lon);
            console.log('Geocoded donor location:', donorLat, donorLng);
            
            // Update the database with the geocoded coordinates
            await supabase
              .from('donations')
              .update({ 
                pickup_latitude: donorLat,
                pickup_longitude: donorLng
              })
              .eq('id', foodId);
          } else {
            alert('Unable to determine donor location from address. Please try again or contact the donor.');
            setIsProcessing(false);
            return;
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          alert('Unable to determine donor location. Please try again or contact the donor.');
          setIsProcessing(false);
          return;
        }
      }

      // Calculate delivery feasibility
      feasibility = checkDeliveryFeasibility(
        donorLat,
        donorLng,
        recipientLocation.lat,
        recipientLocation.lng,
        foodData.expiry_datetime
      );
    }

    console.log('Delivery feasibility:', feasibility);

    // Delete the donation from database regardless of feasibility
    try {
      console.log('🗑️ Removing donation from database...');
      
      const { error: deleteError } = await supabase
        .from('donations')
        .delete()
        .eq('id', foodId);

      if (deleteError) {
        console.error('Error removing donation from database:', deleteError);
        setAcceptanceStatus({
          success: false,
          message: 'Failed to process donation',
          reason: 'Database error. Please try again later.',
          type: 'error'
        });
        setIsProcessing(false);
        return;
      }

      console.log('✅ Donation successfully removed from database');

      // Check if delivery is feasible and show appropriate message
      if (!feasibility.isFeasible) {
        // Order CANNOT be delivered - but still removed from database
        setAcceptanceStatus({
          success: false,
          message: 'Order Cannot Be Delivered',
          reason: 'The food will expire before you can reach the pickup location. The donation has been removed from the list.',
          type: 'error'
        });
      } else {
        // Order CAN be delivered - show success message
        setAcceptanceStatus({
          success: true,
          message: 'Order Accepted Successfully!',
          reason: 'The donation has been assigned to you. Please proceed to the pickup location as soon as possible!',
          type: 'success'
        });
      }

      // Navigate back to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/recipient-dashboard');
      }, 3000);

    } catch (error) {
      console.error('Error in handleAcceptDonation:', error);
      setAcceptanceStatus({
        success: false,
        message: 'An error occurred',
        reason: 'Please try again.',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRemaining = (expiryTime) => {
    if (!expiryTime) return 'Not specified';
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs <= 0) return 'Expired';
    if (diffHours < 1) return `${diffMinutes} minutes`;
    return `${diffHours} hours ${diffMinutes} minutes`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (!foodData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-foreground text-lg mb-2">Food donation not found</p>
          <p className="text-muted-foreground mb-4">The requested donation may have been removed or is no longer available.</p>
          <Button onClick={() => navigate('/recipient-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Food Donation Details</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back
          </Button>
        </div>

        {/* Acceptance Status Message */}
        {acceptanceStatus && (
          <div className={`mb-6 p-6 rounded-lg border-2 ${
            acceptanceStatus.type === 'success' 
              ? 'bg-success/10 border-success' 
              : 'bg-error/10 border-error'
          }`}>
            <div className="flex items-start">
              <Icon 
                name={acceptanceStatus.type === 'success' ? 'CheckCircle' : 'XCircle'} 
                size={48} 
                className={acceptanceStatus.type === 'success' ? 'text-success' : 'text-error'}
              />
              <div className="ml-4 flex-1">
                <h3 className={`text-3xl font-bold mb-3 ${
                  acceptanceStatus.type === 'success' ? 'text-success' : 'text-error'
                }`}>
                  {acceptanceStatus.message}
                </h3>
                <p className="text-foreground text-lg">{acceptanceStatus.reason}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Food Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-card rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold text-foreground mb-4">Basic Information</h2>
              <div className="space-y-4">
                {foodData.image_url && (
                  <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={foodData.image_url} 
                      alt={foodData.food_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Food Name</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.food_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Food Type</p>
                    <p className="text-lg font-semibold text-foreground capitalize">{foodData.food_type?.replace('-', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.quantity} {foodData.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Servings</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.estimated_servings || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-foreground">{foodData.description || 'No description provided'}</p>
                </div>
              </div>
            </div>

            {/* Dietary Information Card */}
            <div className="bg-card rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold text-foreground mb-4">Dietary Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dietary Type</p>
                  <p className="text-lg font-semibold text-foreground capitalize">{foodData.dietary_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spice Level</p>
                  <p className="text-lg font-semibold text-foreground capitalize">{foodData.spice_level || 'N/A'}</p>
                </div>
                {foodData.allergens && foodData.allergens.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Allergens</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.allergens.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map with Both Locations */}
            {donationWithDistance && donationWithDistance.donorLocation && recipientLocation && (
              <div className="bg-card rounded-lg p-6 shadow">
                <h2 className="text-2xl font-bold text-foreground mb-4">Location & Route</h2>
                
                {/* Distance Info */}
                <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Distance</p>
                      <p className="text-2xl font-bold text-primary">{donationWithDistance.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Travel Time</p>
                      <p className="text-2xl font-bold text-primary">{donationWithDistance.feasibility.travelTimeMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Speed (avg)</p>
                      <p className="text-2xl font-bold text-primary">20 km/h</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="h-96 rounded-lg overflow-hidden border border-border">
                  <MapContainer
                    center={[
                      (donationWithDistance.donorLocation.lat + recipientLocation.lat) / 2,
                      (donationWithDistance.donorLocation.lng + recipientLocation.lng) / 2
                    ]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Donor Location Marker */}
                    <Marker position={[donationWithDistance.donorLocation.lat, donationWithDistance.donorLocation.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-sm mb-1">🏪 Donor Location</h3>
                          <p className="text-xs">{foodData.pickup_street_address}</p>
                          <p className="text-xs">{foodData.pickup_city}, {foodData.pickup_state}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Recipient Location Marker */}
                    <Marker position={[recipientLocation.lat, recipientLocation.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-sm mb-1">📍 Your Location</h3>
                          <p className="text-xs">Recipient pickup point</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route Line */}
                    <Polyline
                      positions={[
                        [donationWithDistance.donorLocation.lat, donationWithDistance.donorLocation.lng],
                        [recipientLocation.lat, recipientLocation.lng]
                      ]}
                      color="#3b82f6"
                      weight={3}
                      opacity={0.7}
                      dashArray="10, 10"
                    />
                  </MapContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-muted-foreground">Donor Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Your Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-0.5 bg-blue-500 opacity-70" style={{borderTop: '2px dashed'}}></div>
                    <span className="text-muted-foreground">Route</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Location Card */}
            <div className="bg-card rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold text-foreground mb-4">Pickup Location</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-lg font-semibold text-foreground">
                    {[
                      foodData.pickup_street_address, 
                      foodData.pickup_area, 
                      foodData.pickup_city, 
                      foodData.pickup_state, 
                      foodData.pickup_pin_code
                    ]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </p>
                </div>
                {foodData.pickup_instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Instructions</p>
                    <p className="text-foreground">{foodData.pickup_instructions}</p>
                  </div>
                )}
                {foodData.preferred_pickup_time && (
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Pickup Time</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.preferred_pickup_time}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.contact_person_name || foodData.contact_person || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Phone</p>
                    <p className="text-lg font-semibold text-foreground">{foodData.contact_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action & Time Info */}
          <div className="space-y-6">
            {/* Expiry Card */}
            <div className="bg-warning/10 border-2 border-warning rounded-lg p-6 shadow">
              <div className="flex items-center mb-3">
                <Icon name="Clock" size={24} className="text-warning mr-2" />
                <h2 className="text-xl font-bold text-foreground">Time Remaining</h2>
              </div>
              <p className="text-3xl font-bold text-warning mb-2">{formatTimeRemaining(foodData.expiry_datetime)}</p>
              <p className="text-sm text-muted-foreground">Expires: {formatDate(foodData.expiry_datetime)}</p>
            </div>

            {/* Urgency Card */}
            <div className={`rounded-lg p-6 shadow ${
              foodData.urgency_level === 'high' ? 'bg-error/10 border-2 border-error' :
              foodData.urgency_level === 'medium' ? 'bg-warning/10 border-2 border-warning' :
              'bg-success/10 border-2 border-success'
            }`}>
              <div className="flex items-center mb-3">
                <Icon name="AlertTriangle" size={24} className={
                  foodData.urgency_level === 'high' ? 'text-error' :
                  foodData.urgency_level === 'medium' ? 'text-warning' :
                  'text-success'
                } />
                <h2 className="text-xl font-bold text-foreground ml-2">Urgency Level</h2>
              </div>
              <p className={`text-2xl font-bold capitalize ${
                foodData.urgency_level === 'high' ? 'text-error' :
                foodData.urgency_level === 'medium' ? 'text-warning' :
                'text-success'
              }`}>{foodData.urgency_level || 'Medium'}</p>
              {foodData.urgency_notes && (
                <p className="text-sm text-muted-foreground mt-2">{foodData.urgency_notes}</p>
              )}
            </div>

            {/* Action Button */}
            <div className="bg-card rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold text-foreground mb-4">Take Action</h2>
              <Button 
                variant="default" 
                fullWidth 
                onClick={handleAcceptDonation}
                disabled={isProcessing || acceptanceStatus !== null}
                loading={isProcessing}
                className="h-14 text-lg"
              >
                <Icon name="Heart" size={20} className="mr-2" />
                {isProcessing ? 'Processing...' : 'Accept Donation'}
              </Button>
              {!recipientLocation && (
                <p className="text-xs text-warning mt-2">Waiting for location permission...</p>
              )}
            </div>

            {/* Status Card */}
            <div className="bg-card rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold text-foreground mb-3">Status</h2>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  foodData.status === 'successful' ? 'bg-success/20 text-success' :
                  foodData.status === 'matched' ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {foodData.status === 'successful' ? 'Available' : foodData.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsSimple;
