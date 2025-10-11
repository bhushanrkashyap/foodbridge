import React from 'react';
import FoodPostCard from '../../donor-dashboard/components/FoodPostCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

/**
 * ActiveFoodPosts - Paginated list of food posts with filtering
 * @param {Array} posts - Array of food posts to display
 * @param {Number} currentPage - Current page number
 * @param {Number} totalPages - Total number of pages
 * @param {Number} pageSize - Items per page
 * @param {Boolean} loading - Loading state
 * @param {Function} onPageChange - Callback for page changes
 * @param {Function} onViewDetails - Callback when viewing post details
 * @param {String} viewMode - 'grid' or 'list'
 */
const ActiveFoodPosts = ({
  posts = [],
  currentPage = 0,
  totalPages = 1,
  pageSize = 12,
  totalCount = 0,
  loading = false,
  onPageChange,
  onViewDetails,
  viewMode = 'grid'
}) => {
  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft animate-pulse">
      <div className="h-48 bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {[...Array(pageSize)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="Package" size={64} className="text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No food posts available
        </h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          No food donations match your current filters. Try adjusting your filters or check back later for new posts.
        </p>
        <Button 
          variant="outline"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    );
  }

  // Calculate pagination info
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing <span className="font-medium text-foreground">{startItem}-{endItem}</span> of{' '}
          <span className="font-medium text-foreground">{totalCount}</span> food posts
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Layers" size={14} />
          <span>Page {currentPage + 1} of {totalPages}</span>
        </div>
      </div>

      {/* Posts Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {posts.map((post) => (
          <FoodPostCard
            key={post.id}
            post={post}
            onViewDetails={onViewDetails}
            onExtendExpiry={() => console.log('Extend expiry:', post.id)}
            onMarkCollected={() => console.log('Mark collected:', post.id)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            iconName="ChevronsLeft"
            title="First page"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            iconName="ChevronLeft"
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, idx) => {
              // Show first page, last page, current page, and pages around current
              const showPage = 
                idx === 0 || 
                idx === totalPages - 1 || 
                Math.abs(idx - currentPage) <= 1;
              
              const showEllipsis = 
                (idx === 1 && currentPage > 2) ||
                (idx === totalPages - 2 && currentPage < totalPages - 3);

              if (showEllipsis) {
                return <span key={idx} className="px-2 text-muted-foreground">...</span>;
              }

              if (!showPage) return null;

              return (
                <Button
                  key={idx}
                  variant={currentPage === idx ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(idx)}
                  className="min-w-[40px]"
                >
                  {idx + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            iconName="ChevronsRight"
            title="Last page"
          />
        </div>
      )}
    </div>
  );
};

export default ActiveFoodPosts;
