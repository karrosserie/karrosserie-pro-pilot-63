import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Car, CheckCircle, Pause, AlertTriangle, Camera } from 'lucide-react';

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
  };
  onCompleteTask: (taskId: string) => void;
  onPauseTask: (taskId: string) => void;
  onReportProblem: () => void;
  onTakePhoto: (taskId: string) => void;
  isProcessingPhoto?: boolean;
  isOnBreak?: boolean;
}

export const CurrentTaskDisplay = ({
  task,
  onCompleteTask,
  onPauseTask,
  onReportProblem,
  onTakePhoto,
  isProcessingPhoto = false,
  isOnBreak = false
}: CurrentTaskDisplayProps) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  // Chronomètre qui commence à 0
  useEffect(() => {
    const startTime = Date.now();
    
    const updateTimer = () => {
      const now = Date.now();
      const diff = now - startTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [task.id]);

  // Calculer la durée estimée (en minutes)
  const calculateEstimatedDuration = () => {
    const start = new Date(`1970-01-01T${task.startTime}:00`);
    const end = new Date(`1970-01-01T${task.endTime}:00`);
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60));
  };

  const estimatedDuration = calculateEstimatedDuration();

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