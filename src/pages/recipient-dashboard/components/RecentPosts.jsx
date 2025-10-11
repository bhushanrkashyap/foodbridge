import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

/**
 * RecentPosts - Sidebar widget showing last 5-10 food posts
 * @param {Array} posts - Recent posts array
 * @param {Boolean} loading - Loading state
 * @param {Number} limit - Number of posts to show (default 5)
 */
const RecentPosts = ({ posts = [], loading = false, limit = 5 }) => {
  const navigate = useNavigate();

  const formatTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMinutes = Math.floor((now - posted) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-soft">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Recent Posts</h3>
        </div>
        <div className="divide-y divide-border">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="flex space-x-3">
                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayPosts = posts.slice(0, limit);

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Recent Posts</h3>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>Latest</span>
        </div>
      </div>

      {/* Posts List */}
      {displayPosts.length > 0 ? (
        <div className="divide-y divide-border">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/food-details?id=${post.id}`)}
            >
              <div className="flex space-x-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm line-clamp-1 mb-1">
                    {post.title}
                  </h4>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                    <Icon name="MapPin" size={12} />
                    <span className="line-clamp-1">{post.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-0.5 bg-muted rounded-full">
                        {post.quantity}
                      </span>
                      <span className={`font-medium ${getUrgencyColor(post.urgency)}`}>
                        {post.urgency}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(post.postedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <Icon name="Package" size={32} className="text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No recent posts</p>
        </div>
      )}

      {/* View All Footer */}
      {displayPosts.length > 0 && posts.length > limit && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            iconName="ArrowRight"
            iconPosition="right"
            onClick={() => navigate('/recipient-dashboard')}
          >
            View All Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
