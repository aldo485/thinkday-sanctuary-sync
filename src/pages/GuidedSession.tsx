import { useThinkDay } from '@/contexts/ThinkDayContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import WheelOfLife from '@/components/session/WheelOfLife';
import FearSetting from '@/components/session/FearSetting';
import Journaling from '@/components/session/Journaling';
import ActionSteps from '@/components/session/ActionSteps';
import SessionSummary from '@/components/session/SessionSummary';

const steps = [
  { name: 'Wheel of Life', component: WheelOfLife },
  { name: 'Fear Setting', component: FearSetting },
  { name: 'Journaling', component: Journaling },
  { name: 'Action Steps', component: ActionSteps },
  { name: 'Session Summary', component: SessionSummary },
];

const GuidedSession = () => {
  const { state, dispatch } = useThinkDay();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentStepComponent = steps[state.currentStep]?.component;
  const isLastStep = state.currentStep === steps.length - 1;
  const progress = ((state.currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      completeSession();
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrevious = () => {
    if (state.currentStep === 0) {
      // End session and go back to dashboard
      dispatch({ type: 'END_SESSION' });
      navigate('/');
    } else {
      dispatch({ type: 'PREV_STEP' });
    }
  };

  const completeSession = () => {
    dispatch({ type: 'COMPLETE_SESSION' });
    toast({
      title: "Think Day Complete! 🎉",
      description: "Your session has been saved. Great work on taking time for reflection.",
    });
    navigate('/');
  };

  if (!state.currentSession) {
    navigate('/');
    return null;
  }

  const CurrentStepComponent = currentStepComponent;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {state.currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
        <h1 className="text-2xl font-bold text-primary">
          {steps[state.currentStep]?.name}
        </h1>
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {CurrentStepComponent && <CurrentStepComponent />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{state.currentStep === 0 ? 'Exit Session' : 'Previous'}</span>
        </Button>

        <Button
          onClick={handleNext}
          className="flex items-center space-x-2 bg-sanctuary-gradient"
        >
          <span>{isLastStep ? 'Complete Session' : 'Next'}</span>
          {isLastStep ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default GuidedSession;