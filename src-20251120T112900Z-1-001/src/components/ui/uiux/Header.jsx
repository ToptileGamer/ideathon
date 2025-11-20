import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ 
  currentUser = null, 
  alertCount = 0, 
  selectedLocation = "Current Location", 
  connectionStatus = "connected",
  onNavigate = () => {},
  className = ""
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Update timestamp every minute for connection status
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === 'connected') {
        setLastUpdate(new Date());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/risk-dashboard',
      icon: 'Gauge',
      badge: null,
      tooltip: 'Real-time weather monitoring and risk assessment'
    },
    {
      label: 'Alerts',
      path: '/alert-timeline',
      icon: 'AlertTriangle',
      badge: alertCount > 0 ? alertCount : null,
      tooltip: 'Current and historical weather alerts'
    },
    {
      label: 'History',
      path: '/historical-weather-data',
      icon: 'Clock',
      badge: null,
      tooltip: 'Historical weather patterns and trends'
    },
    {
      label: 'Emergency',
      path: '/emergency-information',
      icon: 'Phone',
      badge: null,
      tooltip: 'Emergency contacts and safety resources'
    }
  ];

  const secondaryItems = [
    {
      label: 'About',
      path: '/about',
      icon: 'Info',
      tooltip: 'Platform information and team details'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings',
      tooltip: 'Application preferences and configuration'
    },
    {
      label: 'Help',
      path: '/help',
      icon: 'HelpCircle',
      tooltip: 'User guides and support resources'
    }
  ];

  const handleNavigation = (path) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'disconnected':
        return 'text-error';
      case 'reconnecting':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 min ago';
    if (diff < 60) return `${diff} mins ago`;
    
    const hours = Math.floor(diff / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <>
      <header className={`nav-sticky bg-card/95 glass-effect border-b border-border ${className}`}>
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                CloudGuard
              </h1>
              <span className="text-xs text-muted-foreground font-medium">
                Disaster Management
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                className="relative px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={18} className="mr-2" />
                {item?.label}
                {item?.badge && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error rounded-full animate-pulse">
                    {item?.badge > 99 ? '99+' : item?.badge}
                  </span>
                )}
              </Button>
            ))}
            
            {/* More Menu */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="px-4 py-2 text-sm font-medium"
              >
                <Icon name="MoreHorizontal" size={18} className="mr-2" />
                More
              </Button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-layered opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-1200">
                <div className="py-2">
                  {secondaryItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted/50 transition-colors"
                      title={item?.tooltip}
                    >
                      <Icon name={item?.icon} size={16} className="mr-3" />
                      {item?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Location Context & Connection Status */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Location Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground max-w-32 truncate">
                {selectedLocation}
              </span>
              <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-success' : 
                connectionStatus === 'reconnecting' ? 'bg-warning animate-pulse' : 'bg-error'
              }`} />
              <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
                {connectionStatus === 'connected' ? formatLastUpdate() : 
                 connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/98 glass-effect">
            <div className="px-4 py-4 space-y-2">
              {/* Location & Status on Mobile */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {selectedLocation}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-success' : 
                    connectionStatus === 'reconnecting' ? 'bg-warning animate-pulse' : 'bg-error'
                  }`} />
                  <span className={`text-xs ${getConnectionStatusColor()}`}>
                    {connectionStatus === 'connected' ? 'Live' : 
                     connectionStatus === 'reconnecting' ? 'Syncing' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              {[...navigationItems, ...secondaryItems]?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className="flex items-center justify-between w-full px-3 py-3 text-left rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </div>
                  {item?.badge && (
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-error rounded-full">
                      {item?.badge > 99 ? '99+' : item?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden bottom-nav bg-card/95 glass-effect border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className="relative flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors min-w-0 flex-1"
            >
              <Icon name={item?.icon} size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">{item?.label}</span>
              {item?.badge && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-error rounded-full">
                  {item?.badge > 9 ? '9+' : item?.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;