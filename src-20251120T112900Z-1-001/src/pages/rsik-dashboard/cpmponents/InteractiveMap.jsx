import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ 
  selectedLocation = null,
  riskZones = [],
  onLocationSelect = () => {},
  onZoomChange = () => {},
  className = ""
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center

  // Mock risk zones data for India
  const mockRiskZones = [
    {
      id: 'mumbai-high',
      name: 'Mumbai Metropolitan',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      riskLevel: 'high',
      severity: 85,
      population: '12.4M',
      lastAlert: '2 hours ago',
      description: 'Heavy rainfall expected with cloudburst risk'
    },
    {
      id: 'delhi-moderate',
      name: 'Delhi NCR',
      coordinates: { lat: 28.7041, lng: 77.1025 },
      riskLevel: 'moderate',
      severity: 65,
      population: '32.9M',
      lastAlert: '6 hours ago',
      description: 'Moderate rainfall with flood potential'
    },
    {
      id: 'chennai-low',
      name: 'Chennai',
      coordinates: { lat: 13.0827, lng: 80.2707 },
      riskLevel: 'low',
      severity: 25,
      population: '7.1M',
      lastAlert: '1 day ago',
      description: 'Light showers expected'
    },
    {
      id: 'kolkata-moderate',
      name: 'Kolkata',
      coordinates: { lat: 22.5726, lng: 88.3639 },
      riskLevel: 'moderate',
      severity: 55,
      population: '4.5M',
      lastAlert: '4 hours ago',
      description: 'Thunderstorms with moderate risk'
    },
    {
      id: 'bangalore-low',
      name: 'Bangalore',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      riskLevel: 'low',
      severity: 30,
      population: '8.4M',
      lastAlert: '12 hours ago',
      description: 'Scattered showers possible'
    },
    {
      id: 'hyderabad-moderate',
      name: 'Hyderabad',
      coordinates: { lat: 17.3850, lng: 78.4867 },
      riskLevel: 'moderate',
      severity: 70,
      population: '6.9M',
      lastAlert: '3 hours ago',
      description: 'Heavy rain with urban flooding risk'
    }
  ];

  const zones = riskZones?.length > 0 ? riskZones : mockRiskZones;

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getRiskColor = (riskLevel, severity) => {
    switch (riskLevel) {
      case 'high':
        return {
          bg: 'bg-error',
          border: 'border-error',
          text: 'text-error',
          dot: 'bg-error',
          opacity: severity > 80 ? 'opacity-90' : 'opacity-75'
        };
      case 'moderate':
        return {
          bg: 'bg-warning',
          border: 'border-warning',
          text: 'text-warning',
          dot: 'bg-warning',
          opacity: severity > 60 ? 'opacity-80' : 'opacity-65'
        };
      case 'low':
        return {
          bg: 'bg-success',
          border: 'border-success',
          text: 'text-success',
          dot: 'bg-success',
          opacity: 'opacity-60'
        };
      default:
        return {
          bg: 'bg-muted-foreground',
          border: 'border-muted',
          text: 'text-muted-foreground',
          dot: 'bg-muted-foreground',
          opacity: 'opacity-50'
        };
    }
  };

  const handleZoneClick = (zone) => {
    setMapCenter(zone?.coordinates);
    setCurrentZoom(8);
    onLocationSelect(zone);
  };

  const handleZoomIn = () => {
    if (currentZoom < 10) {
      setCurrentZoom(prev => prev + 1);
      onZoomChange(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (currentZoom > 3) {
      setCurrentZoom(prev => prev - 1);
      onZoomChange(currentZoom - 1);
    }
  };

  const resetView = () => {
    setMapCenter({ lat: 20.5937, lng: 78.9629 });
    setCurrentZoom(5);
    onLocationSelect(null);
  };

  return (
    <div className={`relative bg-card rounded-xl border border-border overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <Icon name="Map" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Risk Zone Map</h3>
          <span className="text-sm text-muted-foreground">
            Zoom: {currentZoom}x
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="RotateCcw" size={16} className="mr-1" />
            Reset
          </Button>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={currentZoom <= 3}
            >
              <Icon name="Minus" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={currentZoom >= 10}
            >
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 lg:h-[500px] bg-slate-100">
        {!mapLoaded ? (
          // Loading State
          (<div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin text-primary mb-2 mx-auto" />
              <p className="text-sm text-muted-foreground">Loading interactive map...</p>
            </div>
          </div>)
        ) : (
          // Map with Google Maps Embed
          (<div className="relative w-full h-full">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="India Risk Zone Map"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${currentZoom + 5}&output=embed`}
              className="absolute inset-0"
            />
            {/* Risk Zone Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {zones?.map((zone) => {
                const colors = getRiskColor(zone?.riskLevel, zone?.severity);
                
                // Calculate position based on coordinates (simplified positioning)
                const xPos = ((zone?.coordinates?.lng - 68) / (97 - 68)) * 100;
                const yPos = ((35 - zone?.coordinates?.lat) / (35 - 8)) * 100;
                
                return (
                  <div
                    key={zone?.id}
                    className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${Math.max(5, Math.min(95, xPos))}%`,
                      top: `${Math.max(5, Math.min(95, yPos))}%`
                    }}
                    onClick={() => handleZoneClick(zone)}
                  >
                    {/* Risk Zone Marker */}
                    <div className={`
                      relative w-6 h-6 rounded-full ${colors?.bg} ${colors?.opacity}
                      border-2 border-white shadow-lg hover:scale-110 transition-transform
                      ${selectedLocation?.id === zone?.id ? 'ring-4 ring-primary/30' : ''}
                    `}>
                      {/* Pulse Animation for High Risk */}
                      {zone?.riskLevel === 'high' && (
                        <div className={`
                          absolute inset-0 rounded-full ${colors?.bg} animate-ping opacity-40
                        `} />
                      )}
                      
                      {/* Severity Indicator */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-800">
                          {Math.round(zone?.severity / 10)}
                        </span>
                      </div>
                    </div>
                    {/* Zone Label */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-gray-200">
                        <p className="text-xs font-medium text-gray-800">
                          {zone?.name}
                        </p>
                        <p className={`text-xs ${colors?.text}`}>
                          {zone?.severity}% Risk
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>)
        )}
      </div>
      {/* Map Legend */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Risk Levels:</span>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Low (0-40%)</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Moderate (41-75%)</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <span className="text-xs text-muted-foreground">High (76-100%)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Updated: {new Date()?.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>
      </div>
      {/* Selected Zone Info Panel */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 w-72 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-layered p-4 z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-foreground">{selectedLocation?.name}</h4>
              <p className="text-sm text-muted-foreground">Population: {selectedLocation?.population}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLocationSelect(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getRiskColor(selectedLocation?.riskLevel)?.dot}`} />
                <span className={`text-sm font-medium capitalize ${getRiskColor(selectedLocation?.riskLevel)?.text}`}>
                  {selectedLocation?.riskLevel}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Severity:</span>
              <span className="text-sm font-medium text-foreground">{selectedLocation?.severity}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Alert:</span>
              <span className="text-sm text-foreground">{selectedLocation?.lastAlert}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
            {selectedLocation?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;