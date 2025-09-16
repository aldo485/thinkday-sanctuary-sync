import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useThinkDay } from '@/contexts/ThinkDayContext';
import { AlertTriangle, Target, Shield, Plus, X, Lightbulb } from 'lucide-react';

const FearSetting = () => {
  const { state, dispatch } = useThinkDay();
  const [currentFear, setCurrentFear] = useState('');
  const [prevent, setPrevent] = useState('');
  const [repair, setRepair] = useState('');
  const [selectedFearIndex, setSelectedFearIndex] = useState<number | null>(null);

  const fearData = state.currentSession?.fearSetting || {
    catalyst: '',
    fears: [],
    benefits: '',
    costs: {
      sixMonths: '',
      oneYear: '',
      threeYears: ''
    }
  };

  const handleAddFear = () => {
    if (!currentFear.trim()) return;
    
    const newFear = {
      fear: currentFear.trim(),
      prevent: '',
      repair: '',
      likelihood: 5,
      impact: 5
    };

    dispatch({
      type: 'UPDATE_FEAR_SETTING',
      payload: {
        ...fearData,
        fears: [...fearData.fears, newFear]
      }
    });

    setCurrentFear('');
    setSelectedFearIndex(fearData.fears.length);
  };

  const handleUpdateFear = (index: number, field: 'prevent' | 'repair', value: string) => {
    const updatedFears = [...fearData.fears];
    updatedFears[index] = {
      ...updatedFears[index],
      [field]: value
    };

    dispatch({
      type: 'UPDATE_FEAR_SETTING',
      payload: {
        ...fearData,
        fears: updatedFears
      }
    });
  };

  const handleUpdateField = (field: 'catalyst' | 'benefits', value: string) => {
    dispatch({
      type: 'UPDATE_FEAR_SETTING',
      payload: {
        ...fearData,
        [field]: value
      }
    });
  };

  const handleUpdateCosts = (period: 'sixMonths' | 'oneYear' | 'threeYears', value: string) => {
    dispatch({
      type: 'UPDATE_FEAR_SETTING',
      payload: {
        ...fearData,
        costs: {
          ...fearData.costs,
          [period]: value
        }
      }
    });
  };

  const handleSelectFear = (index: number) => {
    setSelectedFearIndex(index);
    const selectedFear = fearData.fears[index];
    setPrevent(selectedFear.prevent);
    setRepair(selectedFear.repair);
  };

  const handleRemoveFear = (index: number) => {
    const updatedFears = fearData.fears.filter((_, i) => i !== index);
    
    dispatch({
      type: 'UPDATE_FEAR_SETTING',
      payload: {
        ...fearData,
        fears: updatedFears
      }
    });

    if (selectedFearIndex === index) {
      setSelectedFearIndex(null);
    } else if (selectedFearIndex !== null && selectedFearIndex > index) {
      setSelectedFearIndex(selectedFearIndex - 1);
    }
  };

  const selectedFear = selectedFearIndex !== null ? fearData.fears[selectedFearIndex] : null;

  return (
    <div className="space-y-6">
      <Card className="sanctuary-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-primary">Fear Setting Exercise</CardTitle>
          <p className="text-muted-foreground">
            Confront what holds you back to find the path forward.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Catalyst */}
          <div>
            <Label htmlFor="catalyst" className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              What's driving this fear-setting session?
            </Label>
            <Textarea
              id="catalyst"
              value={fearData.catalyst}
              onChange={(e) => handleUpdateField('catalyst', e.target.value)}
              placeholder="e.g., Considering a career change, starting a business, making a big life decision..."
              className="min-h-[80px]"
            />
          </div>

          {/* Add New Fear */}
          <div>
            <Label htmlFor="new-fear" className="text-sm font-medium mb-2 block flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              What specific fears are holding you back?
            </Label>
            <div className="flex gap-2">
              <Input
                id="new-fear"
                value={currentFear}
                onChange={(e) => setCurrentFear(e.target.value)}
                placeholder="e.g., Failure, financial loss, rejection..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddFear()}
              />
              <Button onClick={handleAddFear} disabled={!currentFear.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Fear List */}
          {fearData.fears.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Your Fears</Label>
              <div className="flex flex-wrap gap-2">
                {fearData.fears.map((fear, index) => (
                  <div key={index} className="relative group">
                    <Badge
                      variant={index === selectedFearIndex ? "default" : "secondary"}
                      className="cursor-pointer pr-8"
                      onClick={() => handleSelectFear(index)}
                    >
                      {fear.fear}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFear(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fear Analysis */}
          {selectedFear && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Analyzing: "{selectedFear.fear}"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-medium mb-2 block flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    How can you prevent this fear from becoming reality?
                  </Label>
                  <Textarea
                    value={prevent}
                    onChange={(e) => {
                      setPrevent(e.target.value);
                      handleUpdateFear(selectedFearIndex!, 'prevent', e.target.value);
                    }}
                    placeholder="List specific actions you can take to prevent this fear..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="font-medium mb-2 block flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    How would you repair the damage if it happened?
                  </Label>
                  <Textarea
                    value={repair}
                    onChange={(e) => {
                      setRepair(e.target.value);
                      handleUpdateFear(selectedFearIndex!, 'repair', e.target.value);
                    }}
                    placeholder="What steps would you take to recover and move forward..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits and Costs */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Benefits of Taking Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={fearData.benefits}
                  onChange={(e) => handleUpdateField('benefits', e.target.value)}
                  placeholder="What positive outcomes could result from facing these fears..."
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Cost of Inaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs font-medium mb-1 block">In 6 months</Label>
                  <Textarea
                    value={fearData.costs.sixMonths}
                    onChange={(e) => handleUpdateCosts('sixMonths', e.target.value)}
                    placeholder="What will you miss out on..."
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">In 1 year</Label>
                  <Textarea
                    value={fearData.costs.oneYear}
                    onChange={(e) => handleUpdateCosts('oneYear', e.target.value)}
                    placeholder="How will inaction affect you..."
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">In 3 years</Label>
                  <Textarea
                    value={fearData.costs.threeYears}
                    onChange={(e) => handleUpdateCosts('threeYears', e.target.value)}
                    placeholder="What regrets might you have..."
                    className="min-h-[60px] text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {fearData.fears.length === 0 && !fearData.catalyst && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Start by describing what's driving this fear-setting session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FearSetting;