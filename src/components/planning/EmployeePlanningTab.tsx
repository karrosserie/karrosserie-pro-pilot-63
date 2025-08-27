import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

interface EmployeeSchedule {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'Disponible' | 'Occupé' | 'Pause' | 'Absent';
  currentTask?: {
    vehicleBrand: string;
    vehicleModel: string;
    licensePlate: string;
    taskType: string;
    endTime: string;
  };
  todayTasks: {
    completed: number;
    total: number;
    efficiency: number;
  };
  upcomingTasks: Array<{
    id: string;
    vehicleBrand: string;
    vehicleModel: string;
    taskType: string;
    startTime: string;
    duration: string;
  }>;
}

const mockEmployeeSchedules: EmployeeSchedule[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    role: 'Technicien Peinture',
    status: 'Occupé',
    currentTask: {
      vehicleBrand: 'Peugeot',
      vehicleModel: '308',
      licensePlate: 'AB-789-XY',
      taskType: 'Préparation peinture',
      endTime: '10:30'
    },
    todayTasks: {
      completed: 2,
      total: 4,
      efficiency: 85
    },
    upcomingTasks: [
      {
        id: '1',
        vehicleBrand: 'Renault',
        vehicleModel: 'Clio',
        taskType: 'Mise en peinture',
        startTime: '11:00',
        duration: '4h'
      },
      {
        id: '2',
        vehicleBrand: 'Audi',
        vehicleModel: 'A4',
        taskType: 'Débosselage portière',
        startTime: '15:30',
        duration: '2h'
      }
    ]
  },
  {
    id: '2',
    name: 'Martin Dubois',
    role: 'Technicien Carrosserie',
    status: 'Disponible',
    todayTasks: {
      completed: 3,
      total: 3,
      efficiency: 92
    },
    upcomingTasks: [
      {
        id: '3',
        vehicleBrand: 'Volkswagen',
        vehicleModel: 'Golf',
        taskType: 'Finitions & remontage',
        startTime: '14:00',
        duration: '1h30'
      },
      {
        id: '4',
        vehicleBrand: 'Ford',
        vehicleModel: 'Focus',
        taskType: 'Contrôle qualité',
        startTime: '16:00',
        duration: '30min'
      }
    ]
  },
  {
    id: '3',
    name: 'Julie Blanc',
    role: 'Technicien Junior',
    status: 'Pause',
    todayTasks: {
      completed: 1,
      total: 3,
      efficiency: 78
    },
    upcomingTasks: [
      {
        id: '5',
        vehicleBrand: 'BMW',
        vehicleModel: 'Série 1',
        taskType: 'Remplacement pare-chocs',
        startTime: '13:30',
        duration: '3h'
      }
    ]
  },
  {
    id: '4',
    name: 'Pierre Moreau',
    role: 'Chef d\'équipe',
    status: 'Absent',
    todayTasks: {
      completed: 0,
      total: 0,
      efficiency: 0
    },
    upcomingTasks: []
  }
];

export const EmployeePlanningTab = () => {
  const getStatusBadge = (status: EmployeeSchedule['status']) => {
    switch (status) {
      case 'Disponible':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'Occupé':
        return <Badge className="bg-blue-100 text-blue-800">Occupé</Badge>;
      case 'Pause':
        return <Badge className="bg-orange-100 text-orange-800">Pause</Badge>;
      case 'Absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-blue-600';
    if (efficiency >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const stats = {
    totalEmployees: mockEmployeeSchedules.length,
    available: mockEmployeeSchedules.filter(e => e.status === 'Disponible').length,
    busy: mockEmployeeSchedules.filter(e => e.status === 'Occupé').length,
    averageEfficiency: Math.round(
      mockEmployeeSchedules.reduce((acc, emp) => acc + emp.todayTasks.efficiency, 0) / 
      mockEmployeeSchedules.length
    )
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Planning Employés</h2>
        <p className="text-muted-foreground">Suivi en temps réel de l'activité des techniciens</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalEmployees}</div>
            <div className="text-sm text-muted-foreground">Employés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-muted-foreground">Disponibles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.busy}</div>
            <div className="text-sm text-muted-foreground">Occupés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getEfficiencyColor(stats.averageEfficiency)}`}>
              {stats.averageEfficiency}%
            </div>
            <div className="text-sm text-muted-foreground">Efficacité moy.</div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Cards */}
      <div className="grid gap-6">
        {mockEmployeeSchedules.map((employee) => (
          <Card key={employee.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Task */}
              {employee.currentTask ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Tâche en cours</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">
                        {employee.currentTask.vehicleBrand} {employee.currentTask.vehicleModel}
                      </span>
                      <div className="text-muted-foreground">{employee.currentTask.licensePlate}</div>
                    </div>
                    <div>
                      <div>{employee.currentTask.taskType}</div>
                      <div className="text-muted-foreground">Fin prévue: {employee.currentTask.endTime}</div>
                    </div>
                  </div>
                </div>
              ) : employee.status === 'Disponible' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <span className="text-sm text-green-800">Disponible pour nouvelle tâche</span>
                </div>
              ) : employee.status === 'Absent' ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <span className="text-sm text-red-800">Absent aujourd'hui</span>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <span className="text-sm text-orange-800">En pause</span>
                </div>
              )}

              {/* Today's Progress */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{employee.todayTasks.completed}/{employee.todayTasks.total}</div>
                  <div className="text-sm text-muted-foreground">Tâches</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${getEfficiencyColor(employee.todayTasks.efficiency)}`}>
                    {employee.todayTasks.efficiency}%
                  </div>
                  <div className="text-sm text-muted-foreground">Efficacité</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{employee.upcomingTasks.length}</div>
                  <div className="text-sm text-muted-foreground">À venir</div>
                </div>
              </div>

              {/* Upcoming Tasks */}
              {employee.upcomingTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Prochaines tâches
                  </h4>
                  {employee.upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <div>
                        <span className="font-medium">{task.vehicleBrand} {task.vehicleModel}</span>
                        <div className="text-muted-foreground">{task.taskType}</div>
                      </div>
                      <div className="text-right text-muted-foreground">
                        <div>{task.startTime}</div>
                        <div>({task.duration})</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};