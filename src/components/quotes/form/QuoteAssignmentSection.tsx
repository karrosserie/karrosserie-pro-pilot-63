
import React from 'react';
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
  isEditing?: boolean; // Ajouter cette prop pour savoir si on est en mode édition
}

export const QuoteAssignmentSection = ({
  formData,
  onFieldChange,
  clientOptions,
  isLoadingClients,
  isEditing = false
}: QuoteAssignmentSectionProps) => {
  const isReadOnly = formData.status === 'Accepté' || formData.status === 'Refusé';
  
  // Récupérer les véhicules du client sélectionné
  const { vehicles: clientVehicles, isLoading: isLoadingClientVehicles } = useClientVehicles(formData.client_id || undefined);

  const handleClientChange = (clientId: string) => {
    onFieldChange('client_id', clientId);
    // Réinitialiser le véhicule sélectionné seulement lors de la création d'un nouveau devis
    if (!isEditing) {
      onFieldChange('vehicle_id', '');
    }
  };

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
              value={formData.client_id || undefined}
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
              value={formData.vehicle_id || undefined}
              onValueChange={(value) => onFieldChange('vehicle_id', value || '')}
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
