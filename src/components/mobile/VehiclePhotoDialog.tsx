import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MultipleVehicleImages from '@/components/vehicle/form/MultipleVehicleImages';
import { useVehicles } from '@/hooks/use-vehicles';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VehicleImageData {
  url: string;
  timing: 'Avant' | 'Pendant' | 'Après';
}

interface VehiclePhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VehiclePhotoDialog: React.FC<VehiclePhotoDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [vehicleImages, setVehicleImages] = useState<VehicleImageData[]>([]);
  const { vehicles, updateVehicle } = useVehicles();
  const { toast } = useToast();

  // Trouver le véhicule sélectionné
  const selectedVehicle = vehicles?.find(v => v.id === selectedVehicleId);

  // Réinitialiser les images quand un véhicule est sélectionné
  React.useEffect(() => {
    setVehicleImages([]);
  }, [selectedVehicle]);

  const handleImageAdd = (url: string) => {
    const newImage: VehicleImageData = { url, timing: 'Avant' };
    setVehicleImages([...vehicleImages, newImage]);
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = vehicleImages.filter((_, i) => i !== index);
    setVehicleImages(updatedImages);
  };

  const handleImageUpdate = (index: number, url: string) => {
    const updatedImages = [...vehicleImages];
    updatedImages[index] = { ...updatedImages[index], url };
    setVehicleImages(updatedImages);
  };

  const handleImageTimingUpdate = (index: number, timing: 'Avant' | 'Pendant' | 'Après') => {
    const updatedImages = [...vehicleImages];
    updatedImages[index] = { ...updatedImages[index], timing };
    setVehicleImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (!selectedVehicleId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un véhicule",
        variant: "destructive"
      });
      return;
    }

    // Vérifier qu'il y a au moins une photo avec une URL valide
    const validImages = vehicleImages.filter(img => img.url && img.url.trim() !== '');
    if (validImages.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une photo",
        variant: "destructive"
      });
      return;
    }

    try {
      // Récupérer les données actuelles du véhicule directement depuis la base
      const { data: currentVehicleData } = await supabase
        .from('vehicles')
        .select('vehicle_images')
        .eq('id', selectedVehicleId)
        .single();
      
      let existingImages: VehicleImageData[] = [];
      
      if (currentVehicleData?.vehicle_images) {
        existingImages = Array.isArray(currentVehicleData.vehicle_images) 
          ? currentVehicleData.vehicle_images as unknown as VehicleImageData[]
          : [];
      }
      
      // Filtrer les nouvelles images valides (avec URL)
      const newValidImages = vehicleImages.filter(img => img.url && img.url.trim() !== '');
      
      // Combiner les images existantes avec les nouvelles
      const allImages = [...existingImages, ...newValidImages];
      
      await updateVehicle.mutateAsync({
        id: selectedVehicleId,
        data: { vehicle_images: allImages }
      });
      
      onOpenChange(false);
      setSelectedVehicleId('');
      setVehicleImages([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les photos",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedVehicleId('');
    setVehicleImages([]);
  };

  // Calculer si le formulaire est valide
  const validImages = vehicleImages.filter(img => img.url && img.url.trim() !== '');
  const isFormValid = selectedVehicleId && validImages.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une photo de véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vehicle-select">Véhicule <span className="text-red-500">*</span></Label>
            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.license_plate} - {vehicle.car_brands?.name} {vehicle.car_models?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedVehicleId && (
            <MultipleVehicleImages
              vehicleId={selectedVehicleId}
              vehicleImages={vehicleImages}
              isViewMode={false}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
              onImageUpdate={handleImageUpdate}
              onImageTimingUpdate={handleImageTimingUpdate}
            />
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button 
            variant="validation"
            onClick={handleSubmit}
            disabled={!isFormValid || updateVehicle.isPending}
          >
            {updateVehicle.isPending ? 'Enregistrement...' : 'Valider'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehiclePhotoDialog;