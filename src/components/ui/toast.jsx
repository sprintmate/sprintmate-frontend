import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Toast = ({ title, description, variant = "default", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const variantClasses = {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div
      className={`rounded-lg border shadow-md p-4 w-80 
                 ${variantClasses[variant] || variantClasses.default}
                 animate-in fade-in slide-in-from-right-5`}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <h3 className="font-medium text-sm">{title}</h3>}
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close toast"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
