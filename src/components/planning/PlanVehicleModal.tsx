import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  client: string;
}

interface Employee {
  id: string;
  user_id: string;
  nom: string;
}

interface PlanVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  employees: Employee[];
  companyId: string | null;
  onSuccess: () => void;
}

const TASK_TYPES = [
  { value: 'Accueil & Préparation du dossier', label: 'Accueil & Préparation du dossier', duration: 1 },
  { value: 'Remplacement ou débosselage', label: 'Remplacement ou débosselage', duration: 2.5 },
  { value: 'Préparation peinture', label: 'Préparation peinture', duration: 2.5 },
  { value: 'Mise en peinture', label: 'Mise en peinture', duration: 5 },
  { value: 'Finitions & remontage', label: 'Finitions & remontage', duration: 2 },
  { value: 'Clôture & livraison', label: 'Clôture & livraison', duration: 0.5 }
];

export const PlanVehicleModal = ({
  isOpen,
  onClose,
  vehicle,
  employees,
  companyId,
  onSuccess
}: PlanVehicleModalProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlan = async () => {
    if (!vehicle || !selectedEmployeeId || !selectedTaskType || !selectedDate || !selectedTime || !companyId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Calculer les heures de début et fin
      const taskType = TASK_TYPES.find(t => t.value === selectedTaskType);
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + (taskType?.duration || 1) * 60 * 60 * 1000);

      // Créer la tâche dans employee_schedule
      const { data, error } = await supabase
        .from('employee_schedule')
        .insert({
          company_id: companyId,
          user_id: selectedEmployeeId,
          vehicle_id: vehicle.id,
          task_type: selectedTaskType as any, // Cast pour éviter l'erreur TypeScript
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          status: 'En attente' as any
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la tâche:', error);
        toast.error('Erreur lors de la planification');
        return;
      }

      console.log('Tâche planifiée avec succès:', data);
      toast.success(`Véhicule ${vehicle.licensePlate} planifié avec succès`);
      
      // Réinitialiser le formulaire
      setSelectedEmployeeId('');
      setSelectedTaskType('');
      setSelectedDate('');
      setSelectedTime('');
      
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast.error('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedEmployeeId('');
      setSelectedTaskType('');
      setSelectedDate('');
      setSelectedTime('');
      onClose();
    }
  };

  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Planifier un véhicule
          </DialogTitle>
        </DialogHeader>

        {vehicle && (
          <div className="space-y-4">
            {/* Informations du véhicule */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900">
                {vehicle.brand} {vehicle.model}
              </h4>
              <p className="text-sm text-slate-600">{vehicle.licensePlate}</p>
              <p className="text-sm text-slate-600">Client: {vehicle.client}</p>
            </div>

            {/* Sélection de l'employé */}
            <div className="space-y-2">
              <Label htmlFor="employee" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Employé *
              </Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.user_id} value={employee.user_id}>
                      {employee.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection du type de tâche */}
            <div className="space-y-2">
              <Label htmlFor="taskType">Type de tâche *</Label>
              <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une tâche" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((task) => (
                    <SelectItem key={task.value} value={task.value}>
                      {task.label} ({task.duration}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection de la date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
              />
            </div>

            {/* Sélection de l'heure */}
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Heure de début *
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent className="max-h-[240px] overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 bg-white border shadow-lg z-50 rounded-md">
                  <div className="p-1">
                    {Array.from({ length: 20 }, (_, index) => {
                      const hour = Math.floor(8 + index / 2); // Commence à 8h
                      const minute = index % 2 === 0 ? '00' : '30';
                      const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
                      const displayTime = `${hour}h${minute === '00' ? '' : minute}`;
                      
                      return (
                        <SelectItem 
                          key={timeValue} 
                          value={timeValue}
                          className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100 px-3 py-2.5 rounded-sm text-sm transition-colors duration-150"
                        >
                          {displayTime}
                        </SelectItem>
                      );
                    })}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handlePlan}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Planification...' : 'Planifier'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};