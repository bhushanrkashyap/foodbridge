import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import DashboardNavigation from '../../components/ui/DashboardNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import FilterBar from './components/FilterBar';
import ActiveFoodPosts from './components/ActiveFoodPosts';
import RecentPosts from './components/RecentPosts';
import MetricsCard from '../donor-dashboard/components/MetricsCard';

/**
 * RecipientDashboard - Main recipient dashboard with filtering and pagination
 * Mirrors donor dashboard UX with recipient-specific features
 */
const RecipientDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    urgency: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    view: 'grid'
  });
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Mock data - in production, this would come from Supabase
  // Using the same structure as donor-dashboard
  const allFoodPosts = [
    {
      id: 1,
      title: 'Fresh Vegetable Curry',
      description: 'Delicious mixed vegetable curry prepared with fresh seasonal vegetables. Perfect for immediate consumption.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      quantity: '15 servings',
      location: 'Mumbai Central',
      category: 'prepared-food',
      urgency: 'high',
      status: 'active',
      expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      matchCount: 3,
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Assorted Bakery Items',
      description: 'Fresh bread, pastries, and baked goods from our daily production.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      quantity: '25 items',
      location: 'Bandra West',
      category: 'bakery',
      urgency: 'medium',
      status: 'active',
      expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      matchCount: 1,
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Fresh Fruits & Vegetables',
      description: 'Seasonal fresh produce including apples, bananas, tomatoes, and leafy greens.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      quantity: '30 kg',
      location: 'Andheri East',
      category: 'fresh-produce',
      urgency: 'low',
      status: 'active',
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      matchCount: 2,
      postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 4,
      title: 'Packaged Rice & Lentils',
      description: 'Sealed packages of basmati rice and various lentils.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      quantity: '50 kg',
      location: 'Thane',
      category: 'packaged-goods',
      urgency: 'low',
      status: 'collected',
      expiryTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
      matchCount: 1,
      postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    // Add more mock posts for pagination testing
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 5,
      title: `Food Item ${i + 5}`,
      description: `Description for food item ${i + 5}`,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      quantity: `${10 + i} servings`,
      location: ['Mumbai', 'Pune', 'Delhi', 'Bangalore'][i % 4],
      category: ['prepared-food', 'fresh-produce', 'bakery', 'packaged-goods'][i % 4],
      urgency: ['high', 'medium', 'low'][i % 3],
      status: ['active', 'matched', 'collected'][i % 3],
      expiryTime: new Date(Date.now() + (i + 1) * 60 * 60 * 1000),
      matchCount: i % 3,
      postedAt: new Date(Date.now() - (i + 1) * 60 * 60 * 1000)
    }))
  ];

  // Metrics data
  const metricsData = [
    {
      title: 'Meals Secured This Month',
      value: '1,247',
      unit: 'meals',
      change: '+18',
      changeType: 'increase',
      icon: 'Utensils',
      color: 'success'
    },
    {
      title: 'Beneficiaries Served',
      value: '423',
      unit: 'people',
      change: '+12',
      changeType: 'increase',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Active Requests',
      value: '7',
      unit: 'requests',
      change: '-2',
      changeType: 'decrease',
      icon: 'Heart',
      color: 'warning'
    },
    {
      title: 'Pickup Success Rate',
      value: '94',
      unit: '%',
      change: '+3',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'accent'
    }
  ];

  // Apply filters to posts
  const getFilteredPosts = () => {
    return allFoodPosts.filter(post => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.location.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'all' && post.category !== filters.category) {
        return false;
      }

      // Urgency filter
      if (filters.urgency !== 'all' && post.urgency !== filters.urgency) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && post.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.startDate) {
        const postDate = new Date(post.postedAt);
        const startDate = new Date(filters.startDate);
        if (postDate < startDate) return false;
      }

      if (filters.endDate) {
        const postDate = new Date(post.postedAt);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (postDate > endDate) return false;
      }

      return true;
    });
  };

  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (postId) => {
    navigate(`/food-details?id=${postId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader
        userRole="recipient"
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
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

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metricsData.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  unit={metric.unit}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Filters & Active Posts */}
              <div className="lg:col-span-3 space-y-6">
                {/* Filter Bar */}
                <FilterBar
                  onFilterChange={handleFilterChange}
                  initialFilters={filters}
                />

                {/* Active Food Posts */}
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                    Active Food Posts
                  </h2>
                  <ActiveFoodPosts
                    posts={paginatedPosts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalCount={filteredPosts.length}
                    loading={loading}
                    onPageChange={handlePageChange}
                    onViewDetails={handleViewDetails}
                    viewMode={filters.view}
                  />
                </div>
              </div>

              {/* Right Column - Recent Posts Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <RecentPosts
                    posts={allFoodPosts.sort((a, b) => b.postedAt - a.postedAt)}
                    loading={loading}
                    limit={10}
                  />
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecipientDashboard;
