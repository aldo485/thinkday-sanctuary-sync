import { useState } from 'react';
import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import WheelOfLifeChart from '@/components/WheelOfLifeChart';

const WheelOfLife = () => {
  const { state, dispatch } = useThinkDay();
  const [scores, setScores] = useState<number[]>(
    state.currentSession?.wheelOfLife?.scores || 
    new Array(state.settings.wheelCategories.length).fill(5)
  );
  const [satisfaction, setSatisfaction] = useState<number[]>(
    state.currentSession?.wheelOfLife?.satisfaction || 
    new Array(state.settings.wheelCategories.length).fill(5)
  );

  const updateScore = (index: number, value: number[]) => {
    const newScores = [...scores];
    newScores[index] = value[0];
    setScores(newScores);

    // Update the context
    dispatch({
      type: 'UPDATE_WHEEL_OF_LIFE',
      payload: {
        categories: state.settings.wheelCategories,
        scores: newScores,
        satisfaction: satisfaction,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="sanctuary-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-primary">Assess Your Life Balance</CardTitle>
          <p className="text-muted-foreground">
            Rate your satisfaction from 1 (center) to 10 (edge) in each area of your life.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Chart */}
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <WheelOfLifeChart
                  categories={state.settings.wheelCategories}
                  scores={scores}
                  size={320}
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              {state.settings.wheelCategories.map((category, index) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{category}</Label>
                    <span className="text-sm font-bold text-primary bg-surface px-2 py-1 rounded">
                      {scores[index]}
                    </span>
                  </div>
                  <Slider
                    value={[scores[index]]}
                    onValueChange={(value) => updateScore(index, value)}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-surface rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> This wheel helps you visualize areas of your life that might need attention. 
              Areas with lower scores represent opportunities for growth and focus.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WheelOfLife;