import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

export const MultiSelect = ({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  className = "",
}) => {
  const handleToggle = (val) => {
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onValueChange(newValue);
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`justify-between w-full ${className}`}>
          <span>{selectedLabels || placeholder}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => handleToggle(option.value)}
          >
            <Checkbox checked={value.includes(option.value)} />
            <span className="text-sm">{option.label}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
