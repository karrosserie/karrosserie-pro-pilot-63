import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Car } from 'lucide-react';
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCompany } from '@/hooks/use-company';
import { supabase } from '@/integrations/supabase/client';
import { userActionWebhookService } from '@/services/tracking/UserActionWebhookService';

interface PlanVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleInfo: string;
  alertId: string;
  onPlanified: () => void;
}

interface Employee {
  id: string;
  user_id: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  actif: boolean;
}

const PlanVehicleModal: React.FC<PlanVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicleInfo,
  alertId,
  onPlanified
}) => {
  const { companyData } = useCompany();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Types de tâches disponibles
  const taskTypes = [
    'Accueil & Préparation',
    'Débosselage',
    'Préparation peinture',
    'Mise en peinture',
    'Finitions & Remontage',
    'Clôture & Livraison'
  ];

  // Heures de début disponibles
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Charger les employés de l'entreprise
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!companyData?.id) return;

      try {
        // Récupérer d'abord les user_companies
        const { data: userCompanies, error: ucError } = await supabase
          .from('user_companies')
          .select('id, user_id, role, active')
          .eq('company_id', companyData.id)
          .eq('active', true)
          .in('role', ['carrossier', 'carrossier-vehicule de courtoisie', 'responsable']);

        if (ucError) throw ucError;

        // Puis récupérer les profiles correspondants
        if (userCompanies && userCompanies.length > 0) {
          const userIds = userCompanies.map(uc => uc.user_id);
          
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone_number')
            .in('id', userIds);

          if (profilesError) throw profilesError;

          // Combiner les données
          const employeeData = userCompanies.map(uc => {
            const profile = profiles?.find(p => p.id === uc.user_id);
            return {
              id: uc.id,
              user_id: uc.user_id,
              nom: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Nom non défini',
              email: profile?.email || '',
              telephone: profile?.phone_number || '',
              role: uc.role,
              actif: uc.active
            };
          });

          setEmployees(employeeData);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des employés:', error);
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, companyData?.id]);

  const handlePlanify = async () => {
    if (!selectedEmployee || !selectedTask || !selectedDate || !selectedTime) {
      return;
    }

    setIsLoading(true);

    try {
      // Ici on pourrait sauvegarder la planification dans une table dédiée
      // Pour l'instant, on simule juste une planification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Envoyer le webhook pour l'action mise_planning
      try {
        await userActionWebhookService.sendUserAction('mise_planning', {
          vehicle_info: vehicleInfo,
          employee_id: selectedEmployee,
          task_type: selectedTask,
          scheduled_date: selectedDate?.toISOString(),
          scheduled_time: selectedTime,
          company_id: companyData?.id
        });
        console.log('✅ Webhook mise_planning envoyé avec succès');
      } catch (webhookError) {
        console.error('⚠️ Erreur lors de l\'envoi du webhook mise_planning:', webhookError);
        // Ne pas bloquer la planification si le webhook échoue
      }

      onPlanified();
      onClose();
      
      // Reset form
      setSelectedEmployee('');
      setSelectedTask('');
      setSelectedDate(undefined);
      setSelectedTime('');
    } catch (error) {
      console.error('Erreur lors de la planification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedEmployee('');
    setSelectedTask('');
    setSelectedDate(undefined);
    setSelectedTime('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Planifier un véhicule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du véhicule */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Car className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="space-y-1 text-sm">
                <div className="font-medium">Marque non renseignée Modèle non renseigné</div>
                <div className="text-muted-foreground">{vehicleInfo || '12-OIU-96'}</div>
                <div className="text-muted-foreground">Client: dotout rien</div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="space-y-4">
            {/* Employé */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Employé *
              </Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex items-center gap-2">
                        <span>{employee.nom || 'Nom non défini'}</span>
                        <span className="text-xs text-muted-foreground">({employee.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                  {employees.length === 0 && (
                    <SelectItem value="no-employees" disabled>
                      Aucun employé disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Type de tâche */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type de tâche *</Label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une tâche" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((task) => (
                    <SelectItem key={task} value={task}>
                      {task}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy", { locale: fr })
                    ) : (
                      <span>jj/mm/aaaa</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Heure de début */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Heure de début *
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
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

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePlanify}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!selectedEmployee || !selectedTask || !selectedDate || !selectedTime || isLoading}
            >
              {isLoading ? 'Planification...' : 'Planifier'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanVehicleModal;