
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
}

interface AssignmentSectionProps {
  formData: Partial<ExpertiseReport>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: Client[];
  vehicleOptions: Vehicle[];
  isLoadingClients: boolean;
  isLoadingVehicles: boolean;
}

export const AssignmentSection = ({
  formData,
  onFieldChange,
  clientOptions,
  vehicleOptions,
  isLoadingClients,
  isLoadingVehicles
}: AssignmentSectionProps) => {
  const isReadOnly = formData.status !== 'Importé';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2" />
          Assignation
        </CardTitle>
        <CardDescription>
          Client et véhicule concernés par l'expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select
              value={formData.client_id || ''}
              onValueChange={(value) => onFieldChange('client_id', value || null)}
              disabled={isReadOnly}
            >
              <SelectTrigger id="client_id">
                <SelectValue placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun client</SelectItem>
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
              value={formData.vehicle_id || ''}
              onValueChange={(value) => onFieldChange('vehicle_id', value || null)}
              disabled={isReadOnly}
            >
              <SelectTrigger id="vehicle_id">
                <SelectValue placeholder={isLoadingVehicles ? "Chargement..." : "Sélectionner un véhicule"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun véhicule</SelectItem>
                {vehicleOptions.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
