import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ActionFloatingButton from '../../components/ui/ActionFloatingButton';
import Icon from '../../components/AppIcon';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole] = useState('recipient'); // Mock user role
  const [isLoading, setIsLoading] = useState(true);

  // Mock food data
  const mockFoodData = {
    id: "fd_001",
    name: "Chicken Biryani with Raita",
    description: "Aromatic basmati rice cooked with tender chicken pieces, traditional spices, and served with cooling cucumber raita. Prepared fresh this morning using organic ingredients.",
    aiEnhancedDescription: `This traditional Hyderabadi-style biryani features long-grain basmati rice layered with marinated chicken cooked in a blend of cardamom, cinnamon, and bay leaves. The dish is garnished with fried onions, fresh mint, and boiled eggs. Accompanied by cucumber raita made with yogurt, mint, and cumin for a balanced meal. Rich in protein (35g per serving) and provides essential nutrients. Best consumed within 4 hours of preparation for optimal taste and food safety.`,
    images: [
      "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop"
    ],
    quantity: "15 kg",
    servings: 45,
    expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    ingredients: "Basmati rice, chicken, yogurt, onions, ginger-garlic paste, red chili powder, turmeric, garam masala, cardamom, cinnamon, bay leaves, mint leaves, coriander leaves, ghee, cucumber, cumin powder, salt",
    preparationMethod: "Chicken marinated in yogurt and spices for 2 hours, then cooked with partially boiled rice in layers. Dum cooking method used for 45 minutes. Raita prepared with fresh cucumber, yogurt, and aromatic spices.",
    dietaryInfo: ["halal", "dairy"],
    allergens: ["dairy", "gluten"],
    spiceLevel: "medium",
    nutritionalInfo: {
      calories: "420 kcal",
      protein: "35g",
      carbs: "45g",
      fat: "12g"
    }
  };

  // Mock donor data
  const mockDonorData = {
    name: "Spice Garden Restaurant",
    type: "restaurant",
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
    rating: 4.8,
    totalDonations: 234,
    successRate: 96,
    verificationBadges: ["verified", "food-safety", "top-donor"],
    location: {
      address: "123 MG Road, Commercial Complex",
      area: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034"
    },
    operatingHours: "11:00 AM - 11:00 PM",
    contactInfo: {
      phone: "+91 98765 43210",
      email: "contact@spicegarden.com"
    },
    description: "Premium Indian restaurant specializing in authentic regional cuisines. Committed to reducing food waste through regular donations to local NGOs and shelters.",
    joinedDate: new Date('2022-03-15'),
    lastActive: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  };

  // Mock location data
  const mockLocationData = {
    address: {
      name: "Spice Garden Restaurant - Kitchen Entrance",
      street: "123 MG Road, Commercial Complex",
      area: "Koramangala 4th Block",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034"
    },
    coordinates: {
      lat: 12.9352,
      lng: 77.6245
    },
    landmarks: [
      "Opposite Forum Mall",
      "Near Koramangala Metro Station",
      "Behind Cafe Coffee Day"
    ],
    accessInstructions: "Enter through the main gate and take the left corridor to reach the kitchen entrance. Look for the 'Food Donation Pickup' sign. Ring the bell and mention you're here for FoodBridge pickup.",
    parkingInfo: "Free parking available in the basement. Take a token from the security guard and mention food donation pickup for complimentary parking.",
    contactPerson: {
      name: "Ramesh Kumar",
      role: "Kitchen Manager"
    },
    availableTimeSlots: [
      { start: "2:00 PM", end: "3:00 PM", available: true, note: "Preferred time" },
      { start: "3:00 PM", end: "4:00 PM", available: true },
      { start: "4:00 PM", end: "5:00 PM", available: false, note: "Rush hour" },
      { start: "5:00 PM", end: "6:00 PM", available: true }
    ],
    specialInstructions: "Please bring insulated containers for hot food transport. Kitchen staff will assist with packaging. Ensure volunteer has valid ID for security verification."
  };

  // Mock AI matching data
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

  const handleAcceptDonation = (acceptanceData) => {
    console.log('Donation accepted:', acceptanceData);
    // Navigate to confirmation or dashboard
    navigate('/recipient-dashboard?section=requests');
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Food Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Food Images */}
              <FoodImageGallery 
                images={mockFoodData?.images}
                foodName={mockFoodData?.name}
              />

              {/* Food Information */}
              <FoodInformation foodData={mockFoodData} />

              {/* AI Matching Score */}
              <AIMatchingScore matchingData={mockMatchingData} />

              {/* Pickup Location */}
              <PickupLocation locationData={mockLocationData} />

              {/* Communication Panel - Desktop */}
              <div className="hidden lg:block">
                <CommunicationPanel 
                  donorInfo={mockDonorData}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>

            {/* Right Column - Actions & Details */}
            <div className="space-y-6">
              {/* Expiry Countdown */}
              <ExpiryCountdown expiryDate={mockFoodData?.expiryDate} />

              {/* Action Buttons */}
              <ActionButtons
                foodData={mockFoodData}
                onAccept={handleAcceptDonation}
                onRequestInfo={handleRequestInfo}
                onDecline={handleDeclineDonation}
                userCapacity={50}
              />

              {/* Donor Information */}
              <DonorInformation donorData={mockDonorData} />

              {/* Volunteer Coordination */}
              <VolunteerCoordination 
                pickupLocation={mockLocationData}
                estimatedDeliveryTime="6:30 PM"
              />
            </div>
          </div>

          {/* Mobile Communication Panel */}
          <div className="lg:hidden mt-8">
            <CommunicationPanel 
              donorInfo={mockDonorData}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>
      <ActionFloatingButton userRole={userRole} />
    </div>
  );
};

export default FoodDetailsPage;