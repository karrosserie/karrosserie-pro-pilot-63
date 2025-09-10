import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, User } from 'lucide-react';

interface PointageModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName?: string;
  onConfirm?: () => void;
}

export const PointageModal: React.FC<PointageModalProps> = ({
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
            <Clock className="h-5 w-5" />
            Pointage d'arrivée
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 bg-muted rounded-lg">
            <User className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <div className="font-medium text-lg">{employeeName}</div>
            <div className="text-2xl font-bold text-primary mt-2">{currentTime}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Confirmez votre arrivée pour commencer votre journée de travail
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Confirmer l'arrivée
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};