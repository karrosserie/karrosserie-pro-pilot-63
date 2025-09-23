
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { Client } from '@/services/supabase/clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { cn } from '@/lib/utils';

interface QuoteAssignmentSectionProps {
  formData: Partial<Quote>;
  onChange: (field: string, value: any) => void;
  clientOptions: Client[];
  isLoadingClients: boolean;
  errors?: Record<string, string>;
  onNewClientClick?: () => void;
}

export const QuoteAssignmentSection = ({ 
  formData, 
  onChange, 
  clientOptions, 
  isLoadingClients,
  errors = {},
  onNewClientClick
}: QuoteAssignmentSectionProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  
  console.log('QuoteAssignmentSection - clientOptions:', clientOptions);
  console.log('QuoteAssignmentSection - formData.client_id:', formData.client_id);
  
  // Filtrer les véhicules pour le client sélectionné
  const clientVehicles = vehicles?.filter(vehicle => 
    vehicle.client_id === formData.client_id
  ) || [];

  console.log('QuoteAssignmentSection - clientVehicles:', clientVehicles);

  const handleClientChange = (clientId: string) => {
    console.log('QuoteAssignmentSection - Client changed to:', clientId);
    console.log('QuoteAssignmentSection - Calling onChange with client_id:', clientId);
    onChange('client_id', clientId);
    // Réinitialiser le véhicule quand on change de client
    onChange('vehicle_id', '');
  };

  const handleVehicleChange = (vehicleId: string) => {
    console.log('QuoteAssignmentSection - Vehicle changed to:', vehicleId);
    onChange('vehicle_id', vehicleId);
  };

  // Préparer les options pour SearchableSelect
  const clientSelectOptions = (clientOptions || []).map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  }));

  const vehicleSelectOptions = clientVehicles.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`
  }));

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
              showNewClientOption={true}
              onNewClientClick={onNewClientClick}
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
};
