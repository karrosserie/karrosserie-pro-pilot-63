import React, { useState } from 'react';
import { Calendar, Clock, User, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { usePlanning } from '@/contexts/PlanningContext';

const ScheduleModal: React.FC = () => {
  const { state, actions } = usePlanning();
  const { selectedVehicle, isScheduleModalOpen } = state;

  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [notes, setNotes] = useState('');

  const technicians = [
    'Martin Dubois',
    'Sophie Martin',
    'Jean Dupont',
    'Marie Rousseau'
  ];

  const handleSave = () => {
    if (selectedVehicle && assignedTechnician) {
      actions.assignTechnician(selectedVehicle.id, assignedTechnician);
      actions.updateVehicleStatus(selectedVehicle.id, `Planifié le ${scheduledDate} à ${scheduledTime}`);
      actions.closeScheduleModal();
    }
  };

  const handleClose = () => {
    actions.closeScheduleModal();
    setScheduledDate('');
    setScheduledTime('');
    setAssignedTechnician('');
    setNotes('');
  };

  if (!selectedVehicle) return null;

  return (
    <Dialog open={isScheduleModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Planifier - {selectedVehicle.brand} {selectedVehicle.model}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Plaque:</strong> {selectedVehicle.plate}</p>
            <p><strong>Client:</strong> {selectedVehicle.client}</p>
            <p><strong>Statut actuel:</strong> {selectedVehicle.status}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="technician">Technicien assigné</Label>
            <Select value={assignedTechnician} onValueChange={setAssignedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un technicien" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Ajouter des notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!scheduledDate || !scheduledTime || !assignedTechnician}
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;