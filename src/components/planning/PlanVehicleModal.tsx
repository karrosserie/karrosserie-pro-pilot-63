import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { userActionWebhookService } from '@/services/tracking/UserActionWebhookService';

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
  role: string;
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
  { value: 'Contrôle technique de sécurité', label: 'Contrôle technique de sécurité', duration: 1.5 },
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
  const [isLoading, setIsLoading] = useState(false);

  const handlePlan = async () => {
    if (!vehicle || !selectedEmployeeId || !selectedTaskType || !companyId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Utiliser la date et l'heure actuelles
      const taskType = TASK_TYPES.find(t => t.value === selectedTaskType);
      const startDateTime = new Date();
      const endDateTime = new Date(startDateTime.getTime() + (taskType?.duration || 1) * 60 * 60 * 1000);

      // D'abord, nettoyer toutes les anciennes tâches en attente avec waiting_reason pour ce véhicule
      const { error: cleanupError } = await supabase
        .from('employee_schedule')
        .delete()
        .eq('vehicle_id', vehicle.id)
        .eq('status', 'En attente')
        .not('waiting_reason', 'is', null);

      if (cleanupError) {
        console.error('Erreur lors du nettoyage des anciennes tâches:', cleanupError);
        // Ne pas bloquer la planification
      }

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

      // Remettre waiting_reason à NULL dans la table vehicles (au cas où)
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ waiting_reason: null } as any)
        .eq('id', vehicle.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour du véhicule:', updateError);
        // Ne pas bloquer la planification si cette mise à jour échoue
      }

      console.log('Tâche planifiée avec succès:', data);
      toast.success(`Véhicule ${vehicle.licensePlate} planifié avec succès`);
      
      // Envoyer le webhook pour l'action mise_planning
      try {
        await userActionWebhookService.sendUserAction('mise_planning', {
          vehicle_id: vehicle.id,
          vehicle_license_plate: vehicle.licensePlate,
          employee_id: selectedEmployeeId,
          task_type: selectedTaskType,
          scheduled_date: startDateTime.toISOString(),
          company_id: companyId
        });
        console.log('✅ Webhook mise_planning envoyé avec succès');
      } catch (webhookError) {
        console.error('⚠️ Erreur lors de l\'envoi du webhook mise_planning:', webhookError);
        // Ne pas bloquer la planification si le webhook échoue
      }
      
      // Réinitialiser le formulaire
      setSelectedEmployeeId('');
      setSelectedTaskType('');
      
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
      onClose();
    }
  };

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
              {employees
                .filter(employee => 
                  employee.role === 'carrossier' || 
                  employee.role === 'carrossier-vehicule de courtoisie'
                )
                .map((employee) => (
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