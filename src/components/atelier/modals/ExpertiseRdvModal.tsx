import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Car } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Dossier } from '@/types/atelier';

interface ExpertiseRdvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossier: Dossier | null;
  onSubmit: (dossier: Dossier, date: string, heure: string) => void;
}

export const ExpertiseRdvModal = ({ open, onOpenChange, dossier, onSubmit }: ExpertiseRdvModalProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [heure, setHeure] = useState('09:00');

  const handleSubmit = () => {
    if (!dossier || !date) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    onSubmit(dossier, dateStr, heure);
    
    // Reset form
    setDate(undefined);
    setHeure('09:00');
  };

  if (!dossier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Planifier RDV Expert</DialogTitle>
          <DialogDescription>
            Définissez la date et l'heure du passage de l'expert
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Vehicle Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Car className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{dossier.immatriculation}</p>
              {dossier.marqueModele && (
                <p className="text-sm text-muted-foreground">{dossier.marqueModele}</p>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date de l'expertise *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <Label htmlFor="expertise-time">Heure *</Label>
            <Input
              id="expertise-time"
              type="time"
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!date || !heure}
            >
              Planifier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
