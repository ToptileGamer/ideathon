import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AlertStatusBanner from '../../components/ui/AlertStatusBanner';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import InteractiveMap from './components/InteractiveMap';
import WeatherInfoCards from './components/WeatherInfoCards';
import TimelineChart from './components/TimelineChart';
import LocationSearchBar from './components/LocationSearchBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RiskDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [recentSearches, setRecentSearches] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock active alerts data
  const mockAlerts = [
    {
      id: 'alert-001',
      title: 'Heavy Rainfall Warning',
      message: 'Intense rainfall expected in Mumbai region with cloudburst potential. Avoid low-lying areas and stay indoors.',
      severity: 'high',
      timestamp: Date.now() - 7200000, // 2 hours ago
      location: 'Mumbai Metropolitan Area',
      details: `Heavy to very heavy rainfall is expected to continue for the next 6-8 hours. Current rainfall rate: 45mm/hr. \n\nFlood risk is elevated in areas like Kurla, Sion, and Hindmata. Emergency services are on high alert.`,
      type: 'weather'
    },
    {
      id: 'alert-002',
      title: 'Flood Advisory',
      message: 'Urban flooding reported in low-lying areas of Delhi NCR due to continuous rainfall.',
      severity: 'moderate',
      timestamp: Date.now() - 14400000, // 4 hours ago
      location: 'Delhi NCR',
      details: 'Water logging reported in several areas including CP, Karol Bagh, and Lajpat Nagar. Traffic diversions in effect.',
      type: 'flood'
    }
  ];

  useEffect(() => {
    setActiveAlerts(mockAlerts);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setConnectionStatus(prev => prev === 'connected' ? 'connected' : 'reconnecting');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    
    // Add to recent searches if not already present
    if (location && !recentSearches?.find(item => item?.id === location?.id)) {
      setRecentSearches(prev => [location, ...prev?.slice(0, 4)]);
    }
  };

  const handleCurrentLocation = (location) => {
    setSelectedLocation(location);
  };

  const handleLocationSearch = async (query) => {
    // Mock search implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = [
          {
            id: 'search-1',
            name: `${query} City`,
            state: 'Search Result',
            coordinates: { lat: 20 + Math.random() * 10, lng: 75 + Math.random() * 10 },
            type: 'city'
          }
        ];
        resolve(mockResults);
      }, 500);
    });
  };

  const handleAlertDismiss = (alertId) => {
    setActiveAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleAlertDetails = (alert) => {
    // Navigate to alert details or show modal
    console.log('View alert details:', alert);
  };

  const handleTestAlert = async () => {
    const testAlert = {
      id: `test-${Date.now()}`,
      title: 'Test Alert',
      message: 'This is a test alert to verify system functionality.',
      severity: 'low',
      timestamp: Date.now(),
      location: selectedLocation?.name || 'Current Location',
      type: 'test'
    };
    
    setActiveAlerts(prev => [testAlert, ...prev]);
  };

  const handleReportIncident = () => {
    // Navigate to incident reporting page
    console.log('Report incident');
  };

  const handleDownloadData = async () => {
    // Simulate data download
    console.log('Downloading weather data...');
  };

  const handleRefreshData = async () => {
    setConnectionStatus('reconnecting');
    
    setTimeout(() => {
      setLastUpdate(new Date());
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleShareLocation = () => {
    if (selectedLocation) {
      const shareData = {
        title: 'CloudGuard Location',
        text: `Current weather monitoring: ${selectedLocation?.name}`,
        url: window.location?.href
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard?.writeText(shareData?.url);
      }
    }
  };

  const handleExportReport = () => {
    console.log('Exporting weather report...');
  };

  const handleNavigation = (path) => {
    // Handle navigation - would typically use React Router
    console.log('Navigate to:', path);
  };

  return (
    <div className="min-h-screen bg-background weather-pattern">
      {/* Header */}
      <Header
        alertCount={activeAlerts?.length}
        selectedLocation={selectedLocation?.name || "Select Location"}
        connectionStatus={connectionStatus}
        onNavigate={handleNavigation}
      />
      {/* Alert Banner */}
      <AlertStatusBanner
        alerts={activeAlerts}
        onDismiss={handleAlertDismiss}
        onViewDetails={handleAlertDetails}
      />
      {/* Quick Actions Toolbar */}
      <QuickActionToolbar
        currentScreen="risk-dashboard"
        onTestAlert={handleTestAlert}
        onReportIncident={handleReportIncident}
        onDownloadData={handleDownloadData}
        onRefreshData={handleRefreshData}
        onShareLocation={handleShareLocation}
        onExportReport={handleExportReport}
      />
      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Risk Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time weather monitoring and cloudburst prediction for India
            </p>
          </div>

          {/* Location Search */}
          <div className="w-full lg:w-96">
            <LocationSearchBar
              onLocationSelect={handleLocationSelect}
              onCurrentLocation={handleCurrentLocation}
              onLocationSearch={handleLocationSearch}
              recentSearches={recentSearches}
            />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Map and Timeline */}
          <div className="xl:col-span-2 space-y-6">
            {/* Interactive Map */}
            <InteractiveMap
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              className="h-full"
            />

            {/* Timeline Chart */}
            <TimelineChart
              selectedLocation={selectedLocation}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>

          {/* Right Column - Weather Cards */}
          <div className="xl:col-span-1">
            <WeatherInfoCards
              selectedLocation={selectedLocation}
              refreshInterval={30000}
            />
          </div>
        </div>

        {/* Emergency Actions */}
        {activeAlerts?.some(alert => alert?.severity === 'high') && (
          <div className="bg-error/5 border border-error/20 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-error" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-error mb-2">
                  High Risk Alert Active
                </h3>
                <p className="text-sm text-error/80 mb-4">
                  Severe weather conditions detected. Take immediate precautionary measures and stay informed.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="border-error text-error hover:bg-error/10">
                    <Icon name="Phone" size={16} className="mr-2" />
                    Emergency Contacts
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-error text-error hover:bg-error/10">
                    <Icon name="MapPin" size={16} className="mr-2" />
                    Nearest Shelter
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-error text-error hover:bg-error/10">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Safety Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Icon name="MapPin" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {selectedLocation ? '1' : '0'}
            </p>
            <p className="text-sm text-muted-foreground">Active Location</p>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Icon name="AlertTriangle" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {activeAlerts?.length}
            </p>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Icon name="Clock" size={24} className="text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {lastUpdate?.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">Last Update</p>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Icon name="Wifi" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground capitalize">
              {connectionStatus}
            </p>
            <p className="text-sm text-muted-foreground">Connection</p>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="font-semibold text-foreground">CloudGuard</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} Disaster Management Platform
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Powered by AI Weather Prediction</span>
              <span>•</span>
              <span>Real-time Monitoring</span>
              <span>•</span>
              <span>Emergency Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RiskDashboard;
