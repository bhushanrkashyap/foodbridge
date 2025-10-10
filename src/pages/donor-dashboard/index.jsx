import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleBasedHeader from '../../components/ui/RoleBasedHeader';
import DashboardNavigation from '../../components/ui/DashboardNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricsCard from './components/MetricsCard';
import FoodPostCard from './components/FoodPostCard';
import RecentMatchCard from './components/RecentMatchCard';
import FilterControls from './components/FilterControls';
import NotificationPanel from './components/NotificationPanel';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    urgency: 'all',
    status: 'all',
    dateRange: 'all',
    view: 'grid'
  });

  const currentSection = searchParams?.get('section') || 'overview';

  // Mock data for dashboard metrics
  const metricsData = [
    {
      title: 'Food Donated This Week',
      value: '847',
      unit: 'kg',
      change: 12,
      changeType: 'increase',
      icon: 'Package',
      color: 'primary'
    },
    {
      title: 'CO₂ Prevented',
      value: '2.1',
      unit: 'tonnes',
      change: 8,
      changeType: 'increase',
      icon: 'Leaf',
      color: 'success'
    },
    {
      title: 'People Served',
      value: '156',
      unit: 'meals',
      change: 15,
      changeType: 'increase',
      icon: 'Users',
      color: 'accent'
    },
    {
      title: 'Active Posts',
      value: '12',
      unit: '',
      change: -2,
      changeType: 'decrease',
      icon: 'Activity',
      color: 'warning'
    }
  ];

  // Mock data for food posts
  const foodPosts = [
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
      expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      matchCount: 3,
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Assorted Bakery Items',
      description: 'Fresh bread, pastries, and baked goods from our daily production. Includes whole wheat bread and croissants.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      quantity: '25 items',
      location: 'Bandra West',
      category: 'bakery',
      urgency: 'medium',
      status: 'matched',
      expiryTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      matchCount: 1,
      recipient: {
        name: 'Hope Foundation',
        type: 'NGO'
      },
      matchScore: 94,
      pickupTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Fresh Fruits & Vegetables',
      description: 'Seasonal fresh produce including apples, bananas, tomatoes, and leafy greens. All items are in good condition.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      quantity: '30 kg',
      location: 'Andheri East',
      category: 'fresh-produce',
      urgency: 'low',
      status: 'active',
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      matchCount: 2,
      postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 4,
      title: 'Packaged Rice & Lentils',
      description: 'Sealed packages of basmati rice and various lentils. Long shelf life and perfect for bulk distribution.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      quantity: '50 kg',
      location: 'Thane',
      category: 'packaged-goods',
      urgency: 'low',
      status: 'collected',
      expiryTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
      matchCount: 1,
      recipient: {
        name: 'Akshaya Patra',
        type: 'NGO'
      },
      matchScore: 88,
      postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ];

  // Mock data for recent matches
  const recentMatches = [
    {
      id: 1,
      recipientName: 'Smile Foundation',
      recipientType: 'NGO',
      location: 'Mumbai Central',
      foodTitle: 'Fresh Vegetable Curry',
      foodImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100',
      quantity: '15 servings',
      category: 'prepared-food',
      status: 'pending',
      matchScore: 96,
      matchedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      recipientName: 'Care & Share',
      recipientType: 'Shelter',
      location: 'Bandra West',
      foodTitle: 'Assorted Bakery Items',
      foodImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100',
      quantity: '25 items',
      category: 'bakery',
      status: 'confirmed',
      matchScore: 94,
      matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      pickupTime: new Date(Date.now() + 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      recipientName: 'Food for All',
      recipientType: 'Community Kitchen',
      location: 'Andheri East',
      foodTitle: 'Fresh Fruits & Vegetables',
      foodImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
      quantity: '30 kg',
      category: 'fresh-produce',
      status: 'in-progress',
      matchScore: 91,
      matchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      pickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000)
    }
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'match',
      title: 'New Match Found!',
      message: 'Smile Foundation is interested in your Fresh Vegetable Curry. Match score: 96%',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionLabel: 'View Match',
      actionUrl: '/donor-dashboard?section=matches'
    },
    {
      id: 2,
      type: 'pickup',
      title: 'Pickup Scheduled',
      message: 'Care & Share has scheduled pickup for Assorted Bakery Items at 2:00 PM today.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      actionLabel: 'View Details',
      actionUrl: '/food-details'
    },
    {
      id: 3,
      type: 'completion',
      title: 'Donation Completed',
      message: 'Your Packaged Rice & Lentils donation has been successfully collected by Akshaya Patra.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      actionLabel: 'View Impact',
      actionUrl: '/donor-dashboard?section=history'
    },
    {
      id: 4,
      type: 'expiry',
      title: 'Expiry Alert',
      message: 'Your Fresh Vegetable Curry will expire in 3 hours. Consider extending the expiry time.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      actionLabel: 'Extend Expiry',
      actionUrl: '/food-details'
    }
  ];

  // Filter food posts based on current filters
  const filteredPosts = foodPosts?.filter(post => {
    if (filters?.category !== 'all' && post?.category !== filters?.category) return false;
    if (filters?.urgency !== 'all' && post?.urgency !== filters?.urgency) return false;
    if (filters?.status !== 'all' && post?.status !== filters?.status) return false;
    
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const postDate = new Date(post.postedAt);
      
      switch (filters?.dateRange) {
        case 'today':
          if (postDate?.toDateString() !== now?.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (postDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (postDate < monthAgo) return false;
          break;
      }
    }
    
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      urgency: 'all',
      status: 'all',
      dateRange: 'all',
      view: filters?.view // Keep view preference
    });
  };

  const handleBulkAction = (action, postIds) => {
    console.log('Bulk action:', action, 'for posts:', postIds);
    // Handle bulk actions here
    setSelectedPosts([]);
  };

  const handlePostAction = (action, postId) => {
    console.log('Post action:', action, 'for post:', postId);
    // Handle individual post actions here
  };

  const handleMatchAction = (action, matchId) => {
    console.log('Match action:', action, 'for match:', matchId);
    // Handle match actions here
  };

  const handleNotificationAction = (action, notificationId) => {
    console.log('Notification action:', action, 'for notification:', notificationId);
    // Handle notification actions here
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData?.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Posts Preview */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-foreground">
              Recent Posts
            </h2>
            <Button
              variant="outline"
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              onClick={() => navigate('/donor-dashboard?section=active')}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodPosts?.slice(0, 4)?.map(post => (
              <FoodPostCard
                key={post?.id}
                post={post}
                onViewDetails={(id) => navigate(`/food-details?id=${id}`)}
                onExtendExpiry={(id) => handlePostAction('extend', id)}
                onMarkCollected={(id) => handlePostAction('collected', id)}
              />
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={(id) => handleNotificationAction('markRead', id)}
            onMarkAllAsRead={() => handleNotificationAction('markAllRead')}
          />
        </div>
      </div>
    </div>
  );

  const renderActivePostsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Active Food Posts
        </h2>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/post-surplus-food')}
        >
          Post Surplus Food
        </Button>
      </div>

      <FilterControls
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onBulkAction={handleBulkAction}
        selectedPosts={selectedPosts}
        totalPosts={filteredPosts?.length}
      />

      <div className={`grid gap-6 ${
        filters?.view === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :'grid-cols-1'
      }`}>
        {filteredPosts?.map(post => (
          <FoodPostCard
            key={post?.id}
            post={post}
            onViewDetails={(id) => navigate(`/food-details?id=${id}`)}
            onExtendExpiry={(id) => handlePostAction('extend', id)}
            onMarkCollected={(id) => handlePostAction('collected', id)}
          />
        ))}
      </div>

      {filteredPosts?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            No posts found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or create a new food post.
          </p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/post-surplus-food')}
          >
            Post Surplus Food
          </Button>
        </div>
      )}
    </div>
  );

  const renderMatchesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          AI-Powered Matches
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Zap" size={16} className="text-primary" />
          <span>Powered by AI matching</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentMatches?.map(match => (
          <RecentMatchCard
            key={match?.id}
            match={match}
            onContact={(id) => handleMatchAction('contact', id)}
            onViewDetails={(id) => handleMatchAction('details', id)}
          />
        ))}
      </div>

      {recentMatches?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            No matches yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Post surplus food to get AI-powered matches with recipients.
          </p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/post-surplus-food')}
          >
            Post Surplus Food
          </Button>
        </div>
      )}
    </div>
  );

  const renderHistorySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">
        Donation History & Impact
      </h2>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-success/10 text-success">
              <Icon name="Award" size={24} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Total Impact</h3>
              <p className="text-sm text-muted-foreground">All time donations</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Food Donated</span>
              <span className="font-mono font-medium">2,847 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">CO₂ Prevented</span>
              <span className="font-mono font-medium text-success">8.2 tonnes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">People Served</span>
              <span className="font-mono font-medium text-primary">1,247 meals</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Icon name="TrendingUp" size={24} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">This Month</h3>
              <p className="text-sm text-muted-foreground">October 2024</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Donations</span>
              <span className="font-mono font-medium">23 posts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-mono font-medium text-success">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg. Match Score</span>
              <span className="font-mono font-medium text-primary">92%</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <Icon name="Target" size={24} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Recognition</h3>
              <p className="text-sm text-muted-foreground">Community impact</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Donor Level</span>
              <span className="font-mono font-medium text-accent">Gold</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Rating</span>
              <span className="font-mono font-medium">4.9/5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Badges</span>
              <span className="font-mono font-medium text-primary">7 earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Completed Donations */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Recent Completed Donations
        </h3>
        <div className="space-y-4">
          {foodPosts?.filter(post => post?.status === 'collected')?.map(post => (
            <div key={post?.id} className="bg-card border border-border rounded-lg p-4 shadow-soft">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img src={post?.image} alt={post?.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-semibold text-foreground">{post?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Collected by {post?.recipient?.name} • {post?.quantity}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.postedAt)?.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Match: {post?.matchScore}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'active':
        return renderActivePostsSection();
      case 'matches':
        return renderMatchesSection();
      case 'history':
        return renderHistorySection();
      default:
        return renderOverviewSection();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader
        userRole="donor"
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      <div className="flex pt-16">
        <DashboardNavigation userRole="donor" />

        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            <BreadcrumbNavigation userRole="donor" />
            
            <div className="mt-6">
              {renderCurrentSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;