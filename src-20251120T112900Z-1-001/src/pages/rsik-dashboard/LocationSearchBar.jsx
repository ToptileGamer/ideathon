import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const LocationSearchBar = ({ 
  onLocationSelect = () => {},
  onCurrentLocation = () => {},
  recentSearches = [],
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mock location data for India
  const mockLocations = [
    {
      id: 'mumbai',
      name: 'Mumbai',
      state: 'Maharashtra',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      type: 'city',
      population: '12.4M',
      riskLevel: 'high'
    },
    {
      id: 'delhi',
      name: 'New Delhi',
      state: 'Delhi',
      coordinates: { lat: 28.7041, lng: 77.1025 },
      type: 'city',
      population: '32.9M',
      riskLevel: 'moderate'
    },
    {
      id: 'bangalore',
      name: 'Bangalore',
      state: 'Karnataka',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      type: 'city',
      population: '8.4M',
      riskLevel: 'low'
    },
    {
      id: 'chennai',
      name: 'Chennai',
      state: 'Tamil Nadu',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      type: 'city',
      population: '7.1M',
      riskLevel: 'low'
    },
    {
      id: 'kolkata',
      name: 'Kolkata',
      state: 'West Bengal',
      coordinates: { lat: 22.5726, lng: 88.3639 },
      type: 'city',
      population: '4.5M',
      riskLevel: 'moderate'
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad',
      state: 'Telangana',
      coordinates: { lat: 17.3850, lng: 78.4867 },
      type: 'city',
      population: '6.9M',
      riskLevel: 'moderate'
    },
    {
      id: 'pune',
      name: 'Pune',
      state: 'Maharashtra',
      coordinates: { lat: 18.5204, lng: 73.8567 },
      type: 'city',
      population: '3.1M',
      riskLevel: 'moderate'
    },
    {
      id: 'ahmedabad',
      name: 'Ahmedabad',
      state: 'Gujarat',
      coordinates: { lat: 23.0225, lng: 72.5714 },
      type: 'city',
      population: '5.6M',
      riskLevel: 'low'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality with debouncing
  useEffect(() => {
    if (searchQuery?.length > 1) {
      setIsSearching(true);
      setShowDropdown(true);
      
      const timeoutId = setTimeout(() => {
        const filtered = mockLocations?.filter(location =>
          location?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          location?.state?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
      if (searchQuery?.length === 0) {
        setShowDropdown(false);
      }
    }
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    setSearchQuery(location?.name);
    setShowDropdown(false);
    onLocationSelect(location);
  };

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          const currentLocation = {
            id: 'current',
            name: 'Current Location',
            coordinates: { lat: latitude, lng: longitude },
            type: 'current'
          };
          
          setSearchQuery('Current Location');
          onCurrentLocation(currentLocation);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery?.length > 1 || recentSearches?.length > 0) {
      setShowDropdown(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    searchRef?.current?.focus();
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'moderate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon name="Search" size={18} className="text-muted-foreground" />
        </div>
        
        <Input
          ref={searchRef}
          type="search"
          placeholder="Search locations in India..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          onFocus={handleInputFocus}
          className="pl-10 pr-20 h-12 text-base"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCurrentLocation}
            disabled={isGettingLocation}
            className="h-8 px-2"
            title="Use current location"
          >
            {isGettingLocation ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Navigation" size={16} />
            )}
          </Button>
        </div>
      </div>
      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-layered z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Searching locations...</span>
            </div>
          ) : (
            <div className="py-2">
              {/* Recent Searches */}
              {searchQuery?.length === 0 && recentSearches?.length > 0 && (
                <div className="px-3 py-2 border-b border-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {recentSearches?.slice(0, 3)?.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className="flex items-center w-full px-2 py-2 text-left rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Icon name="Clock" size={14} className="mr-2 text-muted-foreground" />
                        <span className="text-sm text-foreground">{location?.name}</span>
                        {location?.state && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {location?.state}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults?.length > 0 ? (
                <div className="px-3 py-2">
                  {searchQuery?.length > 1 && (
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Search Results
                    </h4>
                  )}
                  <div className="space-y-1">
                    {searchResults?.map((location) => (
                      <button
                        key={location?.id}
                        onClick={() => handleLocationSelect(location)}
                        className="flex items-center w-full px-2 py-3 text-left rounded-md hover:bg-muted/50 transition-colors group"
                      >
                        <Icon name="MapPin" size={16} className="mr-3 text-muted-foreground group-hover:text-primary" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-foreground truncate">
                              {location?.name}
                            </span>
                            {location?.riskLevel && (
                              <span className={`
                                px-2 py-0.5 text-xs font-medium rounded-full border
                                ${getRiskBadgeColor(location?.riskLevel)}
                              `}>
                                {location?.riskLevel}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {location?.state}
                            </span>
                            {location?.population && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {location?.population}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Icon name="ChevronRight" size={14} className="text-muted-foreground group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchQuery?.length > 1 ? (
                <div className="px-3 py-8 text-center">
                  <Icon name="MapPin" size={24} className="text-muted-foreground mb-2 mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    No locations found for "{searchQuery}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching for major Indian cities or states
                  </p>
                </div>
              ) : null}

              {/* Popular Locations */}
              {searchQuery?.length === 0 && (
                <div className="px-3 py-2 border-t border-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Popular Locations
                  </h4>
                  <div className="space-y-1">
                    {mockLocations?.slice(0, 4)?.map((location) => (
                      <button
                        key={location?.id}
                        onClick={() => handleLocationSelect(location)}
                        className="flex items-center w-full px-2 py-2 text-left rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Icon name="TrendingUp" size={14} className="mr-2 text-muted-foreground" />
                        <span className="text-sm text-foreground">{location?.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {location?.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchBar;