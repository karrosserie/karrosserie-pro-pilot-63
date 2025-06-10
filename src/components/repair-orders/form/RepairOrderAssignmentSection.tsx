
import React, { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export const RepairOrderAssignmentSection = ({
  formData,
  errors,
  onFieldChange,
  clientOptions,
  isLoadingClients
}: RepairOrderAssignmentSectionProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  const isInitializing = useRef(true);
  
  // Filtrer les véhicules pour le client sélectionné
  const clientVehicles = vehicles?.filter(vehicle => 
    vehicle.client_id === formData.client_id
  ) || [];

  // Marquer la fin de l'initialisation une fois que les données sont chargées
  useEffect(() => {
    if (formData.client_id && formData.vehicle_id && isInitializing.current) {
      console.log('Initial data loaded, stopping initialization phase');
      isInitializing.current = false;
    }
  }, [formData.client_id, formData.vehicle_id]);

  const handleClientChange = (clientId: string) => {
    console.log('Client change triggered, isInitializing:', isInitializing.current);
    onFieldChange('client_id', clientId);
    
    // Ne réinitialiser le véhicule que si ce n'est pas la phase d'initialisation
    // et si le nouveau client n'a pas le véhicule actuellement sélectionné
    if (!isInitializing.current && formData.vehicle_id) {
      const vehicleExistsForNewClient = vehicles?.some(vehicle => 
        vehicle.client_id === clientId && vehicle.id === formData.vehicle_id
      );
      
      if (!vehicleExistsForNewClient) {
        console.log('Vehicle does not exist for new client, resetting vehicle selection');
        onFieldChange('vehicle_id', null);
      }
    }
  };

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
            <Select
              value={formData.client_id || ''}
              onValueChange={handleClientChange}
              disabled={isLoadingClients}
            >
              <SelectTrigger 
                id="client_id"
                className={cn(
                  errors.client_id && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.client_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="vehicle_id" required>Véhicule</Label>
            <Select
              value={formData.vehicle_id || ''}
              onValueChange={(value) => onFieldChange('vehicle_id', value)}
              disabled={!formData.client_id || isLoadingVehicles}
            >
              <SelectTrigger 
                id="vehicle_id"
                className={cn(
                  errors.vehicle_id && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {clientVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.vehicle_id}
              </p>
            )}
            {formData.client_id && clientVehicles.length === 0 && !isLoadingVehicles && (
              <p className="text-sm text-gray-500 mt-1">
                Aucun véhicule trouvé pour ce client
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
