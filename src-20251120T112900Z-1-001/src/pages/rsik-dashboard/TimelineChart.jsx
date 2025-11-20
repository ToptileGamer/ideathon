import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineChart = ({ 
  selectedLocation = null,
  timeRange = '24h',
  onTimeRangeChange = () => {},
  className = ""
}) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('rainfall'); // rainfall, alerts, combined
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock historical data
  const generateTimelineData = (range, location) => {
    const now = new Date();
    const data = [];
    let intervals, intervalDuration, dateFormat;

    switch (range) {
      case '24h':
        intervals = 24;
        intervalDuration = 60 * 60 * 1000; // 1 hour
        dateFormat = 'HH:mm';
        break;
      case '7d':
        intervals = 7;
        intervalDuration = 24 * 60 * 60 * 1000; // 1 day
        dateFormat = 'MM/DD';
        break;
      case '1w':
        intervals = 7;
        intervalDuration = 24 * 60 * 60 * 1000; // 1 day
        dateFormat = 'ddd';
        break;
      default:
        intervals = 24;
        intervalDuration = 60 * 60 * 1000;
        dateFormat = 'HH:mm';
    }

    for (let i = intervals - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * intervalDuration));
      
      // Base values with some randomness
      let rainfallBase = Math.random() * 20 + 5;
      let alertCountBase = Math.floor(Math.random() * 3);
      let riskBase = Math.random() * 40 + 30;

      // Adjust based on location risk level
      if (location?.riskLevel === 'high') {
        rainfallBase = Math.random() * 40 + 20;
        alertCountBase = Math.floor(Math.random() * 5) + 1;
        riskBase = Math.random() * 30 + 60;
      } else if (location?.riskLevel === 'low') {
        rainfallBase = Math.random() * 10 + 2;
        alertCountBase = Math.floor(Math.random() * 2);
        riskBase = Math.random() * 25 + 10;
      }

      data?.push({
        timestamp: timestamp?.getTime(),
        time: timestamp?.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          weekday: range === '1w' ? 'short' : undefined,
          month: range === '7d' ? 'numeric' : undefined,
          day: range === '7d' ? 'numeric' : undefined
        }),
        rainfall: Math.round(rainfallBase * 10) / 10,
        alerts: alertCountBase,
        riskLevel: Math.round(riskBase),
        temperature: Math.round((Math.random() * 10 + 20) * 10) / 10,
        humidity: Math.round((Math.random() * 20 + 60)),
        windSpeed: Math.round((Math.random() * 15 + 5) * 10) / 10
      });
    }

    return data;
  };

  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newData = generateTimelineData(timeRange, selectedLocation);
      setChartData(newData);
      setIsLoading(false);
    }, 800);
  }, [timeRange, selectedLocation]);

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours', icon: 'Clock' },
    { value: '7d', label: '7 Days', icon: 'Calendar' },
    { value: '1w', label: '1 Week', icon: 'CalendarDays' }
  ];

  const chartTypeOptions = [
    { value: 'rainfall', label: 'Rainfall', icon: 'CloudRain', color: '#3B82F6' },
    { value: 'alerts', label: 'Alerts', icon: 'AlertTriangle', color: '#EF4444' },
    { value: 'combined', label: 'Combined', icon: 'BarChart3', color: '#8B5CF6' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {entry?.dataKey}:
                </span>
              </div>
              <span className="text-sm font-medium text-popover-foreground">
                {entry?.value}
                {entry?.dataKey === 'rainfall' && 'mm'}
                {entry?.dataKey === 'riskLevel' && '%'}
                {entry?.dataKey === 'temperature' && '°C'}
                {entry?.dataKey === 'humidity' && '%'}
                {entry?.dataKey === 'windSpeed' && 'km/h'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'rainfall') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="rainfall" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="riskLevel" 
              stroke="#EF4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'alerts') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Alert Count', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="alerts" 
              fill="#EF4444"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Combined chart
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="time" 
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            label={{ value: 'Risk (%)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="rainfall" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Rainfall (mm)"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="riskLevel" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Risk Level (%)"
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="temperature" 
            stroke="#F59E0B" 
            strokeWidth={1}
            strokeDasharray="3 3"
            name="Temperature (°C)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`bg-card rounded-xl border border-border ${className}`}>
      {/* Chart Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Weather Timeline</h3>
            {selectedLocation && (
              <span className="text-sm text-muted-foreground">
                • {selectedLocation?.name}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
              {chartTypeOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={chartType === option?.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType(option?.value)}
                  className="text-xs"
                >
                  <Icon name={option?.icon} size={14} className="mr-1" />
                  {option?.label}
                </Button>
              ))}
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
              {timeRangeOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={timeRange === option?.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTimeRangeChange(option?.value)}
                  className="text-xs"
                >
                  <Icon name={option?.icon} size={14} className="mr-1" />
                  {option?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Chart Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="animate-spin text-primary mb-2 mx-auto" />
              <p className="text-sm text-muted-foreground">Loading timeline data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {renderChart()}
            
            {/* Chart Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Peak Rainfall</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.max(...chartData?.map(d => d?.rainfall))?.toFixed(1)}mm
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Alerts</p>
                <p className="text-lg font-semibold text-foreground">
                  {chartData?.reduce((sum, d) => sum + d?.alerts, 0)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg Risk</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(chartData?.reduce((sum, d) => sum + d?.riskLevel, 0) / chartData?.length)}%
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Data Points</p>
                <p className="text-lg font-semibold text-foreground">
                  {chartData?.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineChart;