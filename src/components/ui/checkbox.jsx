import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export const Checkbox = ({ id, checked, onCheckedChange, className, disabled }) => {
  return (
    <button
      type="button"
      id={id}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`flex items-center justify-center w-4 h-4 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      aria-checked={checked}
      role="checkbox"
      disabled={disabled}
    >
      {checked ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
    </button>
  );
};

export default Checkbox;
