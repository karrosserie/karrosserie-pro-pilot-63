import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehiculePlanifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule?: any;
  onConfirm?: (planningData: any) => void;
}

export const VehiculePlanifierModal: React.FC<VehiculePlanifierModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onConfirm
}) => {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [selectedTechnician, setSelectedTechnician] = React.useState('');
  const [selectedTask, setSelectedTask] = React.useState('');

  const handleConfirm = () => {
    onConfirm?.({
      date: selectedDate,
      time: selectedTime,
      technician: selectedTechnician,
      task: selectedTask
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planifier le véhicule
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {vehicule && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">{vehicule.marque} {vehicule.modele}</div>
              <div className="text-sm text-muted-foreground">{vehicule.immatriculation}</div>
              <div className="text-sm">{vehicule.client}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label>Technicien</Label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un technicien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="martin">Martin Dubois</SelectItem>
                <SelectItem value="sophie">Sophie Martin</SelectItem>
                <SelectItem value="pierre">Pierre Durand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Tâche</Label>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une tâche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accueil">Accueil & Préparation</SelectItem>
                <SelectItem value="debosselage">Débosselage</SelectItem>
                <SelectItem value="peinture">Préparation peinture</SelectItem>
                <SelectItem value="finitions">Finitions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Planifier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};