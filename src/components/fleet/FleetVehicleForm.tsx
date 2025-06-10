
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useVehicleReservations } from '@/hooks/use-fleet-reservations';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { isValidVin, decodeVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';
import FleetVehicleBasicInfo from './form/FleetVehicleBasicInfo';
import FleetVehicleDetails from './form/FleetVehicleDetails';
import FleetLoansHistoryTab from './form/FleetLoansHistoryTab';

interface FleetVehicleFormProps {
  vehicle?: FleetVehicle | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
  onCancel: () => void;
}

const FleetVehicleForm: React.FC<FleetVehicleFormProps> = ({
  vehicle,
  mode,
  onSuccess,
  onCancel
}) => {
  const { createVehicle, updateVehicle } = useFleetVehicles();
  const { reservations } = useVehicleReservations(vehicle?.id);
  const { user } = useAuth();
  const { carBrands } = useCarBrands();
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState({
    vin: '',
    engine_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    color: '',
    mileage: '',
    status: 'Disponible',
    notes: ''
  });

  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const { carModels } = useCarModels(selectedBrandId);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin || '',
        engine_number: vehicle.engine_number || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        license_plate: vehicle.license_plate || '',
        color: vehicle.color || '',
        mileage: vehicle.mileage?.toString() || '',
        status: vehicle.status || 'Disponible',
        notes: vehicle.notes || ''
      });

      // Trouver l'ID de la marque correspondante
      if (vehicle.brand && carBrands.length > 0) {
        const matchingBrand = carBrands.find(brand => brand.name === vehicle.brand);
        if (matchingBrand) {
          setSelectedBrandId(matchingBrand.id);
        }
      }
    }
  }, [vehicle, carBrands]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vin') {
      const upperValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: upperValue
      }));

      // Décoder automatiquement le VIN si valide
      if (isValidVin(upperValue)) {
        const vinInfo = decodeVin(upperValue);
        console.log('VIN décodé:', vinInfo);
        
        if (vinInfo.brand) {
          // Trouver la marque correspondante
          const matchingBrand = carBrands.find(brand => 
            brand.name.toLowerCase() === vinInfo.brand?.toLowerCase()
          );
          
          if (matchingBrand) {
            setSelectedBrandId(matchingBrand.id);
            setFormData(prev => ({
              ...prev,
              brand: matchingBrand.name,
              model: vinInfo.model || prev.model,
              year: vinInfo.year || prev.year
            }));
          }
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = carBrands.find(brand => brand.id === brandId);
    if (selectedBrand) {
      setSelectedBrandId(brandId);
      setFormData(prev => ({
        ...prev,
        brand: selectedBrand.name,
        model: '' // Reset model when brand changes
      }));
    }
  };

  const handleModelChange = (modelName: string) => {
    setFormData(prev => ({
      ...prev,
      model: modelName
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      const submissionData = {
        vin: formData.vin,
        engine_number: formData.engine_number,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        license_plate: formData.license_plate,
        color: formData.color,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        status: formData.status,
        notes: formData.notes
      };

      if (mode === 'edit' && vehicle) {
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: submissionData
        });
      } else if (mode === 'create') {
        await createVehicle.mutateAsync({
          ...submissionData,
          user_id: user.id
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving fleet vehicle:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="text-center">
        <p className="text-muted-foreground">
          {mode === 'create' 
            ? "Saisissez les informations du nouveau véhicule." 
            : mode === 'edit' 
              ? "Modifiez les informations du véhicule." 
              : "Consultez les informations du véhicule."
          }
        </p>
      </div>

      <Tabs defaultValue="vehicle-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vehicle-info">Informations sur le véhicule</TabsTrigger>
          <TabsTrigger value="loans-history">Historique des prêts</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle-info" className="space-y-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FleetVehicleBasicInfo
              formData={{
                vin: formData.vin,
                engine_number: formData.engine_number,
                brand: formData.brand,
                model: formData.model
              }}
              selectedBrandId={selectedBrandId}
              isViewMode={isViewMode}
              onInputChange={handleInputChange}
              onBrandChange={handleBrandChange}
              onModelChange={handleModelChange}
            />

            <FleetVehicleDetails
              formData={{
                year: formData.year,
                license_plate: formData.license_plate,
                color: formData.color,
                mileage: formData.mileage,
                status: formData.status,
                notes: formData.notes
              }}
              isViewMode={isViewMode}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
            />

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {isViewMode ? "Fermer" : "Annuler"}
              </Button>
              {!isViewMode && (
                <Button 
                  type="submit" 
                  className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                  disabled={createVehicle.isPending || updateVehicle.isPending}
                >
                  {createVehicle.isPending || updateVehicle.isPending 
                    ? "Enregistrement..." 
                    : (mode === 'edit' ? "Mettre à jour" : "Enregistrer")
                  }
                </Button>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="loans-history" className="space-y-6 mt-6">
          <FleetLoansHistoryTab reservations={reservations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetVehicleForm;
