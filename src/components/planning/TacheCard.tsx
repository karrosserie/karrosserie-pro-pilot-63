import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, Play, Camera, AlertTriangle } from 'lucide-react';
import { PlanningTache } from '@/hooks/usePlanningManager';
import { useToast } from '@/hooks/use-toast';
import { uploadTaskPhoto } from '@/utils/taskPhotoService';
import { ProblemReportModal } from './ProblemReportModal';

interface TacheCardProps {
  tache: PlanningTache;
  onTerminer: (tacheId: string) => void;
  onVoirVehicule: (vehiculeId: number) => void;
  getStatusVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
  getStatusLabel: (status: string) => string;
  isTerminee?: boolean;
  onCommencer?: (tacheId: string) => void;
  employeeId: string;
  companyId: string;
}

export const TacheCard: React.FC<TacheCardProps> = ({
  tache,
  onTerminer,
  onVoirVehicule,
  getStatusVariant,
  getStatusLabel,
  isTerminee = false,
  onCommencer,
  employeeId,
  companyId
}) => {
  const [estCommencee, setEstCommencee] = useState(false);
  const [prisePhotosEnCours, setPrisePhotosEnCours] = useState(false);
  const [photosTerminees, setPhotosTerminees] = useState(false);
  const [prisePhotosFinEnCours, setPrisePhotosFinEnCours] = useState(false);
  const [photosDebutPrises, setPhotosDebutPrises] = useState(0);
  const [photosFinPrises, setPhotosFinPrises] = useState(0);
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Fonction pour déterminer si une tâche nécessite des photos
  const requiresPhotos = (taskType: string): boolean => {
    const noPhotoTasks = [
      'Accueil & Préparation du dossier',
      'Préparation peinture', 
      'Clôture & livraison',
      'Clôture du dossier et livraison'
    ];
    return !noPhotoTasks.includes(taskType);
  };
  
  // Fonction pour déterminer si la tâche est urgente (dans les 30 prochaines minutes)
  const isUrgent = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    try {
      const debut = tache.heure.split('-')[0];
      const parts = debut.trim().split('h');
      const heureDebut = parseInt(parts[0], 10);
      const minutesDebut = parts[1] ? parseInt(parts[1], 10) : 0;
      const tacheTime = heureDebut * 60 + minutesDebut;
      
      return tacheTime - currentTime <= 30 && tacheTime - currentTime >= 0;
    } catch {
      return false;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Caméra arrière par défaut
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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
  };

  const takePhoto = async (photoType: 'start' | 'end') => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              console.log('🔍 TacheCard - Taking photo:', {
                taskId: tache.id,
                employeeId,
                companyId,
                vehicleId: tache.vehicle_id,
                photoType,
                taskType: tache.tache
              });
              
              if (!tache.vehicle_id) {
                console.error('❌ TacheCard - vehicle_id is missing!', tache);
                toast({
                  title: "Erreur",
                  description: "ID du véhicule manquant",
                  variant: "destructive",
                });
                return;
              }

              const result = await uploadTaskPhoto(
                tache.id,
                employeeId,
                companyId,
                tache.vehicle_id, // CORRECTION: Utiliser vehicle_id (UUID) au lieu de vehiculeId (number)
                photoType,
                blob
              );
              
              if (result.success) {
                // Incrémenter le compteur de photos
                if (photoType === 'start') {
                  setPhotosDebutPrises(prev => prev + 1);
                } else {
                  setPhotosFinPrises(prev => prev + 1);
                }
                
                toast({
                  title: "Photo sauvegardée",
                  description: `Photo ${photoType === 'start' ? 'de début' : 'de fin'} sauvegardée avec succès`,
                });
                
                console.log('✅ TakePhoto success:', result);
              } else {
                toast({
                  title: "Erreur",
                  description: result.error || "Erreur lors de la sauvegarde",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error('Erreur upload photo:', error);
              toast({
                title: "Erreur",
                description: "Erreur lors de l'upload de la photo",
                variant: "destructive",
              });
            }
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleCommencer = async () => {
    console.log('DEBUG TacheCard - handleCommencer called for task:', tache.id);
    const needsPhoto = requiresPhotos(tache.tache);
    
    if (needsPhoto) {
      setEstCommencee(true); // Marquer immédiatement comme commencée pour cacher le bouton
      setPrisePhotosEnCours(true);
      await startCamera();
      toast({
        title: "Prise de photos",
        description: "Prenez des photos du véhicule avant de commencer",
      });
    } else {
      // Pas de photo nécessaire, démarrer directement
      setEstCommencee(true);
      setPhotosTerminees(true);
      if (onCommencer) {
        onCommencer(tache.id);
      }
      toast({
        title: "Tâche commencée",
        description: "La tâche a été démarrée avec succès",
      });
    }
  };

  const terminerPhotos = () => {
    if (photosDebutPrises === 0) {
      toast({
        title: "Photos obligatoires",
        description: "Vous devez prendre au moins une photo avant de commencer la tâche",
        variant: "destructive",
      });
      return;
    }
    
    stopCamera();
    setPrisePhotosEnCours(false);
    setPhotosTerminees(true);
    setEstCommencee(true);
    if (onCommencer) {
      onCommencer(tache.id);
    }
    toast({
      title: "Photos terminées",
      description: `${photosDebutPrises} photo(s) sauvegardée(s). Vous pouvez maintenant commencer la tâche`,
    });
  };

  const handleTerminer = async () => {
    const needsPhoto = requiresPhotos(tache.tache);
    
    if (needsPhoto) {
      setPrisePhotosFinEnCours(true);
      await startCamera();
      toast({
        title: "Prise de photos",
        description: "Prenez des photos du travail terminé",
      });
    } else {
      // Pas de photo nécessaire, terminer directement
      onTerminer(tache.id);
      toast({
        title: "Tâche terminée",
        description: "La tâche a été terminée avec succès",
      });
    }
  };

  const terminerPhotosFinales = () => {
    if (photosFinPrises === 0) {
      toast({
        title: "Photos obligatoires",
        description: "Vous devez prendre au moins une photo du travail terminé pour valider la tâche",
        variant: "destructive",
      });
      return;
    }
    
    stopCamera();
    setPrisePhotosFinEnCours(false);
    onTerminer(tache.id);
    toast({
      title: "Tâche terminée",
      description: `${photosFinPrises} photo(s) sauvegardée(s), tâche validée avec succès`,
    });
  };

  const urgent = isUrgent();

  if (isTerminee) {
    return (
      <Card className="border-l-4 border-l-success opacity-75 bg-success/5">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-success" />
                <span className="font-mono text-sm text-success font-medium">{tache.heure}</span>
                <h4 className="font-medium">{tache.tache}</h4>
                <Badge variant="outline" className="bg-success/10 text-success">
                  ✓ Terminé
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-6">
                <span>{tache.vehicule} - {tache.marque} {tache.modele}</span>
                <span>{tache.client}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVoirVehicule(tache.vehiculeId)}
            >
              Voir détails
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={`border-l-4 ${urgent ? 'border-l-destructive bg-destructive/5 animate-pulse' : 'border-l-warning'} transition-all duration-200`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="flex-1">
              {/* En-tête avec heure mise en évidence */}
              <div className="flex items-center gap-2 mb-3">
                <Clock className={`w-4 h-4 ${urgent ? 'text-destructive' : 'text-warning'}`} />
                <span className={`font-mono text-lg font-bold ${urgent ? 'text-destructive' : 'text-warning'}`}>
                  {tache.heure}
                </span>
                {urgent && (
                  <Badge variant="destructive" className="animate-bounce">
                    URGENT
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm sm:text-base">{tache.tache}</h4>
                <div className="flex gap-2">
                  <Badge variant={getStatusVariant(tache.status)} className="self-start text-xs">
                    {getStatusLabel(tache.status)}
                  </Badge>
                  {requiresPhotos(tache.tache) && (
                    <Badge variant="outline" className="self-start text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Camera className="w-3 h-3 mr-1" />
                      Photos requises
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Véhicule :</span>
                  <span 
                    className="font-medium cursor-pointer text-primary hover:underline break-all"
                    onClick={() => onVoirVehicule(tache.vehiculeId)}
                  >
                    {tache.vehicule}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marque :</span>
                  <span className="text-right">{tache.marque}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modèle :</span>
                  <span className="text-right">{tache.modele}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client :</span>
                  <span className="text-right">{tache.client}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="text-muted-foreground">
                  Durée estimée: {tache.duree}h
                </span>
              </div>
            </div>
            <div className="self-end sm:self-start sm:ml-4 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setShowProblemReportModal(true)}
                size="sm"
                variant="destructive"
                className="transition-all hover:scale-105 w-full sm:w-auto"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Signaler problème
              </Button>
              
              {!estCommencee ? (
                <Button
                  onClick={handleCommencer}
                  size="sm"
                  className="transition-all hover:scale-105 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Commencer
                </Button>
               ) : (
                <Button
                  onClick={handleTerminer}
                  size="sm"
                  className={`transition-all hover:scale-105 w-full sm:w-auto ${urgent ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Terminer
                </Button>
                )}
            </div>
          </div>

          {/* Interface de prise de photos */}
          {prisePhotosEnCours && (
            <div className="mt-4 p-4 border-t border-border bg-blue-50/50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Prise de photos - Début de tâche</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Prenez des photos du véhicule avant de commencer la tâche
                </p>
                {photosDebutPrises > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {photosDebutPrises} photo(s) prise(s)
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="w-full max-w-sm rounded-lg border"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => takePhoto('start')}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Prendre photo ({photosDebutPrises})
                  </Button>
                  
                  <Button
                    onClick={terminerPhotos}
                    size="sm"
                    variant={photosDebutPrises > 0 ? "default" : "outline"}
                    disabled={photosDebutPrises === 0}
                  >
                    {photosDebutPrises > 0 ? '✓ Terminer photos' : 'Au moins 1 photo requise'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Interface de prise de photos de fin */}
          {prisePhotosFinEnCours && (
            <div className="mt-4 p-4 border-t border-border bg-green-50/50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">Photos du travail terminé</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Prenez des photos du travail effectué pour valider la tâche
                </p>
                {photosFinPrises > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {photosFinPrises} photo(s) prise(s)
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="w-full max-w-sm rounded-lg border"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => takePhoto('end')}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Prendre photo ({photosFinPrises})
                  </Button>
                  
                  <Button
                    onClick={terminerPhotosFinales}
                    size="sm"
                    variant={photosFinPrises > 0 ? "default" : "outline"}
                    disabled={photosFinPrises === 0}
                  >
                    {photosFinPrises > 0 ? '✅ Valider la tâche' : 'Au moins 1 photo requise'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de signalement de problème */}
      <ProblemReportModal
        isOpen={showProblemReportModal}
        onClose={() => setShowProblemReportModal(false)}
        taskType={tache.tache}
        vehicleInfo={{
          vehicule: tache.vehicule,
          marque: tache.marque,
          modele: tache.modele,
          client: tache.client
        }}
      />
    </>
  );
};