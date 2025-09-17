import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Download, 
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useMemo } from 'react';

const SessionSummary = () => {
  const { state, dispatch } = useThinkDay();
  const session = state.currentSession;

  const insights = useMemo(() => {
    if (!session) return null;

    const wheelData = session.wheelOfLife;
    const fearData = session.fearSetting;
    const journalEntries = session.journalEntries;
    
    let topStrengths: string[] = [];
    let improvementAreas: string[] = [];
    let averageScore = 0;
    
    if (wheelData) {
      const scores = wheelData.scores.map((score, index) => ({
        category: wheelData.categories[index],
        score: score
      }));
      
      averageScore = scores.reduce((sum, item) => sum + item.score, 0) / scores.length;
      
      topStrengths = scores
        .filter(item => item.score >= 8)
        .map(item => item.category)
        .slice(0, 3);
        
      improvementAreas = scores
        .filter(item => item.score <= 5)
        .map(item => item.category)
        .slice(0, 3);
    }
    
    const highPriorityFears = fearData?.fears.filter(fear => 
      fear.impact >= 7 && fear.likelihood >= 6
    ).length || 0;
    
    const keyJournalInsights = journalEntries
      .filter(entry => entry.priority && entry.priority >= 4)
      .slice(0, 3);
    
    return {
      topStrengths,
      improvementAreas,
      averageScore,
      highPriorityFears,
      keyJournalInsights,
      totalJournalEntries: journalEntries.length
    };
  }, [session]);

  const generateRecommendations = () => {
    if (!insights) return [];
    
    const recommendations = [];
    
    if (insights.improvementAreas.length > 0) {
      recommendations.push({
        type: 'improvement',
        title: 'Focus on Growth Areas',
        description: `Prioritize development in: ${insights.improvementAreas.join(', ')}`,
        icon: TrendingUp
      });
    }
    
    if (insights.highPriorityFears > 0) {
      recommendations.push({
        type: 'fear',
        title: 'Address Critical Fears',
        description: `${insights.highPriorityFears} high-impact fears need immediate attention`,
        icon: AlertCircle
      });
    }
    
    if (insights.topStrengths.length > 0) {
      recommendations.push({
        type: 'strength',
        title: 'Leverage Your Strengths',
        description: `Build on your strong areas: ${insights.topStrengths.join(', ')}`,
        icon: Star
      });
    }
    
    return recommendations.slice(0, 3);
  };

  const handleExportSummary = () => {
    // Generate a comprehensive text summary for export
    const exportData = {
      sessionDate: new Date(session?.date || '').toLocaleDateString(),
      wheelOfLife: session?.wheelOfLife,
      fearSetting: session?.fearSetting,
      journalEntries: session?.journalEntries,
      actionSteps: session?.actionSteps,
      insights: insights
    };
    
    const exportText = `
THINK DAY SANCTUARY - SESSION SUMMARY
Date: ${exportData.sessionDate}

WHEEL OF LIFE SCORES:
${exportData.wheelOfLife?.categories.map((cat, i) => 
  `${cat}: ${exportData.wheelOfLife?.scores[i]}/10`).join('\n') || 'Not completed'}

FEAR SETTING INSIGHTS:
Catalyst: ${exportData.fearSetting?.catalyst || 'Not specified'}
High Priority Fears: ${insights?.highPriorityFears || 0}

KEY JOURNAL INSIGHTS:
${exportData.journalEntries?.map(entry => 
  `${entry.prompt}: ${entry.response.slice(0, 100)}...`).join('\n\n') || 'No entries'}

ACTION STEPS:
${exportData.actionSteps || 'Not defined'}

RECOMMENDATIONS:
${generateRecommendations().map(rec => `• ${rec.title}: ${rec.description}`).join('\n')}
    `.trim();
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `think-day-session-${exportData.sessionDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scheduleNextSession = () => {
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 30); // 30 days from now
    
    dispatch({ 
      type: 'SET_REVIEW_DATE', 
      payload: nextReviewDate.toISOString() 
    });
  };

  if (!session || !insights) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-text-secondary">Complete the session to see your summary.</p>
        </CardContent>
      </Card>
    );
  }

  const recommendations = generateRecommendations();

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Session Overview */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-surface/30">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Session Complete!</CardTitle>
              <p className="text-text-secondary text-sm">
                {new Date(session.date).toLocaleDateString()} • 
                {session.journalEntries.length} insights captured
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-surface/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-sanctuary-gold" />
                <span className="font-semibold">Life Balance</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {insights.averageScore.toFixed(1)}/10
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-sanctuary-gold" />
                <span className="font-semibold">Strengths</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {insights.topStrengths.length}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-surface/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-semibold">Priority Fears</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {insights.highPriorityFears}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-sanctuary-gold" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.topStrengths.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-2">Your Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {insights.topStrengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {insights.improvementAreas.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-2">Growth Opportunities</h4>
              <div className="flex flex-wrap gap-2">
                {insights.improvementAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {insights.keyJournalInsights.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-2">Priority Insights</h4>
              <div className="space-y-2">
                {insights.keyJournalInsights.map((entry, index) => (
                  <div key={index} className="p-3 rounded-lg bg-surface/50 border-l-4 border-primary">
                    <p className="text-sm font-medium text-text-secondary mb-1">
                      {entry.prompt}
                    </p>
                    <p className="text-sm">
                      {entry.response.slice(0, 150)}
                      {entry.response.length > 150 ? '...' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface/30">
                  <div className="p-2 rounded-full bg-primary/10">
                    <rec.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{rec.title}</h4>
                    <p className="text-sm text-text-secondary">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleExportSummary}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Summary
            </Button>
            
            <Button 
              onClick={scheduleNextSession}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Next Review
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-text-secondary">
              Recommended next session: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
            <p className="text-xs text-text-secondary">
              Regular reflection helps maintain clarity and direction in your personal growth journey.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionSummary;