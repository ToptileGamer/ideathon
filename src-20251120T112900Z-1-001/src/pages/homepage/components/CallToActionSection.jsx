import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CallToActionSection = ({ onNavigate = () => {} }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e?.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  const features = [
    {
      icon: 'Zap',
      title: 'Instant Alerts',
      description: 'Get notified within seconds of weather changes'
    },
    {
      icon: 'Shield',
      title: 'AI Protection',
      description: '95% accuracy in cloudburst predictions'
    },
    {
      icon: 'MapPin',
      title: 'Local Focus',
      description: 'Hyper-local weather monitoring for your area'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-cyan-900 to-teal-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)]?.map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-teal-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Ready to Stay
                <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Weather Safe?
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Join thousands of communities already protected by CloudGuard's 
                AI-powered weather prediction system. Get started in minutes.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              {features?.map((feature, index) => (
                <motion.div
                  key={feature?.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon name={feature?.icon} size={24} color="white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {feature?.title}
                    </h4>
                    <p className="text-slate-300">
                      {feature?.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => onNavigate('/risk-dashboard')}
                className="spring-bounce bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-4 text-lg font-semibold shadow-xl"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Start Monitoring Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('/alert-timeline')}
                className="spring-bounce border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                iconName="Eye"
                iconPosition="left"
              >
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Newsletter Signup Side */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Newsletter Card */}
            <div className="bg-white/10 glass-effect rounded-3xl p-8 border border-white/20 backdrop-blur-lg">
              {!isSubscribed ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon name="Bell" size={32} color="white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Get Weather Alerts
                    </h3>
                    <p className="text-slate-300">
                      Subscribe to receive critical weather updates and safety tips directly in your inbox.
                    </p>
                  </div>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e?.target?.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/70"
                    />
                    
                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      loading={isLoading}
                      disabled={!email}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                      iconName="Send"
                      iconPosition="right"
                    >
                      Subscribe to Alerts
                    </Button>
                  </form>

                  <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Icon name="Shield" size={16} className="text-green-400" />
                      <span>No spam, ever</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Icon name="Zap" size={16} className="text-yellow-400" />
                      <span>Instant delivery</span>
                    </div>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon name="Check" size={32} color="white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    You're All Set!
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Thank you for subscribing. You'll receive weather alerts and safety updates directly in your inbox.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('/risk-dashboard')}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Explore Dashboard
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 glass-effect rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm text-slate-300">Active Users</div>
              </div>
              <div className="bg-white/5 glass-effect rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-slate-300">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="text-center mt-16 pt-12 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-slate-300 mb-4">
            Trusted by meteorologists, emergency responders, and communities across India
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
            <span className="text-sm text-slate-400">IMD Certified</span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-400">NDMA Approved</span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-400">ISO 27001</span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-400">24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
