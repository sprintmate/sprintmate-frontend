import React from 'react';
import { motion } from 'framer-motion';

// Animated card component for dashboard items
export const AnimatedCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated section with staggered children
export const StaggeredSection = ({ children, title, actionButton = null, delay = 0, staggerDelay = 0.1 }) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <section className="space-y-4">
      <motion.div 
        className="flex justify-between items-center border-b pb-3 border-gray-200/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-1 h-5 bg-blue-600 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: "1.25rem" }}
            transition={{ duration: 0.4, delay: delay + 0.2 }}
          />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {actionButton}
      </motion.div>

      <div className="space-y-4">
        {childrenArray.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: delay + (index * staggerDelay),
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Shimmer effect element
export const Shimmer = ({ width = "w-full", height = "h-4" }) => {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded ${width} ${height}`}></div>
  );
};

// Number counter animation
export const AnimatedCounter = ({ value, duration = 1.5, delay = 0 }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.span
        initial={{ value: 0 }}
        animate={{ value }}
        transition={{ duration, delay }}
      >
        {useMotionValue => Math.round(useMotionValue)}
      </motion.span>
    </motion.span>
  );
};

// Glow effect container
export const GlowContainer = ({ children, color = "blue" }) => {
  const colorMap = {
    blue: "before:bg-blue-500/20",
    green: "before:bg-green-500/20",
    purple: "before:bg-purple-500/20",
    yellow: "before:bg-amber-500/20",
  };

  return (
    <div className={`relative overflow-hidden group ${colorMap[color]
      } before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:rounded-lg before:duration-500 hover:before:opacity-100 before:-z-10 before:blur-xl`}
    >
      {children}
    </div>
  );
};