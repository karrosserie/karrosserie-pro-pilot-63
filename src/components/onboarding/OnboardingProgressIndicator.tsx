import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/onboarding/useOnboarding';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface OnboardingProgressIndicatorProps {
  tunnel?: 'tunnel1' | 'tunnel2' | 'tunnel3';
  showDetails?: boolean;
}

const tunnelLabels = {
  tunnel1: 'Profil carrossier',
  tunnel2: 'Workflow métier',
  tunnel3: 'Prêt de véhicules',
};

export const OnboardingProgressIndicator: React.FC<OnboardingProgressIndicatorProps> = ({
  tunnel,
  showDetails = false,
}) => {
  const { getTunnelProgress, getOverallProgress, state } = useOnboarding();

  const progress = tunnel ? getTunnelProgress(tunnel) : getOverallProgress();

  if (!state) return null;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {tunnel ? tunnelLabels[tunnel] : 'Progression globale'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {progress.completed}/{progress.total}
            </span>
            {progress.percentage === 100 && (
              <CheckCircle2 className="h-4 w-4 text-success" />
            )}
          </div>
        </div>

        <Progress value={progress.percentage} className="h-2" />

        <p className="text-xs text-muted-foreground">
          {progress.percentage}% complété
        </p>

        {showDetails && tunnel && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Étapes :</p>
            <div className="space-y-1">
              {Object.entries(state[tunnel]).map(([stepKey, step]) => (
                <div key={stepKey} className="flex items-center gap-2 text-xs">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      step.completed ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                  <span className={step.completed ? 'text-foreground' : 'text-muted-foreground'}>
                    {stepKey}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
