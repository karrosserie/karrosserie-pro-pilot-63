
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { Plus, X } from 'lucide-react';

interface MultipleVehicleImagesProps {
  vehicleId: string;
  vehicleImages: string[];
  isViewMode: boolean;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
}

const MultipleVehicleImages: React.FC<MultipleVehicleImagesProps> = ({
  vehicleId,
  vehicleImages,
  isViewMode,
  onImageAdd,
  onImageRemove
}) => {
  const addNewImageSlot = () => {
    // Ajouter un slot vide pour une nouvelle image
    onImageAdd('');
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
          <DocumentUploader
            documentType="vehicle-image"
            documentId={`${vehicleId}-0`}
            currentDocumentUrl=""
            onUploadComplete={onImageAdd}
            isViewMode={isViewMode}
          />
        )}
        
        {vehicleImages.map((imageUrl, index) => (
          <div key={index} className="relative">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <DocumentUploader
                  documentType="vehicle-image"
                  documentId={`${vehicleId}-${index}`}
                  currentDocumentUrl={imageUrl}
                  onUploadComplete={(url) => {
                    // Mettre à jour l'image à l'index spécifique
                    const updatedImages = [...vehicleImages];
                    updatedImages[index] = url;
                    // Ici on devrait appeler une fonction pour mettre à jour toutes les images
                    // Pour l'instant on utilise onImageAdd qui sera adapté dans le parent
                    onImageAdd(url);
                  }}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleVehicleImages;
