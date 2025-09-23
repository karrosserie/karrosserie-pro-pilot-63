import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Car, CheckCircle, Pause, AlertTriangle, Camera, Paintbrush } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TaskInstructions } from './TaskInstructions';

interface DetailedInstructions {
  instructions: { number: number; task: string }[];
  received_at: string;
  task_type_confirmed: string;
  source: string;
}

interface CurrentTaskDisplayProps {
  task: {
    id: string;
    vehicleBrand: string;
    vehicleModel: string;
    licensePlate: string;
    client: string;
    taskType: string;
    startTime: string;
    endTime: string;
    description: string;
    paint_brand?: string;
    color_code?: string;
    vehicleId: string;
    companyId: string;
  };
  onCompleteTask: (taskId: string) => void;
  onPauseTask: (taskId: string) => void;
  onReportProblem: () => void;
  onTakePhoto: (taskId: string) => void;
  isProcessingPhoto?: boolean;
  isOnBreak?: boolean;
  instructions?: DetailedInstructions | null;
}

export const CurrentTaskDisplay = ({
  task,
  onCompleteTask,
  onPauseTask,
  onReportProblem,
  onTakePhoto,
  isProcessingPhoto = false,
  isOnBreak = false,
  instructions
}: CurrentTaskDisplayProps) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [paintBrand, setPaintBrand] = useState(task.paint_brand || '');
  const [colorCode, setColorCode] = useState(task.color_code || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Chronomètre qui commence à 0
  useEffect(() => {
    // Initialiser le temps de départ une seule fois
    if (startTime === null) {
      setStartTime(Date.now());
    }
  }, [startTime]);

  useEffect(() => {
    if (startTime === null) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, now - startTime); // S'assurer que diff n'est jamais négatif
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Calculer la durée estimée (en minutes)
  const calculateEstimatedDuration = () => {
    const start = new Date(`1970-01-01T${task.startTime}:00`);
    const end = new Date(`1970-01-01T${task.endTime}:00`);
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60));
  };

  const estimatedDuration = calculateEstimatedDuration();

  const handleValidatePaintInfo = async () => {
    // Vérifier que les champs sont remplis
    if (!paintBrand.trim() || !colorCode.trim()) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir la marque de peinture et le code couleur.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // D'abord récupérer les informations du véhicule pour obtenir la marque et le modèle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          id,
          car_brands (name),
          car_models (name)
        `)
        .eq('id', task.vehicleId)
        .single();

      if (vehicleError) throw vehicleError;

      // Sauvegarder dans la table peinture_info
      const { error } = await supabase
        .from('peinture_info')
        .insert({
          company_id: task.companyId,
          task_id: task.id,
          vehicle_id: task.vehicleId,
          paint_brand: paintBrand.trim(),
          color_code: colorCode.trim(),
          vehicle_brand: vehicleData?.car_brands?.name || null,
          vehicle_model: vehicleData?.car_models?.name || null
        });

      if (error) throw error;

      toast({
        title: "Informations validées",
        description: "Les détails de peinture ont été sauvegardés avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les informations de peinture.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isPaintPreparationTask = task.taskType === 'Préparation peinture';

  return (
    <div className="space-y-0">
      {/* Header avec informations véhicule */}
      <Card className="rounded-b-none border-b-0 bg-background">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">{task.vehicleBrand} {task.vehicleModel}</h2>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {task.licensePlate} - {task.client}
          </p>
        </CardContent>
      </Card>

      {/* Section tâche en cours */}
      <Card className="rounded-t-none border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-primary text-xl font-semibold text-center">
            Tâche en cours
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 px-6 pb-6">
          {/* Nom de la tâche avec icône */}
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium">{task.taskType}</h3>
          </div>

          {/* Durée estimée */}
          <p className="text-muted-foreground">
            Durée estimée: {estimatedDuration} minutes
          </p>

          {/* Timer */}
          <Card className="bg-background border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Temps écoulé</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {elapsedTime}
              </div>
              <p className="text-sm text-muted-foreground">
                Commencé à {task.startTime}
              </p>
            </CardContent>
          </Card>

          {/* Champs spécifiques pour la préparation peinture */}
          {isPaintPreparationTask && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Paintbrush className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Détails de peinture</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="paint-brand" className="text-sm font-medium">
                      Marque de peinture
                    </Label>
                    <Input
                      id="paint-brand"
                      value={paintBrand}
                      onChange={(e) => setPaintBrand(e.target.value)}
                      placeholder="Ex: Sikkens, PPG, BASF..."
                      className="mt-1"
                      disabled={isUpdating}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="color-code" className="text-sm font-medium">
                      Code couleur
                    </Label>
                    <Input
                      id="color-code"
                      value={colorCode}
                      onChange={(e) => setColorCode(e.target.value)}
                      placeholder="Ex: L041, 147/A, etc."
                      className="mt-1"
                      disabled={isUpdating}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleValidatePaintInfo}
                    disabled={isUpdating || (!paintBrand && !colorCode)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    {isUpdating ? 'Validation...' : 'Valider les infos'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions détaillées de N8N */}
          {instructions && (
            <TaskInstructions 
              instructions={instructions}
              className="mb-4"
            />
          )}

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Button 
              onClick={() => onCompleteTask(task.id)}
              disabled={isProcessingPhoto || isOnBreak}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {isProcessingPhoto ? (
                <>
                  <Camera className="w-5 h-5 mr-2 animate-pulse" />
                  Photo en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Terminer la tâche
                </>
              )}
            </Button>

            <Button 
              onClick={() => onPauseTask(task.id)}
              disabled={isProcessingPhoto || isOnBreak}
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              size="lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>

            <Button 
              onClick={onReportProblem}
              disabled={isProcessingPhoto}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              size="lg"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Signaler un problème
            </Button>

            <Button 
              onClick={() => onTakePhoto(task.id)}
              disabled={isProcessingPhoto || isOnBreak}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Prendre une photo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};