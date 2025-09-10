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

interface EmployeePlanningTabProps {
  employees?: any[];
  schedules?: any[];
  vehicles?: any[];
}

export const EmployeePlanningTab = ({ 
  employees = [], 
  schedules = [], 
  vehicles = [] 
}: EmployeePlanningTabProps) => {
  // Helper functions
  const findVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return {
      brand: vehicle?.car_brands?.name || 'Marque inconnue',
      model: vehicle?.car_models?.name || 'Modèle inconnu',
      licensePlate: vehicle?.license_plate || 'Plaque inconnue'
    };
  };

  const getEmployeeStatus = (employee: any): EmployeeSchedule['status'] => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Vérifier si l'employé a une tâche en cours aujourd'hui
    const currentTask = schedules.find(schedule => 
      schedule.user_id === employee.user_id &&
      schedule.status === 'En cours' &&
      new Date(schedule.start_datetime).toISOString().split('T')[0] === today
    );
    
    if (currentTask) {
      return 'Occupé';
    }
    
    // Vérifier s'il a des tâches planifiées aujourd'hui
    const hasTodayTasks = schedules.some(schedule => 
      schedule.user_id === employee.user_id &&
      new Date(schedule.start_datetime).toISOString().split('T')[0] === today
    );
    
    return hasTodayTasks ? 'Disponible' : 'Disponible';
  };

  const getCurrentTask = (employee: any) => {
    const now = new Date();
    const currentTask = schedules.find(schedule => 
      schedule.user_id === employee.user_id &&
      schedule.status === 'En cours' &&
      new Date(schedule.start_datetime) <= now &&
      new Date(schedule.end_datetime) >= now
    );

    if (currentTask) {
      const vehicleInfo = findVehicleInfo(currentTask.vehicle_id);
      return {
        vehicleBrand: vehicleInfo.brand,
        vehicleModel: vehicleInfo.model,
        licensePlate: vehicleInfo.licensePlate,
        taskType: currentTask.task_type,
        endTime: new Date(currentTask.end_datetime).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    }
    return undefined;
  };

  const getTodayTasks = (employee: any) => {
    const today = new Date().toISOString().split('T')[0];
    const todaySchedules = schedules.filter(schedule => 
      schedule.user_id === employee.user_id &&
      new Date(schedule.start_datetime).toISOString().split('T')[0] === today
    );

    const completed = todaySchedules.filter(s => s.status === 'Terminé').length;
    const total = todaySchedules.length;
    const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, efficiency };
  };

  const getUpcomingTasks = (employee: any) => {
    const now = new Date();
    return schedules
      .filter(schedule => 
        schedule.user_id === employee.user_id &&
        schedule.status === 'En attente' &&
        new Date(schedule.start_datetime) > now
      )
      .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
      .slice(0, 3) // Limite à 3 tâches à venir
      .map(schedule => {
        const vehicleInfo = findVehicleInfo(schedule.vehicle_id);
        const startTime = new Date(schedule.start_datetime);
        const endTime = new Date(schedule.end_datetime);
        const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 100)) / 100;
        
        return {
          id: schedule.id,
          vehicleBrand: vehicleInfo.brand,
          vehicleModel: vehicleInfo.model,
          taskType: schedule.task_type,
          startTime: startTime.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          duration: `${duration}h`
        };
      });
  };

  // Convertir les employés de la base de données en format EmployeeSchedule
  const employeeSchedules: EmployeeSchedule[] = employees.map(employee => ({
    id: employee.user_id,
    name: employee.nom || 'Employé',
    role: employee.role || 'Technicien',
    status: getEmployeeStatus(employee),
    currentTask: getCurrentTask(employee),
    todayTasks: getTodayTasks(employee),
    upcomingTasks: getUpcomingTasks(employee)
  }));

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
    totalEmployees: employeeSchedules.length,
    available: employeeSchedules.filter(e => e.status === 'Disponible').length,
    busy: employeeSchedules.filter(e => e.status === 'Occupé').length,
    averageEfficiency: employeeSchedules.length > 0 ? Math.round(
      employeeSchedules.reduce((acc, emp) => acc + emp.todayTasks.efficiency, 0) / 
      employeeSchedules.length
    ) : 0
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
        {employeeSchedules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun employé trouvé</h3>
              <p className="text-muted-foreground">Ajoutez des employés pour voir leur planning</p>
            </CardContent>
          </Card>
        ) : (
          employeeSchedules.map((employee) => (
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
        )))}
      </div>
    </div>
  );
};