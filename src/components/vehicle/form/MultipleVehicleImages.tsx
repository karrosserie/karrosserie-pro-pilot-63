
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface VehicleImageData {
  url: string;
  timing: 'Avant' | 'Pendant' | 'Après';
}

interface MultipleVehicleImagesProps {
  vehicleId: string;
  vehicleImages: VehicleImageData[];
  isViewMode: boolean;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
  onImageUpdate: (index: number, url: string) => void;
  onImageTimingUpdate: (index: number, timing: 'Avant' | 'Pendant' | 'Après') => void;
  showTimingSelector?: boolean; // Nouvelle prop pour désactiver le sélecteur de timing
}

const MultipleVehicleImages: React.FC<MultipleVehicleImagesProps> = ({
  vehicleId,
  vehicleImages,
  isViewMode,
  onImageAdd,
  onImageRemove,
  onImageUpdate,
  onImageTimingUpdate,
  showTimingSelector = true // Par défaut, afficher le sélecteur de timing
}) => {
  const addNewImageSlot = () => {
    // Ajouter un slot vide pour une nouvelle image
    onImageAdd('');
  };

  const handleImageUpload = (index: number, url: string) => {
    // Si c'est la première image et qu'il n'y a pas encore d'images dans le tableau
    if (index === 0 && vehicleImages.length === 0) {
      onImageAdd(url); // Utilise onImageAdd qui définit automatiquement timing: 'Avant'
    } else {
      onImageUpdate(index, url);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Label className="text-sm">Photos du véhicule</Label>
        {!isViewMode && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addNewImageSlot}
            className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter une photo
          </Button>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {vehicleImages.length === 0 && !isViewMode && (
          <DocumentUploader
            documentType="vehicle-image"
            documentId={`${vehicleId}-0`}
            currentDocumentUrl=""
            onUploadComplete={(url) => handleImageUpload(0, url)}
            isViewMode={isViewMode}
          />
        )}
        
        {vehicleImages.map((imageData, index) => (
          <div key={index} className="relative">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <DocumentUploader
                    documentType="vehicle-image"
                    documentId={`${vehicleId}-${index}`}
                    currentDocumentUrl={imageData.url}
                    onUploadComplete={(url) => handleImageUpload(index, url)}
                    isViewMode={isViewMode}
                    customContent={
                      imageData.url && showTimingSelector ? (
                        <Select
                          value={imageData.timing}
                          onValueChange={(value) => onImageTimingUpdate(index, value as 'Avant' | 'Pendant' | 'Après')}
                          disabled={isViewMode}
                        >
                          <SelectTrigger className="w-24 sm:w-28 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Avant">Avant</SelectItem>
                            <SelectItem value="Pendant">Pendant</SelectItem>
                            <SelectItem value="Après">Après</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : null
                    }
                  />
                </div>
                {!isViewMode && vehicleImages.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onImageRemove(index)}
                    className="text-red-500 hover:text-red-600 px-2 sm:px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleVehicleImages;
