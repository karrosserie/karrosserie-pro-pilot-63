import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User, Car } from 'lucide-react';
import { Employe } from '@/hooks/usePlanningManager';
import VoiceInputButton from '@/components/common/VoiceInputButton';

interface VehiculeUrgenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  employes: (Employe & { role: string })[];
  onAjouterVehicule: (vehiculeUrgence: {
    plaque: string;
    nom: string;
    prenom: string;
    heure: string;
    employeId: string;
  }) => void;
}

export const VehiculeUrgenceModal: React.FC<VehiculeUrgenceModalProps> = ({
  isOpen,
  onClose,
  employes,
  onAjouterVehicule
}) => {
  const [formData, setFormData] = useState({
    plaque: '',
    nom: '',
    prenom: '',
    heure: '',
    employeId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.plaque.trim()) {
      newErrors.plaque = 'La plaque d\'immatriculation est requise';
    }
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du client est requis';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom du client est requis';
    }
    if (!formData.heure) {
      newErrors.heure = 'L\'heure d\'affectation est requise';
    }
    if (!formData.employeId) {
      newErrors.employeId = 'L\'employé assigné est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAjouterVehicule({
        plaque: formData.plaque.toUpperCase(),
        nom: formData.nom,
        prenom: formData.prenom,
        heure: formData.heure,
        employeId: formData.employeId
      });
      
      // Reset form
      setFormData({
        plaque: '',
        nom: '',
        prenom: '',
        heure: '',
        employeId: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleReset = () => {
    setFormData({
      plaque: '',
      nom: '',
      prenom: '',
      heure: '',
      employeId: ''
    });
    setErrors({});
  };

  // Générer les options d'heure (8h à 18h par tranches de 30min)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour < 18; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return options;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background to-muted/30 border-warning/20">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold bg-gradient-elegant bg-clip-text text-transparent">
                Véhicule en Urgence - PRIORITÉ ABSOLUE
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Insertion immédiate à l'heure choisie - Les autres tâches seront décalées si nécessaire
              </DialogDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="destructive" className="w-fit animate-bounce">
              <AlertTriangle className="h-3 w-3 mr-1" />
              URGENCE - Traitement immédiat
            </Badge>
            <Badge variant="outline" className="w-fit text-warning border-warning/50">
              <Clock className="h-3 w-3 mr-1" />
              Priorité sur les tâches existantes
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plaque" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Plaque d'immatriculation *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="plaque"
                  value={formData.plaque}
                  onChange={(e) => setFormData({ ...formData, plaque: e.target.value })}
                  placeholder="XX-123-XX"
                  className={`transition-all duration-200 flex-1 ${errors.plaque ? 'border-destructive' : 'border-input'}`}
                  style={{ textTransform: 'uppercase' }}
                />
                <VoiceInputButton
                  fieldName="plaque"
                  onTranscript={(text) => {
                    setFormData({ ...formData, plaque: text.toUpperCase() });
                    setErrors({ ...errors, plaque: '' });
                  }}
                />
              </div>
              {errors.plaque && (
                <p className="text-sm text-destructive animate-fade-in">{errors.plaque}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heure" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heure d'affectation *
              </Label>
              <Select value={formData.heure} onValueChange={(value) => setFormData({ ...formData, heure: value })}>
                <SelectTrigger className={errors.heure ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.heure && (
                <p className="text-sm text-destructive animate-fade-in">{errors.heure}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du client *</Label>
              <div className="flex gap-2">
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom"
                  className={`flex-1 ${errors.nom ? 'border-destructive' : ''}`}
                />
                <VoiceInputButton
                  fieldName="nom"
                  onTranscript={(text) => {
                    setFormData({ ...formData, nom: text });
                    setErrors({ ...errors, nom: '' });
                  }}
                />
              </div>
              {errors.nom && (
                <p className="text-sm text-destructive animate-fade-in">{errors.nom}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom du client *</Label>
              <div className="flex gap-2">
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Prénom"
                  className={`flex-1 ${errors.prenom ? 'border-destructive' : ''}`}
                />
                <VoiceInputButton
                  fieldName="prenom"
                  onTranscript={(text) => {
                    setFormData({ ...formData, prenom: text });
                    setErrors({ ...errors, prenom: '' });
                  }}
                />
              </div>
              {errors.prenom && (
                <p className="text-sm text-destructive animate-fade-in">{errors.prenom}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employe" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Employé assigné *
            </Label>
            <Select value={formData.employeId} onValueChange={(value) => setFormData({ ...formData, employeId: value })}>
              <SelectTrigger className={errors.employeId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employes
                  .filter(emp => 
                    emp.actif && 
                    (emp.role === 'carrossier' || emp.role === 'carrossier-vehicule de courtoisie')
                  )
                  .map((employe) => (
                  <SelectItem key={employe.id} value={employe.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{employe.nom}</span>
                      <Badge variant="outline" className="text-xs">
                        {employe.qualifications.length} qualif.
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeId && (
              <p className="text-sm text-destructive animate-fade-in">{errors.employeId}</p>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="hover-scale"
            >
              Réinitialiser
            </Button>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="hover-scale"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-green-100 hover:bg-green-200 text-black hover-scale"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Ajouter en urgence
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};