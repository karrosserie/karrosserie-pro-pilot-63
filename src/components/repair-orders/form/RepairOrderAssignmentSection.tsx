import React, { useCallback, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { Client } from '@/services/supabase/clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { cn } from '@/lib/utils';

interface RepairOrderAssignmentSectionProps {
  formData: Partial<RepairOrder>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: Client[];
  isLoadingClients: boolean;
}

export const RepairOrderAssignmentSection = React.memo(({
  formData,
  errors,
  onFieldChange,
  clientOptions,
  isLoadingClients
}: RepairOrderAssignmentSectionProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  
  // Filtrer les véhicules pour le client sélectionné
  const clientVehicles = useMemo(() => 
    vehicles?.filter(vehicle => vehicle.client_id === formData.client_id) || [],
    [vehicles, formData.client_id]
  );

  const handleClientChange = useCallback((clientId: string) => {
    onFieldChange('client_id', clientId);
    // Réinitialiser le véhicule quand on change de client
    onFieldChange('vehicle_id', null);
  }, [onFieldChange]);

  const handleVehicleChange = useCallback((vehicleId: string) => {
    onFieldChange('vehicle_id', vehicleId);
  }, [onFieldChange]);

  // Préparer les options pour SearchableSelect
  const clientSelectOptions = useMemo(() => 
    (clientOptions || []).map(client => ({
      value: client.id,
      label: `${client.first_name} ${client.last_name}`
    })),
    [clientOptions]
  );

  const vehicleSelectOptions = useMemo(() => 
    clientVehicles.map(vehicle => ({
      value: vehicle.id,
      label: `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`
    })),
    [clientVehicles]
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2" />
          Attribution
        </CardTitle>
        <CardDescription>
          Sélectionnez le client et le véhicule concernés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id" required>Client</Label>
            <SearchableSelect
              options={clientSelectOptions}
              value={formData.client_id || ''}
              onValueChange={handleClientChange}
              placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client"}
              searchPlaceholder="Rechercher un client..."
              disabled={isLoadingClients}
              className={cn(
                errors.client_id && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.client_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.client_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="vehicle_id" required>Véhicule</Label>
            <SearchableSelect
              options={vehicleSelectOptions}
              value={formData.vehicle_id || ''}
              onValueChange={handleVehicleChange}
              placeholder={
                !formData.client_id 
                  ? "Sélectionnez d'abord un client"
                  : isLoadingVehicles 
                  ? "Chargement..."
                  : clientVehicles.length === 0
                  ? "Aucun véhicule trouvé pour ce client"
                  : "Sélectionner un véhicule"
              }
              searchPlaceholder="Rechercher un véhicule..."
              disabled={!formData.client_id || isLoadingVehicles}
              className={cn(
                errors.vehicle_id && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.vehicle_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.vehicle_id}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
