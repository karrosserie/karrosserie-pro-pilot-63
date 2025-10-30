import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, User, Car, FileText } from 'lucide-react';
import { Employe } from '@/hooks/usePlanningManager';
import VoiceInputButton from '@/components/common/VoiceInputButton';
import { formatPlaque } from '@/lib/utils';

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
    notes?: string;
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
    employeId: '',
    notes: ''
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
        employeId: formData.employeId,
        notes: formData.notes
      });
      
      // Reset form
      setFormData({
        plaque: '',
        nom: '',
        prenom: '',
        heure: '',
        employeId: '',
        notes: ''
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
      employeId: '',
      notes: ''
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-muted/30 border-amber-500/20">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg flex-shrink-0">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base sm:text-xl font-semibold text-foreground leading-tight">
                Véhicule en Urgence
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Insertion immédiate - Les autres tâches seront décalées
              </DialogDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive" className="text-xs animate-bounce">
              <AlertTriangle className="h-3 w-3 mr-1" />
              URGENCE
            </Badge>
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/50">
              <Clock className="h-3 w-3 mr-1" />
              Priorité absolue
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plaque" className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4" />
                Plaque *
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
                    const formattedPlaque = formatPlaque(text);
                    setFormData({ ...formData, plaque: formattedPlaque });
                    setErrors({ ...errors, plaque: '' });
                  }}
                />
              </div>
              {errors.plaque && (
                <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.plaque}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heure" className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                Heure *
              </Label>
              <Select value={formData.heure} onValueChange={(value) => setFormData({ ...formData, heure: value })}>
                <SelectTrigger className={errors.heure ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Heure" />
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
                <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.heure}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-sm">Nom du client *</Label>
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
                <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.nom}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-sm">Prénom du client *</Label>
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
                <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.prenom}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employe" className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Employé *
            </Label>
            <Select value={formData.employeId} onValueChange={(value) => setFormData({ ...formData, employeId: value })}>
              <SelectTrigger className={errors.employeId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Employé" />
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
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                        {employe.qualifications.length} qualif.
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeId && (
              <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.employeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Détails de l'urgence
            </Label>
            <div className="flex gap-2">
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Décrivez ce qui doit être fait en urgence..."
                rows={3}
                className="flex-1"
              />
              <VoiceInputButton
                fieldName="notes"
                onTranscript={(text) => {
                  setFormData({ ...formData, notes: formData.notes + (formData.notes ? ' ' : '') + text });
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Cette note sera visible par l'employé assigné
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto order-3 sm:order-1"
            >
              Réinitialiser
            </Button>
            
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ajouter en urgence</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};