
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface AssignmentSectionProps {
  formData: Partial<ExpertiseReport>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: any[];
  vehicleOptions: any[];
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
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <User className="h-5 w-5 mr-2" />
          Assignation
        </CardTitle>
        <CardDescription>
          Client et véhicule concernés par le rapport
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="client">Client</Label>
          <Select
            value={formData.client_id || 'none'}
            onValueChange={(value) => onFieldChange('client_id', value === 'none' ? null : value)}
          >
            <SelectTrigger id="client">
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun client</SelectItem>
              {clientOptions.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.first_name} {client.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoadingClients && <p className="text-sm text-gray-500">Chargement des clients...</p>}
        </div>

        <div>
          <Label htmlFor="vehicle">Véhicule</Label>
          <Select
            value={formData.vehicle_id || 'none'}
            onValueChange={(value) => onFieldChange('vehicle_id', value === 'none' ? null : value)}
          >
            <SelectTrigger id="vehicle">
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun véhicule</SelectItem>
              {vehicleOptions.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoadingVehicles && <p className="text-sm text-gray-500">Chargement des véhicules...</p>}
        </div>
      </CardContent>
    </Card>
  );
};
