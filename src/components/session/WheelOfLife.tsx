import { useState } from 'react';
import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RatingInput } from '@/components/ui/rating-input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import WheelOfLifeChart from '@/components/WheelOfLifeChart';
import { Target, TrendingUp, Plus, X, Settings } from 'lucide-react';

// Category configuration with emojis
const categoryGroups = {
  'Health & Wellness': {
    emoji: '🌟',
    areas: [
      { name: 'Physical', emoji: '💪', originalIndex: 6 },
      { name: 'Mental', emoji: '🧠', originalIndex: 5 },
      { name: 'Spiritual', emoji: '🙏', originalIndex: 4 },
      { name: 'Joy', emoji: '😊', originalIndex: 9 },
    ]
  },
  'Personal Growth': {
    emoji: '🚀',
    areas: [
      { name: 'Growth', emoji: '🌱', originalIndex: 7 },
      { name: 'Mission', emoji: '🎯', originalIndex: 0 },
    ]
  },
  'Relationships': {
    emoji: '💝',
    areas: [
      { name: 'Family', emoji: '👨‍👩‍👧‍👦', originalIndex: 1 },
      { name: 'Friends', emoji: '👥', originalIndex: 2 },
      { name: 'Romance', emoji: '💕', originalIndex: 3 },
    ]
  },
  'Resources': {
    emoji: '💎',
    areas: [
      { name: 'Money', emoji: '💰', originalIndex: 8 },
    ]
  }
};

