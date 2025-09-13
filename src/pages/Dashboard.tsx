import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen, Target, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { state, dispatch } = useThinkDay();
  const navigate = useNavigate();

  const startNewThinkDay = () => {
    dispatch({ type: 'START_GUIDED_SESSION' });
    navigate('/session');
  };

  const openTool = (tool: string) => {
    dispatch({ type: 'START_NEW_SESSION' });
    navigate('/session');
  };

  const getRecentActions = () => {
    return state.completedSessions
      .slice(0, 3)
      .map(session => ({
        id: session.id,
        date: new Date(session.date).toLocaleDateString(),
        actionSteps: session.actionSteps.split('\n').filter(step => step.trim())[0] || 'No action steps recorded',
      }));
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 animate-glow">
          Think Day Sanctuary
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          A private space for clarity, motivation, and courage.
        </p>
      </header>

      {/* Main Action */}
      <div className="text-center">
        <Button
          onClick={startNewThinkDay}
          size="lg"
          className="bg-sanctuary-gradient hover:scale-105 transition-transform duration-200 shadow-glow px-8 py-4 text-lg font-semibold"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start a New Think Day
        </Button>
      </div>

      {/* Toolbox */}
      <Card className="sanctuary-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">The Toolbox</CardTitle>
          <p className="text-muted-foreground">For quick, focused reflections.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => openTool('wheel-of-life')}
              className="p-6 h-auto flex-col space-y-2 sanctuary-hover"
            >
              <Target className="h-8 w-8 text-primary" />
              <span className="font-semibold">Assess my Wheel of Life</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => openTool('fear-setting')}
              className="p-6 h-auto flex-col space-y-2 sanctuary-hover"
            >
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="font-semibold">Work Through a Fear</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => openTool('journaling')}
              className="p-6 h-auto flex-col space-y-2 sanctuary-hover"
            >
              <CalendarDays className="h-8 w-8 text-primary" />
              <span className="font-semibold">Explore Journal Prompts</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card className="sanctuary-border">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Recent Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          {getRecentActions().length > 0 ? (
            <div className="space-y-3">
              {getRecentActions().map((action) => (
                <div
                  key={action.id}
                  className="bg-surface p-4 rounded-lg border-l-4 border-primary transition-all duration-200 hover:bg-surface-hover"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-foreground leading-relaxed flex-1">
                      {action.actionSteps}
                    </p>
                    <Badge variant="outline" className="ml-4 shrink-0">
                      {action.date}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent action items. Start your first Think Day to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;