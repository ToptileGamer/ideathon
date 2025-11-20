import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import AlertCard from './AlertCard';

const AlertTimelineList = ({
  alerts = [],
  isLoading = false,
  hasMore = true,
  onLoadMore = () => {},
  onViewDetails = () => {},
  onExportAlert = () => {},
  className = ""
}) => {
  const [displayedAlerts, setDisplayedAlerts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Update displayed alerts when alerts prop changes
  useEffect(() => {
    setDisplayedAlerts(alerts);
  }, [alerts]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement?.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement?.scrollHeight;

    // Load more when user is 200px from bottom
    if (scrollTop + windowHeight >= documentHeight - 200) {
      setIsLoadingMore(true);
      onLoadMore()?.finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [isLoadingMore, hasMore, onLoadMore]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Generate skeleton loading cards
  const renderSkeletonCards = (count = 3) => {
    return Array.from({ length: count }, (_, index) => (
      <div
        key={`skeleton-${index}`}
        className="bg-card border border-border rounded-lg p-4 animate-pulse"
      >
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-muted rounded w-48" />
              <div className="h-6 bg-muted rounded-full w-16" />
            </div>
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="flex items-center space-x-4 mt-2">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Group alerts by date for better organization
  const groupAlertsByDate = (alertList) => {
    const groups = {};
    
    alertList?.forEach(alert => {
      const date = new Date(alert.timestamp || Date.now());
      const dateKey = date?.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups?.[dateKey]) {
        groups[dateKey] = [];
      }
      groups?.[dateKey]?.push(alert);
    });

    return groups;
  };

  const alertGroups = groupAlertsByDate(displayedAlerts);
  const groupKeys = Object.keys(alertGroups)?.sort((a, b) => {
    return new Date(b) - new Date(a); // Sort by date descending (newest first)
  });

  if (isLoading && displayedAlerts?.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading alert timeline...</span>
          </div>
        </div>
        {renderSkeletonCards(5)}
      </div>
    );
  }

  if (!isLoading && displayedAlerts?.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Icon name="Clock" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Alerts Found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            No weather alerts match your current filters. Try adjusting your search criteria or date range to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {groupKeys?.map(dateKey => (
        <div key={dateKey} className="space-y-4">
          {/* Date Header */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{dateKey}</span>
              <span className="text-xs text-muted-foreground">
                ({alertGroups?.[dateKey]?.length} alert{alertGroups?.[dateKey]?.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Alerts for this date */}
          <div className="space-y-3">
            {alertGroups?.[dateKey]?.map((alert, index) => (
              <AlertCard
                key={alert?.id || `${dateKey}-${index}`}
                alert={alert}
                onViewDetails={onViewDetails}
                onExportAlert={onExportAlert}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Load More Indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={18} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading more alerts...</span>
          </div>
        </div>
      )}
      {/* End of Results */}
      {!hasMore && displayedAlerts?.length > 0 && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-2 px-4 py-2 bg-muted/30 rounded-lg">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">
              All alerts loaded ({displayedAlerts?.length} total)
            </span>
          </div>
        </div>
      )}
      {/* Back to Top Button */}
      {displayedAlerts?.length > 10 && (
        <div className="fixed bottom-24 lg:bottom-8 right-4 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            title="Back to top"
          >
            <Icon name="ArrowUp" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertTimelineList;