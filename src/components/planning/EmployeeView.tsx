import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, CheckCircle, Calendar, User } from 'lucide-react';
import { useEmployeeSchedule } from '@/hooks/use-employee-schedule';
import { useCompany } from '@/hooks/use-company';

interface EmployeeViewProps {
  employeeId?: string;
}

interface Task {
  id: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  client: string;
  taskType: string;
  startTime: string;
  endTime: string;
  status: 'En attente' | 'En cours' | 'Terminé';
  description: string;
}

// Mock data pour l'employé courant
const mockEmployeeTasks: Task[] = [
  {
    id: '1',
    vehicleBrand: 'Peugeot',
    vehicleModel: '308',
    licensePlate: 'AB-789-XY',
    client: 'Mme Moreau',
    taskType: 'Préparation peinture',
    startTime: '08:00',
    endTime: '10:30',
    status: 'En cours',
    description: 'Ponçage aile avant'
  },
  {
    id: '2',
    vehicleBrand: 'Renault',
    vehicleModel: 'Clio',
    licensePlate: 'CD-123-ZW',
    client: 'M. Petit',
    taskType: 'Mise en peinture',
    startTime: '11:00',
    endTime: '15:00',
    status: 'En attente',
    description: 'Application base'
  },
  {
    id: '3',
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Golf',
    licensePlate: 'EF-456-UV',
    client: 'Mme Blanc',
    taskType: 'Finitions & remontage',
    startTime: '15:30',
    endTime: '17:00',
    status: 'En attente',
    description: 'Polissage final'
  }
];

export const EmployeeView = ({ employeeId }: EmployeeViewProps) => {
  const { companyInfo } = useCompany();
  const [currentTimer, setCurrentTimer] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockEmployeeTasks);

  const currentTask = tasks.find(task => task.status === 'En cours');
  const upcomingTasks = tasks.filter(task => task.status === 'En attente');
  const completedTasks = tasks.filter(task => task.status === 'Terminé');

  const handleStartTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'En cours' as const }
        : { ...task, status: task.status === 'En cours' ? 'En attente' as const : task.status }
    ));
    setCurrentTimer(taskId);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'Terminé' as const }
        : task
    ));
    setCurrentTimer(null);
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'En cours':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'En attente':
        return <Badge variant="outline">En attente</Badge>;
      case 'Terminé':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Mon Planning</h1>
          <p className="text-muted-foreground">Vue employé - {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
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
    </div>
  );
};