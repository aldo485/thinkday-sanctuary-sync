import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FearSetting = () => {
  return (
    <Card className="sanctuary-border">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">Fear Setting Exercise</CardTitle>
        <p className="text-muted-foreground">
          Confront what holds you back to find the path forward.
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Fear Setting component coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FearSetting;