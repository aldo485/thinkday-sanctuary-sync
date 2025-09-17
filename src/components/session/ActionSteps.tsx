import { useState } from 'react';
import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Target, 
  Plus, 
  Calendar as CalendarIcon, 
  Zap, 
  TrendingUp, 
  Clock, 
  X,
  CheckCircle2,
  Download,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'wheel' | 'fear' | 'journal' | 'custom';
  priority: 'quick-win' | 'major-project' | 'fill-in' | 'thankless';
  impact: number; // 1-10
  effort: number; // 1-10
  dueDate?: Date;
  completed: boolean;
  smart: {
    specific: boolean;
    measurable: boolean;
    achievable: boolean;
    relevant: boolean;
    timeBound: boolean;
  };
}

const priorityConfig = {
  'quick-win': { 
    label: 'Quick Win', 
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: Zap,
    description: 'High Impact, Low Effort'
  },
  'major-project': { 
    label: 'Major Project', 
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: TrendingUp,
    description: 'High Impact, High Effort'
  },
  'fill-in': { 
    label: 'Fill-in Task', 
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: Clock,
    description: 'Low Impact, Low Effort'
  },
  'thankless': { 
    label: 'Thankless Task', 
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: AlertTriangle,
    description: 'Low Impact, High Effort'
  }
};

