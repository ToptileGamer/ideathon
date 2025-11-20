import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({
  alert = {},
  onViewDetails = () => {},
  onExportAlert = () => {},
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bgColor: 'bg-error/5',
          borderColor: 'border-l-error',
          textColor: 'text-error',
          badgeColor: 'bg-error text-error-foreground',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          bgColor: 'bg-error/5',
          borderColor: 'border-l-error',
          textColor: 'text-error',
          badgeColor: 'bg-error text-error-foreground',
          icon: 'AlertCircle'
        };
      case 'moderate':
        return {
          bgColor: 'bg-warning/5',
          borderColor: 'border-l-warning',
          textColor: 'text-warning',
          badgeColor: 'bg-warning text-warning-foreground',
          icon: 'AlertCircle'
        };
      case 'low':
        return {
          bgColor: 'bg-accent/5',
          borderColor: 'border-l-accent',
          textColor: 'text-accent',
          badgeColor: 'bg-accent text-accent-foreground',
          icon: 'Info'
        };
      default:
        return {
          bgColor: 'bg-muted/5',
          borderColor: 'border-l-muted-foreground',
          textColor: 'text-muted-foreground',
          badgeColor: 'bg-muted text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const config = getSeverityConfig(alert?.severity);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date?.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'Ongoing';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = Math.floor((end - start) / (1000 * 60 * 60));
    const diffMinutes = Math.floor(((end - start) % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const { date, time } = formatDate(alert?.timestamp || Date.now());

  return (
    <div className={`
      bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200
      ${config?.bgColor} border-l-4 ${config?.borderColor} ${className}
    `}>
      <div className="p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Severity Icon */}
            <div className={`flex-shrink-0 mt-0.5 ${config?.textColor}`}>
              <Icon name={config?.icon} size={20} strokeWidth={2} />
            </div>

            {/* Alert Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {alert?.title || 'Weather Alert'}
                </h3>
                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${config?.badgeColor}`}>
                  {alert?.severity || 'Alert'}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {alert?.description || 'Weather conditions require attention in the specified area.'}
              </p>

              {/* Location and Time */}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{alert?.location || 'Multiple Areas'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{date} at {time}</span>
                </div>
                {alert?.duration && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Timer" size={12} />
                    <span>{formatDuration(alert?.timestamp, alert?.endTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(alert)}
              iconName="ExternalLink"
              title="View full details"
            />
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-border/50 pt-3 mt-3 space-y-3">
            {/* Detailed Information */}
            {alert?.details && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Details</h4>
                <p className="text-sm text-muted-foreground">{alert?.details}</p>
              </div>
            )}

            {/* Weather Data */}
            {alert?.weatherData && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Weather Conditions</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {alert?.weatherData?.rainfall && (
                    <div className="flex items-center space-x-2">
                      <Icon name="CloudRain" size={14} className="text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {alert?.weatherData?.rainfall}mm
                      </span>
                    </div>
                  )}
                  {alert?.weatherData?.windSpeed && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Wind" size={14} className="text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {alert?.weatherData?.windSpeed} km/h
                      </span>
                    </div>
                  )}
                  {alert?.weatherData?.temperature && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Thermometer" size={14} className="text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {alert?.weatherData?.temperature}°C
                      </span>
                    </div>
                  )}
                  {alert?.weatherData?.humidity && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Droplets" size={14} className="text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {alert?.weatherData?.humidity}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Affected Areas */}
            {alert?.affectedAreas && alert?.affectedAreas?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Affected Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {alert?.affectedAreas?.map((area, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Alert ID:</span>
                <span className="text-xs font-mono text-foreground">
                  {alert?.id || 'ALT-' + Date.now()?.toString()?.slice(-6)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportAlert(alert)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onViewDetails(alert)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCard;