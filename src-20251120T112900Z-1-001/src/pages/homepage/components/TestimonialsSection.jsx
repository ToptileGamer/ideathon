import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    role: "Meteorologist, IMD Mumbai",
    location: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1643488625793-76063e65d9c4",
    avatarAlt: "Professional headshot of Indian woman meteorologist with short black hair in white lab coat",
    content: "CloudGuard\'s AI predictions have revolutionized our early warning capabilities. The 15-minute advance notice has helped us save countless lives during the recent monsoon season.",
    rating: 5,
    verified: true,
    date: "October 2024"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Disaster Management Officer",
    location: "Uttarakhand",
    avatar: "https://images.unsplash.com/photo-1714900590399-baba2f3f5672",
    avatarAlt: "Professional headshot of Indian man in navy blue uniform with short black hair and mustache",
    content: "The location-based alerts are incredibly accurate. During the recent cloudburst in our region, CloudGuard's warnings allowed us to evacuate vulnerable areas well in advance.",
    rating: 5,
    verified: true,
    date: "September 2024"
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Village Sarpanch",
    location: "Himachal Pradesh",
    avatar: "https://images.unsplash.com/photo-1624354865912-fdf2f0e09a21",
    avatarAlt: "Professional headshot of middle-aged Indian woman with traditional bindi and colorful sari",
    content: "As a village leader, CloudGuard has become our lifeline. The simple alerts help our community prepare for severe weather, protecting our families and livestock.",
    rating: 5,
    verified: true,
    date: "August 2024"
  },
  {
    id: 4,
    name: "Captain Arjun Singh",
    role: "NDRF Team Leader",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1638908219964-b94fd11fefcf",
    avatarAlt: "Professional headshot of Indian man in NDRF uniform with short black hair and confident expression",
    content: "The real-time monitoring and instant alerts have enhanced our response times significantly. CloudGuard is now an essential tool in our disaster preparedness toolkit.",
    rating: 5,
    verified: true,
    date: "November 2024"
  }];


  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const renderStars = (rating) => {
    return [...Array(5)]?.map((_, index) =>
    <Icon
      key={index}
      name="Star"
      size={16}
      className={index < rating ? "text-amber-400 fill-current" : "text-slate-300"} />

    );
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
          transition={{ duration: 0.6 }}>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Hear from meteorologists, disaster management officials, and community leaders 
            who rely on CloudGuard to protect their communities.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 glass-effect rounded-3xl p-8 md:p-12 border border-white/20 shadow-layered">

            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="Quote" size={32} color="white" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-center space-y-6">
              <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
                "{testimonials?.[currentTestimonial]?.content}"
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center space-x-1">
                {renderStars(testimonials?.[currentTestimonial]?.rating)}
              </div>

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6 border-t border-slate-200">
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={testimonials?.[currentTestimonial]?.avatar}
                    alt={testimonials?.[currentTestimonial]?.avatarAlt}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />

                  {testimonials?.[currentTestimonial]?.verified &&
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Icon name="Check" size={12} color="white" strokeWidth={3} />
                    </div>
                  }
                </div>

                {/* Author Details */}
                <div className="text-center sm:text-left">
                  <div className="font-bold text-slate-900 text-lg">
                    {testimonials?.[currentTestimonial]?.name}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {testimonials?.[currentTestimonial]?.role}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-slate-500 mt-1">
                    <Icon name="MapPin" size={14} />
                    <span>{testimonials?.[currentTestimonial]?.location}</span>
                    <span>•</span>
                    <span>{testimonials?.[currentTestimonial]?.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials?.map((_, index) =>
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentTestimonial ?
              'bg-gradient-to-r from-cyan-500 to-teal-500 scale-125' : 'bg-slate-300 hover:bg-slate-400'}
                `
              } />

            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 glass-effect rounded-full border border-white/20 flex items-center justify-center hover:bg-white/90 transition-all duration-300 shadow-md">

            <Icon name="ChevronLeft" size={20} className="text-slate-600" />
          </button>

          <button
            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 glass-effect rounded-full border border-white/20 flex items-center justify-center hover:bg-white/90 transition-all duration-300 shadow-md">

            <Icon name="ChevronRight" size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-12 border-t border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}>

          <div className="flex items-center space-x-3 text-slate-600">
            <Icon name="Shield" size={20} className="text-green-600" />
            <span className="font-medium">Verified Reviews</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <Icon name="Users" size={20} className="text-blue-600" />
            <span className="font-medium">10,000+ Protected</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <Icon name="Award" size={20} className="text-amber-600" />
            <span className="font-medium">Government Certified</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <Icon name="Star" size={20} className="text-amber-400 fill-current" />
            <span className="font-medium">4.9/5 Rating</span>
          </div>
        </motion.div>
      </div>
    </section>);

};

export default TestimonialsSection;