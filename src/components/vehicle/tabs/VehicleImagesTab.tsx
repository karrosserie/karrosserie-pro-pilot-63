import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
      const vehiclePhotosResult = await getVehiclePhotos(vehicleId);
      setVehiclePhotos(vehiclePhotosResult);
      
      // Récupérer les photos de tâches liées au véhicule
      const taskPhotosResult = await getTaskPhotosByVehicle(vehicleId);
      setTaskPhotos(taskPhotosResult);
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
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

  const renderPhotoCard = (photo: VehiclePhoto | TaskPhoto, category: string) => {
    const isTaskPhoto = 'task_id' in photo;
    const isWorkshopPhoto = !isTaskPhoto && (photo as VehiclePhoto).photo_type === 'workshop';
    const photoDate = new Date(photo.created_at);
    const description = isTaskPhoto ? `Photo de tâche (${(photo as TaskPhoto).photo_type})` : (photo as VehiclePhoto).description;

    const getBadgeContent = () => {
      if (isTaskPhoto) {
        return (photo as TaskPhoto).photo_type === 'start' ? 'Début' : 'Fin';
      } else if (isWorkshopPhoto) {
        return 'Atelier';
      } else {
        return 'Véhicule';
      }
    };

    const getBadgeVariant = (): "default" | "destructive" | "outline" | "secondary" => {
      if (isTaskPhoto) {
        return (photo as TaskPhoto).photo_type === 'start' ? 'secondary' : 'destructive';
      } else if (isWorkshopPhoto) {
        return 'default';
      } else {
        return 'outline';
      }
    };
    
    return (
      <Card 
        key={photo.id} 
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => openPhotoDialog(photo)}
      >
        <div className="aspect-square relative">
          <img 
            src={photo.file_url} 
            alt={description || 'Photo du véhicule'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={getBadgeVariant()} className="text-xs">
              {getBadgeContent()}
            </Badge>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{format(photoDate, 'dd MMM yyyy HH:mm', { locale: fr })}</span>
          </div>
          {description && (
            <p className="text-sm mt-1 truncate" title={description}>
              {description}
            </p>
          )}
        </div>
      </Card>
    );
  };

  const renderPhotoSection = (title: string, photos: (VehiclePhoto | TaskPhoto)[], category: string) => {
    if (photos.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          <h3 className="text-lg font-medium">{title}</h3>
          <Badge variant="outline">{photos.length}</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => renderPhotoCard(photo, category))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Organiser les photos par catégorie
  const workshopPhotos = vehiclePhotos.filter(photo => photo.photo_type === 'workshop');
  const generalPhotos = vehiclePhotos.filter(photo => photo.photo_type !== 'workshop');
  const startPhotos = taskPhotos.filter(photo => photo.photo_type === 'start');
  const endPhotos = taskPhotos.filter(photo => photo.photo_type === 'end');

  const totalPhotos = vehiclePhotos.length + taskPhotos.length;

  if (totalPhotos === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Aucune image</h3>
          <p className="mt-2 text-muted-foreground">
            Aucune photo n'a été prise pour ce véhicule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-8">
        {renderPhotoSection('Photos d\'atelier', workshopPhotos, 'workshop')}
        {workshopPhotos.length > 0 && generalPhotos.length > 0 && <Separator />}
        
        {renderPhotoSection('Photos générales du véhicule', generalPhotos, 'vehicle')}
        
        {(startPhotos.length > 0 || endPhotos.length > 0) && (generalPhotos.length > 0 || workshopPhotos.length > 0) && <Separator />}
        
        {renderPhotoSection('Photos de début de tâche', startPhotos, 'task-start')}
        {startPhotos.length > 0 && endPhotos.length > 0 && <Separator />}
        
        {renderPhotoSection('Photos de fin de tâche', endPhotos, 'task-end')}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Détails de la photo</DialogTitle>
              <Button variant="ghost" size="sm" onClick={closePhotoDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={selectedPhoto.file_url}
                  alt={'description' in selectedPhoto ? selectedPhoto.description || 'Photo' : 'Photo'}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {format(new Date(selectedPhoto.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
                {'description' in selectedPhoto && selectedPhoto.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPhoto.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {'task_id' in selectedPhoto 
                      ? (selectedPhoto.photo_type === 'start' ? 'Début de tâche' : 'Fin de tâche')
                      : selectedPhoto.photo_type === 'workshop' ? 'Photo atelier' : 'Photo véhicule'
                    }
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};