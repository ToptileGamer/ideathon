import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WeatherInfoCards = ({ 
  selectedLocation = null,
  refreshInterval = 30000,
  className = ""
}) => {
  const [weatherData, setWeatherData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Mock weather data based on location
  const generateWeatherData = (location) => {
    const baseData = {
      rainfall: {
        current: Math.floor(Math.random() * 50) + 10,
        unit: 'mm/hr',
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        forecast24h: Math.floor(Math.random() * 200) + 50
      },
      humidity: {
        current: Math.floor(Math.random() * 40) + 60,
        unit: '%',
        trend: Math.random() > 0.5 ? 'stable' : 'increasing',
        comfort: 'high'
      },
      temperature: {
        current: Math.floor(Math.random() * 15) + 20,
        unit: '°C',
        feelsLike: Math.floor(Math.random() * 15) + 22,
        trend: Math.random() > 0.5 ? 'rising' : 'falling'
      },
      windSpeed: {
        current: Math.floor(Math.random() * 20) + 5,
        unit: 'km/h',
        direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']?.[Math.floor(Math.random() * 8)],
        gusts: Math.floor(Math.random() * 30) + 10
      },
      cloudburstRisk: {
        current: Math.floor(Math.random() * 60) + 20,
        unit: '%',
        level: 'moderate',
        nextHours: Math.floor(Math.random() * 6) + 2
      },
      pressure: {
        current: Math.floor(Math.random() * 50) + 1000,
        unit: 'hPa',
        trend: Math.random() > 0.5 ? 'falling' : 'rising'
      }
    };

    // Adjust based on location risk level
    if (location?.riskLevel === 'high') {
      baseData.rainfall.current = Math.floor(Math.random() * 30) + 40;
      baseData.cloudburstRisk.current = Math.floor(Math.random() * 20) + 70;
      baseData.cloudburstRisk.level = 'high';
    } else if (location?.riskLevel === 'low') {
      baseData.rainfall.current = Math.floor(Math.random() * 15) + 5;
      baseData.cloudburstRisk.current = Math.floor(Math.random() * 30) + 10;
      baseData.cloudburstRisk.level = 'low';
    }

    return baseData;
  };

  useEffect(() => {
    const updateWeatherData = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const newData = generateWeatherData(selectedLocation);
        setWeatherData(newData);
        setLastUpdate(new Date());
        setIsLoading(false);
      }, 1000);
    };

    updateWeatherData();
    
    const interval = setInterval(updateWeatherData, refreshInterval);
    return () => clearInterval(interval);
  }, [selectedLocation, refreshInterval]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': case'rising':
        return 'TrendingUp';
      case 'decreasing': case'falling':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
      default:
        return 'Activity';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': case'rising':
        return 'text-error';
      case 'decreasing': case'falling':
        return 'text-success';
      case 'stable':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'moderate':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  if (isLoading || !weatherData) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="w-6 h-6 bg-muted rounded" />
              <div className="w-16 h-4 bg-muted rounded" />
            </div>
            <div className="w-20 h-8 bg-muted rounded mb-2" />
            <div className="w-24 h-4 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const weatherCards = [
    {
      id: 'rainfall',
      title: 'Rainfall',
      icon: 'CloudRain',
      value: weatherData?.rainfall?.current,
      unit: weatherData?.rainfall?.unit,
      trend: weatherData?.rainfall?.trend,
      subtitle: `${weatherData?.rainfall?.forecast24h}mm expected in 24h`,
      color: 'text-blue-600'
    },
    {
      id: 'humidity',
      title: 'Humidity',
      icon: 'Droplets',
      value: weatherData?.humidity?.current,
      unit: weatherData?.humidity?.unit,
      trend: weatherData?.humidity?.trend,
      subtitle: `${weatherData?.humidity?.comfort} comfort level`,
      color: 'text-cyan-600'
    },
    {
      id: 'temperature',
      title: 'Temperature',
      icon: 'Thermometer',
      value: weatherData?.temperature?.current,
      unit: weatherData?.temperature?.unit,
      trend: weatherData?.temperature?.trend,
      subtitle: `Feels like ${weatherData?.temperature?.feelsLike}°C`,
      color: 'text-orange-600'
    },
    {
      id: 'wind',
      title: 'Wind Speed',
      icon: 'Wind',
      value: weatherData?.windSpeed?.current,
      unit: weatherData?.windSpeed?.unit,
      trend: 'stable',
      subtitle: `${weatherData?.windSpeed?.direction}, gusts ${weatherData?.windSpeed?.gusts}km/h`,
      color: 'text-green-600'
    },
    {
      id: 'cloudburst',
      title: 'Cloudburst Risk',
      icon: 'Zap',
      value: weatherData?.cloudburstRisk?.current,
      unit: weatherData?.cloudburstRisk?.unit,
      trend: 'increasing',
      subtitle: `Peak risk in ${weatherData?.cloudburstRisk?.nextHours} hours`,
      color: 'text-red-600',
      isRisk: true,
      riskLevel: weatherData?.cloudburstRisk?.level
    },
    {
      id: 'pressure',
      title: 'Pressure',
      icon: 'Gauge',
      value: weatherData?.pressure?.current,
      unit: weatherData?.pressure?.unit,
      trend: weatherData?.pressure?.trend,
      subtitle: 'Atmospheric pressure',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Cloud" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Weather Conditions</h3>
          {selectedLocation && (
            <span className="text-sm text-muted-foreground">
              • {selectedLocation?.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>
            Updated: {lastUpdate?.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherCards?.map((card) => (
          <div
            key={card?.id}
            className={`
              bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow
              ${card?.isRisk ? getRiskLevelColor(card?.riskLevel) : ''}
            `}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={card?.icon} 
                  size={20} 
                  className={card?.isRisk ? 'text-current' : card?.color} 
                />
                <span className="text-sm font-medium text-foreground">
                  {card?.title}
                </span>
              </div>
              
              {card?.trend && (
                <Icon 
                  name={getTrendIcon(card?.trend)} 
                  size={16} 
                  className={getTrendColor(card?.trend)} 
                />
              )}
            </div>

            {/* Main Value */}
            <div className="mb-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-foreground">
                  {card?.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {card?.unit}
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-muted-foreground">
              {card?.subtitle}
            </p>

            {/* Risk Level Badge */}
            {card?.isRisk && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide">
                    Risk Level
                  </span>
                  <span className="text-xs font-bold capitalize">
                    {card?.riskLevel}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Summary Alert */}
      {weatherData?.cloudburstRisk?.current > 70 && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-error mb-1">High Cloudburst Risk Detected</h4>
              <p className="text-sm text-error/80">
                Current conditions indicate a {weatherData?.cloudburstRisk?.current}% probability of cloudburst activity. 
                Monitor alerts closely and be prepared for rapid weather changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherInfoCards;