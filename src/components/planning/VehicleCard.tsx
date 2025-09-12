import { User, Clock, Euro, Camera, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadVehiclePhoto } from "@/utils/vehiclePhotoService";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/hooks/use-company";
import { VehiclePhotosViewer } from "@/components/vehicle/VehiclePhotosViewer";
import { Camera as CapacitorCamera, CameraResultType } from "@capacitor/camera";

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
    if (!user?.id || !companyInfo?.id) return;

    setIsProcessing(true);
    
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      if (image.dataUrl) {
        // Convertir dataUrl en blob
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        
        const result = await uploadVehiclePhoto(
          vehicle.id,
          user.id,
          companyInfo.id,
          blob,
          `Photo atelier - ${vehicle.brand} ${vehicle.model} ${vehicle.licensePlate}`
        );
        
        if (result.success) {
          toast({
            title: "Photo sauvegardée",
            description: "La photo a été ajoutée au véhicule avec succès",
          });
        } else {
          toast({
            title: "Erreur",
            description: result.error || "Erreur lors de la sauvegarde",
            variant: "destructive",
          });
        }
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
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-base text-slate-900">{vehicle.brand} {vehicle.model}</h4>
            <p className="text-sm text-slate-600">{vehicle.licensePlate}</p>
            <p className="text-xs text-slate-500 mt-1">{vehicle.description}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg text-slate-900">{vehicle.price}</div>
            <div className="text-xs text-slate-500">{vehicle.duration}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {vehicle.technician || 'À planifier'}
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => setShowPhotosViewer(true)}
              size="sm"
              variant="ghost"
              className="p-2"
              title="Voir les photos"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleCameraClick}
              size="sm"
              variant="outline"
              className="p-2"
              title="Prendre une photo"
            >
              <Camera className="h-4 w-4" />
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