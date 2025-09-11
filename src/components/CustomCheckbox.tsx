import React from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  size = "medium",
  disabled = false,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  const iconSizes = {
    small: "w-2.5 h-2.5",
    medium: "w-3 h-3",
    large: "w-4 h-4",
  };

  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${className}
        relative inline-flex items-center justify-center
        rounded-md border-2 transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          checked
            ? "bg-primary-600 border-primary-600 text-white shadow-md hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-500"
            : "bg-white border-gray-300 text-transparent hover:border-primary-400 hover:bg-primary-50 focus:ring-primary-500"
        }
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-sm"
        }
      `}
    >
      {checked && (
        <Check
          className={`${iconSizes[size]} transition-all duration-200 ease-in-out`}
        />
      )}
    </button>
  );
};

export default CustomCheckbox;
