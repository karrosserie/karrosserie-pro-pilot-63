import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useVehicleReservations } from '@/hooks/use-fleet-reservations';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { isValidVin, decodeVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';
import { Calendar, User } from 'lucide-react';

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
            {/* VIN and Engine Number */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vin">
                    Numéro de série (VIN) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vin"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    required
                    placeholder="17 caractères"
                    maxLength={17}
                    style={{
                      textTransform: 'uppercase'
                    }}
                  />
                  {formData.vin && !isValidVin(formData.vin) && (
                    <p className="text-sm text-red-500 mt-1">
                      Le VIN doit contenir exactement 17 caractères alphanumériques (sans I, O, Q)
                    </p>
                  )}
                  {formData.vin && isValidVin(formData.vin) && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ VIN valide
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="engine_number">Numéro de moteur</Label>
                  <Input
                    id="engine_number"
                    name="engine_number"
                    value={formData.engine_number}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </div>

            {/* Brand and Model */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Marque *</Label>
                <Select
                  value={selectedBrandId}
                  onValueChange={handleBrandChange}
                  disabled={isViewMode}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="model">Modèle *</Label>
                <Select
                  value={formData.model}
                  onValueChange={handleModelChange}
                  disabled={isViewMode || !selectedBrandId}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map((model) => (
                      <SelectItem key={model.id} value={model.name}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* License Plate, Year, Color, and Mileage */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="license_plate">
                  Plaque d'immatriculation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="license_plate"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                />
              </div>

              <div>
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                />
              </div>
              
              <div>
                <Label htmlFor="mileage">Kilométrage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Loué">Loué</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                  <SelectItem value="Hors service">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                disabled={isViewMode}
                rows={3}
              />
            </div>

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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Historique des prêts</h3>
            
            {reservations && reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div 
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-600 mr-2" />
                        <h4 className="font-medium">
                          {reservation.clients?.first_name} {reservation.clients?.last_name}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500">
                        Réservation #{reservation.id.slice(0, 8)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          Du {new Date(reservation.start_date).toLocaleDateString('fr-FR')} 
                          {reservation.end_date && (
                            ` au ${new Date(reservation.end_date).toLocaleDateString('fr-FR')}`
                          )}
                        </span>
                      </div>
                      
                      {reservation.repair_orders?.reference && (
                        <div className="text-sm">
                          <span className="font-medium">Ordre de réparation: </span>
                          {reservation.repair_orders.reference}
                        </div>
                      )}
                      
                      {reservation.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes: </span>
                          {reservation.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : reservation.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status === 'active' && 'En cours'}
                        {reservation.status === 'completed' && 'Terminé'}
                        {reservation.status === 'cancelled' && 'Annulé'}
                        {reservation.status === 'pending' && 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun prêt enregistré pour ce véhicule</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetVehicleForm;

</edits_to_apply>