const WheelOfLife = () => {
  const { state, dispatch } = useThinkDay();
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [goals, setGoals] = useState<{[key: number]: string}>({});
  const [actions, setActions] = useState<{[key: number]: string[]}>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const scores = state.currentSession?.wheelOfLife?.scores || 
    new Array(state.settings.wheelCategories.length).fill(5);
  const satisfaction = state.currentSession?.wheelOfLife?.satisfaction || 
    new Array(state.settings.wheelCategories.length).fill(5);

  const updateScore = (index: number, value: number[]) => {
    const newScores = [...scores];
    newScores[index] = value[0];

    dispatch({
      type: 'UPDATE_WHEEL_OF_LIFE',
      payload: {
        categories: state.settings.wheelCategories,
        scores: newScores,
        satisfaction: satisfaction,
      },
    });
  };

  const updateSatisfaction = (index: number, value: number) => {
    const newSatisfaction = [...satisfaction];
    newSatisfaction[index] = value;

    dispatch({
      type: 'UPDATE_WHEEL_OF_LIFE',
      payload: {
        categories: state.settings.wheelCategories,
        scores: scores,
        satisfaction: newSatisfaction,
      },
    });
  };

  const addAction = (areaIndex: number) => {
    setActions(prev => ({
      ...prev,
      [areaIndex]: [...(prev[areaIndex] || []), '']
    }));
  };

  const updateAction = (areaIndex: number, actionIndex: number, value: string) => {
    setActions(prev => ({
      ...prev,
      [areaIndex]: prev[areaIndex]?.map((action, idx) => 
        idx === actionIndex ? value : action
      ) || []
    }));
  };

  const removeAction = (areaIndex: number, actionIndex: number) => {
    setActions(prev => ({
      ...prev,
      [areaIndex]: prev[areaIndex]?.filter((_, idx) => idx !== actionIndex) || []
    }));
  };

  const getAreaStatus = (score: number, satisfaction: number) => {
    const average = (score + satisfaction) / 2;
    if (average >= 8) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (average >= 6) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (average >= 4) return { status: 'needs attention', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'priority', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const openDrawerForArea = (index: number) => {
    setSelectedArea(index);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Life Areas by Category */}
      <Card className="sanctuary-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-primary">Life Balance Assessment</CardTitle>
          <p className="text-muted-foreground">
            Rate each area and click "Details" to set goals and actions.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(categoryGroups).map(([categoryName, categoryData]) => (
            <div key={categoryName} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <span className="text-2xl">{categoryData.emoji}</span>
                <h3 className="text-lg font-semibold text-primary">{categoryName}</h3>
              </div>

              {/* Areas Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {categoryData.areas.map((area) => {
                  const areaStatus = getAreaStatus(scores[area.originalIndex], satisfaction[area.originalIndex]);
                  return (
                    <Card 
                      key={area.originalIndex}
                      className={`p-4 transition-all hover:shadow-md ${areaStatus.bg} border-l-4 ${
                        areaStatus.status === 'excellent' ? 'border-l-green-500' :
                        areaStatus.status === 'good' ? 'border-l-blue-500' :
                        areaStatus.status === 'needs attention' ? 'border-l-yellow-500' :
                        'border-l-red-500'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header with emoji, category and status */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{area.emoji}</span>
                            <h4 className="font-medium text-lg">{area.name}</h4>
                          </div>
                          <Badge variant="outline" className={areaStatus.color}>
                            {areaStatus.status}
                          </Badge>
                        </div>

                        {/* Current Level Slider */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Current Level</Label>
                          <Slider
                            value={[scores[area.originalIndex]]}
                            onValueChange={(value) => updateScore(area.originalIndex, value)}
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Needs Work (1)</span>
                            <span className="font-medium">{scores[area.originalIndex]}/10</span>
                            <span>Excellent (10)</span>
                          </div>
                        </div>

                        {/* Satisfaction Rating */}
                        <RatingInput
                          value={satisfaction[area.originalIndex]}
                          onChange={(value) => updateSatisfaction(area.originalIndex, value)}
                          max={10}
                          label="Satisfaction Level"
                          description="How satisfied are you with this area?"
                        />

                        {/* Details Button */}
                        <div className="pt-2 border-t">
                          <Sheet open={isDrawerOpen && selectedArea === area.originalIndex} onOpenChange={setIsDrawerOpen}>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDrawerForArea(area.originalIndex)}
                                className="w-full justify-between text-sm"
                              >
                                Set Goals & Actions
                                <Settings className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                              <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                  <span className="text-xl">{area.emoji}</span>
                                  {area.name} - Goals & Actions
                                </SheetTitle>
                              </SheetHeader>
                              
                              <div className="space-y-6 mt-6">
                                {/* Goal Setting */}
                                <div className="space-y-4">
                                  <Label className="text-sm font-medium">Goal for this area</Label>
                                  <Textarea
                                    placeholder="What would you like to achieve in this area? Be specific and realistic..."
                                    value={goals[area.originalIndex] || ''}
                                    onChange={(e) => setGoals(prev => ({...prev, [area.originalIndex]: e.target.value}))}
                                    className="min-h-[80px]"
                                  />
                                </div>

                                {/* Action Steps */}
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium">Action Steps</Label>
                                    <Button 
                                      onClick={() => addAction(area.originalIndex)} 
                                      size="sm" 
                                      variant="outline"
                                      className="flex items-center gap-1"
                                    >
                                      <Plus className="h-4 w-4" />
                                      Add Action
                                    </Button>
                                  </div>
                                  
                                  {actions[area.originalIndex]?.map((action, actionIndex) => (
                                    <div key={actionIndex} className="flex gap-2">
                                      <Input
                                        placeholder="Enter an actionable step..."
                                        value={action}
                                        onChange={(e) => updateAction(area.originalIndex, actionIndex, e.target.value)}
                                        className="flex-1"
                                      />
                                      <Button
                                        onClick={() => removeAction(area.originalIndex, actionIndex)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  
                                  {(!actions[area.originalIndex] || actions[area.originalIndex].length === 0) && (
                                    <p className="text-sm text-muted-foreground italic">
                                      Add action steps to improve this area of your life.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Spider Chart Summary */}
      <Card className="sanctuary-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Life Balance Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="w-80 h-80">
              <WheelOfLifeChart
                categories={state.settings.wheelCategories}
                scores={scores}
                size={320}
              />
            </div>
          </div>
          
          {/* Summary Insights */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {scores.filter(score => score >= 8).length}
              </div>
              <div className="text-sm text-green-700">Strong Areas</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {scores.filter(score => score >= 4 && score < 8).length}
              </div>
              <div className="text-sm text-yellow-700">Areas for Growth</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {scores.filter(score => score < 4).length}
              </div>
              <div className="text-sm text-red-700">Priority Areas</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-surface rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              <strong>Balance Tip:</strong> Focus on your lowest-scoring areas first, but don't neglect maintaining your strong areas. 
              Small, consistent actions in priority areas can create significant improvements over time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelOfLife;