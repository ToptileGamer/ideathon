import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import TechnologyShowcase from './components/TechnologyShowcase';
import TestimonialsSection from './components/TestimonialsSection';
import CallToActionSection from './components/CallToActionSection';

const Homepage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Mock data for header
  const mockAlerts = [
    {
      id: 1,
      title: "Heavy Rainfall Alert",
      message: "Moderate to heavy rainfall expected in Mumbai region. Stay indoors and avoid waterlogged areas.",
      severity: "moderate",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      location: "Mumbai, Maharashtra"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header
        currentUser={null}
        alertCount={mockAlerts?.length}
        selectedLocation="Mumbai, Maharashtra"
        connectionStatus="connected"
        onNavigate={handleNavigation}
      />
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection onNavigate={handleNavigation} />

        {/* Feature Cards Section */}
        <FeatureCards onNavigate={handleNavigation} />

        {/* Technology Showcase */}
        <TechnologyShowcase />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Call to Action Section */}
        <CallToActionSection onNavigate={handleNavigation} />
      </main>
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
                  <span className="text-white font-bold text-lg">CG</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">CloudGuard</h3>
                  <p className="text-sm text-slate-400">Disaster Management</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI-powered weather prediction and disaster management platform 
                protecting communities across India.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => handleNavigation('/risk-dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={() => handleNavigation('/alert-timeline')} className="hover:text-white transition-colors">Alerts</button></li>
                <li><button onClick={() => handleNavigation('/history')} className="hover:text-white transition-colors">History</button></li>
                <li><button onClick={() => handleNavigation('/emergency')} className="hover:text-white transition-colors">Emergency</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => handleNavigation('/about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => handleNavigation('/help')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => handleNavigation('/settings')} className="hover:text-white transition-colors">Settings</button></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Emergency: 1077</li>
                <li>Support: +91-11-2334-5678</li>
                <li>Email: help@cloudguard.in</li>
                <li>Address: New Delhi, India</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              © {new Date()?.getFullYear()} CloudGuard. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;