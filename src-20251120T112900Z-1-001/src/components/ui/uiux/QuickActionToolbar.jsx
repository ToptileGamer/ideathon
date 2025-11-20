import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = ({ 
  currentScreen = 'dashboard',
  userPermissions = {},
  onTestAlert = () => {},
  onReportIncident = () => {},
  onDownloadData = () => {},
  onRefreshData = () => {},
  onShareLocation = () => {},
  onExportReport = () => {},
  isLoading = false,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Define actions based on current screen and permissions
  const getAvailableActions = () => {
    const baseActions = [];

    // Dashboard specific actions
    if (currentScreen === 'dashboard' || currentScreen === 'risk-dashboard') {
      if (userPermissions?.canTestAlerts !== false) {
        baseActions?.push({
          id: 'test-alert',
          label: 'Test Alert',
          icon: 'Zap',
          onClick: onTestAlert,
          variant: 'outline',
          tooltip: 'Send a test weather alert to verify system functionality'
        });
      }

      if (userPermissions?.canReportIncidents !== false) {
        baseActions?.push({
          id: 'report-incident',
          label: 'Report Incident',
          icon: 'AlertTriangle',
          onClick: onReportIncident,
          variant: 'outline',
          tooltip: 'Report a weather-related incident or emergency'
        });
      }

      baseActions?.push({
        id: 'refresh-data',
        label: 'Refresh',
        icon: 'RefreshCw',
        onClick: onRefreshData,
        variant: 'ghost',
        tooltip: 'Refresh weather data and alerts'
      });

      baseActions?.push({
        id: 'share-location',
        label: 'Share Location',
        icon: 'Share2',
        onClick: onShareLocation,
        variant: 'ghost',
        tooltip: 'Share current location for emergency coordination'
      });
    }

    // Alert Timeline specific actions
    if (currentScreen === 'alert-timeline') {
      baseActions?.push({
        id: 'download-data',
        label: 'Download Data',
        icon: 'Download',
        onClick: onDownloadData,
        variant: 'outline',
        tooltip: 'Download alert history and weather data'
      });

      baseActions?.push({
        id: 'export-report',
        label: 'Export Report',
        icon: 'FileText',
        onClick: onExportReport,
        variant: 'outline',
        tooltip: 'Generate and export detailed weather report'
      });

      baseActions?.push({
        id: 'refresh-data',
        label: 'Refresh',
        icon: 'RefreshCw',
        onClick: onRefreshData,
        variant: 'ghost',
        tooltip: 'Refresh alert timeline data'
      });
    }

    return baseActions;
  };

  const actions = getAvailableActions();

  const handleActionClick = async (action) => {
    setActiveAction(action?.id);
    try {
      await action?.onClick();
    } catch (error) {
      console.error(`Action ${action?.id} failed:`, error);
    } finally {
      setActiveAction(null);
    }
  };

  // Don't render if no actions available
  if (actions?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Toolbar */}
      <div className={`hidden lg:flex items-center justify-between bg-card/50 border-b border-border px-6 py-3 ${className}`}>
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Quick Actions
          </h2>
          <div className="flex items-center space-x-2">
            {actions?.map((action) => (
              <Button
                key={action?.id}
                variant={action?.variant}
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={isLoading || activeAction === action?.id}
                className="spring-bounce"
                title={action?.tooltip}
              >
                {activeAction === action?.id ? (
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                ) : (
                  <Icon name={action?.icon} size={16} className="mr-2" />
                )}
                {action?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last updated: {new Date()?.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>
      </div>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-1000">
        {/* Expanded Actions */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 space-y-2 animate-slide-up">
            {actions?.map((action, index) => (
              <Button
                key={action?.id}
                variant={action?.variant}
                size="sm"
                onClick={() => {
                  handleActionClick(action);
                  setIsExpanded(false);
                }}
                disabled={isLoading || activeAction === action?.id}
                className="floating-action bg-card shadow-floating min-w-0 whitespace-nowrap"
                style={{ animationDelay: `${index * 50}ms` }}
                title={action?.tooltip}
              >
                {activeAction === action?.id ? (
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                ) : (
                  <Icon name={action?.icon} size={16} className="mr-2" />
                )}
                {action?.label}
              </Button>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="floating-action bg-primary text-primary-foreground shadow-floating w-14 h-14 rounded-full"
        >
          <Icon 
            name={isExpanded ? "X" : "Zap"} 
            size={24} 
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </Button>

        {/* Backdrop */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black/20 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
      {/* Mobile Toolbar (Alternative Layout) */}
      <div className="lg:hidden bg-card/95 border-t border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Quick Actions
          </span>
          <div className="flex items-center space-x-1">
            {actions?.slice(0, 3)?.map((action) => (
              <Button
                key={action?.id}
                variant="ghost"
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={isLoading || activeAction === action?.id}
                className="px-2 py-1"
                title={action?.tooltip}
              >
                {activeAction === action?.id ? (
                  <Icon name="Loader2" size={14} className="animate-spin" />
                ) : (
                  <Icon name={action?.icon} size={14} />
                )}
              </Button>
            ))}
            {actions?.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-2 py-1"
              >
                <Icon name="MoreHorizontal" size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickActionToolbar;