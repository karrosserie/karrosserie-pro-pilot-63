import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getVehiclePhotos, deleteVehiclePhoto, VehiclePhoto } from '@/utils/vehiclePhotoService';
import { Camera, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface VehiclePhotosViewerProps {
  vehicleId: string;
  vehicleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VehiclePhotosViewer: React.FC<VehiclePhotosViewerProps> = ({
  vehicleId,
  vehicleName,
  open,
  onOpenChange
}) => {
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  const loadPhotos = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      const vehiclePhotos = await getVehiclePhotos(vehicleId);
      setPhotos(vehiclePhotos);
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const success = await deleteVehiclePhoto(photoId);
      if (success) {
        setPhotos(photos.filter(p => p.id !== photoId));
        toast({
          title: "Photo supprimée",
          description: "La photo a été supprimée avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la photo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur suppression photo:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (open) {
      loadPhotos();
    }
  }, [open, vehicleId]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Photos du véhicule - {vehicleName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement des photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune photo disponible pour ce véhicule</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="relative overflow-hidden rounded-lg border">
                      <img
                        src={photo.file_url}
                        alt={photo.description || 'Photo véhicule'}
                        className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedPhoto(photo.file_url)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <Badge variant="secondary" className="text-xs">
                        {photo.photo_type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(photo.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </p>
                      {photo.description && (
                        <p className="text-xs text-muted-foreground truncate" title={photo.description}>
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher la photo en grand */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Photo en grand</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="flex justify-center">
              <img
                src={selectedPhoto}
                alt="Photo véhicule"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};