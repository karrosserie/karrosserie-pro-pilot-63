import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Car, ArrowRight } from 'lucide-react';
import { Employe, PlanningTache } from '@/hooks/usePlanningManager';

interface DeplacerTacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  tache: PlanningTache | null;
  employes: Employe[];
  onDeplacer: (tacheId: string, nouvelEmployeId: string, nouveauJour: string, nouvelleHeure: string) => void;
}

export const DeplacerTacheModal: React.FC<DeplacerTacheModalProps> = ({
  isOpen,
  onClose,
  tache,
  employes,
  onDeplacer
}) => {
  const [formData, setFormData] = useState({
    employeId: '',
    jour: '',
    heure: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options de jours (aujourd'hui + 14 jours)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      options.push({ value: dateString, display: displayDate });
    }
    return options;
  };

  // Options d'heure simplifiées
  const timeOptions = [
    'Matin (8h-12h)',
    'Après-midi (14h-18h)',
    'Fin de journée (17h-19h)'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeId) {
      newErrors.employeId = 'L\'employé est requis';
    } else if (tache) {
      const employe = employes.find(e => e.id === formData.employeId);
      if (employe && !employe.qualifications.includes(tache.etape)) {
        newErrors.employeId = `Cet employé n'a pas la qualification requise (${tache.etape})`;
      }
    }
    
    if (!formData.jour) {
      newErrors.jour = 'Le jour est requis';
    }
    if (!formData.heure) {
      newErrors.heure = 'L\'heure est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tache) return;
    
    if (validateForm()) {
      onDeplacer(
        tache.id,
        formData.employeId,
        formData.jour,
        formData.heure
      );
      
      // Reset form
      setFormData({
        employeId: '',
        jour: '',
        heure: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      employeId: '',
      jour: '',
      heure: ''
    });
    setErrors({});
    onClose();
  };

  if (!tache) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-background to-primary/5 border-primary/20">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold bg-gradient-elegant bg-clip-text text-transparent">
                Déplacer la tâche
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Choisir un nouvel employé, jour et heure
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Informations de la tâche */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-start gap-4">
            <Car className="h-5 w-5 mt-1 text-muted-foreground" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {tache.vehicule}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {tache.modele}
                </span>
              </div>
              <div className="text-sm">
                <p><strong>Tâche:</strong> {tache.tache}</p>
                <p><strong>Employé actuel:</strong> {tache.technicien}</p>
                <p><strong>Heure actuelle:</strong> {tache.heure}</p>
                <p><strong>Client:</strong> {tache.client}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employe" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nouvel employé assigné *
            </Label>
            <Select value={formData.employeId} onValueChange={(value) => setFormData({ ...formData, employeId: value })}>
              <SelectTrigger className={errors.employeId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employes.filter(emp => emp.actif).map((employe) => {
                  const hasQualification = employe.qualifications.includes(tache.etape);
                  return (
                    <SelectItem key={employe.id} value={employe.id.toString()} disabled={!hasQualification}>
                      <div className="flex items-center gap-2">
                        <span className={!hasQualification ? 'text-muted-foreground' : ''}>
                          {employe.nom}
                        </span>
                        {hasQualification ? (
                          <Badge variant="outline" className="text-xs bg-success/10">
                            Qualifié
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-destructive/10">
                            Non qualifié
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.employeId && (
              <p className="text-sm text-destructive animate-fade-in">{errors.employeId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jour" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Nouveau jour *
              </Label>
              <Select value={formData.jour} onValueChange={(value) => setFormData({ ...formData, jour: value })}>
                <SelectTrigger className={errors.jour ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sélectionner le jour" />
                </SelectTrigger>
                <SelectContent>
                  {generateDateOptions().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jour && (
                <p className="text-sm text-destructive animate-fade-in">{errors.jour}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heure" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Nouvelle heure *
              </Label>
              <Select value={formData.heure} onValueChange={(value) => setFormData({ ...formData, heure: value })}>
                <SelectTrigger className={errors.heure ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
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
              className="bg-primary hover:bg-primary/90 hover-scale"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Déplacer la tâche
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};