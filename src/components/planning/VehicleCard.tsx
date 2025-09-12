import { User, Clock, Euro, Camera, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadVehiclePhoto } from "@/utils/vehiclePhotoService";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/hooks/use-company";
import { VehiclePhotosViewer } from "@/components/vehicle/VehiclePhotosViewer";

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
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [showPhotosViewer, setShowPhotosViewer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { companyInfo } = useCompany();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const takePhoto = async () => {
    if (!videoRef.current || !user?.id || !companyInfo?.id) return;

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
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
              stopCamera();
              setShowCameraDialog(false);
            } else {
              toast({
                title: "Erreur",
                description: result.error || "Erreur lors de la sauvegarde",
                variant: "destructive",
              });
            }
          }
          setIsProcessing(false);
        }, 'image/jpeg', 0.8);
      }
    } catch (error) {
      console.error('Erreur prise photo:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la prise de photo",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleCameraClick = () => {
    setShowCameraDialog(true);
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setShowCameraDialog(false);
    setIsProcessing(false);
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

      {/* Dialog Caméra */}
      <Dialog open={showCameraDialog} onOpenChange={handleCloseCamera}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prendre une photo du véhicule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
            </div>
            
            {isRecording && (
              <div className="flex flex-col items-center space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-sm rounded-lg border"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={takePhoto}
                    disabled={isProcessing}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    {isProcessing ? 'Sauvegarde...' : 'Prendre la photo'}
                  </Button>
                  
                  <Button
                    onClick={handleCloseCamera}
                    variant="outline"
                    disabled={isProcessing}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
            
            {!isRecording && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Initialisation de la caméra...
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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