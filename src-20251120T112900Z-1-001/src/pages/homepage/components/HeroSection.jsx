import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onNavigate = () => {} }) => {
  const [animationPhase, setAnimationPhase] = useState('calm');

  // Cycle through animation phases
  useEffect(() => {
    const phases = ['calm', 'building', 'storm', 'flash'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phases?.length;
      setAnimationPhase(phases?.[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getCloudAnimation = () => {
    switch (animationPhase) {
      case 'building':
        return { scale: 1.1, opacity: 0.8 };
      case 'storm':
        return { scale: 1.2, opacity: 0.6, x: [-5, 5, -5] };
      case 'flash':
        return { scale: 1.15, opacity: 1 };
      default:
        return { scale: 1, opacity: 0.7 };
    }
  };

  const getRainAnimation = () => {
    return animationPhase === 'storm' || animationPhase === 'flash'
      ? { opacity: 1, y: [0, 20, 0] }
      : { opacity: 0 };
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 weather-pattern">
        {/* Animated Clouds */}
        <motion.div
          className="absolute top-20 left-1/4 w-32 h-20 opacity-30"
          animate={getCloudAnimation()}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Icon name="Cloud" size={128} className="text-slate-400" />
        </motion.div>

        <motion.div
          className="absolute top-32 right-1/3 w-24 h-16 opacity-25"
          animate={{ ...getCloudAnimation(), x: getCloudAnimation()?.x ? [5, -5, 5] : 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <Icon name="Cloud" size={96} className="text-slate-300" />
        </motion.div>

        <motion.div
          className="absolute top-16 right-1/4 w-20 h-12 opacity-20"
          animate={getCloudAnimation()}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        >
          <Icon name="Cloud" size={80} className="text-slate-500" />
        </motion.div>

        {/* Rain Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={getRainAnimation()}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {[...Array(20)]?.map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
              }}
              animate={{
                y: [0, 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </motion.div>

        {/* Lightning Flash Effect */}
        {animationPhase === 'flash' && (
          <motion.div
            className="absolute inset-0 bg-yellow-200 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Stay Ahead of the{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Storm
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              CloudGuard delivers AI-powered cloudburst predictions and real-time weather alerts, 
              helping communities prepare for severe weather events before they strike.
            </motion.p>
          </div>

          {/* Key Statistics */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-12 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-600">95%</div>
              <div className="text-sm text-slate-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-600">24/7</div>
              <div className="text-sm text-slate-600">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-600">15min</div>
              <div className="text-sm text-slate-600">Early Warning</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={() => onNavigate('/risk-dashboard')}
              className="spring-bounce bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              iconName="Shield"
              iconPosition="left"
            >
              View Live Dashboard
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('/alert-timeline')}
              className="spring-bounce glass-effect border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              iconName="Bell"
              iconPosition="left"
            >
              Check Alerts
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-6 pt-12 opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Icon name="Shield" size={16} className="text-green-600" />
              <span>Government Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Icon name="Users" size={16} className="text-blue-600" />
              <span>10,000+ Users Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Icon name="Award" size={16} className="text-amber-600" />
              <span>ISO 27001 Certified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center space-y-2 text-slate-400">
          <span className="text-sm">Discover Features</span>
          <Icon name="ChevronDown" size={24} />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;