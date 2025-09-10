import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit2, Car, DollarSign, User, AlertTriangle, FileText } from 'lucide-react';

interface VehiculeModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule: any;
  onModifier: (vehiculeId: number, modifications: any) => void;
}

export const VehiculeModifierModal: React.FC<VehiculeModifierModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onModifier
}) => {
  const [formData, setFormData] = useState({
    plaque: '',
    modele: '',
    client: '',
    prix: '',
    priorite: '',
    raisonBlocage: '',
    detailBlocage: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données du véhicule
  useEffect(() => {
    if (vehicule) {
      setFormData({
        plaque: vehicule.plaque || '',
        modele: vehicule.modele || '',
        client: vehicule.client || '',
        prix: vehicule.prix || '',
        priorite: vehicule.priorite || 'normale',
        raisonBlocage: vehicule.raisonBlocage || '',
        detailBlocage: vehicule.detailBlocage || '',
        notes: ''
      });
    }
  }, [vehicule]);

  const prioriteOptions = [
    { value: 'normale', label: 'Normale', color: 'bg-secondary' },
    { value: 'urgente', label: 'Urgente', color: 'bg-destructive' },
    { value: 'faible', label: 'Faible', color: 'bg-muted' }
  ];

  const raisonsBlocage = [
    'Attente pièces',
    'Accord expert assurance',
    'Attente technicien',
    'Problème découvert',
    'Pièces sur commande',
    'Validation client',
    'Attente expertise',
    'Autre - Préciser'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plaque.trim()) {
      newErrors.plaque = 'La plaque d\'immatriculation est requise';
    }
    if (!formData.modele.trim()) {
      newErrors.modele = 'Le modèle est requis';
    }
    if (!formData.client.trim()) {
      newErrors.client = 'Le nom du client est requis';
    }
    if (!formData.prix.trim()) {
      newErrors.prix = 'Le prix est requis';
    }
    if (!formData.raisonBlocage) {
      newErrors.raisonBlocage = 'La raison du blocage est requise';
    }
    if (!formData.detailBlocage.trim()) {
      newErrors.detailBlocage = 'Le détail du blocage est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const modifications = {
        plaque: formData.plaque.toUpperCase(),
        modele: formData.modele,
        client: formData.client,
        prix: formData.prix,
        priorite: formData.priorite,
        raisonBlocage: formData.raisonBlocage,
        detailBlocage: formData.detailBlocage,
        dateModification: new Date().toISOString()
      };

      onModifier(vehicule.id, modifications);
      
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    // Réinitialiser avec les données originales
    if (vehicule) {
      setFormData({
        plaque: vehicule.plaque || '',
        modele: vehicule.modele || '',
        client: vehicule.client || '',
        prix: vehicule.prix || '',
        priorite: vehicule.priorite || 'normale',
        raisonBlocage: vehicule.raisonBlocage || '',
        detailBlocage: vehicule.detailBlocage || '',
        notes: ''
      });
    }
    setErrors({});
    onClose();
  };

  if (!vehicule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-gradient-to-br from-background to-warning/5 border-warning/20">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Edit2 className="h-6 w-6 text-warning" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold bg-gradient-elegant bg-clip-text text-transparent">
                Modifier le véhicule
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Mettre à jour les informations du véhicule en attente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Informations de base
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plaque" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Plaque d'immatriculation *
                </Label>
                <Input
                  id="plaque"
                  value={formData.plaque}
                  onChange={(e) => setFormData({ ...formData, plaque: e.target.value })}
                  placeholder="XX-123-XX"
                  className={`transition-all duration-200 ${errors.plaque ? 'border-destructive' : 'border-input'}`}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.plaque && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.plaque}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modele">Modèle *</Label>
                <Input
                  id="modele"
                  value={formData.modele}
                  onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                  placeholder="Renault Clio, BMW Série 3..."
                  className={errors.modele ? 'border-destructive' : ''}
                />
                {errors.modele && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.modele}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client *
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="M. Dupont, Mme Martin..."
                  className={errors.client ? 'border-destructive' : ''}
                />
                {errors.client && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.client}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prix" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Prix *
                </Label>
                <Input
                  id="prix"
                  value={formData.prix}
                  onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                  placeholder="1500€"
                  className={errors.prix ? 'border-destructive' : ''}
                />
                {errors.prix && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.prix}</p>
                )}
              </div>
            </div>
          </div>

          {/* Statut et priorité */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Statut et priorité
            </h3>
            <div className="space-y-2">
              <Label htmlFor="priorite" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Priorité
              </Label>
              <Select value={formData.priorite} onValueChange={(value) => setFormData({ ...formData, priorite: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la priorité" />
                </SelectTrigger>
                <SelectContent>
                  {prioriteOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant={option.value === 'urgente' ? 'destructive' : 'secondary'}>
                          {option.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Raison du blocage */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Détails du blocage
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="raisonBlocage">Raison du blocage *</Label>
                <Select value={formData.raisonBlocage} onValueChange={(value) => setFormData({ ...formData, raisonBlocage: value })}>
                  <SelectTrigger className={errors.raisonBlocage ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Sélectionner la raison" />
                  </SelectTrigger>
                  <SelectContent>
                    {raisonsBlocage.map((raison) => (
                      <SelectItem key={raison} value={raison}>
                        {raison}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.raisonBlocage && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.raisonBlocage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailBlocage" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Détail du blocage *
                </Label>
                <Textarea
                  id="detailBlocage"
                  value={formData.detailBlocage}
                  onChange={(e) => setFormData({ ...formData, detailBlocage: e.target.value })}
                  placeholder="Description détaillée du problème, délais estimés..."
                  className={`min-h-[80px] transition-all duration-200 ${errors.detailBlocage ? 'border-destructive' : 'border-input'}`}
                />
                {errors.detailBlocage && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.detailBlocage}</p>
                )}
              </div>
            </div>
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
              className="bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 hover-scale"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};