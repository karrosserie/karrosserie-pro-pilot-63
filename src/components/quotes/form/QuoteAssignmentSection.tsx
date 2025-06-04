
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { vehiclesService } from '@/services/supabase/vehicles';
import { cn } from '@/lib/utils';

interface QuoteAssignmentSectionProps {
  formData: Partial<Quote>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: any[];
  isLoadingClients: boolean;
  errors?: Record<string, string>;
}

export const QuoteAssignmentSection = ({ 
  formData, 
  onFieldChange, 
  clientOptions, 
  isLoadingClients,
  errors = {}
}: QuoteAssignmentSectionProps) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  console.log('QuoteAssignmentSection - Errors received:', errors);
  console.log('QuoteAssignmentSection - client_id error:', errors.client_id);

  // Charger les véhicules quand un client est sélectionné
  useEffect(() => {
    const loadVehicles = async () => {
      if (formData.client_id) {
        setIsLoadingVehicles(true);
        try {
          console.log('Loading vehicles for client:', formData.client_id);
          const clientVehicles = await vehiclesService.getByClientId(formData.client_id);
          console.log('Vehicles loaded:', clientVehicles);
          setVehicles(clientVehicles || []);
        } catch (error) {
          console.error('Error loading vehicles:', error);
          setVehicles([]);
        } finally {
          setIsLoadingVehicles(false);
        }
      } else {
        setVehicles([]);
      }
    };

    loadVehicles();
  }, [formData.client_id]);

  // Réinitialiser le véhicule sélectionné quand le client change
  useEffect(() => {
    if (formData.client_id && formData.vehicle_id) {
      // Vérifier si le véhicule sélectionné appartient toujours au client
      const vehicleExists = vehicles.some(v => v.id === formData.vehicle_id);
      if (!vehicleExists) {
        console.log('Resetting vehicle selection as it does not belong to selected client');
        onFieldChange('vehicle_id', '');
      }
    }
  }, [vehicles, formData.vehicle_id, formData.client_id, onFieldChange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2" />
          Attribution
        </CardTitle>
        <CardDescription>
          Sélectionner le client et le véhicule pour ce devis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_id" required className={cn(errors.client_id && "text-red-500")}>
              Client
            </Label>
            <Select
              value={formData.client_id || ''}
              onValueChange={(value) => onFieldChange('client_id', value)}
            >
              <SelectTrigger 
                id="client_id"
                className={cn(
                  errors.client_id && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
                )}
              >
                <SelectValue placeholder={isLoadingClients ? "Chargement..." : "Sélectionner un client"} />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
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
            <Label htmlFor="vehicle_id" className={cn(errors.vehicle_id && "text-red-500")}>
              Véhicule
            </Label>
            <Select
              value={formData.vehicle_id || ''}
              onValueChange={(value) => onFieldChange('vehicle_id', value)}
              disabled={!formData.client_id}
            >
              <SelectTrigger 
                id="vehicle_id"
                className={cn(
                  errors.vehicle_id && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
                )}
              >
                <SelectValue 
                  placeholder={
                    !formData.client_id 
                      ? "Sélectionner d'abord un client" 
                      : isLoadingVehicles 
                        ? "Chargement des véhicules..." 
                        : vehicles.length === 0 
                          ? "Aucun véhicule trouvé" 
                          : "Sélectionner un véhicule"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {vehicles.length === 0 && !isLoadingVehicles && formData.client_id && (
                  <SelectItem value="no-vehicle" disabled>Aucun véhicule disponible</SelectItem>
                )}
                {vehicles.map((vehicle) => (
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
