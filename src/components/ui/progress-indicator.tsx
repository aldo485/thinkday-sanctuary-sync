import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from './progress';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sanctuary';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  showNumbers = true,
  size = 'md',
  variant = 'sanctuary',
  className
}) => {
  const percentage = (current / total) * 100;
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2', 
    lg: 'h-3'
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        {showNumbers && (
          <>
            <span className="text-xs font-medium text-text-secondary">
              Step {current} of {total}
            </span>
            <span className="text-xs font-medium text-sanctuary-gold">
              {Math.round(percentage)}%
            </span>
          </>
        )}
      </div>
      
      <Progress
        value={percentage}
        className={cn(
          sizeClasses[size],
          variant === 'sanctuary' && 'bg-surface-hover'
        )}
      />
    </div>
  );
};