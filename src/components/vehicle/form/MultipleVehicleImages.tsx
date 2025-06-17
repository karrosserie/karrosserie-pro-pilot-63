
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { Plus, X } from 'lucide-react';

interface VehicleImage {
  url: string;
  phase: 'Avant' | 'Pendant' | 'Après';
}

interface MultipleVehicleImagesProps {
  vehicleId: string;
  vehicleImages: VehicleImage[];
  isViewMode: boolean;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
  onImageUpdate: (index: number, url: string) => void;
  onImagePhaseUpdate: (index: number, phase: 'Avant' | 'Pendant' | 'Après') => void;
}

const MultipleVehicleImages: React.FC<MultipleVehicleImagesProps> = ({
  vehicleId,
  vehicleImages,
  isViewMode,
  onImageAdd,
  onImageRemove,
  onImageUpdate,
  onImagePhaseUpdate
}) => {
  const addNewImageSlot = () => {
    // Ajouter un slot vide pour une nouvelle image
    onImageAdd('');
  };

  const handleImageUpload = (index: number, url: string) => {
    if (vehicleImages[index]?.url === '' || !vehicleImages[index]) {
      // Si c'est un slot vide, utiliser onImageUpdate pour le remplir
      onImageUpdate(index, url);
    } else {
      // Si c'est une image existante, la remplacer
      onImageUpdate(index, url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Photos du véhicule</Label>
        {!isViewMode && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addNewImageSlot}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une photo
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {vehicleImages.length === 0 && !isViewMode && (
          <div className="space-y-3">
            <DocumentUploader
              documentType="vehicle-image"
              documentId={`${vehicleId}-0`}
              currentDocumentUrl=""
              onUploadComplete={(url) => handleImageUpload(0, url)}
              isViewMode={isViewMode}
            />
            <div className="w-full max-w-xs">
              <Label className="text-sm font-medium mb-2 block">Phase</Label>
              <Select 
                value="Avant" 
                onValueChange={(value) => onImagePhaseUpdate(0, value as 'Avant' | 'Pendant' | 'Après')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Avant">Avant</SelectItem>
                  <SelectItem value="Pendant">Pendant</SelectItem>
                  <SelectItem value="Après">Après</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {vehicleImages.map((image, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <DocumentUploader
                  documentType="vehicle-image"
                  documentId={`${vehicleId}-${index}`}
                  currentDocumentUrl={image?.url || ''}
                  onUploadComplete={(url) => handleImageUpload(index, url)}
                  isViewMode={isViewMode}
                />
              </div>
              {!isViewMode && vehicleImages.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onImageRemove(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="w-full max-w-xs">
              <Label className="text-sm font-medium mb-2 block">Phase</Label>
              {isViewMode ? (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {image?.phase || 'Non spécifiée'}
                </div>
              ) : (
                <Select 
                  value={image?.phase || 'Avant'} 
                  onValueChange={(value) => onImagePhaseUpdate(index, value as 'Avant' | 'Pendant' | 'Après')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Avant">Avant</SelectItem>
                    <SelectItem value="Pendant">Pendant</SelectItem>
                    <SelectItem value="Après">Après</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleVehicleImages;
