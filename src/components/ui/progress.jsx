import React from "react";

const Progress = ({ 
  value = 0, 
  max = 100, 
  className = "", 
  indicatorColor = "blue",
  ...props 
}) => {
  // Ensure value is within bounds
  const safeValue = Math.max(0, Math.min(value, max));
  const percentage = (safeValue / max) * 100;
  
  // Get the indicator color class
  const getIndicatorColorClass = () => {
    const baseColors = {
      "blue": "bg-blue-600",
      "green": "bg-green-600",
      "purple": "bg-purple-600",
      "yellow": "bg-yellow-500",
      "amber": "bg-amber-500",
      "red": "bg-red-600",
      "gray": "bg-gray-600",
    };
    
    return baseColors[indicatorColor] || "bg-blue-600";
  };

  return (
    <div 
      className={`w-full overflow-hidden rounded-full bg-gray-100 ${className}`} 
      role="progressbar" 
      aria-valuemin={0} 
      aria-valuemax={max} 
      aria-valuenow={safeValue}
      {...props}
    >
      <div
        className={`h-full transition-all duration-300 ease-in-out ${getIndicatorColorClass()}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { Progress };
