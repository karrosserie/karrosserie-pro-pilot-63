import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, CheckCircle, Calendar, User, BarChart, Coffee, LogOut } from 'lucide-react';
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

interface EmployeeViewProps {
  employeeId?: string;
}

export const EmployeeView = ({ employeeId }: EmployeeViewProps) => {
  const { user } = useAuth();
  const { companyInfo } = useCompany();
  const [currentTimer, setCurrentTimer] = useState<string | null>(null);
  const [showPointageModal, setShowPointageModal] = useState(false);

  // Utiliser l'ID de l'utilisateur connecté ou celui passé en prop
  const currentUserId = employeeId || user?.id;
  
  // Récupérer les vraies données depuis Supabase
  const { schedules, isLoading, refetch } = useEmployeeSchedule(currentUserId);

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

  const handleStartTask = async (taskId: string) => {
    try {
      // Mettre à jour le statut de la tâche dans Supabase
      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En cours',
          real_start_datetime: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Erreur lors du démarrage de la tâche:', error);
        return;
      }

      console.log('Tâche démarrée avec succès:', taskId);
      setCurrentTimer(taskId);
      // Rafraîchir les données pour voir les changements
      refetch();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleStartBreak = async () => {
    if (!currentUserId) return;
    
    try {
      // Récupérer la feuille de temps d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const { data: timesheet, error: timesheetError } = await supabase
        .from('employee_timesheets')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('date', today)
        .single();

      if (timesheetError || !timesheet) {
        console.error('Erreur récupération timesheet:', timesheetError);
        return;
      }

      // Créer une nouvelle pause
      const { error } = await supabase
        .from('employee_breaks')
        .insert({
          timesheet_id: timesheet.id,
          break_start_time: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur lors du démarrage de la pause:', error);
        return;
      }

      console.log('Pause démarrée avec succès');
      // Vous pourriez vouloir rafraîchir les données ou afficher une notification
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleClockOut = async () => {
    if (!currentUserId) return;
    
    try {
      // Récupérer la feuille de temps d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('employee_timesheets')
        .update({
          clock_out_time: new Date().toISOString()
        })
        .eq('user_id', currentUserId)
        .eq('date', today);

      if (error) {
        console.error('Erreur lors du dépointage:', error);
        return;
      }

      console.log('Dépointage effectué avec succès');
      // Vous pourriez vouloir rafraîchir les données ou rediriger l'utilisateur
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      // Mettre à jour le statut de la tâche dans Supabase
      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'Terminé',
          real_end_datetime: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Erreur lors de la finalisation de la tâche:', error);
        return;
      }

      console.log('Tâche terminée avec succès:', taskId);
      setCurrentTimer(null);
      // Rafraîchir les données pour voir les changements
      refetch();
    } catch (error) {
      console.error('Erreur:', error);
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

  return (
    <div className="space-y-6">
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
            <DropdownMenuItem onClick={handleStartBreak}>
              <Coffee className="w-4 h-4 mr-2" />
              Partir en pause
            </DropdownMenuItem>
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
                  >
                    <CheckCircle className="w-4 h-4" />
                    Terminer
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
                <div className="ml-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStartTask(task.id)}
                    className="flex items-center gap-1"
                  >
                    <Play className="w-4 h-4" />
                    Commencer
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
    </div>
  );
};