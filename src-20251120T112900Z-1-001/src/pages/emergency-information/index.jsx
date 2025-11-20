import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AlertStatusBanner from '../../components/ui/AlertStatusBanner';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

const EmergencyInformation = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedDisasterType, setSelectedDisasterType] = useState('all');
  const [expandedSections, setExpandedSections] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [currentLocation, setCurrentLocation] = useState('Current Location');

  // Emergency contacts data
  const emergencyContacts = [
    {
      id: 'ndrf',
      name: 'National Disaster Response Force',
      number: '1070',
      icon: 'Shield',
      description: 'Primary disaster response team',
      available: '24/7'
    },
    {
      id: 'police',
      name: 'Police Emergency',
      number: '100',
      icon: 'Phone',
      description: 'Law enforcement & rescue',
      available: '24/7'
    },
    {
      id: 'fire',
      name: 'Fire & Rescue',
      number: '101',
      icon: 'Flame',
      description: 'Fire emergencies & rescue operations',
      available: '24/7'
    },
    {
      id: 'ambulance',
      name: 'Medical Emergency',
      number: '108',
      icon: 'Plus',
      description: 'Medical emergencies & ambulance',
      available: '24/7'
    },
    {
      id: 'disaster-control',
      name: 'Disaster Control Room',
      number: '1077',
      icon: 'AlertTriangle',
      description: 'State disaster management',
      available: '24/7'
    },
    {
      id: 'women-helpline',
      name: 'Women Helpline',
      number: '1091',
      icon: 'Heart',
      description: 'Women safety & assistance',
      available: '24/7'
    }
  ];

  // Safety protocols by disaster type
  const safetyProtocols = {
    cloudburst: {
      title: 'Cloudburst Safety Protocols',
      icon: 'CloudRain',
      severity: 'high',
      steps: [
        'Move to higher ground immediately if water levels rise rapidly',
        'Avoid walking or driving through flood waters',
        'Stay away from electrical equipment and power lines',
        'Keep emergency supplies ready: water, food, flashlight, radio',
        'Monitor local weather updates and official warnings',
        'Do not attempt to cross swollen streams or rivers',
        'If trapped in a building, move to the highest floor',
        'Signal for help using bright colors or mirrors'
      ]
    },
    flood: {
      title: 'Flood Safety Guidelines',
      icon: 'Waves',
      severity: 'high',
      steps: [
        'Evacuate to higher ground if advised by authorities',
        'Turn off utilities (gas, electricity, water) if time permits',
        'Do not walk through moving water - 6 inches can knock you down',
        'Do not drive through flooded roads - turn around, don\'t drown',
        'Avoid contaminated flood water - it may contain sewage or chemicals',
        'Listen to emergency radio for evacuation instructions',
        'Stock up on clean water and non-perishable food',
        'Keep important documents in waterproof containers'
      ]
    },
    storm: {
      title: 'Storm & Heavy Rain Precautions',
      icon: 'Zap',
      severity: 'moderate',
      steps: [
        'Stay indoors and avoid unnecessary travel',
        'Close and secure all windows and doors',
        'Unplug electrical appliances to prevent damage from power surges',
        'Avoid using corded phones during thunderstorms',
        'Stay away from windows, metal objects, and tall structures',
        'If outdoors, seek shelter in a sturdy building immediately',
        'Do not take shelter under trees or near power lines',
        'Keep flashlights and batteries ready for power outages'
      ]
    },
    earthquake: {
      title: 'Earthquake Safety Measures',
      icon: 'Mountain',
      severity: 'high',
      steps: [
        'Drop, Cover, and Hold On during shaking',
        'Take cover under a sturdy desk or table',
        'Stay away from glass, mirrors, and heavy objects that could fall',
        'If outdoors, move away from buildings, trees, and power lines',
        'Do not run outside during shaking - most injuries occur from falling debris',
        'After shaking stops, check for injuries and hazards',
        'Be prepared for aftershocks',
        'Have emergency supplies: water, food, first aid kit'
      ]
    }
  };

  // Emergency kit checklist
  const emergencyKit = [
    { id: 'water', item: 'Water (1 gallon per person per day for 3 days)', category: 'essentials' },
    { id: 'food', item: 'Non-perishable food for 3 days', category: 'essentials' },
    { id: 'radio', item: 'Battery-powered or hand crank radio', category: 'communication' },
    { id: 'flashlight', item: 'Flashlight with extra batteries', category: 'tools' },
    { id: 'first-aid', item: 'First aid kit and medications', category: 'medical' },
    { id: 'whistle', item: 'Whistle for signaling help', category: 'tools' },
    { id: 'dust-masks', item: 'Dust masks and plastic sheeting', category: 'protection' },
    { id: 'wipes', item: 'Moist towelettes and garbage bags', category: 'sanitation' },
    { id: 'wrench', item: 'Wrench or pliers to turn off utilities', category: 'tools' },
    { id: 'phone-charger', item: 'Portable phone chargers/power banks', category: 'communication' },
    { id: 'cash', item: 'Cash and credit cards', category: 'essentials' },
    { id: 'documents', item: 'Emergency contact info and important documents', category: 'documents' },
    { id: 'blankets', item: 'Blankets and warm clothing', category: 'comfort' },
    { id: 'matches', item: 'Waterproof matches', category: 'tools' }
  ];

  // Mock active alerts
  useEffect(() => {
    const mockAlerts = [
      {
        id: 'alert-emergency-001',
        title: 'Severe Weather Alert',
        message: 'Heavy rainfall warning issued for your area. Stay prepared.',
        severity: 'moderate',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        location: currentLocation,
        type: 'weather'
      }
    ];
    setActiveAlerts(mockAlerts);
  }, [currentLocation]);

  const handleEmergencyCall = (number) => {
    if (typeof window !== 'undefined' && window.location?.protocol === 'https:') {
      window.open(`tel:${number}`, '_self');
    } else {
      // Fallback for development/HTTP
      navigator.clipboard?.writeText(number);
      alert(`Emergency number copied: ${number}\nFor actual emergencies, dial this number.`);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const handleChecklistItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev?.[itemId]
    }));
  };

  const filteredProtocols = selectedDisasterType === 'all' 
    ? Object.entries(safetyProtocols)
    : Object.entries(safetyProtocols)?.filter(([key]) => key === selectedDisasterType);

  const getCompletionPercentage = () => {
    const totalItems = emergencyKit?.length;
    const checkedCount = Object.values(checkedItems)?.filter(Boolean)?.length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-error bg-error/5';
      case 'moderate': return 'border-warning bg-warning/5';
      case 'low': return 'border-success bg-success/5';
      default: return 'border-border bg-muted/20';
    }
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
        currentScreen="emergency-information"
        onTestAlert={() => console.log('Test alert')}
        onReportIncident={() => console.log('Report incident')}
        onDownloadData={() => console.log('Download data')}
        onRefreshData={() => console.log('Refresh data')}
        onShareLocation={() => console.log('Share location')}
        onExportReport={() => console.log('Export report')}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={28} className="text-error" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Emergency Information
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Critical safety guidance and emergency protocols for weather-related disasters. 
            Access emergency contacts, safety procedures, and preparation checklists.
          </p>
        </div>

        {/* Emergency Alert Banner */}
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 alert-pulse">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center">
                <Icon name="Siren" size={32} className="text-error animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-error mb-2">Emergency Mode</h2>
              <p className="text-error/90 text-lg leading-relaxed">
                This page provides critical emergency information. In a real emergency, call the appropriate emergency services immediately.
                All emergency numbers listed below are active 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Grid */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Emergency Contacts</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              One-Tap Calling
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {emergencyContacts?.map((contact) => (
              <div key={contact?.id} className="bg-card border border-border rounded-xl p-6 spring-bounce hover:shadow-layered">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={contact?.icon} size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{contact?.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact?.description}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    {contact?.available}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleEmergencyCall(contact?.number)}
                  className="w-full bg-error hover:bg-error/90 text-white font-bold text-lg py-3"
                  size="lg"
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Call {contact?.number}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Protocols Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={24} className="text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Safety Protocols</h2>
            </div>
            <select
              value={selectedDisasterType}
              onChange={(e) => setSelectedDisasterType(e?.target?.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Disasters</option>
              <option value="cloudburst">Cloudburst</option>
              <option value="flood">Flood</option>
              <option value="storm">Storm</option>
              <option value="earthquake">Earthquake</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredProtocols?.map(([key, protocol]) => (
              <div key={key} className={`border rounded-xl overflow-hidden ${getSeverityColor(protocol?.severity)}`}>
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm">
                      <Icon name={protocol?.icon} size={24} className="text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{protocol?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {protocol?.steps?.length} safety steps • {protocol?.severity} priority
                      </p>
                    </div>
                  </div>
                  <Icon 
                    name={expandedSections?.[key] ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-muted-foreground" 
                  />
                </button>

                {expandedSections?.[key] && (
                  <div className="px-6 pb-6 space-y-3">
                    <div className="h-px bg-border my-4" />
                    {protocol?.steps?.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <p className="text-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Kit Checklist */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Package" size={24} className="text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Emergency Kit Checklist</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{getCompletionPercentage()}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Preparation Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Object.values(checkedItems)?.filter(Boolean)?.length} of {emergencyKit?.length} items
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyKit?.map((item) => (
                <div key={item?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={item?.id}
                    checked={checkedItems?.[item?.id] || false}
                    onCheckedChange={() => handleChecklistItem(item?.id)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={item?.id}
                    className={`text-sm leading-relaxed cursor-pointer flex-1 ${
                      checkedItems?.[item?.id] ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item?.item}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 text-center spring-bounce hover:shadow-layered">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MapPin" size={32} className="text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nearest Shelter</h3>
            <p className="text-sm text-muted-foreground mb-4">Find emergency shelters and safe zones in your area</p>
            <Button variant="outline" size="sm" className="w-full">
              <Icon name="Navigation" size={16} className="mr-2" />
              Find Shelters
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 text-center spring-bounce hover:shadow-layered">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Download" size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Offline Guides</h3>
            <p className="text-sm text-muted-foreground mb-4">Download safety guides for offline access</p>
            <Button variant="outline" size="sm" className="w-full">
              <Icon name="Download" size={16} className="mr-2" />
              Download Guides
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 text-center spring-bounce hover:shadow-layered">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} className="text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Community Alert</h3>
            <p className="text-sm text-muted-foreground mb-4">Share emergency status with your community</p>
            <Button variant="outline" size="sm" className="w-full">
              <Icon name="Share" size={16} className="mr-2" />
              Share Status
            </Button>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Shield" size={24} className="text-primary" />
              <span className="text-xl font-bold text-foreground">CloudGuard Emergency</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay prepared, stay safe. This emergency information system is designed to help you respond effectively 
              to weather-related disasters and emergencies.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span>🚨 Available 24/7</span>
              <span>•</span>
              <span>📞 Emergency Ready</span>
              <span>•</span>
              <span>🛡️ Safety First</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmergencyInformation;