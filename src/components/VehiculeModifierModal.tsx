import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface VehiculeModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule?: any;
  onSave?: (data: any) => void;
}

export const VehiculeModifierModal: React.FC<VehiculeModifierModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onSave
}) => {
  const [formData, setFormData] = React.useState({
    marque: '',
    modele: '',
    immatriculation: '',
    client: '',
    description: ''
  });

  React.useEffect(() => {
    if (vehicule) {
      setFormData({
        marque: vehicule.marque || '',
        modele: vehicule.modele || '',
        immatriculation: vehicule.immatriculation || '',
        client: vehicule.client || '',
        description: vehicule.description || ''
      });
    }
  }, [vehicule]);

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Modifier le véhicule
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marque">Marque</Label>
              <Input
                id="marque"
                value={formData.marque}
                onChange={(e) => handleChange('marque', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="modele">Modèle</Label>
              <Input
                id="modele"
                value={formData.modele}
                onChange={(e) => handleChange('modele', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="immatriculation">Immatriculation</Label>
            <Input
              id="immatriculation"
              value={formData.immatriculation}
              onChange={(e) => handleChange('immatriculation', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description / Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Ajoutez des notes sur ce véhicule..."
            />
          </div>
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