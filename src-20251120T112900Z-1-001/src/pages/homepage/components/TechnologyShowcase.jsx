import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TechnologyShowcase = () => {
  const [activeTab, setActiveTab] = useState('ai');

  const technologies = {
    ai: {
      title: 'Artificial Intelligence',
      description: 'Advanced machine learning models trained on decades of meteorological data to predict weather patterns with unprecedented accuracy.',
      features: [
        'Deep Learning Neural Networks',
        'Real-time Pattern Recognition',
        'Predictive Weather Modeling',
        'Continuous Model Improvement'
      ],
      stats: [
        { label: 'Prediction Accuracy', value: '95%' },
        { label: 'Processing Speed', value: '<1s' },
        { label: 'Data Points Analyzed', value: '10M+' }
      ],
      icon: 'Brain',
      gradient: 'from-purple-500 to-indigo-500'
    },
    monitoring: {
      title: 'Real-Time Monitoring',
      description: 'Comprehensive sensor network and satellite integration providing continuous weather surveillance across India.',
      features: [
        'Satellite Data Integration',
        'Ground Sensor Networks',
        'Atmospheric Pressure Monitoring',
        'Multi-Source Data Fusion'
      ],
      stats: [
        { label: 'Monitoring Stations', value: '500+' },
        { label: 'Update Frequency', value: '5min' },
        { label: 'Coverage Area', value: '100%' }
      ],
      icon: 'Radar',
      gradient: 'from-blue-500 to-cyan-500'
    },
    alerts: {
      title: 'Smart Alert System',
      description: 'Multi-channel notification system with intelligent routing and severity-based escalation protocols.',
      features: [
        'Multi-Channel Delivery',
        'Severity-Based Routing',
        'Location-Specific Alerts',
        'Emergency Escalation'
      ],
      stats: [
        { label: 'Delivery Success', value: '99.9%' },
        { label: 'Average Delivery Time', value: '3s' },
        { label: 'Supported Channels', value: '6' }
      ],
      icon: 'Bell',
      gradient: 'from-amber-500 to-orange-500'
    }
  };

  const tabs = [
    { id: 'ai', label: 'AI Engine', icon: 'Brain' },
    { id: 'monitoring', label: 'Monitoring', icon: 'Radar' },
    { id: 'alerts', label: 'Alert System', icon: 'Bell' }
  ];

  const currentTech = technologies?.[activeTab];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Powered by Advanced Technology
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our platform leverages cutting-edge technology stack to deliver reliable, 
            accurate, and timely weather predictions and alerts.
          </p>
        </motion.div>

        {/* Technology Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex bg-white/60 glass-effect rounded-2xl p-2 border border-white/20">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${activeTab === tab?.id 
                    ? 'bg-white shadow-md text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }
                `}
              >
                <Icon name={tab?.icon} size={20} />
                <span className="hidden sm:inline">{tab?.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Technology Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content Side */}
          <div className="space-y-8">
            {/* Title and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-xl
                  bg-gradient-to-br ${currentTech?.gradient} shadow-lg
                `}>
                  <Icon name={currentTech?.icon} size={24} color="white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">
                  {currentTech?.title}
                </h3>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                {currentTech?.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-slate-900">Key Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTech?.features?.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`
                      w-2 h-2 rounded-full bg-gradient-to-r ${currentTech?.gradient}
                    `} />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              {currentTech?.stats?.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`
                    text-2xl md:text-3xl font-bold bg-gradient-to-r ${currentTech?.gradient} 
                    bg-clip-text text-transparent
                  `}>
                    {stat?.value}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {stat?.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative">
            <div className="relative bg-white/60 glass-effect rounded-2xl p-8 border border-white/20">
              {/* Technology Visualization */}
              <div className="space-y-6">
                {/* Main Icon */}
                <div className="text-center">
                  <div className={`
                    inline-flex items-center justify-center w-24 h-24 rounded-2xl
                    bg-gradient-to-br ${currentTech?.gradient} shadow-xl
                  `}>
                    <Icon name={currentTech?.icon} size={48} color="white" />
                  </div>
                </div>

                {/* Process Flow */}
                <div className="space-y-4">
                  {['Data Collection', 'Processing', 'Analysis', 'Alert Generation']?.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.2 }}
                      className="flex items-center space-x-3"
                    >
                      <div className={`
                        w-8 h-8 rounded-full bg-gradient-to-r ${currentTech?.gradient} 
                        flex items-center justify-center text-white font-bold text-sm
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${currentTech?.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1, delay: index * 0.3 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 min-w-0">
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Status Indicators */}
                <div className="flex justify-around pt-4 border-t border-slate-200">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
                    <span className="text-xs text-slate-600">Active</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1 animate-pulse" />
                    <span className="text-xs text-slate-600">Processing</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1 animate-pulse" />
                    <span className="text-xs text-slate-600">Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <Icon name={currentTech?.icon} size={200} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;