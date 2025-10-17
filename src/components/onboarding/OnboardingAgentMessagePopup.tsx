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

export function OnboardingAgentMessagePopup() {
  const { unreadMessage, markAsRead, isMarkingAsRead } = useOnboardingAgentMessages();
  const { shouldShowExpertiseReportPrompt, markHelpAsSeen } = useUserOnboardingProgress();
  const [open, setOpen] = useState(false);
  const [lastDisplayedMessageId, setLastDisplayedMessageId] = useState<number | null>(null);

  // Ouvrir automatiquement la popup quand un nouveau message non lu arrive ET si l'utilisateur doit voir le prompt
  useEffect(() => {
    if (shouldShowExpertiseReportPrompt && unreadMessage && unreadMessage.id !== lastDisplayedMessageId) {
      setOpen(true);
      setLastDisplayedMessageId(unreadMessage.id);
    }
  }, [unreadMessage, shouldShowExpertiseReportPrompt, lastDisplayedMessageId]);

  const handleClose = () => {
    if (unreadMessage) {
      markAsRead(unreadMessage.id);
      markHelpAsSeen('expertise_report_prompt_seen');
    }
    setOpen(false);
  };

  if (!unreadMessage) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-2xl animate-fade-in">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Agent Onboarding
            </span>
          </div>
          <DialogTitle className="text-2xl font-semibold mb-4">Nouveau message</DialogTitle>
          <DialogDescription className="text-lg leading-relaxed text-foreground/80">
            {unreadMessage.message.content}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleClose} 
            disabled={isMarkingAsRead}
            className="min-w-[120px]"
            size="lg"
          >
            {isMarkingAsRead ? 'Chargement...' : "J'ai compris"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
