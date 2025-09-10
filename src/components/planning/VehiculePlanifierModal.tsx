import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Car, FileText } from 'lucide-react';
import { Employe } from '@/hooks/usePlanningManager';

interface VehiculePlanifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule: any;
  employes: Employe[];
  onPlanifier: (vehiculeId: number, employeId: string, datePrevu: string, heurePrevu: string, notes: string) => void;
}

export const VehiculePlanifierModal: React.FC<VehiculePlanifierModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  employes,
  onPlanifier
}) => {
  const [formData, setFormData] = useState({
    employeId: '',
    datePrevu: '',
    heurePrevu: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options d'heure simplifiées (matin/après-midi)
  const timeOptions = [
    'Matin (8h-12h)',
    'Après-midi (14h-18h)'
  ];

  // Générer les dates disponibles (aujourd'hui + 14 jours)
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeId) {
      newErrors.employeId = 'L\'employé assigné est requis';
    }
    if (!formData.datePrevu) {
      newErrors.datePrevu = 'La date prévue est requise';
    }
    if (!formData.heurePrevu) {
      newErrors.heurePrevu = 'L\'heure prévue est requise';
    }
    if (!formData.notes.trim()) {
      newErrors.notes = 'Une note de planification est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onPlanifier(
        vehicule.id, 
        formData.employeId, 
        formData.datePrevu, 
        formData.heurePrevu, 
        formData.notes
      );
      
      // Reset form
      setFormData({
        employeId: '',
        datePrevu: '',
        heurePrevu: '',
        notes: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      employeId: '',
      datePrevu: '',
      heurePrevu: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!vehicule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-background to-primary/5 border-primary/20">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold bg-gradient-elegant bg-clip-text text-transparent">
                Planifier le véhicule
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Programmer la reprise des travaux
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
                <Badge variant={vehicule.priorite === 'urgente' ? 'destructive' : 'secondary'}>
                  {vehicule.priorite}
                </Badge>
              </div>
              <div className="text-sm">
                <p><strong>Étape bloquée:</strong> {vehicule.etapeBloquee}</p>
                <p><strong>Client:</strong> {vehicule.client}</p>
                <p><strong>Prix:</strong> {vehicule.prix}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                  {employes.filter(emp => emp.actif).map((employe) => (
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

            <div className="space-y-2">
              <Label htmlFor="heure" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heure prévue *
              </Label>
              <Select value={formData.heurePrevu} onValueChange={(value) => setFormData({ ...formData, heurePrevu: value })}>
                <SelectTrigger className={errors.heurePrevu ? 'border-destructive' : ''}>
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
              {errors.heurePrevu && (
                <p className="text-sm text-destructive animate-fade-in">{errors.heurePrevu}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date prévue *
            </Label>
            <Select value={formData.datePrevu} onValueChange={(value) => setFormData({ ...formData, datePrevu: value })}>
              <SelectTrigger className={errors.datePrevu ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner la date" />
              </SelectTrigger>
              <SelectContent>
                {generateDateOptions().map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.datePrevu && (
              <p className="text-sm text-destructive animate-fade-in">{errors.datePrevu}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes de planification *
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Instructions spéciales, préparatifs requis, priorités..."
              className={`min-h-[80px] transition-all duration-200 ${errors.notes ? 'border-destructive' : 'border-input'}`}
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
              className="bg-green-100 hover:bg-green-200 text-black hover-scale"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Planifier le véhicule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};