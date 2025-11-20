import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertStatusBanner = ({ 
  alerts = [], 
  onDismiss = () => {},
  onViewDetails = () => {},
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Show banner when there are active alerts
  useEffect(() => {
    setIsVisible(alerts?.length > 0);
    setCurrentAlertIndex(0);
  }, [alerts]);

  // Auto-rotate through multiple alerts
  useEffect(() => {
    if (alerts?.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts?.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [alerts?.length]);

  if (!isVisible || alerts?.length === 0) {
    return null;
  }

  const currentAlert = alerts?.[currentAlertIndex];
  
  const getSeverityConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': case'high':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          iconColor: 'text-error',
          icon: 'AlertTriangle',
          pulseClass: 'alert-pulse'
        };
      case 'moderate': case'medium':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          iconColor: 'text-warning',
          icon: 'AlertCircle',
          pulseClass: ''
        };
      case 'low': case'minor':
        return {
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          textColor: 'text-accent',
          iconColor: 'text-accent',
          icon: 'Info',
          pulseClass: ''
        };
      default:
        return {
          bgColor: 'bg-muted/50',
          borderColor: 'border-border',
          textColor: 'text-foreground',
          iconColor: 'text-muted-foreground',
          icon: 'Bell',
          pulseClass: ''
        };
    }
  };

  const config = getSeverityConfig(currentAlert?.severity);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss(currentAlert?.id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`alert-banner ${className}`}>
      <div className={`
        ${config?.bgColor} ${config?.borderColor} border-b-2 
        ${config?.pulseClass} transition-all duration-300 ease-out
      `}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Alert Content */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Severity Icon */}
              <div className={`flex-shrink-0 ${config?.iconColor}`}>
                <Icon name={config?.icon} size={24} strokeWidth={2} />
              </div>

              {/* Alert Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className={`font-semibold ${config?.textColor} truncate`}>
                    {currentAlert?.title || 'Weather Alert'}
                  </h3>
                  
                  {/* Severity Badge */}
                  <span className={`
                    px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-full
                    ${config?.bgColor} ${config?.textColor} border ${config?.borderColor}
                  `}>
                    {currentAlert?.severity || 'Alert'}
                  </span>

                  {/* Timestamp */}
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {formatTime(currentAlert?.timestamp || Date.now())}
                  </span>

                  {/* Multiple Alerts Indicator */}
                  {alerts?.length > 1 && (
                    <span className="text-sm text-muted-foreground hidden md:inline">
                      {currentAlertIndex + 1} of {alerts?.length}
                    </span>
                  )}
                </div>

                {/* Alert Message */}
                <p className={`text-sm mt-1 ${isExpanded ? '' : 'truncate'} ${config?.textColor}`}>
                  {currentAlert?.message || 'Weather conditions require attention. Stay informed and follow safety guidelines.'}
                </p>

                {/* Expanded Details */}
                {isExpanded && currentAlert?.details && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>{currentAlert?.details}</p>
                    {currentAlert?.location && (
                      <p className="mt-1">
                        <Icon name="MapPin" size={14} className="inline mr-1" />
                        {currentAlert?.location}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Expand/Collapse Button */}
              {(currentAlert?.details || currentAlert?.location) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`${config?.textColor} hover:bg-white/20 hidden sm:flex`}
                >
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </Button>
              )}

              {/* View Details Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(currentAlert)}
                className={`
                  ${config?.textColor} ${config?.borderColor} 
                  hover:bg-white/20 border hidden md:flex
                `}
              >
                <Icon name="ExternalLink" size={14} className="mr-1" />
                Details
              </Button>

              {/* Navigation Dots for Multiple Alerts */}
              {alerts?.length > 1 && (
                <div className="flex items-center space-x-1 hidden lg:flex">
                  {alerts?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAlertIndex(index)}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-200
                        ${index === currentAlertIndex 
                          ? config?.textColor?.replace('text-', 'bg-')
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }
                      `}
                    />
                  ))}
                </div>
              )}

              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className={`${config?.textColor} hover:bg-white/20`}
                title="Dismiss alert"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Mobile Expanded View */}
          {isExpanded && (
            <div className="sm:hidden pb-3 border-t border-white/20 pt-3 mt-2">
              {currentAlert?.details && (
                <p className="text-sm text-muted-foreground mb-2">
                  {currentAlert?.details}
                </p>
              )}
              {currentAlert?.location && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {currentAlert?.location}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(currentAlert)}
                  className={`${config?.textColor} ${config?.borderColor} border`}
                >
                  <Icon name="ExternalLink" size={14} className="mr-1" />
                  View Full Details
                </Button>
                {alerts?.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    Alert {currentAlertIndex + 1} of {alerts?.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertStatusBanner;