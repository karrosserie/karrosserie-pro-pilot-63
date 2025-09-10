import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Unlock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface VehiculeDebloquerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule?: any;
  onConfirm?: (reason: string) => void;
}

export const VehiculeDebloquerModal: React.FC<VehiculeDebloquerModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onConfirm
}) => {
  const [reason, setReason] = React.useState('');

  const handleConfirm = () => {
    onConfirm?.(reason);
    onClose();
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5" />
            Débloquer le véhicule
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {vehicule && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">{vehicule.marque} {vehicule.modele}</div>
              <div className="text-sm text-muted-foreground">{vehicule.immatriculation}</div>
              <div className="text-sm">{vehicule.client}</div>
            </div>
          )}
          
          <div>
            <Label htmlFor="reason">Motif du déblocage</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez pourquoi ce véhicule doit être débloqué..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Unlock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm">Ce véhicule sera disponible pour de nouvelles tâches</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Débloquer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};