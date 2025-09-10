import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MoveRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DeplacerTacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  tache?: any;
  employes?: any[];
  onConfirm?: (nouvelEmployeId: string, nouvelleDate: Date) => void;
}

export const DeplacerTacheModal: React.FC<DeplacerTacheModalProps> = ({
  isOpen,
  onClose,
  tache,
  employes = [],
  onConfirm
}) => {
  const [nouvelEmployeId, setNouvelEmployeId] = useState('');
  const [nouvelleDate, setNouvelleDate] = useState<Date>();

  const handleConfirm = () => {
    if (nouvelEmployeId && nouvelleDate) {
      onConfirm?.(nouvelEmployeId, nouvelleDate);
      onClose();
      setNouvelEmployeId('');
      setNouvelleDate(undefined);
    }
  };

  const handleClose = () => {
    onClose();
    setNouvelEmployeId('');
    setNouvelleDate(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MoveRight className="h-5 w-5" />
            Déplacer la tâche
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de la tâche */}
          {tache && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-medium">{tache.vehicule}</div>
              <div className="text-sm text-muted-foreground">{tache.etape}</div>
              <div className="text-sm">{tache.client}</div>
              <div className="text-sm">Actuellement assigné à: <span className="font-medium">{tache.technicien}</span></div>
            </div>
          )}
          
          {/* Sélection du nouvel employé */}
          <div className="space-y-2">
            <Label>Nouveau technicien</Label>
            <Select value={nouvelEmployeId} onValueChange={setNouvelEmployeId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un technicien" />
              </SelectTrigger>
              <SelectContent>
                {employes.map(employe => (
                  <SelectItem key={employe.user_id} value={employe.user_id}>
                    {employe.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de la nouvelle date */}
          <div className="space-y-2">
            <Label>Nouvelle date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!nouvelEmployeId || !nouvelleDate}
          >
            Déplacer la tâche
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};