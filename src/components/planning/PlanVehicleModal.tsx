import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Wrench, Paintbrush, Settings } from 'lucide-react';
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
  qualifications?: string[];
}

interface PlanVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  employees: Employee[];
  companyId: string | null;
  onSuccess: () => void;
}

// Tâches par section
const SECTION_TASKS = {
  carrosserie: { value: 'Remplacement ou débosselage', duration: 2.5 },
  peinture: { value: 'Mise en peinture', duration: 5 },
  mecanique: { value: 'Contrôle technique de sécurité', duration: 1.5 }
};

export const PlanVehicleModal = ({
  isOpen,
  onClose,
  vehicle,
  employees,
  companyId,
  onSuccess
}: PlanVehicleModalProps) => {
  const [selectedCarrossier, setSelectedCarrossier] = useState<string>('');
  const [selectedPeintre, setSelectedPeintre] = useState<string>('');
  const [selectedMecanicien, setSelectedMecanicien] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrer les employés par classe
  const carrossiers = employees.filter(e => e.qualifications?.includes('carrossier'));
  const peintres = employees.filter(e => e.qualifications?.includes('peintre'));
  const mecaniciens = employees.filter(e => e.qualifications?.includes('mecanicien'));

  const handlePlan = async () => {
    if (!vehicle || !companyId) {
      toast.error('Données du véhicule manquantes');
      return;
    }

    // Au moins un employé doit être sélectionné (valeur non vide et différente de "none")
    const hasCarrossier = selectedCarrossier && selectedCarrossier !== 'none';
    const hasPeintre = selectedPeintre && selectedPeintre !== 'none';
    const hasMecanicien = selectedMecanicien && selectedMecanicien !== 'none';
    
    if (!hasCarrossier && !hasPeintre && !hasMecanicien) {
      toast.error('Veuillez sélectionner au moins un employé');
      return;
    }

    setIsLoading(true);

    try {
      // D'abord, nettoyer toutes les anciennes tâches en attente pour ce véhicule
      const { error: cleanupError } = await supabase
        .from('employee_schedule')
        .delete()
        .eq('vehicle_id', vehicle.id)
        .eq('status', 'En attente')
        .not('waiting_reason', 'is', null);

      if (cleanupError) {
        console.error('Erreur lors du nettoyage des anciennes tâches:', cleanupError);
      }

      const startDateTime = new Date();
      const tasksToCreate: any[] = [];

      // Créer les tâches pour chaque section si un employé est sélectionné
      if (hasCarrossier) {
        const task = SECTION_TASKS.carrosserie;
        const endDateTime = new Date(startDateTime.getTime() + task.duration * 60 * 60 * 1000);
        tasksToCreate.push({
          company_id: companyId,
          user_id: selectedCarrossier,
          vehicle_id: vehicle.id,
          task_type: task.value,
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          status: 'En attente'
        });
      }

      if (hasPeintre) {
        const task = SECTION_TASKS.peinture;
        const endDateTime = new Date(startDateTime.getTime() + task.duration * 60 * 60 * 1000);
        tasksToCreate.push({
          company_id: companyId,
          user_id: selectedPeintre,
          vehicle_id: vehicle.id,
          task_type: task.value,
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          status: 'En attente'
        });
      }

      if (hasMecanicien) {
        const task = SECTION_TASKS.mecanique;
        const endDateTime = new Date(startDateTime.getTime() + task.duration * 60 * 60 * 1000);
        tasksToCreate.push({
          company_id: companyId,
          user_id: selectedMecanicien,
          vehicle_id: vehicle.id,
          task_type: task.value,
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          status: 'En attente'
        });
      }

      // Insérer toutes les tâches
      const { data, error } = await supabase
        .from('employee_schedule')
        .insert(tasksToCreate)
        .select();

      if (error) {
        console.error('Erreur lors de la création des tâches:', error);
        toast.error('Erreur lors de la planification');
        return;
      }

      // Remettre waiting_reason à NULL dans la table vehicles
      await supabase
        .from('vehicles')
        .update({ waiting_reason: null } as any)
        .eq('id', vehicle.id);

      console.log('Tâches planifiées avec succès:', data);
      toast.success(`Véhicule ${vehicle.licensePlate} planifié avec ${tasksToCreate.length} tâche(s)`);
      
      // Envoyer le webhook
      try {
        await userActionWebhookService.sendUserAction('mise_planning', {
          vehicle_id: vehicle.id,
          vehicle_license_plate: vehicle.licensePlate,
          carrossier_id: selectedCarrossier || null,
          peintre_id: selectedPeintre || null,
          mecanicien_id: selectedMecanicien || null,
          tasks_count: tasksToCreate.length,
          scheduled_date: startDateTime.toISOString(),
          company_id: companyId
        });
      } catch (webhookError) {
        console.error('⚠️ Erreur webhook:', webhookError);
      }
      
      // Réinitialiser le formulaire
      setSelectedCarrossier('');
      setSelectedPeintre('');
      setSelectedMecanicien('');
      
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
      setSelectedCarrossier('');
      setSelectedPeintre('');
      setSelectedMecanicien('');
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
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold">
                {vehicle.brand} {vehicle.model}
              </h4>
              <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
              <p className="text-sm text-muted-foreground">Client: {vehicle.client}</p>
            </div>

            {/* Section Carrosserie */}
            <div className="space-y-2 p-3 border rounded-lg">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Wrench className="w-4 h-4 text-orange-500" />
                🔧 Carrosserie
              </Label>
              <Select value={selectedCarrossier} onValueChange={setSelectedCarrossier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un carrossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {carrossiers.map((employee) => (
                    <SelectItem key={employee.user_id} value={employee.user_id}>
                      {employee.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tâche: {SECTION_TASKS.carrosserie.value} ({SECTION_TASKS.carrosserie.duration}h)
              </p>
            </div>

            {/* Section Peinture */}
            <div className="space-y-2 p-3 border rounded-lg">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Paintbrush className="w-4 h-4 text-blue-500" />
                🎨 Peinture
              </Label>
              <Select value={selectedPeintre} onValueChange={setSelectedPeintre}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un peintre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {peintres.map((employee) => (
                    <SelectItem key={employee.user_id} value={employee.user_id}>
                      {employee.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tâche: {SECTION_TASKS.peinture.value} ({SECTION_TASKS.peinture.duration}h)
              </p>
            </div>

            {/* Section Mécanique */}
            <div className="space-y-2 p-3 border rounded-lg">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Settings className="w-4 h-4 text-green-500" />
                ⚙️ Mécanique
              </Label>
              <Select value={selectedMecanicien} onValueChange={setSelectedMecanicien}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {mecaniciens.map((employee) => (
                    <SelectItem key={employee.user_id} value={employee.user_id}>
                      {employee.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tâche: {SECTION_TASKS.mecanique.value} ({SECTION_TASKS.mecanique.duration}h)
              </p>
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
                disabled={isLoading || ((!selectedCarrossier || selectedCarrossier === 'none') && (!selectedPeintre || selectedPeintre === 'none') && (!selectedMecanicien || selectedMecanicien === 'none'))}
                className="flex-1"
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