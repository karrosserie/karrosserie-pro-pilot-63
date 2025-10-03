import { User, Clock, Euro, Camera, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadVehiclePhoto } from "@/utils/vehiclePhotoService";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/hooks/use-company";
import { VehiclePhotosViewer } from "@/components/vehicle/VehiclePhotosViewer";
import { takeTaskPhoto } from "@/utils/cameraUtils";

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    client: string;
    price: string;
    duration: string;
    description: string;
    technician?: string;
    status: 'En cours' | 'À planifier' | 'Terminé';
  };
  onPlan?: (vehicleId: string) => void;
}

export const VehicleCard = ({ vehicle, onPlan }: VehicleCardProps) => {
  const [showPhotosViewer, setShowPhotosViewer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { companyInfo } = useCompany();

  const handleCameraClick = async () => {
    if (!user?.id || !companyInfo?.id) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder aux informations utilisateur",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await takeTaskPhoto(
        vehicle.id, // taskId (using vehicle.id as a temporary task ID)
        user.id, // employeeId
        companyInfo.id, // companyId
        vehicle.id, // vehicleId
        'start'
      );
      
      if (result.success && result.photoUrl) {
        // Convertir l'URL en blob pour utiliser notre service existant
        const response = await fetch(result.photoUrl);
        const blob = await response.blob();
        
        const uploadResult = await uploadVehiclePhoto(
          vehicle.id,
          user.id,
          companyInfo.id,
          blob,
          `Photo atelier - ${vehicle.brand} ${vehicle.model} ${vehicle.licensePlate}`
        );
        
        if (uploadResult.success) {
          toast({
            title: "Photo sauvegardée",
            description: "La photo a été ajoutée au véhicule avec succès",
          });
        } else {
          toast({
            title: "Erreur",
            description: uploadResult.error || "Erreur lors de la sauvegarde",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la prise de photo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur prise photo:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la prise de photo",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-1">{vehicle.brand} {vehicle.model}</h4>
            <p className="text-xs sm:text-sm text-slate-600">{vehicle.licensePlate}</p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vehicle.description}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="font-semibold text-base sm:text-lg text-slate-900">{vehicle.price}</div>
            <div className="text-xs text-slate-500">{vehicle.duration}</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="text-xs text-slate-500 truncate">
            {vehicle.technician || 'À planifier'}
          </div>
          <div className="flex gap-1 self-end sm:self-auto">
            <Button
              onClick={() => setShowPhotosViewer(true)}
              size="sm"
              variant="ghost"
              className="p-2 h-8 w-8"
              title="Voir les photos"
            >
              <Image className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={handleCameraClick}
              size="sm"
              variant="outline"
              className="p-2 h-8 w-8"
              title="Prendre une photo"
              disabled={isProcessing}
            >
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Viewer des photos */}
      <VehiclePhotosViewer
        vehicleId={vehicle.id}
        vehicleName={`${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}`}
        open={showPhotosViewer}
        onOpenChange={setShowPhotosViewer}
      />
    </>
  );
};