import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AlertTimelinePage from './pages/alert-timeline/components';
import RiskDashboard from './pages/rsik-dashboard';
import EmergencyInformation from './pages/emergency-information';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<RiskDashboard />} />
        <Route path="/alert-timeline" element={<AlertTimelinePage />} />
        <Route path="/risk-dashboard" element={<RiskDashboard />} />
        <Route path="/emergency-information" element={<EmergencyInformation />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
