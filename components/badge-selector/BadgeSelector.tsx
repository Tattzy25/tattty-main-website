import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BadgeSelectorProps {
  options: string[];
  selectedIndices: number[];
  onOptionClick: (option: string, index: number) => void;
  label?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({
  options,
  selectedIndices,
  onOptionClick,
  label = 'Select all that apply:',
  variant = 'secondary',
  className = '',
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <>
      <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
      <div className={`flex flex-wrap gap-1.5 sm:gap-2 justify-center ${className}`}>
        {options.map((option: string, index: number) => (
          <Badge 
            key={index}
            variant={variant}
            onClick={() => onOptionClick(option, index)}
            className={`cursor-pointer text-xs sm:text-sm py-1 px-2 sm:px-3 transition-all duration-200 transform hover:scale-105 rounded-2xl ${
              selectedIndices.includes(index)
                ? 'bg-orange-500/30 text-orange-300 border-orange-500/50'
                : 'hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30'
            }`}
          >
            {option}
          </Badge>
        ))}
      </div>
    </>
  );
};
