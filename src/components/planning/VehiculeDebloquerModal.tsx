import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Car, FileText } from 'lucide-react';

interface VehiculeDebloquerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule: any;
  onDebloquer: (vehiculeId: number, solution: string, notes: string) => void;
}

export const VehiculeDebloquerModal: React.FC<VehiculeDebloquerModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onDebloquer
}) => {
  const [formData, setFormData] = useState({
    solution: '',
    notes: '',
    actionRealisee: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const solutions = [
    'Pièce reçue - Reprise des travaux',
    'Accord expert obtenu - Validation devis',
    'Technicien spécialisé disponible',
    'Problème technique résolu',
    'Validation client obtenue',
    'Livraison pièce accélérée',
    'Solution alternative trouvée',
    'Autre - Préciser dans les notes'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.solution) {
      newErrors.solution = 'La solution appliquée est requise';
    }
    if (!formData.notes.trim()) {
      newErrors.notes = 'Une description de l\'action est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onDebloquer(vehicule.id, formData.solution, formData.notes);
      
      // Reset form
      setFormData({
        solution: '',
        notes: '',
        actionRealisee: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      solution: '',
      notes: '',
      actionRealisee: ''
    });
    setErrors({});
    onClose();
  };

  if (!vehicule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-background to-success/5 border-success/20">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold bg-gradient-elegant bg-clip-text text-transparent">
                Débloquer le véhicule
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Résoudre le blocage et reprendre le processus
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Informations du véhicule */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-start gap-4">
            <Car className="h-5 w-5 mt-1 text-muted-foreground" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {vehicule.plaque}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {vehicule.modele}
                </span>
              </div>
              <div className="text-sm">
                <p><strong>Étape bloquée:</strong> {vehicule.etapeBloquee}</p>
                <p><strong>Raison:</strong> {vehicule.raisonBlocage}</p>
                <p><strong>Détail:</strong> {vehicule.detailBlocage}</p>
                <p><strong>Client:</strong> {vehicule.client}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="solution" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Solution appliquée *
            </Label>
            <Select value={formData.solution} onValueChange={(value) => setFormData({ ...formData, solution: value })}>
              <SelectTrigger className={errors.solution ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner la solution appliquée" />
              </SelectTrigger>
              <SelectContent>
                {solutions.map((solution) => (
                  <SelectItem key={solution} value={solution}>
                    {solution}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.solution && (
              <p className="text-sm text-destructive animate-fade-in">{errors.solution}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description de l'action réalisée *
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Décrivez en détail l'action réalisée pour débloquer le véhicule..."
              className={`min-h-[100px] transition-all duration-200 ${errors.notes ? 'border-destructive' : 'border-input'}`}
            />
            {errors.notes && (
              <p className="text-sm text-destructive animate-fade-in">{errors.notes}</p>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="hover-scale"
            >
              Annuler
            </Button>
            
            <Button
              type="submit"
              className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 hover-scale"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Débloquer le véhicule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};