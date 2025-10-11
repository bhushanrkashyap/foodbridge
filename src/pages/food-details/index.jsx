import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ActionFloatingButton from '../../components/ui/ActionFloatingButton';
import Icon from '../../components/AppIcon';
import { supabase } from '../../supabaseClient';

// Import all components
import FoodImageGallery from './components/FoodImageGallery';
import FoodInformation from './components/FoodInformation';
import ExpiryCountdown from './components/ExpiryCountdown';
import DonorInformation from './components/DonorInformation';
import PickupLocation from './components/PickupLocation';
import AIMatchingScore from './components/AIMatchingScore';
import CommunicationPanel from './components/CommunicationPanel';
import ActionButtons from './components/ActionButtons';
import VolunteerCoordination from './components/VolunteerCoordination';

const FoodDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get('id');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole] = useState(localStorage.getItem('userRole') || 'recipient');
  const [isLoading, setIsLoading] = useState(true);
  const [foodData, setFoodData] = useState(null);
  const [donorData, setDonorData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [recipientLocation, setRecipientLocation] = useState(null);
  const [acceptanceStatus, setAcceptanceStatus] = useState(null);
  const [distanceCalculation, setDistanceCalculation] = useState(null);

  // Fetch food donation details from Supabase
  useEffect(() => {
    if (foodId) {
      console.log('Fetching food details for ID:', foodId);
      fetchFoodDetails();
    } else {
      console.log('No food ID provided');
      setIsLoading(false);
    }
  }, [foodId]);

  // Get recipient's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

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

      // Transform data for UI
      const transformedFood = {
        id: data.id,
        name: data.food_name || 'Untitled Food',
        description: data.description || 'No description available',
        aiEnhancedDescription: data.description || 'No description available',
        images: data.image_url ? [data.image_url] : ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'],
        quantity: `${data.quantity || 0} ${data.unit || 'servings'}`,
        servings: data.estimated_servings || 0,
        expiryDate: data.expiry_datetime ? new Date(data.expiry_datetime) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        ingredients: data.description || '',
        preparationMethod: '',
        dietaryInfo: [data.dietary_type || 'other'],
        allergens: data.allergens || [],
        spiceLevel: data.spice_level || 'medium',
        nutritionalInfo: {
          calories: '',
          protein: '',
          carbs: '',
          fat: ''
        }
      };

      console.log('Transformed food data:', transformedFood);

      const transformedLocation = {
        address: {
          name: data.contact_person || 'Pickup Location',
          street: data.pickup_street || '',
          area: data.pickup_area || '',
          city: data.pickup_city || '',
          state: data.pickup_state || '',
          pincode: data.pickup_pincode || ''
        },
        coordinates: {
          lat: data.pickup_latitude || 0,
          lng: data.pickup_longitude || 0
        },
        landmarks: [],
        accessInstructions: data.pickup_instructions || 'No specific instructions',
        parkingInfo: '',
        contactPerson: {
          name: data.contact_person || 'Contact Person',
          role: 'Donor'
        },
        availableTimeSlots: [],
        specialInstructions: data.pickup_instructions || ''
      };

      const transformedDonor = {
        name: data.contact_person || 'Anonymous Donor',
        type: data.food_type || 'donor',
        avatar: '',
        rating: 0,
        totalDonations: 0,
        successRate: 0,
        verificationBadges: [],
        location: {
          address: data.pickup_street || '',
          area: data.pickup_area || '',
          city: data.pickup_city || '',
          state: data.pickup_state || '',
          pincode: data.pickup_pincode || ''
        },
        operatingHours: '',
        contactInfo: {
          phone: data.contact_phone || '',
          email: ''
        },
        description: '',
        joinedDate: new Date(data.created_at),
        lastActive: new Date()
      };

      setFoodData(transformedFood);
      setLocationData(transformedLocation);
      setDonorData(transformedDonor);

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
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location if geolocation fails
          setRecipientLocation({ lat: 0, lng: 0 });
        }
      );
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
    const distanceInMeters = distance * 1000;
    const averageSpeed = 20; // m/s (approximately 72 km/h)
    const travelTimeSeconds = distanceInMeters / averageSpeed;
    const travelTimeMinutes = Math.ceil(travelTimeSeconds / 60);
    
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

  // Mock AI matching data (will be replaced with real AI in production)
  const mockMatchingData = {
    overallScore: 87,
    compatibilityFactors: [
      {
        type: "dietary-compatibility",
        score: 92,
        explanation: "Matches 92% of your beneficiaries\' dietary preferences"
      },
      {
        type: "location-proximity",
        score: 78,
        explanation: "2.3 km from your location - reasonable pickup distance"
      },
      {
        type: "quantity-match",
        score: 85,
        explanation: "Quantity aligns well with your typical meal service capacity"
      },
      {
        type: "timing-alignment",
        score: 90,
        explanation: "Perfect timing for your evening meal distribution"
      }
    ],
    beneficiaryAlignment: {
      dietaryMatch: 92,
      quantityFit: 85,
      estimatedBeneficiaries: 45
    },
    logisticsScore: {
      overall: 78,
      distance: "2.3",
      estimatedTime: "25 min"
    },
    urgencyMatch: {
      score: 88,
      timeWindow: "4-hour"
    },
    recommendations: [
      {
        type: "suggestion",
        message: "This donation perfectly matches your evening meal service timing and beneficiary count."
      },
      {
        type: "info",
        message: "Consider arranging pickup within 2 hours to ensure optimal food quality."
      },
      {
        type: "suggestion",
        message: "The spice level is suitable for your diverse beneficiary group including elderly residents."
      }
    ],
    confidenceLevel: 94
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAcceptDonation = async (acceptanceData) => {
    if (!recipientLocation || !locationData) {
      alert('Unable to get location information. Please enable location services.');
      return;
    }

    // Calculate delivery feasibility
    const feasibility = checkDeliveryFeasibility(
      locationData.coordinates.lat,
      locationData.coordinates.lng,
      recipientLocation.lat,
      recipientLocation.lng,
      foodData.expiryDate
    );

    setDistanceCalculation(feasibility);

    if (!feasibility.isFeasible) {
      setAcceptanceStatus({
        success: false,
        message: `❌ Food cannot be delivered within expiry time!\n\nDistance: ${feasibility.distanceInKm} km\nEstimated travel time: ${feasibility.travelTimeMinutes} minutes\nTime until expiry: ${feasibility.timeUntilExpiryMinutes} minutes\n\nThe food will expire before you can pick it up.`,
        type: 'error'
      });
      return;
    }

    // If feasible, accept the donation
    try {
      const { error } = await supabase
        .from('donations')
        .update({ 
          status: 'matched',
          recipient_location_lat: recipientLocation.lat,
          recipient_location_lng: recipientLocation.lng,
          estimated_travel_time: feasibility.travelTimeMinutes,
          pickup_distance: feasibility.distanceInKm
        })
        .eq('id', foodId);

      if (error) {
        console.error('Error accepting donation:', error);
        setAcceptanceStatus({
          success: false,
          message: 'Failed to accept donation. Please try again.',
          type: 'error'
        });
        return;
      }

      setAcceptanceStatus({
        success: true,
        message: `✅ Request Accepted!\n\nDistance: ${feasibility.distanceInKm} km\nEstimated travel time: ${feasibility.travelTimeMinutes} minutes\nTime until expiry: ${feasibility.timeUntilExpiryMinutes} minutes\n\nDelivery is being processed. Please proceed to pickup location.`,
        type: 'success',
        feasibility
      });

      // Navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/recipient-dashboard?section=requests');
      }, 3000);

    } catch (error) {
      console.error('Error in handleAcceptDonation:', error);
      setAcceptanceStatus({
        success: false,
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
    }
  };

  const handleRequestInfo = (requestData) => {
    console.log('Info requested:', requestData);
    // Show success message or open chat
  };

  const handleDeclineDonation = (declineData) => {
    console.log('Donation declined:', declineData);
    // Navigate back to available food
    navigate('/recipient-dashboard?section=available');
  };

  const handleSendMessage = (message) => {
    console.log('Message sent:', message);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader 
          userRole={userRole}
          isMenuOpen={isMenuOpen}
          onMenuToggle={handleMenuToggle}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading food details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!foodData) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader 
          userRole={userRole}
          isMenuOpen={isMenuOpen}
          onMenuToggle={handleMenuToggle}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <p className="text-foreground text-lg mb-2">Food donation not found</p>
            <p className="text-muted-foreground mb-4">The requested donation may have been removed or is no longer available.</p>
            <button
              onClick={() => navigate('/recipient-dashboard')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader 
        userRole={userRole}
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation 
            userRole={userRole}
            className="mb-6"
          />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Food Details
              </h1>
              <p className="text-muted-foreground">
                Review donation details and coordinate pickup
              </p>
            </div>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back
            </button>
          </div>

          {/* Acceptance Status Message */}
          {acceptanceStatus && (
            <div className={`mb-8 p-6 rounded-lg border-2 ${
              acceptanceStatus.type === 'success' 
                ? 'bg-success/10 border-success' 
                : 'bg-error/10 border-error'
            }`}>
              <div className="flex items-start">
                <Icon 
                  name={acceptanceStatus.type === 'success' ? 'CheckCircle' : 'XCircle'} 
                  size={24} 
                  className={acceptanceStatus.type === 'success' ? 'text-success' : 'text-error'}
                />
                <div className="ml-4 flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${
                    acceptanceStatus.type === 'success' ? 'text-success' : 'text-error'
                  }`}>
                    {acceptanceStatus.success ? 'Donation Accepted!' : 'Unable to Accept Donation'}
                  </h3>
                  <p className="text-foreground whitespace-pre-line">{acceptanceStatus.message}</p>
                  {acceptanceStatus.success && acceptanceStatus.feasibility && (
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-background/50 p-3 rounded">
                        <p className="text-muted-foreground text-xs">Distance</p>
                        <p className="font-bold text-foreground">{acceptanceStatus.feasibility.distanceInKm} km</p>
                      </div>
                      <div className="bg-background/50 p-3 rounded">
                        <p className="text-muted-foreground text-xs">Travel Time</p>
                        <p className="font-bold text-foreground">{acceptanceStatus.feasibility.travelTimeMinutes} min</p>
                      </div>
                      <div className="bg-background/50 p-3 rounded">
                        <p className="text-muted-foreground text-xs">Time Left</p>
                        <p className="font-bold text-foreground">{acceptanceStatus.feasibility.timeUntilExpiryMinutes} min</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Food Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Food Images */}
              {foodData?.images && foodData.images.length > 0 && (
                <FoodImageGallery 
                  images={foodData.images}
                  foodName={foodData.name}
                />
              )}

              {/* Food Information */}
              {foodData && <FoodInformation foodData={foodData} />}

              {/* Pickup Location */}
              {locationData && <PickupLocation locationData={locationData} />}

              {/* Communication Panel - Desktop */}
              {donorData && (
                <div className="hidden lg:block">
                  <CommunicationPanel 
                    donorInfo={donorData}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Actions & Details */}
            <div className="space-y-6">
              {/* Expiry Countdown */}
              {foodData?.expiryDate && <ExpiryCountdown expiryDate={foodData.expiryDate} />}

              {/* Action Buttons */}
              {foodData && (
                <ActionButtons
                  foodData={foodData}
                  onAccept={handleAcceptDonation}
                  onRequestInfo={handleRequestInfo}
                  onDecline={handleDeclineDonation}
                  userCapacity={50}
                  disabled={acceptanceStatus !== null}
                />
              )}

              {/* Donor Information */}
              {donorData && <DonorInformation donorData={donorData} />}

              {/* Volunteer Coordination */}
              {locationData && (
                <VolunteerCoordination 
                  pickupLocation={locationData}
                  estimatedDeliveryTime="6:30 PM"
                />
              )}
            </div>
          </div>

          {/* Mobile Communication Panel */}
          {donorData && (
            <div className="lg:hidden mt-8">
              <CommunicationPanel 
                donorInfo={donorData}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </main>
      <ActionFloatingButton userRole={userRole} />
    </div>
  );
};

export default FoodDetailsPage;