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
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <PartyPopper className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Agent Onboarding
            </span>
          </div>
          <DialogTitle className="text-xl">Félicitations ! 🎉</DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2 space-y-3">
            <p>
              Vous avez terminé toutes les étapes du guide d'aide !
            </p>
            <p>
              Souhaitez-vous recommencer le parcours d'aide depuis le début, 
              ou préférez-vous continuer sans assistance ?
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline"
            onClick={handleFinish}
            className="min-w-[140px]"
          >
            Continuer sans aide
          </Button>
          <Button 
            onClick={handleRestart}
            className="min-w-[180px]"
          >
            Recommencer le parcours
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
