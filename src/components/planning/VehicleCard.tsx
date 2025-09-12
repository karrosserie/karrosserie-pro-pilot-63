import { User, Clock, Euro, Camera, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadVehiclePhoto } from "@/utils/vehiclePhotoService";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/hooks/use-company";
import { VehiclePhotosViewer } from "@/components/vehicle/VehiclePhotosViewer";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from "@capacitor/camera";

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
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
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
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Erreur accès caméra (getUserMedia):', err);
      // Fallback Capacitor Camera en dernier recours
      try {
        const image = await CapacitorCamera.getPhoto({
          quality: 80,
          allowEditing: false,
          source: CameraSource.Camera,
          resultType: CameraResultType.DataUrl,
          presentationStyle: 'fullscreen'
        });
        if (image.dataUrl) {
          const response = await fetch(image.dataUrl);
          const blob = await response.blob();
          await saveBlob(blob);
        }
      } catch (e) {
        toast({
          title: "Caméra indisponible",
          description: "Impossible d'accéder à la caméra",
          variant: "destructive",
        });
        setShowCameraDialog(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const saveBlob = async (blob: Blob) => {
    if (!user?.id || !companyInfo?.id) return;
    setIsProcessing(true);
    try {
      const result = await uploadVehiclePhoto(
        vehicle.id,
        user.id,
        companyInfo.id,
        blob,
        `Photo atelier - ${vehicle.brand} ${vehicle.model} ${vehicle.licensePlate}`
      );
      if (result.success) {
        toast({ title: 'Photo sauvegardée', description: 'Ajoutée avec succès' });
        setShowCameraDialog(false);
        stopCamera();
      } else {
        toast({ title: 'Erreur', description: result.error || 'Sauvegarde impossible', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Erreur sauvegarde photo:', error);
      toast({ title: 'Erreur', description: 'Erreur lors de la sauvegarde', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) saveBlob(blob);
    }, 'image/jpeg', 0.85);
  };

  const handleCameraClick = () => {
    if (!user?.id || !companyInfo?.id) return;
    setShowCameraDialog(true);
    setTimeout(startCamera, 200);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setShowCameraDialog(false);
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
            <DialogDescription>
              Cadrez le véhicule et appuyez sur « Prendre la photo » pour l’enregistrer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
            </div>

            {isStreaming ? (
              <div className="flex flex-col items-center space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-sm rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button onClick={takePhoto} disabled={isProcessing}>
                    <Camera className="w-4 h-4 mr-1" />
                    {isProcessing ? 'Sauvegarde…' : 'Prendre la photo'}
                  </Button>
                  <Button onClick={handleCloseCamera} variant="outline" disabled={isProcessing}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Initialisation de la caméra…</p>
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