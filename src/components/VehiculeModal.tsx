import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface VehiculeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule?: any;
  onSave?: (data: any) => void;
}

export const VehiculeModal: React.FC<VehiculeModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onSave
}) => {
  const handleSave = () => {
    onSave?.({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {vehicule ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marque">Marque</Label>
              <Input id="marque" defaultValue={vehicule?.marque || ''} />
            </div>
            <div>
              <Label htmlFor="modele">Modèle</Label>
              <Input id="modele" defaultValue={vehicule?.modele || ''} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="immatriculation">Immatriculation</Label>
            <Input id="immatriculation" defaultValue={vehicule?.immatriculation || ''} />
          </div>
          
          <div>
            <Label htmlFor="client">Client</Label>
            <Input id="client" defaultValue={vehicule?.client || ''} />
          </div>
          
          {vehicule && (
            <div className="flex gap-2">
              <Badge variant={vehicule.urgent ? 'destructive' : 'secondary'}>
                {vehicule.urgent ? 'Urgent' : 'Normal'}
              </Badge>
              <Badge variant="outline">{vehicule.status}</Badge>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};