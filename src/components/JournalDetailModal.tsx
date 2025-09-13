import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ThinkDaySession } from '@/contexts/ThinkDayContext';
import WheelOfLifeChart from '@/components/WheelOfLifeChart';

interface JournalDetailModalProps {
  session: ThinkDaySession | null;
  onClose: () => void;
}

const JournalDetailModal = ({ session, onClose }: JournalDetailModalProps) => {
  if (!session) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={!!session} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            Think Day Session
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">{formatDate(session.date)}</span>
            <Badge variant={session.isComplete ? "default" : "secondary"}>
              {session.isComplete ? 'Complete' : 'In Progress'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Wheel of Life */}
          {session.wheelOfLife && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Wheel of Life Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="w-80 h-80">
                    <WheelOfLifeChart
                      categories={session.wheelOfLife.categories}
                      scores={session.wheelOfLife.scores}
                      size={320}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {session.wheelOfLife.categories.map((category, index) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-muted-foreground">{category}:</span>
                      <span className="font-medium text-primary">
                        {session.wheelOfLife!.scores[index]}/10
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fear Setting */}
          {session.fearSetting && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Fear Setting Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.fearSetting.catalyst && (
                  <div>
                    <h4 className="font-semibold mb-2">What would I do if I knew I couldn't fail?</h4>
                    <p className="text-muted-foreground italic">"{session.fearSetting.catalyst}"</p>
                  </div>
                )}

                {session.fearSetting.fears && session.fearSetting.fears.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Defined Fears</h4>
                    <div className="space-y-3">
                      {session.fearSetting.fears.map((fear, index) => (
                        <div key={index} className="bg-surface p-3 rounded-md space-y-2">
                          <div>
                            <span className="text-sm font-medium">Fear:</span>
                            <p className="text-sm text-muted-foreground">{fear.fear}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Prevent:</span>
                            <p className="text-sm text-muted-foreground">{fear.prevent}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Repair:</span>
                            <p className="text-sm text-muted-foreground">{fear.repair}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.fearSetting.benefits && (
                  <div>
                    <h4 className="font-semibold mb-2">Potential Benefits</h4>
                    <p className="text-muted-foreground">{session.fearSetting.benefits}</p>
                  </div>
                )}

                {(session.fearSetting.costs?.sixMonths || session.fearSetting.costs?.oneYear || session.fearSetting.costs?.threeYears) && (
                  <div>
                    <h4 className="font-semibold mb-2">Cost of Inaction</h4>
                    <div className="space-y-2">
                      {session.fearSetting.costs.sixMonths && (
                        <div>
                          <span className="text-sm font-medium">6 Months:</span>
                          <p className="text-sm text-muted-foreground">{session.fearSetting.costs.sixMonths}</p>
                        </div>
                      )}
                      {session.fearSetting.costs.oneYear && (
                        <div>
                          <span className="text-sm font-medium">1 Year:</span>
                          <p className="text-sm text-muted-foreground">{session.fearSetting.costs.oneYear}</p>
                        </div>
                      )}
                      {session.fearSetting.costs.threeYears && (
                        <div>
                          <span className="text-sm font-medium">3 Years:</span>
                          <p className="text-sm text-muted-foreground">{session.fearSetting.costs.threeYears}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Journal Entries */}
          {session.journalEntries && session.journalEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Journal Reflections ({session.journalEntries.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.journalEntries.map((entry, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-2 text-foreground">{entry.prompt}</h4>
                    <div className="bg-surface p-4 rounded-md border-l-4 border-primary">
                      <p className="text-muted-foreground whitespace-pre-wrap font-secondary leading-relaxed">
                        {entry.response}
                      </p>
                    </div>
                    {index < session.journalEntries.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Steps */}
          {session.actionSteps && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-surface p-4 rounded-md border-l-4 border-primary">
                  <p className="whitespace-pre-wrap font-secondary leading-relaxed text-foreground">
                    {session.actionSteps}
                  </p>
                </div>
                
                {session.reviewDate && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium">Review Date:</span> {new Date(session.reviewDate).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JournalDetailModal;