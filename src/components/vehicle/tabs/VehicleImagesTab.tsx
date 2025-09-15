import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getVehiclePhotos, VehiclePhoto } from '@/utils/vehiclePhotoService';
import { getTaskPhotosByVehicle, TaskPhoto } from '@/utils/taskPhotoService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VehicleImagesTabProps {
  vehicleId: string;
}

export const VehicleImagesTab: React.FC<VehicleImagesTabProps> = ({ vehicleId }) => {
  const [vehiclePhotos, setVehiclePhotos] = useState<VehiclePhoto[]>([]);
  const [taskPhotos, setTaskPhotos] = useState<TaskPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<VehiclePhoto | TaskPhoto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [vehicleId]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      console.log('🖼️ Loading photos for vehicle:', vehicleId);
      
      const vehiclePhotosResult = await getVehiclePhotos(vehicleId);
      setVehiclePhotos(vehiclePhotosResult);
      console.log('📸 Vehicle photos loaded:', vehiclePhotosResult.length);
      
      // Récupérer les photos de tâches liées au véhicule
      const taskPhotosResult = await getTaskPhotosByVehicle(vehicleId);
      setTaskPhotos(taskPhotosResult);
      console.log('🔧 Task photos loaded:', taskPhotosResult.length);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPhotoDialog = (photo: VehiclePhoto | TaskPhoto) => {
    setSelectedPhoto(photo);
    setIsDialogOpen(true);
  };

  const closePhotoDialog = () => {
    setSelectedPhoto(null);
    setIsDialogOpen(false);
  };

  const isTaskPhoto = (photo: VehiclePhoto | TaskPhoto): photo is TaskPhoto => {
    return 'photo_type' in photo && 'task_id' in photo;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalPhotos = vehiclePhotos.length + taskPhotos.length;

  if (totalPhotos === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune photo disponible</h3>
            <p className="text-muted-foreground">
              Aucune photo n'a encore été prise pour ce véhicule.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Photos du véhicule</h2>
        <Badge variant="secondary">
          {totalPhotos} photo{totalPhotos > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Photos des tâches d'atelier */}
      {taskPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos des étapes d'atelier ({taskPhotos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {taskPhotos.map((photo) => (
                <div key={photo.id} className="group relative">
                  <div 
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => openPhotoDialog(photo)}
                  >
                    <img
                      src={photo.file_url}
                      alt={`Photo ${photo.photo_type} - ${photo.file_name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Badge 
                      variant={photo.photo_type === 'start' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {photo.photo_type === 'start' ? 'Début' : 'Fin'} de tâche
                    </Badge>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(photo.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos générales du véhicule */}
      {vehiclePhotos.length > 0 && (
        <>
          {taskPhotos.length > 0 && <Separator />}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photos générales ({vehiclePhotos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vehiclePhotos.map((photo) => (
                  <div key={photo.id} className="group relative">
                    <div 
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => openPhotoDialog(photo)}
                    >
                      <img
                        src={photo.file_url}
                        alt={photo.description || `Photo véhicule - ${photo.file_name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {photo.description && (
                        <p className="text-xs font-medium truncate">{photo.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(photo.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Dialog pour afficher la photo en grand */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedPhoto && isTaskPhoto(selectedPhoto) 
                  ? `Photo ${selectedPhoto.photo_type === 'start' ? 'de début' : 'de fin'} de tâche`
                  : 'Photo du véhicule'
                }
              </span>
              <Button variant="ghost" size="sm" onClick={closePhotoDialog}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedPhoto.file_url}
                  alt={isTaskPhoto(selectedPhoto) 
                    ? `Photo ${selectedPhoto.photo_type} - ${selectedPhoto.file_name}`
                    : selectedPhoto.description || `Photo véhicule - ${selectedPhoto.file_name}`
                  }
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(selectedPhoto.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
                
                {isTaskPhoto(selectedPhoto) && (
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={selectedPhoto.photo_type === 'start' ? 'default' : 'secondary'}
                    >
                      {selectedPhoto.photo_type === 'start' ? 'Début de tâche' : 'Fin de tâche'}
                    </Badge>
                  </div>
                )}
                
                {!isTaskPhoto(selectedPhoto) && selectedPhoto.description && (
                  <p className="text-muted-foreground">{selectedPhoto.description}</p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Fichier: {selectedPhoto.file_name}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};