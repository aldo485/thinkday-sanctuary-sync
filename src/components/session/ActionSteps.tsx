import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ActionSteps = () => {
  return (
    <Card className="sanctuary-border">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">Your Action Plan</CardTitle>
        <p className="text-muted-foreground">
          Commit to a decision and define your next concrete steps.
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Action Steps component coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionSteps;