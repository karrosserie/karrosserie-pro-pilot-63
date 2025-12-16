import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, ImagePlus } from 'lucide-react';
import SimpleCaptureMode from '@/components/shared/document-scanner/SimpleCaptureMode';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

interface AtelierPhotoCaptureProps {
  photos: CapturedPhoto[];
  onPhotosChange: (photos: CapturedPhoto[]) => void;
  minPhotos?: number;
  maxPhotos?: number;
  title?: string;
}

export const AtelierPhotoCapture = ({
  photos,
  onPhotosChange,
  minPhotos = 2,
  maxPhotos = 10,
  title = "Photos du véhicule"
}: AtelierPhotoCaptureProps) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (blob: Blob) => {
    const preview = URL.createObjectURL(blob);
    onPhotosChange([...photos, { blob, preview }]);
    setShowCamera(false);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  const isMinReached = photos.length >= minPhotos;
  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {title} *
        </span>
        <span className={`text-xs ${isMinReached ? 'text-green-600' : 'text-muted-foreground'}`}>
          {photos.length}/{minPhotos} minimum
        </span>
      </div>

      {/* Grille de photos */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
            <img
              src={photo.preview}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Bouton ajouter photo */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-muted/50 transition-colors"
          >
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Ajouter</span>
          </button>
        )}
      </div>

      {/* Message si pas assez de photos */}
      {!isMinReached && (
        <p className="text-xs text-amber-600">
          Veuillez prendre au moins {minPhotos} photos du véhicule
        </p>
      )}

      {/* Modal caméra */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black">
          <SimpleCaptureMode
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        </div>
      )}
    </div>
  );
};
