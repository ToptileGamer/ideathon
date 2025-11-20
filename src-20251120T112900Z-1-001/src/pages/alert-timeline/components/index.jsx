import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AlertStatusBanner from '../../components/ui/AlertStatusBanner';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import AlertTimelineHeader from './components/AlertTimelineHeader';
import AlertTrendChart from './components/AlertTrendChart';
import AlertTimelineList from './components/AlertTimelineList';


const AlertTimelinePage = () => {
  const navigate = useNavigate();
  
  // State management
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({
    dateRange: { startDate: '', endDate: '' },
    severity: 'all',
    location: 'all',
    search: ''
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');

  // Mock alert data
  const mockAlerts = [
    {
      id: 'ALT-001',
      title: 'Heavy Rainfall Alert',
      description: 'Intense rainfall expected with potential for flash flooding in low-lying areas.',
      severity: 'critical',
      location: 'Mumbai, Maharashtra',
      timestamp: new Date('2025-11-03T10:30:00')?.getTime(),
      endTime: new Date('2025-11-03T16:00:00')?.getTime(),
      details: `Meteorological department has issued a red alert for Mumbai and surrounding areas. Expected rainfall: 150-200mm in 6 hours. Citizens are advised to avoid waterlogged areas and stay indoors unless absolutely necessary.`,
      weatherData: {
        rainfall: 180,
        windSpeed: 45,
        temperature: 26,
        humidity: 95
      },
      affectedAreas: ['Bandra', 'Andheri', 'Borivali', 'Thane', 'Navi Mumbai']
    },
    {
      id: 'ALT-002',
      title: 'Cloudburst Warning',
      description: 'Sudden intense precipitation likely in hilly regions with risk of landslides.',
      severity: 'high',
      location: 'Shimla, Himachal Pradesh',
      timestamp: new Date('2025-11-02T14:15:00')?.getTime(),
      endTime: new Date('2025-11-02T18:30:00')?.getTime(),
      details: `Cloudburst conditions detected in upper reaches of Shimla district. Immediate evacuation recommended for vulnerable areas. Emergency services on high alert.`,
      weatherData: {
        rainfall: 120,
        windSpeed: 35,
        temperature: 18,
        humidity: 88
      },
      affectedAreas: ['Shimla', 'Kufri', 'Chail', 'Mashobra']
    },
    {
      id: 'ALT-003',
      title: 'Flood Advisory',
      description: 'River water levels rising due to continuous rainfall upstream.',
      severity: 'moderate',
      location: 'Patna, Bihar',
      timestamp: new Date('2025-11-02T08:45:00')?.getTime(),
      endTime: new Date('2025-11-02T20:00:00')?.getTime(),
      details: `Ganga river water level approaching warning mark. Low-lying areas along riverbank advised to remain vigilant. Boat services temporarily suspended.`,
      weatherData: {
        rainfall: 85,
        windSpeed: 25,
        temperature: 28,
        humidity: 82
      },
      affectedAreas: ['Patna City', 'Danapur', 'Phulwari Sharif', 'Khagaul']
    },
    {
      id: 'ALT-004',
      title: 'Thunderstorm Alert',
      description: 'Severe thunderstorm with lightning and gusty winds expected.',
      severity: 'moderate',
      location: 'Bangalore, Karnataka',
      timestamp: new Date('2025-11-01T16:20:00')?.getTime(),
      endTime: new Date('2025-11-01T22:00:00')?.getTime(),
      details: `Thunderstorm activity with lightning strikes and wind speeds up to 60 km/h. Outdoor activities should be avoided. Power outages possible in some areas.`,
      weatherData: {
        rainfall: 45,
        windSpeed: 60,
        temperature: 24,
        humidity: 75
      },
      affectedAreas: ['Electronic City', 'Whitefield', 'Koramangala', 'Indiranagar']
    },
    {
      id: 'ALT-005',
      title: 'Cyclone Watch',
      description: 'Tropical cyclone formation detected in Bay of Bengal.',
      severity: 'high',
      location: 'Chennai, Tamil Nadu',
      timestamp: new Date('2025-11-01T06:00:00')?.getTime(),
      endTime: null,
      details: `Cyclonic circulation intensifying over Bay of Bengal. Coastal areas of Tamil Nadu and Andhra Pradesh on high alert. Fishermen advised not to venture into sea.`,
      weatherData: {
        rainfall: 95,
        windSpeed: 75,
        temperature: 29,
        humidity: 90
      },
      affectedAreas: ['Chennai', 'Kanchipuram', 'Tiruvallur', 'Chengalpattu']
    },
    {
      id: 'ALT-006',
      title: 'Heat Wave Warning',
      description: 'Extreme temperatures expected with health risks for vulnerable populations.',
      severity: 'moderate',
      location: 'Delhi NCR',
      timestamp: new Date('2025-10-31T12:00:00')?.getTime(),
      endTime: new Date('2025-11-02T18:00:00')?.getTime(),
      details: `Temperature soaring above 42°C with high humidity. Citizens advised to stay hydrated and avoid direct sun exposure during peak hours (11 AM - 4 PM).`,
      weatherData: {
        rainfall: 0,
        windSpeed: 15,
        temperature: 43,
        humidity: 65
      },
      affectedAreas: ['New Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad']
    },
    {
      id: 'ALT-007',
      title: 'Dust Storm Alert',
      description: 'Severe dust storm approaching with reduced visibility.',
      severity: 'moderate',
      location: 'Jaipur, Rajasthan',
      timestamp: new Date('2025-10-30T18:30:00')?.getTime(),
      endTime: new Date('2025-10-31T02:00:00')?.getTime(),
      details: `Dust storm with wind speeds up to 50 km/h reducing visibility to less than 200 meters. Air travel and road transport may be affected.`,
      weatherData: {
        rainfall: 0,
        windSpeed: 50,
        temperature: 35,
        humidity: 45
      },
      affectedAreas: ['Jaipur', 'Ajmer', 'Sikar', 'Alwar']
    },
    {
      id: 'ALT-008',
      title: 'Landslide Warning',
      description: 'Heavy rainfall triggering landslide risk in mountainous areas.',
      severity: 'high',
      location: 'Dehradun, Uttarakhand',
      timestamp: new Date('2025-10-29T09:15:00')?.getTime(),
      endTime: new Date('2025-10-29T21:00:00')?.getTime(),
      details: `Continuous rainfall saturating hill slopes. Landslide risk high in Mussoorie and surrounding hill stations. Travel on mountain roads discouraged.`,
      weatherData: {
        rainfall: 140,
        windSpeed: 30,
        temperature: 20,
        humidity: 92
      },
      affectedAreas: ['Mussoorie', 'Dehradun', 'Rishikesh', 'Haridwar']
    }
  ];

  // Active alerts for banner (critical and high severity from last 24 hours)
  const activeAlerts = mockAlerts?.filter(alert => {
    const alertTime = new Date(alert.timestamp);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return alertTime > dayAgo && ['critical', 'high']?.includes(alert?.severity);
  });

  // Initialize data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts);
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...alerts];

    // Date range filter
    if (currentFilters?.dateRange?.startDate) {
      const startDate = new Date(currentFilters.dateRange.startDate);
      filtered = filtered?.filter(alert => new Date(alert.timestamp) >= startDate);
    }
    
    if (currentFilters?.dateRange?.endDate) {
      const endDate = new Date(currentFilters.dateRange.endDate);
      endDate?.setHours(23, 59, 59, 999); // End of day
      filtered = filtered?.filter(alert => new Date(alert.timestamp) <= endDate);
    }

    // Severity filter
    if (currentFilters?.severity !== 'all') {
      filtered = filtered?.filter(alert => alert?.severity === currentFilters?.severity);
    }

    // Location filter
    if (currentFilters?.location !== 'all') {
      filtered = filtered?.filter(alert => 
        alert?.location?.toLowerCase()?.includes(currentFilters?.location?.toLowerCase())
      );
    }

    // Search filter
    if (currentFilters?.search) {
      const searchTerm = currentFilters?.search?.toLowerCase();
      filtered = filtered?.filter(alert =>
        alert?.title?.toLowerCase()?.includes(searchTerm) ||
        alert?.description?.toLowerCase()?.includes(searchTerm) ||
        alert?.location?.toLowerCase()?.includes(searchTerm) ||
        alert?.id?.toLowerCase()?.includes(searchTerm)
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, currentFilters]);

  // Navigation handlers
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Filter handlers
  const handleDateRangeChange = (dateRange) => {
    setCurrentFilters(prev => ({ ...prev, dateRange }));
  };

  const handleSeverityFilter = (severity) => {
    setCurrentFilters(prev => ({ ...prev, severity }));
  };

  const handleLocationFilter = (location) => {
    setCurrentFilters(prev => ({ ...prev, location }));
  };

  const handleSearchChange = (search) => {
    setCurrentFilters(prev => ({ ...prev, search }));
  };

  // Action handlers
  const handleExportData = async () => {
    try {
      const dataToExport = {
        exportDate: new Date()?.toISOString(),
        totalAlerts: filteredAlerts?.length,
        filters: currentFilters,
        alerts: filteredAlerts
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alert-timeline-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportAlert = async (alert) => {
    try {
      const blob = new Blob([JSON.stringify(alert, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alert-${alert?.id}.json`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Alert export failed:', error);
    }
  };

  const handleViewDetails = (alert) => {
    // In a real app, this would navigate to a detailed alert view
    console.log('View alert details:', alert);
    // navigate(`/alert-details/${alert.id}`);
  };

  const handleLoadMore = async () => {
    // Simulate loading more data
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, this would load more alerts from API
        setHasMore(false); // No more data to load in this demo
        resolve();
      }, 1000);
    });
  };

  const handleAlertDismiss = (alertId) => {
    // Handle alert dismissal
    console.log('Dismiss alert:', alertId);
  };

  const handleAlertDetails = (alert) => {
    handleViewDetails(alert);
  };

  // Quick action handlers
  const handleTestAlert = async () => {
    console.log('Test alert triggered');
  };

  const handleReportIncident = async () => {
    console.log('Report incident triggered');
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background weather-pattern">
      {/* Header */}
      <Header
        alertCount={activeAlerts?.length}
        selectedLocation={selectedLocation}
        connectionStatus="connected"
        onNavigate={handleNavigation}
      />
      {/* Alert Status Banner */}
      {activeAlerts?.length > 0 && (
        <AlertStatusBanner
          alerts={activeAlerts}
          onDismiss={handleAlertDismiss}
          onViewDetails={handleAlertDetails}
        />
      )}
      {/* Quick Action Toolbar */}
      <QuickActionToolbar
        currentScreen="alert-timeline"
        onTestAlert={handleTestAlert}
        onReportIncident={handleReportIncident}
        onDownloadData={handleExportData}
        onRefreshData={handleRefreshData}
        isLoading={isLoading}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Timeline Header with Filters */}
        <AlertTimelineHeader
          onDateRangeChange={handleDateRangeChange}
          onSeverityFilter={handleSeverityFilter}
          onLocationFilter={handleLocationFilter}
          onSearchChange={handleSearchChange}
          onExportData={handleExportData}
          totalAlerts={alerts?.length}
          filteredAlerts={filteredAlerts?.length}
          isLoading={isLoading}
        />

        {/* Trend Chart */}
        <AlertTrendChart
          alertData={filteredAlerts}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* Alert Timeline List */}
        <AlertTimelineList
          alerts={filteredAlerts}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onViewDetails={handleViewDetails}
          onExportAlert={handleExportAlert}
        />
      </main>
      {/* Footer Spacer for Mobile Navigation */}
      <div className="h-16 lg:hidden" />
    </div>
  );
};

export default AlertTimelinePage;