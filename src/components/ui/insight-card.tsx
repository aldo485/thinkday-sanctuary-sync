import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { RatingInput } from './rating-input';
import { Lightbulb, Target, Heart, Briefcase, Dumbbell, DollarSign } from 'lucide-react';

interface InsightCardProps {
  prompt: string;
  response: string;
  priority?: number;
  category?: 'reflection' | 'growth' | 'relationship' | 'career' | 'health' | 'financial';
  onPriorityChange?: (priority: number) => void;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

const categoryConfig = {
  reflection: { icon: Lightbulb, label: 'Reflection', color: 'bg-sanctuary-gold/10 text-sanctuary-gold' },
  growth: { icon: Target, label: 'Growth', color: 'bg-green-500/10 text-green-400' },
  relationship: { icon: Heart, label: 'Relationships', color: 'bg-pink-500/10 text-pink-400' },
  career: { icon: Briefcase, label: 'Career', color: 'bg-blue-500/10 text-blue-400' },
  health: { icon: Dumbbell, label: 'Health', color: 'bg-emerald-500/10 text-emerald-400' },
  financial: { icon: DollarSign, label: 'Financial', color: 'bg-yellow-500/10 text-yellow-400' },
};

export const InsightCard: React.FC<InsightCardProps> = ({
  prompt,
  response,
  priority = 0,
  category,
  onPriorityChange,
  onCategoryChange,
  className
}) => {
  const categoryInfo = category ? categoryConfig[category] : null;
  const IconComponent = categoryInfo?.icon;

  return (
    <Card className={cn('sanctuary-border hover:sanctuary-glow transition-all duration-300', className)}>
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-sm font-medium text-foreground leading-relaxed">
            {prompt}
          </h4>
          
          {categoryInfo && (
            <Badge className={cn('flex items-center gap-1 text-xs', categoryInfo.color)}>
              <IconComponent className="w-3 h-3" />
              {categoryInfo.label}
            </Badge>
          )}
        </div>
        
        {onPriorityChange && (
          <RatingInput
            value={priority}
            onChange={onPriorityChange}
            max={5}
            size="sm"
            label="Insight Priority"
            description="How valuable is this insight?"
          />
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="bg-surface/50 rounded-lg p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {response || "No response yet..."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};