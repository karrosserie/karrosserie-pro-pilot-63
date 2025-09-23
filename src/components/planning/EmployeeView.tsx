import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, CheckCircle, Calendar, User, BarChart, Coffee, LogOut, Camera, AlertTriangle } from 'lucide-react';
import { CurrentTaskDisplay } from '@/components/planning/CurrentTaskDisplay';
import { useEmployeeSchedule } from '@/hooks/use-employee-schedule';
import { useCompany } from '@/hooks/use-company';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { EmployePointageModal } from '@/components/EmployePointageModal';
import { ProblemReportModal } from '@/components/planning/ProblemReportModal';
import { triggerTaskStartedWebhook } from '@/services/webhooks/taskWebhook';
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
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const [selectedTaskForReport, setSelectedTaskForReport] = useState<any>(null);
  const [taskInstructions, setTaskInstructions] = useState<any>(null);

  // Utiliser l'ID de l'utilisateur connecté ou celui passé en prop
  const currentUserId = employeeId || user?.id;
  
  // Récupérer les vraies données depuis Supabase (realtime temporairement désactivé)
  const { schedules, isLoading, refetch } = useEmployeeSchedule(currentUserId);

  // Fonction pour récupérer les instructions détaillées pour une tâche
  const fetchTaskInstructions = async (taskId: string) => {
    if (!taskId) return;
    
    try {
      const { data, error } = await supabase
        .from('employee_schedule')
        .select('detailed_instructions')
        .eq('id', taskId)
        .single();
        
      if (error) throw error;
      
      if (data?.detailed_instructions) {
        setTaskInstructions(data.detailed_instructions);
      } else {
        setTaskInstructions(null);
      }
    } catch (error) {
      console.error('Erreur lors du fetch des instructions:', error);
      setTaskInstructions(null);
    }
  };

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
      vehicleId: schedule.vehicle_id,
      companyId: schedule.company_id,
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
      description: `${schedule.task_type} - ${schedule.vehicles?.license_plate || ''}`,
      paint_brand: schedule.paint_brand,
      color_code: schedule.color_code
    };
  });

  const currentTask = tasks.find(task => task.status === 'En cours');
  const upcomingTasks = tasks.filter(task => task.status === 'En attente');
  const completedTasks = tasks.filter(task => task.status === 'Terminé');
  
  // Récupérer les instructions quand currentTask change
  useEffect(() => {
    if (currentTask?.id) {
      fetchTaskInstructions(currentTask.id);
    } else {
      setTaskInstructions(null);
    }
  }, [currentTask?.id]);

  // Écouter les mises à jour en temps réel des instructions IA depuis N8N
  // Note: Cette fonctionnalité est maintenant gérée par useEmployeeScheduleRealtime
  // useEffect(() => {
  //   ... ancien code realtime retiré car intégré dans le hook
  // }, [currentTask?.id]);

  // Écouter les mises à jour en temps réel des instructions IA depuis N8N
  useEffect(() => {
    if (!currentTask?.id) return;

    const channel = supabase
      .channel('task-instructions-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'employee_schedule',
          filter: `id=eq.${currentTask.id}`
        },
        (payload) => {
          console.log('📡 Mise à jour des instructions reçue:', payload);
          // Mettre à jour les instructions si elles ont changé
          if (payload.new?.detailed_instructions && 
              payload.new.detailed_instructions !== payload.old?.detailed_instructions) {
            setTaskInstructions(payload.new.detailed_instructions);
            toast({
              title: "Instructions IA mises à jour",
              description: "Les instructions détaillées ont été reçues de N8N",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTask?.id]);
  
  // Prochaine tâche = première tâche en attente (affichage d'une seule tâche à la fois)
  const nextTask = upcomingTasks.length > 0 ? upcomingTasks[0] : null;

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
        
        const photoResult = await takeTaskPhoto(
          taskId, 
          currentUserId!, 
          companyInfo?.id!, 
          task?.vehicleId || '', 
          'start'
        );
        
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

      // Mettre à jour le statut de la tâche dans Supabase (plus de photo URL ici, elles sont dans task_photos)
      const updateData = { 
        status: 'En cours' as const,
        real_start_datetime: new Date().toISOString()
      };

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

      // Déclencher le webhook N8N pour la tâche démarrée
      triggerTaskStartedWebhook({ taskId });

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
        
        const photoResult = await takeTaskPhoto(
          taskId, 
          currentUserId!, 
          companyInfo?.id!, 
          task?.vehicleId || '', 
          'end'
        );
        
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

      // Mettre à jour le statut de la tâche dans Supabase (plus de photo URL ici, elles sont dans task_photos)
      const updateData = { 
        status: 'Terminé' as const,
        real_end_datetime: new Date().toISOString()
      };

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
      
      // Déclencher l'auto-assignation de la tâche suivante
      try {
        console.log('🔄 Déclenchement de l\'auto-assignation pour la tâche suivante...');
        const { data: autoAssignResult, error: autoAssignError } = await supabase.functions.invoke('auto-assign-next-task', {
          body: { 
            taskId: taskId,
            companyId: companyInfo?.id
          }
        });

        if (autoAssignError) {
          console.error('⚠️ Erreur lors de l\'auto-assignation:', autoAssignError);
        } else if (autoAssignResult?.success) {
          console.log('✅ Auto-assignation réussie:', autoAssignResult);
          if (autoAssignResult.nextTaskId) {
            toast({
              title: "Tâche suivante assignée",
              description: `${autoAssignResult.nextTaskType} a été automatiquement assignée`,
            });
          }
        }
      } catch (autoAssignError) {
        console.error('⚠️ Erreur lors de l\'appel à l\'auto-assignation:', autoAssignError);
      }

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

  // Afficher l'interface de dépointage si l'employé a terminé sa journée - Mobile responsive
  if (isClockedOut) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-6 sm:py-8 px-4 sm:px-6">
            <LogOut className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Journée terminée</h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Vous avez dépointé avec succès. Pour reprendre le travail, vous devez repointer.
            </p>
            <Button 
              onClick={handleClockIn}
              className="w-full flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Repointer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full">
      {/* Badge "En pause" fixe en haut - Mobile responsive */}
      {isOnBreak && (
        <div className="fixed top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
            <span className="font-bold text-sm sm:text-lg">En pause</span>
          </div>
        </div>
      )}
      
      {/* Header - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Mon Planning</h1>
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">
              Vue employé - {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto justify-center sm:justify-start"
            >
              <BarChart className="w-4 h-4" />
              <span className="hidden xs:inline">Gestion des pointages</span>
              <span className="xs:hidden">Pointages</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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

      {/* Tâche en cours - Nouveau design */}
      {currentTask ? (
        <CurrentTaskDisplay
          task={currentTask}
          onCompleteTask={handleCompleteTask}
          onPauseTask={handlePutOnHold}
          onReportProblem={() => {
            setSelectedTaskForReport(currentTask);
            setShowProblemReportModal(true);
          }}
          onTakePhoto={async (taskId: string) => {
            setIsProcessingPhoto(true);
            try {
              await takeTaskPhoto(taskId, currentUserId!, companyInfo?.id!, currentTask.vehicleId || '', 'end');
              toast({
                title: "Photo prise avec succès",
                description: "La photo a été enregistrée avec la tâche",
              });
            } catch (error) {
              console.error('Erreur lors de la prise de photo:', error);
              toast({
                title: "Erreur",
                description: "Impossible de prendre la photo",
                variant: "destructive",
              });
            } finally {
              setIsProcessingPhoto(false);
            }
          }}
          isProcessingPhoto={isProcessingPhoto}
          isOnBreak={isOnBreak}
          instructions={taskInstructions}
        />
      ) : (
        <Card>
          <CardContent className="text-center py-6 sm:py-8 p-4 sm:p-6">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Aucune tâche en cours</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">Commencez votre prochaine tâche</p>
          </CardContent>
        </Card>
      )}

      {/* Prochaines tâches - Affichage d'une seule tâche à la fois */}
      {nextTask ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-orange-800 text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Prochaine tâche
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-sm sm:text-base">{nextTask.vehicleBrand} {nextTask.vehicleModel}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                  {nextTask.licensePlate} • {nextTask.client}
                </p>
                <p className="text-xs sm:text-sm font-medium text-orange-700">{nextTask.taskType}</p>
                <p className="text-xs sm:text-sm line-clamp-2">{nextTask.description}</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{nextTask.startTime} - {nextTask.endTime}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-2 justify-start sm:justify-end lg:justify-start">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedTaskForReport(nextTask);
                    setShowProblemReportModal(true);
                  }}
                  className="flex items-center gap-2 w-full sm:w-auto"
                  disabled={isOnBreak || isProcessingPhoto}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Signaler problème</span>
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={() => handleStartTask(nextTask.id)}
                  className="flex items-center gap-2 w-full sm:w-auto"
                  disabled={isOnBreak || isProcessingPhoto}
                >
                  {isProcessingPhoto ? (
                    <>
                      <Camera className="w-4 h-4 animate-pulse" />
                      <span className="text-xs sm:text-sm">Photo...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {isOnBreak ? 'En pause' : 'Commencer'}
                      </span>
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handlePutOnHold(nextTask.id)}
                  className="flex items-center gap-2 w-full sm:w-auto"
                  disabled={isOnBreak || isProcessingPhoto}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Mettre en attente</span>
                </Button>
              </div>
            </div>
            
            {/* Indicateur des tâches restantes */}
            {upcomingTasks.length > 1 && (
              <div className="mt-4 p-3 bg-white/60 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-sm text-orange-700">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {upcomingTasks.length - 1} autres tâches planifiées aujourd'hui
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Les tâches suivantes apparaîtront automatiquement après avoir terminé celle-ci
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : !currentTask ? (
        <Card>
          <CardContent className="text-center py-6 sm:py-8 p-4 sm:p-6">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Toutes les tâches terminées !</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Excellente journée de travail. Vous avez terminé toutes vos tâches.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Tâches terminées - Mobile responsive */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              Tâches terminées ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base line-clamp-1">
                    {task.vehicleBrand} {task.vehicleModel}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    {task.taskType} • {task.client}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(task.status)}
                </div>
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

      {/* Modal de mise en attente - Mobile responsive */}
      <Dialog open={showWaitingModal} onOpenChange={setShowWaitingModal}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              Mettre la tâche en attente
            </DialogTitle>
            <DialogDescription className="text-sm">
              Sélectionnez la raison pour laquelle cette tâche doit être mise en attente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Raison de l'attente</label>
              <Select value={waitingReason} onValueChange={setWaitingReason}>
                <SelectTrigger className="w-full">
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowWaitingModal(false);
                setWaitingReason('');
                setSelectedTaskId(null);
              }}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmWaiting}
              disabled={!waitingReason}
              className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto order-1 sm:order-2"
            >
              Valider la mise en attente
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de signalement de problème */}
      <ProblemReportModal
        isOpen={showProblemReportModal}
        onClose={() => {
          setShowProblemReportModal(false);
          setSelectedTaskForReport(null);
        }}
        taskType={selectedTaskForReport?.taskType || ''}
        taskId={selectedTaskForReport?.id}
        vehicleInfo={{
          vehicule: selectedTaskForReport?.vehicles?.license_plate || '',
          marque: selectedTaskForReport?.vehicles?.car_brands?.name || '',
          modele: selectedTaskForReport?.vehicles?.car_models?.name || '',
          client: `${selectedTaskForReport?.vehicles?.clients?.first_name || ''} ${selectedTaskForReport?.vehicles?.clients?.last_name || ''}`.trim()
        }}
      />
    </div>
  );
};