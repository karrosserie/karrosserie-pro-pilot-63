import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, CheckCircle, Calendar, User, BarChart, Coffee, LogOut, Camera, AlertTriangle } from 'lucide-react';
import { useEmployeeSchedule } from '@/hooks/use-employee-schedule';
import { useCompany } from '@/hooks/use-company';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { EmployePointageModal } from '@/components/EmployePointageModal';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clockIn, startBreak, endBreak } from '@/utils/pointageSupabaseUtils';
import { takeTaskPhoto } from '@/utils/cameraUtils';
import { useToast } from '@/hooks/use-toast';

interface EmployeeViewProps {
  employeeId?: string;
}

export const EmployeeView = ({ employeeId }: EmployeeViewProps) => {
  const { user } = useAuth();
  const { companyInfo } = useCompany();
  const { toast } = useToast();
  const [currentTimer, setCurrentTimer] = useState<string | null>(null);
  const [showPointageModal, setShowPointageModal] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [waitingReason, setWaitingReason] = useState<string>('');

  // Utiliser l'ID de l'utilisateur connecté ou celui passé en prop
  const currentUserId = employeeId || user?.id;
  
  // Récupérer les vraies données depuis Supabase
  const { schedules, isLoading, refetch } = useEmployeeSchedule(currentUserId);

  // Vérifier si l'employé est en pause
  const checkBreakStatus = async () => {
    if (!currentUserId) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: timesheets } = await supabase
        .from('employee_timesheets')
        .select('id, clock_out_time')
        .eq('user_id', currentUserId)
        .eq('date', today)
        .order('created_at', { ascending: false })
        .limit(1);

      const lastTimesheet = timesheets && timesheets.length > 0 ? timesheets[0] : null;
      
      if (lastTimesheet) {
        // Vérifier si l'employé a déjà dépointé (dernier timesheet fermé)
        if (lastTimesheet.clock_out_time) {
          setIsClockedOut(true);
          return;
        }

        // Timesheet actif, vérifier si en pause
        setIsClockedOut(false);
        const { data: activeBreaks } = await supabase
          .from('employee_breaks')
          .select('id')
          .eq('timesheet_id', lastTimesheet.id)
          .is('break_end_time', null)
          .limit(1);

        setIsOnBreak(activeBreaks && activeBreaks.length > 0);
      } else {
        // Aucun timesheet aujourd'hui
        setIsClockedOut(false);
        setIsOnBreak(false);
      }
    } catch (error) {
      console.error('Erreur vérification pause:', error);
    }
  };

  // Vérifier le statut de pause au chargement
  useEffect(() => {
    if (currentUserId) {
      checkBreakStatus();
    }
  }, [currentUserId]);

  // Convertir les données Supabase au format attendu par l'interface
  const tasks = schedules.map(schedule => {
    // Validation des dates pour éviter les erreurs "Invalid time value"
    const startDate = schedule.start_datetime ? new Date(schedule.start_datetime) : null;
    const endDate = schedule.end_datetime ? new Date(schedule.end_datetime) : null;
    
    const isValidStartDate = startDate && !isNaN(startDate.getTime());
    const isValidEndDate = endDate && !isNaN(endDate.getTime());
    
    return {
      id: schedule.id,
      vehicleBrand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
      vehicleModel: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
      licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
      client: schedule.vehicles?.clients 
        ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` 
        : 'Client inconnu',
      taskType: schedule.task_type,
      startTime: isValidStartDate 
        ? startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : '--:--',
      endTime: isValidEndDate 
        ? endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : '--:--',
      status: schedule.status,
      description: `${schedule.task_type} - ${schedule.vehicles?.license_plate || ''}`
    };
  });

  const currentTask = tasks.find(task => task.status === 'En cours');
  const upcomingTasks = tasks.filter(task => task.status === 'En attente');
  const completedTasks = tasks.filter(task => task.status === 'Terminé');

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

  const handleStartTask = async (taskId: string) => {
    if (!currentUserId) return;
    
    setIsProcessingPhoto(true);
    
    try {
      const task = tasks.find(t => t.id === taskId);
      const needsPhoto = task ? requiresPhotos(task.taskType) : true;
      
      let photoUrl = null;
      
      if (needsPhoto) {
        // Prendre une photo avant de commencer la tâche
        toast({
          title: "Photo requise",
          description: "Veuillez prendre une photo pour commencer la tâche",
        });
        
        const photoResult = await takeTaskPhoto(currentUserId, taskId, 'start');
        
        if (!photoResult.success) {
          toast({
            title: "Erreur",
            description: photoResult.error || "Impossible de prendre la photo",
            variant: "destructive",
          });
          return;
        }
        
        photoUrl = photoResult.photoUrl;
      }

      // Mettre à jour le statut de la tâche dans Supabase avec ou sans photo
      const updateData: any = { 
        status: 'En cours',
        real_start_datetime: new Date().toISOString()
      };
      
      if (photoUrl) {
        updateData.start_photo_url = photoUrl;
      }

      const { error } = await supabase
        .from('employee_schedule')
        .update(updateData)
        .eq('id', taskId);

      if (error) {
        console.error('Erreur lors du démarrage de la tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la tâche",
          variant: "destructive",
        });
        return;
      }

      console.log('Tâche démarrée avec succès:', taskId);
      setCurrentTimer(taskId);
      toast({
        title: "Tâche démarrée",
        description: "La tâche a été démarrée avec succès",
      });
      // Rafraîchir les données pour voir les changements
      refetch();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleStartBreak = async () => {
    if (!currentUserId) return;
    
    try {
      const result = await startBreak(currentUserId);
      
      if (result.success) {
        setIsOnBreak(true);
        toast({
          title: "☕ Pause démarrée",
          description: result.message,
        });
      } else {
        toast({
          title: "❌ Pause refusée",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error starting break:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du démarrage de la pause",
        variant: "destructive",
      });
    }
  };

  const handleEndBreak = async () => {
    if (!currentUserId) return;
    
    try {
      const result = await endBreak(currentUserId);
      
      if (result.success) {
        setIsOnBreak(false);
        toast({
          title: "✅ Reprise du travail",
          description: result.message,
        });
      } else {
        toast({
          title: "❌ Reprise refusée",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error ending break:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la reprise du travail",
        variant: "destructive",
      });
    }
  };

  const handleClockOut = async () => {
    if (!currentUserId) return;
    
    try {
      // Dépointer le timesheet actif uniquement
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('employee_timesheets')
        .update({
          clock_out_time: new Date().toISOString()
        })
        .eq('user_id', currentUserId)
        .eq('date', today)
        .is('clock_out_time', null);

      if (error) {
        console.error('Erreur lors du dépointage:', error);
        return;
      }

      console.log('Dépointage effectué avec succès');
      setIsClockedOut(true);
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleClockIn = async () => {
    if (!currentUserId) return;
    
    try {
      // Utiliser la fonction clockIn de pointageSupabaseUtils
      const result = await clockIn(currentUserId);
      
      if (result.success) {
        console.log('Pointage effectué avec succès');
        setIsClockedOut(false);
        setShowPointageModal(false);
        // Rafraîchir les données
        checkBreakStatus();
      } else {
        console.error('Erreur lors du pointage:', result.message);
      }
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!currentUserId) return;
    
    setIsProcessingPhoto(true);
    
    try {
      const task = tasks.find(t => t.id === taskId);
      const needsPhoto = task ? requiresPhotos(task.taskType) : true;
      
      let photoUrl = null;
      
      if (needsPhoto) {
        // Prendre une photo avant de terminer la tâche
        toast({
          title: "Photo requise",
          description: "Veuillez prendre une photo pour terminer la tâche",
        });
        
        const photoResult = await takeTaskPhoto(currentUserId, taskId, 'end');
        
        if (!photoResult.success) {
          toast({
            title: "Erreur",
            description: photoResult.error || "Impossible de prendre la photo",
            variant: "destructive",
          });
          return;
        }
        
        photoUrl = photoResult.photoUrl;
      }

      // Mettre à jour le statut de la tâche dans Supabase avec ou sans photo
      const updateData: any = { 
        status: 'Terminé',
        real_end_datetime: new Date().toISOString()
      };
      
      if (photoUrl) {
        updateData.end_photo_url = photoUrl;
      }

      const { error } = await supabase
        .from('employee_schedule')
        .update(updateData)
        .eq('id', taskId);

      if (error) {
        console.error('Erreur lors de la finalisation de la tâche:', error);
        toast({
          title: "Erreur",
          description: "Impossible de terminer la tâche",
          variant: "destructive",
        });
        return;
      }

      console.log('Tâche terminée avec succès:', taskId);
      setCurrentTimer(null);
      toast({
        title: "Tâche terminée",
        description: "La tâche a été terminée avec succès",
      });
      // Rafraîchir les données pour voir les changements
      refetch();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handlePutOnHold = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowWaitingModal(true);
  };

  const handleConfirmWaiting = async () => {
    if (!selectedTaskId || !waitingReason) return;
    
    try {
      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En attente',
          waiting_reason: waitingReason 
        })
        .eq('id', selectedTaskId);

      if (error) {
        console.error('Erreur lors de la mise en attente:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre la tâche en attente",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Tâche mise en attente",
        description: `Tâche mise en attente : ${waitingReason}`,
      });

      // Réinitialiser les états et rafraîchir
      setShowWaitingModal(false);
      setSelectedTaskId(null);
      setWaitingReason('');
      refetch();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: 'En attente' | 'En cours' | 'Terminé') => {
    switch (status) {
      case 'En cours':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'En attente':
        return <Badge variant="outline">En attente</Badge>;
      case 'Terminé':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    }
  };

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Chargement du planning...</p>
        </div>
      </div>
    );
  }

  // Afficher l'interface de dépointage si l'employé a terminé sa journée
  if (isClockedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <LogOut className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Journée terminée</h2>
            <p className="text-muted-foreground mb-6">
              Vous avez dépointé avec succès. Pour reprendre le travail, vous devez repointer.
            </p>
            <Button 
              onClick={handleClockIn}
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Repointer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badge "En pause" fixe en haut */}
      {isOnBreak && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="font-bold text-lg">En pause</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Mon Planning</h1>
            <p className="text-muted-foreground">Vue employé - {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <BarChart className="w-4 h-4" />
              Gestion des pointages
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOnBreak ? (
              <DropdownMenuItem onClick={handleEndBreak}>
                <Coffee className="w-4 h-4 mr-2" />
                Revenir de pause
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={handleStartBreak}>
                <Coffee className="w-4 h-4 mr-2" />
                Partir en pause
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleClockOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Dépointer (fin de journée)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowPointageModal(true)}>
              <BarChart className="w-4 h-4 mr-2" />
              Voir mes statistiques
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tâche en cours */}
      {currentTask ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Play className="w-5 h-5" />
              Tâche en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">{currentTask.vehicleBrand} {currentTask.vehicleModel}</h3>
                <p className="text-sm text-muted-foreground">{currentTask.licensePlate} • {currentTask.client}</p>
                <p className="text-sm font-medium">{currentTask.taskType}</p>
                <p className="text-sm">{currentTask.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {currentTask.startTime} - {currentTask.endTime}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleCompleteTask(currentTask.id)}
                    className="flex items-center gap-1"
                    disabled={isProcessingPhoto}
                  >
                    {isProcessingPhoto ? (
                      <>
                        <Camera className="w-4 h-4 animate-pulse" />
                        Photo...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Terminer
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handlePutOnHold(currentTask.id)}
                    className="flex items-center gap-1"
                    disabled={isOnBreak || isProcessingPhoto}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Mettre en attente
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Aucune tâche en cours</h3>
            <p className="text-muted-foreground text-sm">Commencez votre prochaine tâche</p>
          </CardContent>
        </Card>
      )}

      {/* Prochaines tâches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Prochaines tâches ({upcomingTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Aucune tâche planifiée
            </div>
          ) : (
            upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{task.vehicleBrand} {task.vehicleModel}</h4>
                    {getStatusBadge(task.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {task.licensePlate} • {task.client}
                  </p>
                  <p className="text-sm font-medium">{task.taskType}</p>
                  <p className="text-sm">{task.description}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    {task.startTime} - {task.endTime}
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStartTask(task.id)}
                    className="flex items-center gap-1"
                    disabled={isOnBreak || isProcessingPhoto}
                  >
                    {isProcessingPhoto ? (
                      <>
                        <Camera className="w-4 h-4 animate-pulse" />
                        Photo...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        {isOnBreak ? 'En pause' : 'Commencer'}
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handlePutOnHold(task.id)}
                    className="flex items-center gap-1"
                    disabled={isOnBreak || isProcessingPhoto}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Mettre en attente
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Tâches terminées */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Tâches terminées ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-semibold">{task.vehicleBrand} {task.vehicleModel}</h4>
                  <p className="text-sm text-muted-foreground">{task.taskType} • {task.client}</p>
                </div>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Modal de gestion des pointages */}
      <EmployePointageModal
        isOpen={showPointageModal}
        onClose={() => setShowPointageModal(false)}
        employe={{
          id: currentUserId || '',
          nom: user?.email?.split('@')[0] || 'Employé'
        }}
      />

      {/* Modal de mise en attente */}
      <Dialog open={showWaitingModal} onOpenChange={setShowWaitingModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Mettre la tâche en attente
            </DialogTitle>
            <DialogDescription>
              Sélectionnez la raison pour laquelle cette tâche doit être mise en attente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Raison de l'attente</label>
              <Select value={waitingReason} onValueChange={setWaitingReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une raison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manque de piece">Manque de pièce</SelectItem>
                  <SelectItem value="probleme client">Problème client</SelectItem>
                  <SelectItem value="probleme assurance">Problème assurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowWaitingModal(false);
                setWaitingReason('');
                setSelectedTaskId(null);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmWaiting}
              disabled={!waitingReason}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Valider la mise en attente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};