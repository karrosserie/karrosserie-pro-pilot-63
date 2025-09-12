import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MoveRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DeplacerTacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  tache?: any;
  employes?: any[];
  onConfirm?: (nouvelEmployeId: string, nouvelleDate: Date, nouvelleHeure: string) => void;
}

// Générer les heures de 8h à 18h par tranches de 30 minutes
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const DeplacerTacheModal: React.FC<DeplacerTacheModalProps> = ({
  isOpen,
  onClose,
  tache,
  employes = [],
  onConfirm
}) => {
  const [nouvelEmployeId, setNouvelEmployeId] = useState('');
  const [nouvelleDate, setNouvelleDate] = useState<Date>();
  const [nouvelleHeure, setNouvelleHeure] = useState<string>('');
  const { toast } = useToast();

  const timeSlots = generateTimeSlots();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

  const handleConfirm = () => {
    if (!nouvelEmployeId || !nouvelleDate || !nouvelleHeure) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un technicien, une date et une heure",
        variant: "destructive"
      });
      return;
    }

    // Vérifier que la date n'est pas antérieure à aujourd'hui
    if (nouvelleDate < today) {
      toast({
        title: "Date invalide", 
        description: "Impossible de déplacer une tâche à une date antérieure à aujourd'hui",
        variant: "destructive"
      });
      return;
    }

    onConfirm?.(nouvelEmployeId, nouvelleDate, nouvelleHeure);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setNouvelEmployeId('');
    setNouvelleDate(undefined);
    setNouvelleHeure('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm sm:max-w-lg mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MoveRight className="h-4 w-4 sm:h-5 sm:w-5" />
            Déplacer la tâche
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Informations de la tâche */}
          {tache && (
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <div className="font-medium text-sm sm:text-base">{tache.vehicule}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{tache.etape}</div>
              <div className="text-xs sm:text-sm">{tache.client}</div>
              <div className="text-xs sm:text-sm">Actuellement assigné à: <span className="font-medium">{tache.technicien}</span></div>
            </div>
          )}
          
          {/* Sélection du nouvel employé */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Nouveau technicien</Label>
            <Select value={nouvelEmployeId} onValueChange={setNouvelEmployeId}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="Sélectionner un technicien" />
              </SelectTrigger>
              <SelectContent>
                {employes
                  .filter(employe => 
                    employe.role === 'carrossier' || 
                    employe.role === 'carrossier-vehicule de courtoisie'
                  )
                  .map(employe => (
                    <SelectItem key={employe.user_id} value={employe.user_id}>
                      {employe.nom}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de la nouvelle date */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Nouvelle date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 sm:h-11",
                    !nouvelleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nouvelleDate ? (
                    format(nouvelleDate, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={nouvelleDate}
                  onSelect={setNouvelleDate}
                  disabled={(date) => date < today}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sélection de l'heure */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Nouvelle heure</Label>
            <Select value={nouvelleHeure} onValueChange={setNouvelleHeure}>
              <SelectTrigger className="h-10 sm:h-11">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sélectionner une heure" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!nouvelEmployeId || !nouvelleDate || !nouvelleHeure}
            className="w-full sm:w-auto"
          >
            Déplacer la tâche
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};