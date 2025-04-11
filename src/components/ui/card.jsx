import React from "react";

// Main Card component
const Card = React.forwardRef(({ className, hover = true, variant = "default", glassmorphism = false, ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "blue":
        return "bg-gradient-to-br from-white via-blue-50 to-blue-100/50";
      case "green":
        return "bg-gradient-to-br from-white via-green-50 to-green-100/50";
      case "purple":
        return "bg-gradient-to-br from-white via-purple-50 to-purple-100/50";
      case "yellow":
        return "bg-gradient-to-br from-white via-yellow-50 to-yellow-100/50";
      case "glass":
        return "bg-white/10 backdrop-blur-md border-white/20";
      case "default":
      default:
        return glassmorphism 
          ? "bg-white/80 backdrop-blur-sm" 
          : "bg-white dark:bg-gray-800";
    }
  };

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-gray-200/50 shadow-sm ${getVariantClasses()} 
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5' : ''} 
        ${className}`}
      {...props}
    />
  );
});

Card.displayName = "Card";

// Card Header component
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

// Card Title component
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

// Card Description component
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

// Card Content component
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 ${className}`}
    {...props}
  />
));

CardContent.displayName = "CardContent";

// Card Footer component
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-6 pt-0 ${className}`}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
};
