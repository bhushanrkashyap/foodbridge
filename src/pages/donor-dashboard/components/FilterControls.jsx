import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onBulkAction,
  selectedPosts = [],
  totalPosts = 0 
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'prepared-food', label: 'Prepared Food' },
    { value: 'fresh-produce', label: 'Fresh Produce' },
    { value: 'packaged-goods', label: 'Packaged Goods' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'bakery', label: 'Bakery Items' },
    { value: 'beverages', label: 'Beverages' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency Levels' },
    { value: 'high', label: 'High Urgency' },
    { value: 'medium', label: 'Medium Urgency' },
    { value: 'low', label: 'Low Urgency' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'matched', label: 'Matched' },
    { value: 'expired', label: 'Expired' },
    { value: 'collected', label: 'Collected' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const bulkActionOptions = [
    { value: '', label: 'Bulk Actions' },
    { value: 'extend-expiry', label: 'Extend Expiry' },
    { value: 'mark-collected', label: 'Mark as Collected' },
    { value: 'delete', label: 'Delete Posts' }
  ];

  const hasActiveFilters = Object.values(filters)?.some(value => value !== 'all' && value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category || 'all'}
          onChange={(value) => onFilterChange('category', value)}
          className="w-full"
        />

        <Select
          label="Urgency"
          options={urgencyOptions}
          value={filters?.urgency || 'all'}
          onChange={(value) => onFilterChange('urgency', value)}
          className="w-full"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status || 'all'}
          onChange={(value) => onFilterChange('status', value)}
          className="w-full"
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange || 'all'}
          onChange={(value) => onFilterChange('dateRange', value)}
          className="w-full"
        />
      </div>
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        {/* Results Info */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Showing {totalPosts} posts
          </span>
          
          {selectedPosts?.length > 0 && (
            <span className="text-sm font-medium text-primary">
              {selectedPosts?.length} selected
            </span>
          )}
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedPosts?.length > 0 && (
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value=""
              onChange={(value) => value && onBulkAction(value, selectedPosts)}
              placeholder="Bulk Actions"
              className="w-40"
            />
          </div>
        )}

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Grid3X3"
            onClick={() => onFilterChange('view', 'grid')}
            className={filters?.view === 'grid' ? 'bg-muted' : ''}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="List"
            onClick={() => onFilterChange('view', 'list')}
            className={filters?.view === 'list' ? 'bg-muted' : ''}
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {Object.entries(filters)?.map(([key, value]) => {
              if (value === 'all' || value === '' || key === 'view') return null;
              
              return (
                <div
                  key={key}
                  className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                >
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => onFilterChange(key, 'all')}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;