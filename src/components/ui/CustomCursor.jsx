import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Optimize performance with refs for direct DOM manipulation
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    let mouseX = 0;
    let mouseY = 0;
    
    // Function to update cursor position with smoothing
    const updateCursorPosition = () => {
      if (!cursor || !ring) return;
      
      // Calculate smoothed position with lerp (linear interpolation)
      const friction = isMoving ? 0.2 : 0.15; // More responsive when moving
      
      lastX += (mouseX - lastX) * friction;
      lastY += (mouseY - lastY) * friction;
      
      // Apply transform with hardware acceleration
      cursor.style.transform = `translate3d(${lastX - 8}px, ${lastY - 8}px, 0) ${isHovering ? 'scale(2)' : 'scale(1)'}`;
      ring.style.transform = `translate3d(${lastX - 16}px, ${lastY - 16}px, 0) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`;
      
      requestAnimationFrame(updateCursorPosition);
    };
    
    // Start the animation loop
    requestAnimationFrame(updateCursorPosition);
    
    // More efficient mouse tracking
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setMousePosition({ x: e.clientX, y: e.clientY });
      isMoving = true;
      
      // Reset moving state after a short delay
      clearTimeout(window.movingTimeout);
      window.movingTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 600);
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);

    // Use a more efficient way to track interactive elements
    const observer = new MutationObserver(() => {
      const interactiveElements = document.querySelectorAll("button, a, .hover-trigger, input, select, textarea");
      interactiveElements.forEach(element => {
        element.removeEventListener("mouseenter", handleHoverStart);
        element.removeEventListener("mouseleave", handleHoverEnd);
        element.addEventListener("mouseenter", handleHoverStart);
        element.addEventListener("mouseleave", handleHoverEnd);
      });
    });

    // Initial setup of event listeners
    const interactiveElements = document.querySelectorAll("button, a, .hover-trigger, input, select, textarea");
    interactiveElements.forEach(element => {
      element.addEventListener("mouseenter", handleHoverStart);
      element.addEventListener("mouseleave", handleHoverEnd);
    });

    // Observe DOM changes to update event listeners
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      observer.disconnect();
      clearTimeout(window.movingTimeout);
      interactiveElements.forEach(element => {
        element.removeEventListener("mouseenter", handleHoverStart);
        element.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, []);

  // Add CSS for the ripple animation
  useEffect(() => {
    // Add the keyframes for the ripple effect
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes rippleEffect {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0.9;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          transform: translate(-50%, -50%) scale(6);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot - using ref for direct DOM manipulation */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-30 will-change-transform"
        style={{
          background: 'linear-gradient(45deg, #3B82F6, #60A5FA)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          borderRadius: '50%',
          transform: 'translate3d(0, 0, 0)',
          transition: isHovering ? 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.1s ease-out'
        }}
      />

      {/* Outer ring - using ref for direct DOM manipulation */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-30 will-change-transform"
        style={{
          border: '2px solid #3B82F6',
          borderRadius: '50%',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
          transform: 'translate3d(0, 0, 0)',
          transition: isHovering ? 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'transform 0.15s ease-out'
        }}
      />

      {/* Click animation - ripples centered exactly on the cursor dot */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            className="fixed pointer-events-none z-40"
            style={{ 
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: 0,
              height: 0
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Perfect rings emanating from center */}
            {[0, 1, 2].map((index) => (
              <div 
                key={index}
                className="absolute rounded-full"
                style={{ 
                  width: '16px',  // Start slightly larger than cursor dot for visibility
                  height: '16px', 
                  left: 0,
                  top: 0,
                  border: `2px solid rgba(59, 130, 246, ${0.9 - index * 0.2})`,
                  boxShadow: `0 0 ${8 + index * 4}px rgba(59, 130, 246, ${0.4 - index * 0.1})`,
                  background: 'transparent',
                  animation: `rippleEffect ${0.8 + index * 0.1}s cubic-bezier(0, 0.2, 0.8, 1) forwards ${index * 0.12}s`,
                  animationFillMode: 'both'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
