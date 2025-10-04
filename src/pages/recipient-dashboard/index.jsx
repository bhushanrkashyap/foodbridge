import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import DashboardNavigation from '../../components/ui/DashboardNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ActionFloatingButton from '../../components/ui/ActionFloatingButton';
import MetricsCard from './components/MetricsCard';
import FoodMatchCard from './components/FoodMatchCard';
import FilterPanel from './components/FilterPanel';
import AcceptedDonationsPanel from './components/AcceptedDonationsPanel';
import EmergencyRequestPanel from './components/EmergencyRequestPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RecipientDashboard = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    dietaryRestrictions: [],
    urgency: [],
    distance: 50,
    minQuantity: ''
  });

  // Mock data for dashboard metrics
  const metricsData = [
    {
      title: 'Meals Secured This Month',
      value: '1,247',
      unit: 'meals',
      change: '+18%',
      changeType: 'positive',
      icon: 'Utensils',
      color: 'success'
    },
    {
      title: 'Beneficiaries Served',
      value: '423',
      unit: 'people',
      change: '+12%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Active Requests',
      value: '7',
      unit: 'requests',
      change: '-2',
      changeType: 'negative',
      icon: 'Heart',
      color: 'warning'
    },
    {
      title: 'Pickup Success Rate',
      value: '94',
      unit: '%',
      change: '+3%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'accent'
    }
  ];

  // Mock data for food matches
  const foodMatches = [
    {
      id: 1,
      donorName: "Green Garden Restaurant",
      donorType: "Restaurant",
      foodName: "Fresh Vegetable Curry with Rice",
      description: "Freshly prepared vegetable curry with basmati rice, suitable for vegetarian diets. Contains onions, tomatoes, mixed vegetables in aromatic spices.",
      foodImage: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      quantity: 25,
      unit: "portions",
      estimatedMeals: 25,
      expiryTime: "4 hours",
      distance: 2.3,
      pickupAddress: "MG Road, Bangalore",
      availableUntil: "6:00 PM today",
      urgency: "high",
      compatibilityScore: 94,
      categories: ["Vegetarian", "Indian", "Prepared Meals"],
      createdAt: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      donorName: "Fresh Mart Supermarket",
      donorType: "Supermarket",
      foodName: "Mixed Fresh Fruits",
      description: "Assorted fresh fruits including apples, bananas, oranges, and seasonal fruits. All items are approaching best-by date but still fresh and nutritious.",
      foodImage: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
      quantity: 15,
      unit: "kg",
      estimatedMeals: 45,
      expiryTime: "2 days",
      distance: 5.7,
      pickupAddress: "Koramangala, Bangalore",
      availableUntil: "8:00 PM today",
      urgency: "medium",
      compatibilityScore: 87,
      categories: ["Fresh Produce", "Fruits", "Healthy"],
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      donorName: "Bread & Beyond Bakery",
      donorType: "Bakery",
      foodName: "Assorted Bread and Pastries",
      description: "Fresh bread loaves, dinner rolls, and pastries from today's batch. Perfect for breakfast distribution or meal accompaniments.",
      foodImage: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
      quantity: 40,
      unit: "pieces",
      estimatedMeals: 60,
      expiryTime: "1 day",
      distance: 3.1,
      pickupAddress: "Indiranagar, Bangalore",
      availableUntil: "10:00 PM today",
      urgency: "low",
      compatibilityScore: 76,
      categories: ["Bakery", "Bread", "Breakfast"],
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: 4,
      donorName: "Spice Route Catering",
      donorType: "Catering Service",
      foodName: "Chicken Biryani with Raita",
      description: "Aromatic chicken biryani with mint raita and pickles. Prepared for an event with extra portions available. Contains dairy and meat.",
      foodImage: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg",
      quantity: 35,
      unit: "portions",
      estimatedMeals: 35,
      expiryTime: "6 hours",
      distance: 4.2,
      pickupAddress: "Whitefield, Bangalore",
      availableUntil: "9:00 PM today",
      urgency: "high",
      compatibilityScore: 82,
      categories: ["Non-Vegetarian", "Indian", "Prepared Meals"],
      createdAt: new Date(Date.now() - 900000)
    }
  ];

  // Mock data for accepted donations
  const acceptedDonations = [
    {
      id: 101,
      donorName: "Healthy Bites Cafe",
      foodName: "Quinoa Salad Bowl",
      foodImage: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      quantity: 20,
      unit: "bowls",
      distance: 1.8,
      status: "scheduled",
      scheduledPickup: new Date(Date.now() + 3600000),
      donorPhone: "+91 98765 43210",
      assignedVolunteer: {
        name: "Rajesh Kumar",
        phone: "+91 87654 32109"
      }
    },
    {
      id: 102,
      donorName: "Corner Bakery",
      foodName: "Fresh Sandwich Platter",
      foodImage: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
      quantity: 30,
      unit: "pieces",
      distance: 3.5,
      status: "in-transit",
      scheduledPickup: new Date(Date.now() - 1800000),
      donorPhone: "+91 98765 43211"
    },
    {
      id: 103,
      donorName: "Green Grocers",
      foodName: "Mixed Vegetables",
      foodImage: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
      quantity: 12,
      unit: "kg",
      distance: 2.1,
      status: "delivered",
      deliveredAt: new Date(Date.now() - 86400000),
      donorPhone: "+91 98765 43212"
    }
  ];

  // Mock data for emergency requests
  const emergencyRequests = [
    {
      id: 201,
      urgencyLevel: "critical",
      beneficiaryCount: 75,
      foodTypes: ["prepared-meals", "fresh-produce"],
      timeframe: "2",
      pickupRadius: 15,
      contactPerson: "Priya Sharma",
      contactPhone: "+91 98765 43213",
      status: "active",
      createdAt: new Date(Date.now() - 1800000),
      responses: [
        { donorName: "City Restaurant", quantity: "30 portions" },
        { donorName: "Fresh Market", quantity: "10 kg vegetables" }
      ]
    }
  ];

  // Get current section from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params?.get('section') || 'overview';
    setCurrentSection(section);
  }, [location?.search]);

  // Handle section changes
  useEffect(() => {
    const handleSectionChange = (event) => {
      setCurrentSection(event?.detail?.section);
    };

    window.addEventListener('dashboardSectionChange', handleSectionChange);
    return () => window.removeEventListener('dashboardSectionChange', handleSectionChange);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAcceptMatch = (matchId) => {
    console.log('Accepting match:', matchId);
    // Handle match acceptance logic
  };

  const handleRejectMatch = (matchId, reason) => {
    console.log('Rejecting match:', matchId, 'Reason:', reason);
    // Handle match rejection logic
  };

  const handleSchedulePickup = (donationId) => {
    console.log('Scheduling pickup for:', donationId);
    // Handle pickup scheduling logic
  };

  const handleUpdateStatus = (donationId, newStatus) => {
    console.log('Updating status for:', donationId, 'to:', newStatus);
    // Handle status update logic
  };

  const handleEmergencyRequest = (requestData) => {
    console.log('Submitting emergency request:', requestData);
    // Handle emergency request submission
  };

  const handleSemanticSearch = (query) => {
    setSearchQuery(query);
    console.log('Semantic search query:', query);
    // Handle semantic search logic
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData?.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric?.title}
            value={metric?.value}
            unit={metric?.unit}
            change={metric?.change}
            changeType={metric?.changeType}
            icon={metric?.icon}
            color={metric?.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <h3 className="font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            iconName="Search"
            iconPosition="left"
            onClick={() => setCurrentSection('available')}
            className="justify-start"
          >
            Browse Available Food
          </Button>
          <Button
            variant="outline"
            iconName="AlertTriangle"
            iconPosition="left"
            onClick={() => setCurrentSection('emergency')}
            className="justify-start"
          >
            Emergency Request
          </Button>
          <Button
            variant="outline"
            iconName="Calendar"
            iconPosition="left"
            onClick={() => setCurrentSection('requests')}
            className="justify-start"
          >
            Manage Pickups
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg shadow-soft">
        <div className="p-6 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          <div className="p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Successfully picked up 25 portions from Green Garden Restaurant</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Heart" size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">New food match available: Fresh Fruit Basket</p>
              <p className="text-xs text-muted-foreground">4 hours ago</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Emergency request fulfilled by 2 donors</p>
              <p className="text-xs text-muted-foreground">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvailableFoodSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter Panel */}
      <div className="lg:col-span-1">
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
        />
      </div>

      {/* Food Matches */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search Bar */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
          <div className="flex gap-3">
            <Input
              type="search"
              placeholder="Search for specific food items using natural language..."
              value={searchQuery}
              onChange={(e) => handleSemanticSearch(e?.target?.value)}
              className="flex-1"
            />
            <Button variant="default" iconName="Search">
              Search
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Try: "vegetarian meals for 50 people" or "fresh fruits near me"
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-foreground">
            Available Food Matches ({foodMatches?.length})
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="px-3 py-1 border border-border rounded bg-input text-foreground text-sm">
              <option>Compatibility Score</option>
              <option>Distance</option>
              <option>Urgency</option>
              <option>Quantity</option>
            </select>
          </div>
        </div>

        {/* Food Match Cards */}
        <div className="space-y-4">
          {foodMatches?.map((match) => (
            <FoodMatchCard
              key={match?.id}
              match={match}
              onAccept={handleAcceptMatch}
              onReject={handleRejectMatch}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequestsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AcceptedDonationsPanel
        donations={acceptedDonations}
        onSchedulePickup={handleSchedulePickup}
        onUpdateStatus={handleUpdateStatus}
      />
      <EmergencyRequestPanel
        onSubmitRequest={handleEmergencyRequest}
        activeRequests={emergencyRequests}
      />
    </div>
  );

  const renderReceivedSection = () => (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <h3 className="font-heading font-semibold text-foreground">Donation History</h3>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="font-heading font-medium text-foreground mb-2">Received Donations</h4>
          <p className="text-sm text-muted-foreground">
            Your completed donation history will appear here.
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'available':
        return renderAvailableFoodSection();
      case 'requests':
        return renderRequestsSection();
      case 'received':
        return renderReceivedSection();
      default:
        return renderOverviewSection();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        userRole="recipient"
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
      />

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <DashboardNavigation userRole="recipient" />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <BreadcrumbNavigation userRole="recipient" className="mb-6" />

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Recipient Dashboard
              </h1>
              <p className="text-muted-foreground">
                Discover available food donations and coordinate pickups for your beneficiaries
              </p>
            </div>

            {/* Dashboard Content */}
            {renderCurrentSection()}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <ActionFloatingButton userRole="recipient" />
    </div>
  );
};

export default RecipientDashboard;