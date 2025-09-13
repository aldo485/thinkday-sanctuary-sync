import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Journaling = () => {
  return (
    <Card className="sanctuary-border">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">Journaling Prompts</CardTitle>
        <p className="text-muted-foreground">
          Select questions that call to you today, then start journaling.
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Journaling component coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Journaling;