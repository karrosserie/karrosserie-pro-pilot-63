import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOptimalPlanning } from '@/hooks/use-optimal-planning';

interface Vehicle {
  id: string;
  license_plate: string;
  brand_name: string;
  model_name: string;
  client_name: string;
  repair_order_reference: string;
}

interface AddVehicleToWorkshopFormProps {
  companyId?: string;
  employees: any[];
  onSuccess: () => void;
}

const WORKFLOW_STEPS = [
  { key: 'accueil_preparation', qualification: 'Accueil & Préparation du dossier', defaultDuration: '01:00', task_type: 'accueil_preparation' },
  { key: 'remplacement_debosselage', qualification: 'Remplacement ou débosselage', defaultDuration: '02:30', task_type: 'remplacement_debosselage' },
  { key: 'preparation_peinture', qualification: 'Préparation peinture', defaultDuration: '02:30', task_type: 'preparation_peinture' },
  { key: 'mise_en_peinture', qualification: 'Mise en peinture', defaultDuration: '05:00', task_type: 'mise_en_peinture' },
  { key: 'finitions_remontage', qualification: 'Finitions & remontage', defaultDuration: '02:00', task_type: 'finitions_remontage' },
  { key: 'cloture_livraison', qualification: 'Clôture du dossier et livraison', defaultDuration: '00:30', task_type: 'cloture_livraison' }
];

export function AddVehicleToWorkshopForm({ companyId, employees, onSuccess }: AddVehicleToWorkshopFormProps) {
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { calculateOptimalPlanning } = useOptimalPlanning(employees);

  // Charger les véhicules disponibles
  useEffect(() => {
    const loadAvailableVehicles = async () => {
      if (!companyId) return;

      try {
        // Récupérer les véhicules avec ordres de réparation qui ne sont pas dans l'atelier
        const { data: vehiclesWithOrders, error: vehiclesError } = await supabase
          .from('vehicles')
          .select(`
            id,
            license_plate,
            car_brands (name),
            car_models (name),
            clients (first_name, last_name),
            repair_orders!inner (reference, status)
          `)
          .eq('company_id', companyId)
          .in('repair_orders.status', ['pending', 'in_progress']);

        if (vehiclesError) throw vehiclesError;

        // Récupérer les véhicules déjà dans l'atelier
        const { data: vehiclesInWorkshop, error: workshopError } = await (supabase as any)
          .from('employee_schedule')
          .select('vehicle_id')
          .eq('company_id', companyId);

        if (workshopError) throw workshopError;

        const vehicleIdsInWorkshop = new Set(vehiclesInWorkshop?.map((item: any) => item.vehicle_id) || []);

        // Filtrer les véhicules disponibles
        const available = vehiclesWithOrders
          ?.filter(vehicle => !vehicleIdsInWorkshop.has(vehicle.id))
          .map(vehicle => ({
            id: vehicle.id,
            license_plate: vehicle.license_plate,
            brand_name: vehicle.car_brands?.name || 'Marque inconnue',
            model_name: vehicle.car_models?.name || 'Modèle inconnu',
            client_name: `${vehicle.clients?.first_name || ''} ${vehicle.clients?.last_name || ''}`.trim(),
            repair_order_reference: vehicle.repair_orders?.[0]?.reference || 'N/A'
          })) || [];

        setAvailableVehicles(available);
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les véhicules disponibles",
          variant: "destructive"
        });
      }
    };

    loadAvailableVehicles();
  }, [companyId]);

  const handleAddVehicle = async () => {
    if (!selectedVehicleId || !companyId) return;

    setIsLoading(true);
    try {
      // Calculer le planning optimal
      const optimalPlanning = calculateOptimalPlanning();
      
      // Créer les entrées de planning pour chaque étape
      const schedulePromises = WORKFLOW_STEPS.map(step => {
        const planningStep = optimalPlanning[step.key as keyof typeof optimalPlanning];
        
        if (!planningStep?.employeeId || !planningStep?.startDateTime || !planningStep?.endDateTime) {
          throw new Error(`Planning incomplet pour l'étape: ${step.qualification}`);
        }

        return (supabase as any)
          .from('employee_schedule')
          .insert({
            company_id: companyId,
            employee_id: planningStep.employeeId,
            vehicle_id: selectedVehicleId,
            task_type: step.task_type,
            start_datetime: planningStep.startDateTime.toISOString(),
            end_datetime: planningStep.endDateTime.toISOString()
          });
      });

      const results = await Promise.all(schedulePromises);
      
      // Vérifier s'il y a des erreurs
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Erreur lors de la création de certaines planifications');
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le véhicule à l'atelier",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVehicle = availableVehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="vehicle-select">Véhicule à ajouter</Label>
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un véhicule..." />
            </SelectTrigger>
            <SelectContent>
              {availableVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{vehicle.license_plate}</span>
                    <span className="text-sm text-muted-foreground">
                      {vehicle.brand_name} {vehicle.model_name} - {vehicle.client_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      OR: {vehicle.repair_order_reference}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {availableVehicles.length === 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground">
                Aucun véhicule disponible. Tous les véhicules avec des ordres de réparation sont déjà dans l'atelier.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedVehicle && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Véhicule sélectionné</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Plaque:</span> {selectedVehicle.license_plate}
                </div>
                <div>
                  <span className="font-medium">Véhicule:</span> {selectedVehicle.brand_name} {selectedVehicle.model_name}
                </div>
                <div>
                  <span className="font-medium">Client:</span> {selectedVehicle.client_name}
                </div>
                <div>
                  <span className="font-medium">Ordre de réparation:</span> {selectedVehicle.repair_order_reference}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => setSelectedVehicleId("")}
        >
          Annuler
        </Button>
        <Button
          onClick={handleAddVehicle}
          disabled={!selectedVehicleId || isLoading}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
        >
          {isLoading ? "Ajout en cours..." : "Ajouter à l'atelier"}
        </Button>
      </div>
    </div>
  );
}