import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const FadeIn = ({ children, delay = 0, duration = 0.5, y = 30, once = true, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ children, direction = "right", delay = 0, duration = 0.5, distance = 100, once = true, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  });

  const getDirection = () => {
    switch (direction) {
      case "left": return { x: -distance };
      case "right": return { x: distance };
      case "up": return { y: -distance };
      case "down": return { y: distance };
      default: return { x: distance };
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getDirection() }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getDirection() }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children, delay = 0, duration = 0.5, once = true, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, staggerChildren = 0.1, delayChildren = 0, once = true, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: once, 
    threshold: 0.1,
  });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScrollTrigger = ({ children, className = "", onEnter = () => {}, onExit = () => {} }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
  });

  React.useEffect(() => {
    if (inView) {
      onEnter();
    } else {
      onExit();
    }
  }, [inView, onEnter, onExit]);

  return (
    <div 
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
};

export const DirectionalSlide = ({ children, scrollDirection, delay = 0, duration = 0.5, distance = 100, once = false, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  });

  // Determine the initial position based on scroll direction
  const getInitialPosition = () => {
    return scrollDirection === 'down' ? { x: distance } : { x: -distance };
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1.0],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const DirectionalStaggerContainer = ({ 
  children, 
  scrollDirection,
  staggerChildren = 0.1, 
  delayChildren = 0, 
  once = false, 
  className = "" 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once, 
    threshold: 0.1,
  });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { scrollDirection }) 
          : child
      )}
    </motion.div>
  );
};

export const DirectionalStaggerItem = ({ children, scrollDirection = 'down', className = "" }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      x: scrollDirection === 'down' ? 100 : -100 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };
  
  return (
    <motion.div
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
