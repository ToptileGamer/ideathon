import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AlertTimelineHeader = ({
  onDateRangeChange = () => {},
  onSeverityFilter = () => {},
  onLocationFilter = () => {},
  onSearchChange = () => {},
  onExportData = () => {},
  totalAlerts = 0,
  filteredAlerts = 0,
  isLoading = false,
  className = ""
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'low', label: 'Low' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'mumbai', label: 'Mumbai, Maharashtra' },
    { value: 'delhi', label: 'Delhi NCR' },
    { value: 'bangalore', label: 'Bangalore, Karnataka' },
    { value: 'chennai', label: 'Chennai, Tamil Nadu' },
    { value: 'kolkata', label: 'Kolkata, West Bengal' },
    { value: 'hyderabad', label: 'Hyderabad, Telangana' },
    { value: 'pune', label: 'Pune, Maharashtra' },
    { value: 'ahmedabad', label: 'Ahmedabad, Gujarat' }
  ];

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onDateRangeChange(newDateRange);
  };

  const handleSeverityChange = (value) => {
    setSelectedSeverity(value);
    onSeverityFilter(value);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    onLocationFilter(value);
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const clearAllFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setSelectedSeverity('all');
    setSelectedLocation('all');
    setSearchQuery('');
    onDateRangeChange({ startDate: '', endDate: '' });
    onSeverityFilter('all');
    onLocationFilter('all');
    onSearchChange('');
  };

  const hasActiveFilters = dateRange?.startDate || dateRange?.endDate || 
                          selectedSeverity !== 'all' || selectedLocation !== 'all' || 
                          searchQuery;

  return (
    <div className={`bg-card/95 glass-effect border-b border-border ${className}`}>
      <div className="px-6 py-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={24} className="text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Alert Timeline</h1>
            </div>
            
            {/* Alert Count */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {filteredAlerts !== totalAlerts ? `${filteredAlerts} of ${totalAlerts}` : totalAlerts} alerts
              </span>
              {isLoading && (
                <Icon name="Loader2" size={14} className="animate-spin text-primary" />
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onExportData}
              iconName="Download"
              iconPosition="left"
              disabled={filteredAlerts === 0}
            >
              Export Data
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              iconName={isFilterExpanded ? "ChevronUp" : "Filter"}
              iconPosition="left"
            >
              {isFilterExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="lg:hidden"
          >
            <Icon name={isFilterExpanded ? "X" : "Filter"} size={20} />
          </Button>
        </div>

        {/* Search Bar - Always Visible */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search alerts by location, description, or alert ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            iconName="Search"
            className="w-full"
          />
        </div>

        {/* Filter Panel */}
        {isFilterExpanded && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            {/* Desktop Filter Layout */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
              <div>
                <Input
                  type="date"
                  label="Start Date"
                  value={dateRange?.startDate}
                  onChange={(e) => handleDateChange('startDate', e?.target?.value)}
                />
              </div>
              
              <div>
                <Input
                  type="date"
                  label="End Date"
                  value={dateRange?.endDate}
                  onChange={(e) => handleDateChange('endDate', e?.target?.value)}
                  min={dateRange?.startDate}
                />
              </div>
              
              <div>
                <Select
                  label="Severity Level"
                  options={severityOptions}
                  value={selectedSeverity}
                  onChange={handleSeverityChange}
                />
              </div>
              
              <div>
                <Select
                  label="Location"
                  options={locationOptions}
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  searchable
                />
              </div>
            </div>

            {/* Mobile Filter Layout */}
            <div className="lg:hidden space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={dateRange?.startDate}
                  onChange={(e) => handleDateChange('startDate', e?.target?.value)}
                />
                
                <Input
                  type="date"
                  label="End Date"
                  value={dateRange?.endDate}
                  onChange={(e) => handleDateChange('endDate', e?.target?.value)}
                  min={dateRange?.startDate}
                />
              </div>
              
              <Select
                label="Severity Level"
                options={severityOptions}
                value={selectedSeverity}
                onChange={handleSeverityChange}
              />
              
              <Select
                label="Location"
                options={locationOptions}
                value={selectedLocation}
                onChange={handleLocationChange}
                searchable
              />
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    iconName="X"
                    iconPosition="left"
                  >
                    Clear Filters
                  </Button>
                )}
                
                {hasActiveFilters && (
                  <span className="text-xs text-muted-foreground">
                    {filteredAlerts} results found
                  </span>
                )}
              </div>

              {/* Mobile Export Button */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportData}
                  iconName="Download"
                  iconPosition="left"
                  disabled={filteredAlerts === 0}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !isFilterExpanded && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <div className="flex items-center space-x-2 flex-wrap">
              {dateRange?.startDate && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  From: {new Date(dateRange.startDate)?.toLocaleDateString('en-IN')}
                </span>
              )}
              {dateRange?.endDate && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  To: {new Date(dateRange.endDate)?.toLocaleDateString('en-IN')}
                </span>
              )}
              {selectedSeverity !== 'all' && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {severityOptions?.find(opt => opt?.value === selectedSeverity)?.label}
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {locationOptions?.find(opt => opt?.value === selectedLocation)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertTimelineHeader;