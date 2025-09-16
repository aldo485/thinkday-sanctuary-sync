import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  max = 10,
  size = 'md',
  label,
  description,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={cn(
              'transition-colors duration-200 hover:scale-110 transform',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                rating <= value
                  ? 'fill-sanctuary-gold text-sanctuary-gold'
                  : 'text-border hover:text-sanctuary-gold/60'
              )}
            />
          </button>
        ))}
        
        <span className="ml-2 text-sm text-text-secondary">
          {value}/{max}
        </span>
      </div>
      
      {description && (
        <p className="text-xs text-text-secondary">{description}</p>
      )}
    </div>
  );
};