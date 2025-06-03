
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { useClientVehicles } from '@/hooks/use-vehicles';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface QuoteAssignmentSectionProps {
  formData: Partial<Quote>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: Client[];
  isLoadingClients: boolean;
  targetVehicleId?: string;
  isInitializing?: boolean;
  onVehiclesLoaded?: (loaded: boolean) => void;
}

export const QuoteAssignmentSection = ({
  formData,
  onFieldChange,
  clientOptions,
  isLoadingClients,
  targetVehicleId = '',
  isInitializing = false,
  onVehiclesLoaded
}: QuoteAssignmentSectionProps) => {
  const isReadOnly = formData.status === 'Accepté' || formData.status === 'Refusé';
  
  // Récupérer les véhicules du client sélectionné
  const { vehicles: clientVehicles, isLoading: isLoadingClientVehicles } = useClientVehicles(
    formData.client_id || undefined
  );

  // Effet pour notifier quand les véhicules sont chargés et sélectionner le bon véhicule
  useEffect(() => {
    console.log('Vehicle loading effect:', {
      isLoadingClientVehicles,
      clientVehiclesCount: clientVehicles?.length,
      targetVehicleId,
      isInitializing,
      currentVehicleId: formData.vehicle_id
    });

    if (!isLoadingClientVehicles && clientVehicles && onVehiclesLoaded) {
      console.log('Notifying that vehicles are loaded');
      onVehiclesLoaded(true);
    }
  }, [isLoadingClientVehicles, clientVehicles, targetVehicleId, isInitializing, formData.vehicle_id, onVehiclesLoaded]);

  const handleClientChange = (clientId: string) => {
    console.log('Client changed to:', clientId);
    onFieldChange('client_id', clientId);
    // Réinitialiser le véhicule lors du changement de client (sauf en mode édition initial)
    if (!isInitializing) {
      console.log('Resetting vehicle because not in initialization mode');
      onFieldChange('vehicle_id', '');
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    console.log('Vehicle changed to:', vehicleId);
    if (vehicleId && vehicleId.trim() !== '') {
      onFieldChange('vehicle_id', vehicleId);
    } else {
      onFieldChange('vehicle_id', '');
    }
  };

  // Déterminer la valeur du véhicule à afficher
  const vehicleValue = formData.vehicle_id || '';
  
  console.log('Render - Vehicle value for Select:', vehicleValue);
  console.log('Available vehicles:', clientVehicles);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2" />
          Assignation
        </CardTitle>
        <CardDescription>
          Client et véhicule concernés par le devis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select
              value={formData.client_id || ''}
              onValueChange={handleClientChange}
              disabled={isReadOnly}
            >
              <SelectTrigger id="client_id">
                <SelectValue placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client"} />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vehicle_id">Véhicule</Label>
            <Select
              value={vehicleValue}
              onValueChange={handleVehicleChange}
              disabled={isReadOnly || !formData.client_id}
            >
              <SelectTrigger id="vehicle_id">
                <SelectValue 
                  placeholder={
                    !formData.client_id
                      ? "Sélectionner d'abord un client" 
                      : isLoadingClientVehicles 
                        ? "Chargement..." 
                        : "Sélectionner un véhicule"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {clientVehicles && clientVehicles.length > 0 ? (
                  clientVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                      </div>
                    </SelectItem>
                  ))
                ) : formData.client_id && !isLoadingClientVehicles ? (
                  <SelectItem value="no-vehicles" disabled>
                    Aucun véhicule trouvé pour ce client
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
