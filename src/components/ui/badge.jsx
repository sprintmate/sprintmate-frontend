import React from "react";

const Badge = ({ children, variant = "blue", size = "default", glow = false, gradient = false, className, ...props }) => {
  const getVariantClasses = () => {
    const baseColors = {
      blue: gradient 
        ? "bg-gradient-to-r from-blue-500/10 via-blue-100/50 to-blue-500/10 text-blue-700 border-blue-200/50" 
        : "bg-blue-100 text-blue-700 border-blue-200",
      green: gradient 
        ? "bg-gradient-to-r from-green-500/10 via-green-100/50 to-green-500/10 text-green-700 border-green-200/50" 
        : "bg-green-100 text-green-700 border-green-200",
      purple: gradient 
        ? "bg-gradient-to-r from-purple-500/10 via-purple-100/50 to-purple-500/10 text-purple-700 border-purple-200/50" 
        : "bg-purple-100 text-purple-700 border-purple-200",
      yellow: gradient 
        ? "bg-gradient-to-r from-yellow-500/10 via-yellow-100/50 to-yellow-500/10 text-yellow-700 border-yellow-200/50" 
        : "bg-yellow-100 text-yellow-700 border-yellow-200",
      red: gradient 
        ? "bg-gradient-to-r from-red-500/10 via-red-100/50 to-red-500/10 text-red-700 border-red-200/50" 
        : "bg-red-100 text-red-700 border-red-200",
    };

    const glowEffects = {
      blue: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
      green: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
      purple: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      yellow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]",
      red: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
    };

    return `${baseColors[variant]} ${glow ? glowEffects[variant] : ''}`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "lg":
        return "text-sm px-3 py-1";
      case "default":
      default:
        return "text-xs px-2.5 py-0.5";
    }
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm
        transition-all duration-200 ease-in-out hover:scale-105
        ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
