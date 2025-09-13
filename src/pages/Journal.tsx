import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, BookOpen, Target, Heart } from 'lucide-react';
import { useState } from 'react';
import JournalDetailModal from '@/components/JournalDetailModal';
import type { ThinkDaySession } from '@/contexts/ThinkDayContext';

const Journal = () => {
  const { state } = useThinkDay();
  const [selectedSession, setSelectedSession] = useState<ThinkDaySession | null>(null);

  const getSessionSummary = (session: ThinkDaySession) => {
    const components = [];
    if (session.wheelOfLife) components.push('Wheel of Life');
    if (session.fearSetting) components.push('Fear Setting');
    if (session.journalEntries.length > 0) components.push(`${session.journalEntries.length} Journal Entries`);
    if (session.actionSteps) components.push('Action Steps');
    return components.join(' • ');
  };

  const getSessionIcon = (session: ThinkDaySession) => {
    if (session.wheelOfLife) return <Target className="h-5 w-5 text-primary" />;
    if (session.fearSetting) return <Heart className="h-5 w-5 text-primary" />;
    if (session.journalEntries.length > 0) return <BookOpen className="h-5 w-5 text-primary" />;
    return <CalendarDays className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">My Journal</h1>
        <p className="text-muted-foreground">A log of all your past Think Day sessions.</p>
      </header>

      {state.completedSessions.length > 0 ? (
        <div className="space-y-4">
          {state.completedSessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer sanctuary-hover sanctuary-border transition-all duration-200"
              onClick={() => setSelectedSession(session)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSessionIcon(session)}
                    <div>
                      <CardTitle className="text-lg">
                        Think Day Session
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {session.isComplete ? 'Complete' : 'In Progress'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {getSessionSummary(session)}
                </p>
                
                {session.actionSteps && (
                  <div className="bg-surface p-3 rounded-md border-l-4 border-primary">
                    <p className="text-sm font-medium text-foreground">
                      Key Actions:
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {session.actionSteps.split('\n').filter(step => step.trim())[0] || 'No action steps recorded'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="sanctuary-border">
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No journal entries yet
            </h3>
            <p className="text-muted-foreground">
              Start your first Think Day session to begin building your personal sanctuary of reflection.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Journal Detail Modal */}
      <JournalDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
};

export default Journal;