import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

/**
 * FilterBar - Advanced filtering component with debounced search and localStorage persistence
 * @param {Function} onFilterChange - Callback when filters change
 * @param {Object} initialFilters - Initial filter values
 */
const FilterBar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    urgency: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    view: 'grid',
    ...initialFilters
  });

  const [searchDebounce, setSearchDebounce] = useState('');

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('recipientDashboardFilters');
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        setFilters(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  }, []);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Notify parent of filter changes (except search, which uses debounced value)
  useEffect(() => {
    const filtersToSend = {
      ...filters,
      search: searchDebounce
    };
    
    // Save to localStorage
    try {
      localStorage.setItem('recipientDashboardFilters', JSON.stringify(filtersToSend));
    } catch (error) {
      console.error('Error saving filters:', error);
    }

    onFilterChange(filtersToSend);
  }, [searchDebounce, filters.category, filters.urgency, filters.status, filters.startDate, filters.endDate, filters.view]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      urgency: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
      view: 'grid'
    };
    setFilters(clearedFilters);
    setSearchDebounce('');
    localStorage.removeItem('recipientDashboardFilters');
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.urgency !== 'all' ||
    filters.status !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '';

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
    { value: 'active', label: 'Available' },
    { value: 'matched', label: 'Matched' },
    { value: 'claimed', label: 'Claimed' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'expired', label: 'Expired' },
    { value: 'collected', label: 'Collected' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search food items by name or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
            className="w-full"
          />

          <Select
            label="Urgency"
            options={urgencyOptions}
            value={filters.urgency}
            onChange={(value) => handleFilterChange('urgency', value)}
            className="w-full"
          />

          <Select
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            className="w-full"
          />

          {/* View Toggle */}
          <div className="flex items-end space-x-2">
            <Button
              variant={filters.view === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleFilterChange('view', 'grid')}
              title="Grid view"
            >
              <Icon name="Grid" size={18} />
            </Button>
            <Button
              variant={filters.view === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleFilterChange('view', 'list')}
              title="List view"
            >
              <Icon name="List" size={18} />
            </Button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            min={filters.startDate}
          />
        </div>

        {/* Action Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Filter" size={16} />
              <span>Active filters applied</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
