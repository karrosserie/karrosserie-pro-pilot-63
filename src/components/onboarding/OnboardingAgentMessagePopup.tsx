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

export function OnboardingAgentMessagePopup() {
  const { unreadMessage, markAsRead, isMarkingAsRead } = useOnboardingAgentMessages();
  const [open, setOpen] = useState(false);
  const [lastDisplayedMessageId, setLastDisplayedMessageId] = useState<number | null>(null);

  // Ouvrir automatiquement la popup quand un nouveau message non lu arrive
  useEffect(() => {
    console.log('🎯 [Popup] useEffect triggered', {
      unreadMessage: unreadMessage?.id,
      lastDisplayedMessageId,
      open
    });

    if (unreadMessage && unreadMessage.id !== lastDisplayedMessageId) {
      console.log('✅ [Popup] Opening popup for new message:', unreadMessage.id);
      setOpen(true);
      setLastDisplayedMessageId(unreadMessage.id);
    }
  }, [unreadMessage]);

  const handleClose = () => {
    console.log('🚪 [Popup] Closing popup, marking message as read:', unreadMessage?.id);
    if (unreadMessage) {
      markAsRead(unreadMessage.id);
    }
    setOpen(false);
  };

  if (!unreadMessage) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Agent Onboarding
            </span>
          </div>
          <DialogTitle className="text-xl">Nouveau message</DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2">
            {unreadMessage.message.content}
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
