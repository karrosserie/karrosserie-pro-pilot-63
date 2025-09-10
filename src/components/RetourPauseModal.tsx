import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Coffee } from 'lucide-react';

interface RetourPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName?: string;
  onConfirm?: () => void;
}

export const RetourPauseModal: React.FC<RetourPauseModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  onConfirm
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Retour de pause
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 bg-muted rounded-lg">
            <Coffee className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <div className="font-medium text-lg">{employeeName}</div>
            <div className="text-sm text-muted-foreground mb-2">En pause depuis un moment</div>
            <div className="text-2xl font-bold text-primary">{currentTime}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Prêt à reprendre le travail ?
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Confirmez votre retour de pause pour continuer vos tâches
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Rester en pause
          </Button>
          <Button onClick={handleConfirm}>
            Reprendre le travail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};