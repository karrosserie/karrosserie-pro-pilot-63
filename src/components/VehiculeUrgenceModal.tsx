import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface VehiculeUrgenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule?: any;
  onConfirm?: (reason: string) => void;
}

export const VehiculeUrgenceModal: React.FC<VehiculeUrgenceModalProps> = ({
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Marquer comme urgent
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
            <Label htmlFor="reason">Motif de l'urgence</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez pourquoi ce véhicule doit être traité en urgence..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm">Ce véhicule sera prioritaire dans le planning</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Marquer urgent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};