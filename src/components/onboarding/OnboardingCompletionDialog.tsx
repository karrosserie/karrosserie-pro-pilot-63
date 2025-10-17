import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import { PartyPopper } from 'lucide-react';

export function OnboardingCompletionDialog() {
  const { shouldShowCompletionDialog, markHelpAsSeen, resetAllHelp } = useUserOnboardingProgress();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldShowCompletionDialog) {
      // Afficher le dialogue après un petit délai
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowCompletionDialog]);

  const handleRestart = () => {
    resetAllHelp();
    setOpen(false);
  };

  const handleFinish = () => {
    markHelpAsSeen('completion_dialog_shown');
    setOpen(false);
  };

  if (!shouldShowCompletionDialog) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl animate-fade-in">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <PartyPopper className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Agent Onboarding
            </span>
          </div>
          <DialogTitle className="text-2xl font-semibold mb-4">Félicitations ! 🎉</DialogTitle>
          <DialogDescription className="text-lg leading-relaxed text-foreground/80 space-y-4">
            <p>
              Vous avez terminé toutes les étapes du guide d'aide !
            </p>
            <p>
              Souhaitez-vous recommencer le parcours d'aide depuis le début, 
              ou préférez-vous continuer sans assistance ?
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-6">
          <Button 
            variant="outline"
            onClick={handleFinish}
            className="min-w-[160px]"
            size="lg"
          >
            Continuer sans aide
          </Button>
          <Button 
            onClick={handleRestart}
            className="min-w-[200px]"
            size="lg"
          >
            Recommencer le parcours
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
