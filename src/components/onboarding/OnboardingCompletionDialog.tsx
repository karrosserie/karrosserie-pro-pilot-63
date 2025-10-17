import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-primary" />
            <AlertDialogTitle>Félicitations ! 🎉</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>
              Vous avez terminé toutes les étapes du guide d'aide !
            </p>
            <p>
              Souhaitez-vous recommencer le parcours d'aide depuis le début, 
              ou préférez-vous continuer sans assistance ?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleFinish}>
            Continuer sans aide
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRestart}>
            Recommencer le parcours
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
