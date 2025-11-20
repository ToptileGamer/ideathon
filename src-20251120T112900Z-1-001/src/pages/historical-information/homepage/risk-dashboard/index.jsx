import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AlertStatusBanner from '../../components/ui/AlertStatusBanner';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, subMonths, subYears } from 'date-fns';

const HistoricalWeatherData = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [currentLocation, setCurrentLocation] = useState('India');
  const [selectedDateRange, setSelectedDateRange] = useState('1year');
  const [selectedParameter, setSelectedParameter] = useState('rainfall');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [granularity, setGranularity] = useState('monthly');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonYear, setComparisonYear] = useState('2022');
  const [exportFormat, setExportFormat] = useState('csv');

  // Generate historical weather data
  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    let startDate, periods, formatStr;

    switch (selectedDateRange) {
      case '1month':
        startDate = subDays(now, 30);
        periods = 30;
        formatStr = 'MMM dd';
        break;
      case '3months':
        startDate = subDays(now, 90);
        periods = 90;
        formatStr = 'MMM dd';
        break;
      case '1year':
        startDate = subMonths(now, 12);
        periods = 12;
        formatStr = 'MMM yyyy';
        break;
      case '5years':
        startDate = subYears(now, 5);
        periods = 5;
        formatStr = 'yyyy';
        break;
      default:
        startDate = subMonths(now, 12);
        periods = 12;
        formatStr = 'MMM yyyy';
    }

    for (let i = 0; i < periods; i++) {
      let date;
      if (selectedDateRange === '1month' || selectedDateRange === '3months') {
        date = subDays(now, periods - i - 1);
      } else if (selectedDateRange === '1year') {
        date = subMonths(now, periods - i - 1);
      } else {
        date = subYears(now, periods - i - 1);
      }

      const baseRainfall = 50 + Math.sin(i * 0.5) * 30 + Math.random() * 40;
      const baseTemp = 25 + Math.sin(i * 0.3) * 8 + Math.random() * 10;
      const baseHumidity = 60 + Math.sin(i * 0.4) * 20 + Math.random() * 20;
      const baseWindSpeed = 15 + Math.random() * 25;

      data?.push({
        date: format(date, formatStr),
        fullDate: date,
        rainfall: Math.max(0, baseRainfall),
        temperature: Math.max(10, baseTemp),
        humidity: Math.max(30, Math.min(100, baseHumidity)),
        windSpeed: Math.max(0, baseWindSpeed),
        disasters: Math.floor(Math.random() * 5),
        comparison: comparisonMode ? baseRainfall * (0.8 + Math.random() * 0.4) : null
      });
    }

    return data;
  };

  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    setHistoricalData(generateHistoricalData());
  }, [selectedDateRange, selectedParameter, comparisonMode, comparisonYear]);

  // Statistics data
  const weatherStats = [
    {
      id: 'avg-rainfall',
      label: 'Average Rainfall',
      value: '1,250 mm',
      change: '+12%',
      trend: 'up',
      icon: 'CloudRain',
      color: 'text-primary'
    },
    {
      id: 'extreme-events',
      label: 'Extreme Weather Events',
      value: '47',
      change: '-5%',
      trend: 'down',
      icon: 'AlertTriangle',
      color: 'text-warning'
    },
    {
      id: 'hottest-day',
      label: 'Highest Temperature',
      value: '48.2°C',
      change: '+2.1°C',
      trend: 'up',
      icon: 'Thermometer',
      color: 'text-error'
    },
    {
      id: 'wettest-month',
      label: 'Wettest Month',
      value: 'July 2024',
      change: '312mm',
      trend: 'neutral',
      icon: 'Droplets',
      color: 'text-success'
    }
  ];

  // Disaster distribution data for pie chart
  const disasterData = [
    { name: 'Floods', value: 35, color: '#0891B2' },
    { name: 'Cloudbursts', value: 25, color: '#0F766E' },
    { name: 'Storms', value: 20, color: '#F59E0B' },
    { name: 'Droughts', value: 12, color: '#EF4444' },
    { name: 'Cyclones', value: 8, color: '#10B981' }
  ];

  // Regional data
  const regions = [
    { value: 'all', label: 'All India' },
    { value: 'north', label: 'Northern India' },
    { value: 'south', label: 'Southern India' },
    { value: 'east', label: 'Eastern India' },
    { value: 'west', label: 'Western India' },
    { value: 'central', label: 'Central India' },
    { value: 'northeast', label: 'Northeast India' }
  ];

  const parameters = [
    { value: 'rainfall', label: 'Rainfall (mm)', color: '#0891B2' },
    { value: 'temperature', label: 'Temperature (°C)', color: '#EF4444' },
    { value: 'humidity', label: 'Humidity (%)', color: '#10B981' },
    { value: 'windSpeed', label: 'Wind Speed (km/h)', color: '#F59E0B' },
    { value: 'disasters', label: 'Disaster Events', color: '#8B5CF6' }
  ];

  const dateRanges = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' },
    { value: '5years', label: 'Last 5 Years' }
  ];

  const handleExportData = () => {
    const dataToExport = historicalData?.map(item => ({
      Date: item?.date,
      [selectedParameter?.charAt(0)?.toUpperCase() + selectedParameter?.slice(1)]: item?.[selectedParameter],
      Region: selectedRegion
    }));

    if (exportFormat === 'csv') {
      const csv = [
        Object.keys(dataToExport?.[0])?.join(','),
        ...dataToExport?.map(row => Object.values(row)?.join(','))
      ]?.join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `weather-data-${selectedParameter}-${selectedDateRange}.csv`;
      link?.click();
    } else if (exportFormat === 'pdf') {
      // Simulate PDF generation
      alert('PDF report generation initiated. This would integrate with a PDF library in production.');
    }
  };

  const getParameterConfig = () => {
    return parameters?.find(p => p?.value === selectedParameter) || parameters?.[0];
  };

  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
  };

  return (
    <div className="min-h-screen bg-background weather-pattern">
      {/* Header */}
      <Header
        alertCount={activeAlerts?.length}
        selectedLocation={currentLocation}
        connectionStatus={connectionStatus}
        onNavigate={handleNavigation}
      />
      {/* Alert Banner */}
      <AlertStatusBanner
        alerts={activeAlerts}
        onDismiss={(alertId) => setActiveAlerts(prev => prev?.filter(alert => alert?.id !== alertId))}
        onViewDetails={(alert) => console.log('View alert details:', alert)}
      />
      {/* Quick Actions Toolbar */}
      <QuickActionToolbar
        currentScreen="historical-weather-data"
        onTestAlert={() => console.log('Test alert')}
        onReportIncident={() => console.log('Report incident')}
        onDownloadData={handleExportData}
        onRefreshData={() => setHistoricalData(generateHistoricalData())}
        onShareLocation={() => console.log('Share location')}
        onExportReport={handleExportData}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="BarChart3" size={28} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Historical Weather Data
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive analysis of past weather patterns and disaster events. 
            Explore historical trends, compare time periods, and download data for research.
          </p>
        </div>

        {/* Control Panel */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Settings" size={20} />
            <span>Analysis Controls</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Time Period</label>
              <Select
                value={selectedDateRange}
                onValueChange={setSelectedDateRange}
                options={dateRanges}
              />
            </div>

            {/* Parameter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Weather Parameter</label>
              <Select
                value={selectedParameter}
                onValueChange={setSelectedParameter}
                options={parameters}
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Geographic Region</label>
              <Select
                value={selectedRegion}
                onValueChange={setSelectedRegion}
                options={regions}
              />
            </div>

            {/* Granularity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Data Granularity</label>
              <Select
                value={granularity}
                onValueChange={setGranularity}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]}
              />
            </div>
          </div>

          {/* Additional Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonMode}
                  onChange={(e) => setComparisonMode(e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-foreground">Compare with previous period</span>
              </label>
              
              {comparisonMode && (
                <Select
                  value={comparisonYear}
                  onValueChange={setComparisonYear}
                  options={[
                    { value: '2023', label: '2023' },
                    { value: '2022', label: '2022' },
                    { value: '2021', label: '2021' },
                    { value: '2020', label: '2020' }
                  ]}
                />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={exportFormat}
                onValueChange={setExportFormat}
                options={[
                  { value: 'csv', label: 'Export as CSV' },
                  { value: 'pdf', label: 'Export as PDF' },
                  { value: 'json', label: 'API Access' }
                ]}
              />
              <Button onClick={handleExportData} size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {weatherStats?.map((stat) => (
            <div key={stat?.id} className="bg-card border border-border rounded-xl p-6 spring-bounce hover:shadow-layered">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center`}>
                  <Icon name={stat?.icon} size={24} className={stat?.color} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat?.trend === 'up' ? 'text-success' :
                  stat?.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                }`}>
                  {stat?.trend === 'up' && <Icon name="TrendingUp" size={16} />}
                  {stat?.trend === 'down' && <Icon name="TrendingDown" size={16} />}
                  <span>{stat?.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat?.value}</p>
                <p className="text-sm text-muted-foreground">{stat?.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Main Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Primary Trend Chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                {getParameterConfig()?.label} Trends
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getParameterConfig()?.color }} />
                <span>Current Period</span>
                {comparisonMode && (
                  <>
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/50 ml-4" />
                    <span>Comparison ({comparisonYear})</span>
                  </>
                )}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748B"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedParameter}
                    stroke={getParameterConfig()?.color}
                    fill={`${getParameterConfig()?.color}20`}
                    strokeWidth={2}
                  />
                  {comparisonMode && (
                    <Area
                      type="monotone"
                      dataKey="comparison"
                      stroke="#64748B"
                      fill="#64748B20"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disaster Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Disaster Types Distribution</h3>
            
            <div className="h-60 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disasterData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {disasterData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {disasterData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item?.color }}
                    />
                    <span className="text-sm text-foreground">{item?.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item?.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Analysis Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Comparison Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Monthly Patterns</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData?.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748B"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar
                    dataKey={selectedParameter}
                    fill={getParameterConfig()?.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Key Insights</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-foreground">Seasonal Patterns</p>
                  <p className="text-xs text-muted-foreground">
                    Rainfall peaks during monsoon months (June-September) with 75% of annual precipitation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-foreground">Extreme Events</p>
                  <p className="text-xs text-muted-foreground">
                    Cloudburst incidents increased by 23% compared to previous decade
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-foreground">Temperature Trends</p>
                  <p className="text-xs text-muted-foreground">
                    Average temperatures rising by 0.5°C per decade in selected regions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-error rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-foreground">Risk Assessment</p>
                  <p className="text-xs text-muted-foreground">
                    Urban flooding risk elevated during consecutive high-rainfall days
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full">
                <Icon name="FileText" size={16} className="mr-2" />
                Generate Detailed Report
              </Button>
            </div>
          </div>
        </section>

        {/* Data Tools Section */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center space-x-2">
            <Icon name="Database" size={20} />
            <span>Data Access & Tools</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Download" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Export</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download historical data in multiple formats for analysis
                </p>
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={16} className="mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Code" size={32} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">API Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Programmatic access to weather data through REST API
                </p>
                <Button variant="outline" size="sm">
                  <Icon name="Code" size={16} className="mr-2" />
                  API Docs
                </Button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Share" size={32} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Share Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share charts and insights with research teams
                </p>
                <Button variant="outline" size="sm">
                  <Icon name="Share" size={16} className="mr-2" />
                  Share Report
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="BarChart3" size={24} className="text-primary" />
              <span className="text-xl font-bold text-foreground">CloudGuard Analytics</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced weather data analysis powered by comprehensive historical records and 
              machine learning insights for informed decision making.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span>📊 Real-time Analysis</span>
              <span>•</span>
              <span>📈 Predictive Insights</span>
              <span>•</span>
              <span>🔍 Research Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HistoricalWeatherData;
