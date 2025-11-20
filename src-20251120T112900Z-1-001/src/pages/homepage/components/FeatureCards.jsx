import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeatureCards = ({ onNavigate = () => {} }) => {
  const features = [
    {
      id: 'ai-forecasting',
      icon: 'Brain',
      title: 'AI-Powered Forecasting',
      description: 'Advanced machine learning algorithms analyze weather patterns to predict cloudbursts with 95% accuracy up to 15 minutes in advance.',
      highlights: ['Real-time Analysis', 'Pattern Recognition', 'Predictive Modeling'],
      ctaText: 'View Predictions',
      ctaAction: () => onNavigate('/risk-dashboard'),
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      id: 'real-time-alerts',
      icon: 'Bell',
      title: 'Real-Time Alerts',
      description: 'Instant notifications delivered through multiple channels including SMS, email, and push notifications for immediate weather warnings.',
      highlights: ['Multi-Channel Delivery', 'Instant Notifications', 'Severity Levels'],
      ctaText: 'Manage Alerts',
      ctaAction: () => onNavigate('/alert-timeline'),
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      id: 'location-safety',
      icon: 'MapPin',
      title: 'Location-Based Safety',
      description: 'Hyper-local weather monitoring with personalized safety recommendations based on your exact location and regional risk factors.',
      highlights: ['Hyper-Local Data', 'Safety Recommendations', 'Risk Assessment'],
      ctaText: 'Set Location',
      ctaAction: () => onNavigate('/risk-dashboard'),
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
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
            Comprehensive Weather Protection
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our integrated platform combines cutting-edge technology with local expertise 
            to deliver unparalleled weather safety solutions.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.id}
              variants={cardVariants}
              className="group relative"
            >
              {/* Card Container */}
              <div className={`
                relative h-full p-8 rounded-2xl glass-effect border border-white/20 
                bg-gradient-to-br ${feature?.bgGradient} hover:shadow-layered 
                transition-all duration-300 transform hover:-translate-y-2
              `}>
                {/* Icon Section */}
                <div className="mb-6">
                  <div className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-xl
                    bg-gradient-to-br ${feature?.gradient} shadow-lg
                  `}>
                    <Icon 
                      name={feature?.icon} 
                      size={32} 
                      color="white" 
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {feature?.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature?.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2">
                    {feature?.highlights?.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className={`
                          w-2 h-2 rounded-full bg-gradient-to-r ${feature?.gradient}
                        `} />
                        <span className="text-sm font-medium text-slate-700">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    onClick={feature?.ctaAction}
                    className={`
                      w-full spring-bounce glass-effect border-2 
                      bg-white/50 hover:bg-white/80 backdrop-blur-sm
                      text-slate-700 hover:text-slate-900 font-semibold
                      group-hover:shadow-md transition-all duration-300
                    `}
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    {feature?.ctaText}
                  </Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Icon name={feature?.icon} size={64} className="text-slate-400" />
                </div>

                {/* Hover Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 
                  bg-gradient-to-br ${feature?.gradient} transition-opacity duration-300 pointer-events-none
                `} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/60 glass-effect rounded-full border border-white/20">
            <Icon name="Zap" size={20} className="text-cyan-600" />
            <span className="text-slate-700 font-medium">
              Ready to protect your community?
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={() => onNavigate('/risk-dashboard')}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;