const ActionSteps = () => {
  const { state } = useThinkDay();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newAction, setNewAction] = useState<Partial<ActionItem>>({
    title: '',
    description: '',
    category: 'custom',
    impact: 5,
    effort: 5,
    completed: false,
    smart: {
      specific: false,
      measurable: false,
      achievable: false,
      relevant: false,
      timeBound: false
    }
  });

  const calculatePriority = (impact: number, effort: number): ActionItem['priority'] => {
    const highImpact = impact >= 7;
    const lowEffort = effort <= 4;
    
    if (highImpact && lowEffort) return 'quick-win';
    if (highImpact && !lowEffort) return 'major-project';
    if (!highImpact && lowEffort) return 'fill-in';
    return 'thankless';
  };

  const addAction = () => {
    if (!newAction.title?.trim()) return;
    
    const priority = calculatePriority(newAction.impact || 5, newAction.effort || 5);
    const action: ActionItem = {
      id: Date.now().toString(),
      title: newAction.title,
      description: newAction.description || '',
      category: newAction.category || 'custom',
      priority,
      impact: newAction.impact || 5,
      effort: newAction.effort || 5,
      dueDate: newAction.dueDate,
      completed: false,
      smart: newAction.smart || {
        specific: false,
        measurable: false,
        achievable: false,
        relevant: false,
        timeBound: false
      }
    };

    setActions(prev => [...prev, action]);
    setNewAction({
      title: '',
      description: '',
      category: 'custom',
      impact: 5,
      effort: 5,
      completed: false,
      smart: {
        specific: false,
        measurable: false,
        achievable: false,
        relevant: false,
        timeBound: false
      }
    });
    setShowAddAction(false);
  };

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(action => 
      action.id === id ? { ...action, completed: !action.completed } : action
    ));
  };

  const removeAction = (id: string) => {
    setActions(prev => prev.filter(action => action.id !== id));
  };

  const updateActionSmart = (id: string, smartKey: keyof ActionItem['smart'], value: boolean) => {
    setActions(prev => prev.map(action => 
      action.id === id 
        ? { 
            ...action, 
            smart: { ...action.smart, [smartKey]: value }
          }
        : action
    ));
  };

  const completedActions = actions.filter(a => a.completed).length;
  const totalActions = actions.length;
  const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  const groupedActions = {
    'quick-win': actions.filter(a => a.priority === 'quick-win'),
    'major-project': actions.filter(a => a.priority === 'major-project'),
    'fill-in': actions.filter(a => a.priority === 'fill-in'),
    'thankless': actions.filter(a => a.priority === 'thankless')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="sanctuary-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-primary flex items-center justify-center gap-2">
            <Target className="h-5 w-5" />
            Your SMART Action Plan
          </CardTitle>
          <p className="text-muted-foreground">
            Transform insights into actionable, time-bound goals using the SMART framework.
          </p>
          
          {totalActions > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{completedActions}/{totalActions} completed</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Priority Matrix Overview */}
      <Card className="sanctuary-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Priority Matrix
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Actions are automatically categorized by impact vs effort analysis.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(priorityConfig).map(([key, config]) => {
              const count = groupedActions[key as keyof typeof groupedActions].length;
              const Icon = config.icon;
              return (
                <div key={key} className={cn('p-4 rounded-lg border-2', config.color)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{config.label}</span>
                    <Badge variant="secondary" className="ml-auto">{count}</Badge>
                  </div>
                  <p className="text-xs opacity-80">{config.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      {Object.entries(groupedActions).map(([priority, priorityActions]) => {
        if (priorityActions.length === 0) return null;
        
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        const Icon = config.icon;
        
        return (
          <Card key={priority} className="sanctuary-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {config.label} ({priorityActions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {priorityActions.map((action) => (
                <div key={action.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={action.completed}
                        onCheckedChange={() => toggleAction(action.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-medium",
                          action.completed && "line-through text-muted-foreground"
                        )}>
                          {action.title}
                        </h4>
                        {action.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        )}
                        {action.dueDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            Due: {format(action.dueDate, 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeAction(action.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* SMART Criteria */}
                  <div className="pl-7">
                    <div className="text-xs text-muted-foreground mb-2">SMART Criteria:</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(action.smart).map(([key, value]) => (
                        <Badge
                          key={key}
                          variant={value ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer text-xs",
                            value ? "bg-green-500/10 text-green-400 border-green-500/20" : ""
                          )}
                          onClick={() => updateActionSmart(action.id, key as keyof ActionItem['smart'], !value)}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          {value && <CheckCircle2 className="h-3 w-3 ml-1" />}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Impact/Effort indicators */}
                  <div className="pl-7 flex gap-4 text-xs text-muted-foreground">
                    <span>Impact: {action.impact}/10</span>
                    <span>Effort: {action.effort}/10</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Add New Action */}
      <Card className="sanctuary-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Add New Action</CardTitle>
            {!showAddAction && (
              <Button onClick={() => setShowAddAction(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Action
              </Button>
            )}
          </div>
        </CardHeader>
        
        {showAddAction && (
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action Title</Label>
                <Input
                  placeholder="What specific action will you take?"
                  value={newAction.title || ''}
                  onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newAction.category || 'custom'} 
                  onValueChange={(value) => setNewAction(prev => ({ ...prev, category: value as ActionItem['category'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheel">From Wheel of Life</SelectItem>
                    <SelectItem value="fear">From Fear Setting</SelectItem>
                    <SelectItem value="journal">From Journaling</SelectItem>
                    <SelectItem value="custom">Custom Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the specific steps and outcomes..."
                value={newAction.description || ''}
                onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Impact (1-10)</Label>
                <Select 
                  value={newAction.impact?.toString() || '5'} 
                  onValueChange={(value) => setNewAction(prev => ({ ...prev, impact: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Effort (1-10)</Label>
                <Select 
                  value={newAction.effort?.toString() || '5'} 
                  onValueChange={(value) => setNewAction(prev => ({ ...prev, effort: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {newAction.dueDate ? format(newAction.dueDate, 'MMM d, yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newAction.dueDate}
                      onSelect={(date) => setNewAction(prev => ({ ...prev, dueDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddAction(false)}>
                Cancel
              </Button>
              <Button onClick={addAction} disabled={!newAction.title?.trim()}>
                Add Action
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Export Summary */}
      {totalActions > 0 && (
        <Card className="sanctuary-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <Button className="flex items-center gap-2" variant="outline">
                <Download className="h-4 w-4" />
                Export Action Plan
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Generate a summary of your action plan for offline reference
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActionSteps;