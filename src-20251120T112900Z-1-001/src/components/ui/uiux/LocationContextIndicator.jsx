import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const LocationContextIndicator = ({ 
  selectedLocation = "Current Location",
  recentLocations = [],
  onLocationChange = () => {},
  onLocationSearch = () => {},
  isLoading = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef?.current) {
      setTimeout(() => searchInputRef?.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery?.length > 2) {
      setIsSearching(true);
      const timeoutId = setTimeout(async () => {
        try {
          const results = await onLocationSearch(searchQuery);
          setSearchResults(results || []);
        } catch (error) {
          console.error('Location search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, onLocationSearch]);

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          onLocationChange({
            name: 'Current Location',
            coordinates: { lat: latitude, lng: longitude },
            type: 'current'
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  const formatLocationName = (location) => {
    if (typeof location === 'string') return location;
    return location?.name || location?.address || 'Unknown Location';
  };

  const getLocationIcon = (location) => {
    if (typeof location === 'string') {
      return location?.includes('Current') ? 'Navigation' : 'MapPin';
    }
    
    switch (location?.type) {
      case 'current':
        return 'Navigation';
      case 'city':
        return 'Building';
      case 'region':
        return 'Map';
      default:
        return 'MapPin';
    }
  };

  const defaultLocations = [
    { name: 'New York, NY', type: 'city', coordinates: { lat: 40.7128, lng: -74.0060 } },
    { name: 'Los Angeles, CA', type: 'city', coordinates: { lat: 34.0522, lng: -118.2437 } },
    { name: 'Chicago, IL', type: 'city', coordinates: { lat: 41.8781, lng: -87.6298 } },
    { name: 'Miami, FL', type: 'city', coordinates: { lat: 25.7617, lng: -80.1918 } },
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Location Display Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <Icon name="Loader2" size={16} className="text-primary animate-spin" />
        ) : (
          <Icon 
            name={getLocationIcon(selectedLocation)} 
            size={16} 
            className="text-primary" 
          />
        )}
        
        <span className="text-sm font-medium text-foreground max-w-32 lg:max-w-48 truncate">
          {formatLocationName(selectedLocation)}
        </span>
        
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-muted-foreground transition-transform duration-200" 
        />
      </Button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-layered z-1200 animate-fade-in">
          <div className="p-4">
            {/* Search Input */}
            <div className="mb-4">
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
                iconName="Search"
              />
            </div>

            {/* Current Location Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full justify-start"
              >
                <Icon name="Navigation" size={16} className="mr-2 text-primary" />
                Use Current Location
              </Button>
            </div>

            {/* Search Results */}
            {searchQuery?.length > 2 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Search Results</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                    </div>
                  ) : searchResults?.length > 0 ? (
                    searchResults?.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(result)}
                        className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Icon name={getLocationIcon(result)} size={14} className="mr-2 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {formatLocationName(result)}
                          </p>
                          {result?.region && (
                            <p className="text-xs text-muted-foreground truncate">
                              {result?.region}
                            </p>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No locations found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Locations */}
            {recentLocations?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Recent Locations</h4>
                <div className="space-y-1">
                  {recentLocations?.slice(0, 3)?.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Icon name={getLocationIcon(location)} size={14} className="mr-2 text-muted-foreground" />
                      <span className="text-sm text-foreground truncate">
                        {formatLocationName(location)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Locations */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Popular Locations</h4>
              <div className="space-y-1">
                {defaultLocations?.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Icon name={getLocationIcon(location)} size={14} className="mr-2 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {location?.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationContextIndicator;