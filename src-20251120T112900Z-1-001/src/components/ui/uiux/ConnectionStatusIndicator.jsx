import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectionStatusIndicator = ({ 
  connectionStatus = 'connected',
  lastUpdate = new Date(),
  dataFreshness = 'live',
  onRetry = () => {},
  showDetails = true,
  className = ""
}) => {
  const [displayTime, setDisplayTime] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  // Update display time every minute
  useEffect(() => {
    const updateDisplayTime = () => {
      const now = new Date();
      const diff = Math.floor((now - new Date(lastUpdate)) / 1000 / 60);
      
      if (diff < 1) {
        setDisplayTime('Just now');
      } else if (diff === 1) {
        setDisplayTime('1 min ago');
      } else if (diff < 60) {
        setDisplayTime(`${diff} mins ago`);
      } else {
        const hours = Math.floor(diff / 60);
        if (hours === 1) {
          setDisplayTime('1 hour ago');
        } else if (hours < 24) {
          setDisplayTime(`${hours} hours ago`);
        } else {
          setDisplayTime('Over 24h ago');
        }
      }
    };

    updateDisplayTime();
    const interval = setInterval(updateDisplayTime, 60000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'Wifi',
          label: 'Connected',
          description: 'Real-time data streaming',
          dotColor: 'bg-success',
          showPulse: dataFreshness === 'live'
        };
      case 'reconnecting':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'WifiOff',
          label: 'Reconnecting',
          description: 'Attempting to restore connection',
          dotColor: 'bg-warning',
          showPulse: true
        };
      case 'disconnected':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'WifiOff',
          label: 'Offline',
          description: 'No connection available',
          dotColor: 'bg-error',
          showPulse: false
        };
      case 'limited':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20',
          icon: 'Wifi',
          label: 'Limited',
          description: 'Reduced functionality',
          dotColor: 'bg-accent',
          showPulse: false
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          icon: 'HelpCircle',
          label: 'Unknown',
          description: 'Status unavailable',
          dotColor: 'bg-muted-foreground',
          showPulse: false
        };
    }
  };

  const config = getStatusConfig();

  const handleRetry = async () => {
    if (connectionStatus === 'disconnected' && !isRetrying) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (error) {
        console.error('Retry connection failed:', error);
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const getFreshnessIndicator = () => {
    switch (dataFreshness) {
      case 'live':
        return { label: 'Live', color: 'text-success' };
      case 'recent':
        return { label: 'Recent', color: 'text-warning' };
      case 'stale':
        return { label: 'Stale', color: 'text-error' };
      default:
        return { label: 'Unknown', color: 'text-muted-foreground' };
    }
  };

  const freshness = getFreshnessIndicator();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Compact Status Indicator */}
      <div className={`
        flex items-center space-x-2 px-3 py-1.5 rounded-lg border
        ${config?.bgColor} ${config?.borderColor} transition-all duration-200
      `}>
        {/* Status Dot with Pulse */}
        <div className="relative">
          <div className={`
            w-2 h-2 rounded-full ${config?.dotColor}
            ${config?.showPulse ? 'animate-pulse' : ''}
          `} />
          {config?.showPulse && (
            <div className={`
              absolute inset-0 w-2 h-2 rounded-full ${config?.dotColor} 
              animate-ping opacity-75
            `} />
          )}
        </div>

        {/* Status Text */}
        {showDetails ? (
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium ${config?.color}`}>
              {config?.label}
            </span>
            
            {connectionStatus === 'connected' && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className={`text-xs ${freshness?.color}`}>
                  {freshness?.label}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {displayTime}
                </span>
              </>
            )}

            {connectionStatus === 'reconnecting' && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <Icon name="Loader2" size={12} className="animate-spin text-warning" />
              </>
            )}

            {connectionStatus === 'disconnected' && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </button>
              </>
            )}
          </div>
        ) : (
          <Icon 
            name={isRetrying ? "Loader2" : config?.icon} 
            size={14} 
            className={`${config?.color} ${isRetrying ? 'animate-spin' : ''}`} 
          />
        )}
      </div>
      {/* Detailed Status Tooltip (Desktop) */}
      {showDetails && (
        <div className="hidden lg:block relative group">
          <Icon 
            name="Info" 
            size={14} 
            className="text-muted-foreground cursor-help" 
          />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-popover border border-border rounded-lg shadow-layered opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-1200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-popover-foreground">
                  Connection Status
                </span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${config?.dotColor}`} />
                  <span className={`text-xs ${config?.color}`}>
                    {config?.label}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {config?.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Update:</span>
                <span className="text-popover-foreground">{displayTime}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Data Quality:</span>
                <span className={freshness?.color}>{freshness?.label}</span>
              </div>

              {connectionStatus === 'connected' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Next Update:</span>
                  <span className="text-popover-foreground">
                    {dataFreshness === 'live' ? 'Continuous' : '5 min'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;