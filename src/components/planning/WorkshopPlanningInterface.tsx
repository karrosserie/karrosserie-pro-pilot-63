import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, User, AlertTriangle, Wrench, Clock, Users, Cog, BarChart } from "lucide-react";
import { WorkshopStats } from "./WorkshopStats";
import { WorkflowStep } from "./WorkflowStep";
import { EmployeeView } from "./EmployeeView";
import { VehiclesWaitingTab } from "./VehiclesWaitingTab";
import { PlanningCalendar } from "./PlanningCalendar";
import { EmployeePlanningTab } from "./EmployeePlanningTab";
import { EmployeesManagement } from "./EmployeesManagement";
import { ProcessConfig } from "./ProcessConfig";
import { useUserRole } from "@/hooks/use-user-role";


interface WorkshopPlanningInterfaceProps {
  employees?: any[];
  vehicles?: any[];
  schedules?: any[];
  onScheduleUpdate?: (data: any) => void;
}

export const WorkshopPlanningInterface = ({ 
  employees = [], 
  vehicles = [], 
  schedules = [], 
  onScheduleUpdate 
}: WorkshopPlanningInterfaceProps) => {
  // Force cache refresh
  console.log('🔄 WorkshopPlanningInterface reloaded with real data');
  const { userRole, isCarrossier, isCarrossierCourtesy, isResponsable, isOwner, isLoading } = useUserRole();
  
  // Debug logs pour comprendre le problème de rôle
  console.log('🔍 WorkshopPlanningInterface - User Role Debug:', {
    userRole,
    isOwner,
    isCarrossier,
    isCarrossierCourtesy,
    isResponsable,
    isLoading
  });
  
  // Déterminer la vue par défaut selon le rôle
  const getDefaultView = () => {
    if (isOwner) return 'manager';
    if (isResponsable) return 'manager';
    if (isCarrossier || isCarrossierCourtesy) return 'employee';
    return 'manager'; // Par défaut pour manager
  };
  
  const [activeView, setActiveView] = useState<'manager' | 'employee'>(getDefaultView());
  const [urgentVehicles, setUrgentVehicles] = useState(false);

  // Mettre à jour la vue si le rôle change
  useEffect(() => {
    if (!isLoading) {
      const defaultView = getDefaultView();
      setActiveView(defaultView);
    }
  }, [isCarrossier, isCarrossierCourtesy, isResponsable, isLoading]);

  // Déterminer si l'utilisateur peut changer de vue
  const canSwitchView = isOwner;

  // Convert real data to workflow steps format
  const workflowSteps = [
    {
      id: 'accueil',
      title: 'Accueil & Préparation du dossier',
      vehicles: schedules.filter(s => s.task_type === 'Accueil & Préparation du dossier').map(schedule => ({
        id: schedule.id,
        brand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
        model: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
        licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
        client: schedule.vehicles?.clients ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` : 'Client inconnu',
        price: '0€', // TODO: Calculate real price
        duration: calculateDuration(schedule.start_datetime, schedule.end_datetime),
        description: schedule.task_type,
        technician: findEmployeeName(schedule.user_id, employees),
        status: mapScheduleStatus(schedule.status)
      }))
    },
    {
      id: 'remplacement',
      title: 'Remplacement ou débosselage',
      vehicles: schedules.filter(s => s.task_type === 'Remplacement ou débosselage').map(schedule => ({
        id: schedule.id,
        brand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
        model: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
        licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
        client: schedule.vehicles?.clients ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` : 'Client inconnu',
        price: '0€',
        duration: calculateDuration(schedule.start_datetime, schedule.end_datetime),
        description: schedule.task_type,
        technician: findEmployeeName(schedule.user_id, employees),
        status: mapScheduleStatus(schedule.status)
      }))
    },
    {
      id: 'preparation',
      title: 'Préparation peinture',
      vehicles: schedules.filter(s => s.task_type === 'Préparation peinture').map(schedule => ({
        id: schedule.id,
        brand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
        model: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
        licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
        client: schedule.vehicles?.clients ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` : 'Client inconnu',
        price: '0€',
        duration: calculateDuration(schedule.start_datetime, schedule.end_datetime),
        description: schedule.task_type,
        technician: findEmployeeName(schedule.user_id, employees),
        status: mapScheduleStatus(schedule.status)
      }))
    },
    {
      id: 'peinture',
      title: 'Mise en peinture',
      vehicles: schedules.filter(s => s.task_type === 'Mise en peinture').map(schedule => ({
        id: schedule.id,
        brand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
        model: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
        licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
        client: schedule.vehicles?.clients ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` : 'Client inconnu',
        price: '0€',
        duration: calculateDuration(schedule.start_datetime, schedule.end_datetime),
        description: schedule.task_type,
        technician: findEmployeeName(schedule.user_id, employees),
        status: mapScheduleStatus(schedule.status)
      }))
    },
    {
      id: 'finitions',
      title: 'Finitions & remontage',
      vehicles: schedules.filter(s => s.task_type === 'Finitions & remontage').map(schedule => ({
        id: schedule.id,
        brand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
        model: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
        licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
        client: schedule.vehicles?.clients ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` : 'Client inconnu',
        price: '0€',
        duration: calculateDuration(schedule.start_datetime, schedule.end_datetime),
        description: schedule.task_type,
        technician: findEmployeeName(schedule.user_id, employees),
        status: mapScheduleStatus(schedule.status)
      }))
    },
    {
      id: 'cloture',
      title: 'Clôture du dossier et livraison',
      vehicles: schedules.filter(s => s.task_type === 'Clôture du dossier et livraison').map(schedule => ({
        id: schedule.id,
        brand: schedule.vehicles?.car_brands?.name || 'Marque inconnue',
        model: schedule.vehicles?.car_models?.name || 'Modèle inconnu',
        licensePlate: schedule.vehicles?.license_plate || 'Plaque inconnue',
        client: schedule.vehicles?.clients ? `${schedule.vehicles.clients.first_name} ${schedule.vehicles.clients.last_name}` : 'Client inconnu',
        price: '0€',
        duration: calculateDuration(schedule.start_datetime, schedule.end_datetime),
        description: schedule.task_type,
        technician: findEmployeeName(schedule.user_id, employees),
        status: mapScheduleStatus(schedule.status)
      }))
    }
  ];

  // Helper functions
  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return '0h';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  const findEmployeeName = (userId: string, employees: any[]): string => {
    const employee = employees.find(emp => emp.user_id === userId);
    return employee ? employee.nom : 'Technicien non assigné';
  };

  const mapScheduleStatus = (status: string): 'En cours' | 'À planifier' | 'Terminé' => {
    switch (status) {
      case 'En cours': return 'En cours';
      case 'Terminé': return 'Terminé';
      default: return 'À planifier';
    }
  };

  const totalVehicles = workflowSteps.reduce((acc, step) => acc + step.vehicles.length, 0);
  const completedVehicles = workflowSteps.reduce((acc, step) => 
    acc + step.vehicles.filter(v => v.status === 'Terminé').length, 0
  );
  const waitingVehicles = workflowSteps.reduce((acc, step) => 
    acc + step.vehicles.filter(v => v.status === 'À planifier').length, 0
  );
  const totalRevenue = workflowSteps.reduce((acc, step) => 
    acc + step.vehicles.reduce((stepAcc, vehicle) => 
      stepAcc + parseFloat(vehicle.price.replace('€', '')), 0
    ), 0
  );

  const handlePlanVehicle = (vehicleId: string) => {
    console.log('Planning vehicle:', vehicleId);
    // TODO: Implement vehicle planning logic
    if (onScheduleUpdate) {
      onScheduleUpdate({ vehicleId, action: 'plan' });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with view switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Afficher les boutons de changement de vue uniquement pour les propriétaires */}
          {canSwitchView ? (
            <>
              <Button
                variant={activeView === 'manager' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('manager')}
                className="flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Vue Manager
              </Button>
              <Button
                variant={activeView === 'employee' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('employee')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Vue Employé
              </Button>
            </>
          ) : (
            /* Afficher la vue actuelle sans possibilité de changement */
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
              {activeView === 'manager' ? (
                <>
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Vue Manager</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Vue Employé</span>
                </>
              )}
              <Badge variant="secondary" className="ml-2 text-xs">
                {userRole}
              </Badge>
            </div>
          )}
        </div>
        
        <Button
          variant={urgentVehicles ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => setUrgentVehicles(!urgentVehicles)}
          className="flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Véhicule Urgence
        </Button>
      </div>

      {/* Navigation Tabs - Only show for manager view */}
      {activeView === 'manager' && (
        <Tabs defaultValue="workshop" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="workshop" className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Étapes atelier</span>
            <span className="sm:hidden">Étapes</span>
          </TabsTrigger>
          <TabsTrigger value="waiting" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Véhicules en Attente</span>
            <span className="sm:hidden">Attente</span>
          </TabsTrigger>
          <TabsTrigger value="planning" className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span className="hidden sm:inline">Planning</span>
            <span className="sm:hidden">Plan</span>
          </TabsTrigger>
          <TabsTrigger value="employee-planning" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Planning Employés</span>
            <span className="sm:hidden">P.Emp</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Employés</span>
            <span className="sm:hidden">Emp</span>
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-1">
            <Cog className="w-4 h-4" />
            <span className="hidden sm:inline">Process</span>
            <span className="sm:hidden">Proc</span>
          </TabsTrigger>
        </TabsList>

        {/* Workshop Steps Tab */}
        <TabsContent value="workshop" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Étapes atelier</h2>
            <p className="text-muted-foreground mb-4">Parcours complet avec synchronisation planning automatique</p>
            
            {/* Statistics */}
            <WorkshopStats
              totalVehicles={totalVehicles}
              completedVehicles={completedVehicles}
              waitingVehicles={waitingVehicles}
              totalRevenue={totalRevenue}
            />

            {/* Summary banner */}
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="text-sm text-muted-foreground">
                {waitingVehicles} véhicules en attente
              </div>
              <div className="text-sm text-muted-foreground">
                Pièces: 2 • Approbations: 1 • Techniciens: 1
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {workflowSteps.map((step) => (
                <WorkflowStep
                  key={step.id}
                  title={step.title}
                  vehicles={step.vehicles}
                  count={step.vehicles.length}
                  onPlanVehicle={handlePlanVehicle}
                />
              ))}
            </div>
          </div>
        </TabsContent>

            <TabsContent value="waiting" className="space-y-6">
              <VehiclesWaitingTab 
                vehicles={vehicles}
                schedules={schedules}
                employees={employees}
                onAddToWorkflow={handlePlanVehicle}
              />
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <PlanningCalendar />
            </TabsContent>

            <TabsContent value="employee-planning" className="space-y-6">
              <EmployeePlanningTab />
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <EmployeesManagement />
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              <ProcessConfig />
            </TabsContent>
        </Tabs>
      )}

      {/* Employee View */}
      {activeView === 'employee' && (
        <div className="mt-6">
          <EmployeeView />
        </div>
      )}
    </div>
  );
};
