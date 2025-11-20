import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const AlertTrendChart = ({
  alertData = [],
  weatherData = [],
  timeRange = '7d',
  onTimeRangeChange = () => {},
  className = ""
}) => {
  const [chartType, setChartType] = useState('alerts');
  const [isLoading, setIsLoading] = useState(false);
  const [processedData, setProcessedData] = useState([]);

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  const chartTypeOptions = [
    { value: 'alerts', label: 'Alert Frequency' },
    { value: 'severity', label: 'Severity Trends' },
    { value: 'weather', label: 'Weather Patterns' },
    { value: 'combined', label: 'Combined View' }
  ];

  // Process data based on time range and chart type
  useEffect(() => {
    setIsLoading(true);
    
    const processData = () => {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Generate mock data for demonstration
      const mockData = generateMockChartData(startDate, now, timeRange, chartType);
      setProcessedData(mockData);
    };

    // Simulate data processing delay
    setTimeout(() => {
      processData();
      setIsLoading(false);
    }, 500);
  }, [timeRange, chartType, alertData, weatherData]);

  const generateMockChartData = (startDate, endDate, range, type) => {
    const data = [];
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const intervals = range === '24h' ? 24 : Math.min(daysDiff, 30);

    for (let i = 0; i < intervals; i++) {
      const date = new Date(startDate.getTime() + (i * (endDate - startDate) / intervals));
      const dateStr = range === '24h' ? date?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : date?.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      const baseData = {
        date: dateStr,
        timestamp: date?.getTime()
      };

      switch (type) {
        case 'alerts':
          data?.push({
            ...baseData,
            alerts: Math.floor(Math.random() * 15) + 1,
            critical: Math.floor(Math.random() * 3),
            high: Math.floor(Math.random() * 5) + 1,
            moderate: Math.floor(Math.random() * 7) + 2,
            low: Math.floor(Math.random() * 4) + 1
          });
          break;
        
        case 'severity':
          data?.push({
            ...baseData,
            critical: Math.floor(Math.random() * 4),
            high: Math.floor(Math.random() * 6) + 1,
            moderate: Math.floor(Math.random() * 8) + 2,
            low: Math.floor(Math.random() * 5) + 1
          });
          break;
        
        case 'weather':
          data?.push({
            ...baseData,
            rainfall: Math.floor(Math.random() * 50) + 5,
            temperature: Math.floor(Math.random() * 15) + 20,
            humidity: Math.floor(Math.random() * 30) + 60,
            windSpeed: Math.floor(Math.random() * 20) + 5
          });
          break;
        
        case 'combined':
          data?.push({
            ...baseData,
            alerts: Math.floor(Math.random() * 12) + 1,
            rainfall: Math.floor(Math.random() * 40) + 10,
            temperature: Math.floor(Math.random() * 12) + 22
          });
          break;
        
        default:
          data?.push(baseData);
      }
    }

    return data;
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading chart data...</span>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case 'alerts':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'severity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="critical" stackId="a" fill="var(--color-error)" name="Critical" />
              <Bar dataKey="high" stackId="a" fill="#FF6B35" name="High" />
              <Bar dataKey="moderate" stackId="a" fill="var(--color-warning)" name="Moderate" />
              <Bar dataKey="low" stackId="a" fill="var(--color-accent)" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'weather':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rainfall"
                stroke="var(--color-primary)"
                strokeWidth={2}
                name="Rainfall (mm)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'combined':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="alerts"
                fill="var(--color-primary)"
                name="Alerts"
                opacity={0.7}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainfall"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                name="Rainfall (mm)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Alert Trends</h3>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center space-x-2">
            <Select
              options={chartTypeOptions}
              value={chartType}
              onChange={setChartType}
              className="w-40"
            />
            
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={onTimeRangeChange}
              className="w-36"
            />
          </div>
        </div>

        {/* Chart Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {processedData?.reduce((sum, item) => sum + (item?.alerts || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Alerts</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {processedData?.reduce((sum, item) => sum + (item?.critical || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {processedData?.reduce((sum, item) => sum + (item?.high || 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {Math.round(processedData?.reduce((sum, item) => sum + (item?.alerts || 0), 0) / processedData?.length * 100) / 100}
            </div>
            <div className="text-xs text-muted-foreground">Avg/Period</div>
          </div>
        </div>
      </div>
      {/* Chart Area */}
      <div className="p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default AlertTrendChart;