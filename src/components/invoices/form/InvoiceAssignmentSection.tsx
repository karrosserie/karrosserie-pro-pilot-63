
import React, { useCallback, useMemo, useRef, memo } from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Users, AlertCircle, Pencil } from 'lucide-react';
import { Invoice } from '@/services/supabase/invoices';
import { Client } from '@/services/supabase/clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { cn } from '@/lib/utils';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

interface InvoiceAssignmentSectionProps {
  formData: Partial<Invoice>;
  errors?: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions: Client[];
  isLoadingClients: boolean;
  skipVehicle?: boolean;
  onSkipVehicleChange?: (value: boolean) => void;
  onEditClient?: (clientId: string) => void;
}

const InvoiceAssignmentSectionComponent = ({
  formData,
  errors = {},
  onFieldChange,
  clientOptions,
  isLoadingClients,
  skipVehicle = false,
  onSkipVehicleChange,
  onEditClient
}: InvoiceAssignmentSectionProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();

  // useRef pattern to stabilize callbacks
  const onFieldChangeRef = useRef(onFieldChange);
  onFieldChangeRef.current = onFieldChange;
  const onSkipVehicleChangeRef = useRef(onSkipVehicleChange);
  onSkipVehicleChangeRef.current = onSkipVehicleChange;

  const handleSkipVehicleToggle = useCallback((checked: boolean) => {
    onSkipVehicleChangeRef.current?.(checked);
    if (checked) {
      onFieldChangeRef.current('vehicle_id', null);
    }
  }, []);
  
  // Filtrer les véhicules pour le client sélectionné
  const clientVehicles = useMemo(() => 
    vehicles?.filter(vehicle => vehicle.client_id === formData.client_id) || [],
    [vehicles, formData.client_id]
  );

  const handleClientChange = useCallback((clientId: string) => {
    onFieldChangeRef.current('client_id', clientId);
    // Réinitialiser le véhicule quand on change de client
    onFieldChangeRef.current('vehicle_id', null);
  }, []);

  const handleVehicleChange = useCallback((vehicleId: string) => {
    onFieldChangeRef.current('vehicle_id', vehicleId);
  }, []);

  // Préparer les options pour SearchableSelect
  const clientSelectOptions = useMemo(() => 
    (clientOptions || []).map(client => ({
      value: client.id,
      label: getClientDisplayName(client)
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
        <div className="flex items-center space-x-2 pb-2 border-b border-border">
          <Switch
            id="skip-vehicle"
            checked={skipVehicle}
            onCheckedChange={handleSkipVehicleToggle}
          />
          <Label htmlFor="skip-vehicle" className="cursor-pointer text-sm font-normal">
            Facture sans véhicule
          </Label>
        </div>
        
        <div className={cn("grid gap-4", skipVehicle ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
          <div>
            <Label htmlFor="client_id" required>Client</Label>
            <div className="flex gap-2">
              <div className="flex-1">
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
              </div>
              {onEditClient && formData.client_id && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onEditClient(formData.client_id!)}
                  title="Modifier le client"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.client_id && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.client_id}
              </p>
            )}
          </div>

          {!skipVehicle && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Memoize to prevent unnecessary re-renders
export const InvoiceAssignmentSection = memo(InvoiceAssignmentSectionComponent);
