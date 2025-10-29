import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useOnboardingAgentMessages } from '@/hooks/onboarding/useOnboardingAgentMessages';
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import { useUserRole } from '@/hooks/use-user-role';

export function OnboardingAgentMessagePopup() {
  const { unreadMessage, markAsRead, isMarkingAsRead } = useOnboardingAgentMessages();
  const { shouldShowExpertiseReportPrompt, markHelpAsSeen } = useUserOnboardingProgress();
  const { isCarrossier, isCarrossierCourtesy, isLoading: isRoleLoading } = useUserRole();
  const [open, setOpen] = useState(false);
  const [lastDisplayedMessageId, setLastDisplayedMessageId] = useState<number | null>(null);

  // Ouvrir automatiquement la popup quand un nouveau message non lu arrive
  // Ne pas afficher pour les carrossiers et carrossiers-véhicule de courtoisie
  useEffect(() => {
    // Attendre que le rôle soit chargé
    if (isRoleLoading) return;
    
    // Ne pas afficher pour les carrossiers
    if (isCarrossier || isCarrossierCourtesy) return;
    
    if (unreadMessage && unreadMessage.id !== lastDisplayedMessageId) {
      setOpen(true);
      setLastDisplayedMessageId(unreadMessage.id);
    }
  }, [unreadMessage, lastDisplayedMessageId, isCarrossier, isCarrossierCourtesy, isRoleLoading]);

  const handleClose = () => {
    if (unreadMessage) {
      markAsRead(unreadMessage.id);
      markHelpAsSeen('expertise_report_prompt_seen');
    }
    setOpen(false);
  };

  // Ne rien rendre si pas de message, en cours de chargement, rôle carrossier, ou déjà vu
  if (!unreadMessage || isRoleLoading || isCarrossier || isCarrossierCourtesy || !shouldShowExpertiseReportPrompt) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-2xl animate-fade-in">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Agent Onboarding
            </span>
          </div>
          <DialogTitle className="text-2xl text-center">Nouveau message</DialogTitle>
          <DialogDescription className="text-lg leading-relaxed pt-2 text-center whitespace-pre-line">
            Charge un nouveau rapport et valide !{'\n'}Karrosserie.pro créera automatiquement :{'\n'}Devis, dossier client, dossier voiture{'\n'}Tu n'as plus rien à taper au clavier !
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleClose} 
            disabled={isMarkingAsRead}
            className="min-w-[100px]"
          >
            {isMarkingAsRead ? 'Chargement...' : 'Compris'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
