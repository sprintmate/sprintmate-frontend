import React from "react";

const Button = React.forwardRef(({ 
  className, 
  children, 
  variant = "primary", 
  size = "md", 
  ...props 
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "outline":
        return "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors";
      case "ghost":
        return "bg-transparent text-blue-600 hover:bg-blue-50 transition-colors";
      default:
        return "btn-primary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2";
      case "lg":
        return "px-6 py-3 text-lg";
      case "xl":
        return "px-8 py-4 text-xl";
      default:
        return "px-4 py-2";
    }
  };

  return (
    <button
      className={`font-medium rounded-lg flex items-center justify-center ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
