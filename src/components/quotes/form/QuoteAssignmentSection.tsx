
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
  isEditing?: boolean;
  pendingVehicleId?: string;
  onVehicleSelection?: (vehicleId: string, vehiclesLoaded: boolean) => void;
}

export const QuoteAssignmentSection = ({
  formData,
  onFieldChange,
  clientOptions,
  isLoadingClients,
  isEditing = false,
  pendingVehicleId = '',
  onVehicleSelection
}: QuoteAssignmentSectionProps) => {
  const isReadOnly = formData.status === 'Accepté' || formData.status === 'Refusé';
  
  // Récupérer les véhicules du client sélectionné
  const { vehicles: clientVehicles, isLoading: isLoadingClientVehicles } = useClientVehicles(
    formData.client_id || undefined,
    isEditing ? pendingVehicleId || undefined : undefined
  );

  // Effet pour sélectionner automatiquement le véhicule une fois les données chargées
  useEffect(() => {
    console.log('Vehicle selection effect:', {
      pendingVehicleId,
      isLoadingClientVehicles,
      clientVehiclesCount: clientVehicles?.length,
      currentVehicleId: formData.vehicle_id
    });

    if (pendingVehicleId && 
        !isLoadingClientVehicles && 
        clientVehicles && 
        clientVehicles.length > 0 && 
        !formData.vehicle_id &&
        onVehicleSelection) {
      
      // Vérifier que le véhicule pending existe dans la liste
      const vehicleExists = clientVehicles.some(vehicle => vehicle.id === pendingVehicleId);
      if (vehicleExists) {
        console.log('Auto-selecting vehicle:', pendingVehicleId);
        onVehicleSelection(pendingVehicleId, true);
      }
    }
  }, [pendingVehicleId, isLoadingClientVehicles, clientVehicles, formData.vehicle_id, onVehicleSelection]);

  const handleClientChange = (clientId: string) => {
    console.log('Client changed to:', clientId, 'isEditing:', isEditing);
    onFieldChange('client_id', clientId);
    // Ne réinitialiser le véhicule que lors de la création d'un nouveau devis
    if (!isEditing) {
      console.log('Resetting vehicle because creating new quote');
      onFieldChange('vehicle_id', '');
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    console.log('Vehicle changed to:', vehicleId);
    // Ne pas accepter les valeurs vides ou undefined comme changement valide
    if (vehicleId && vehicleId.trim() !== '') {
      onFieldChange('vehicle_id', vehicleId);
    } else {
      onFieldChange('vehicle_id', '');
    }
  };

  // Déterminer la valeur du véhicule à afficher
  // Ne pas utiliser undefined car cela peut causer des problèmes avec Radix UI
  const vehicleValue = formData.vehicle_id || '';
  
  console.log('Vehicle value for Select:', vehicleValue, 'formData.vehicle_id:', formData.vehicle_id);
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
