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
import { ProcessConfig } from "./ProcessConfig";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { isWithinInterval, isSameWeek, startOfWeek, addDays, parseISO, isValid } from 'date-fns';


interface WorkshopPlanningInterfaceProps {
  employees?: any[];
  vehicles?: any[];
  waitingVehicles?: any[];
  schedules?: any[];
  planningTaches?: any[];
  companyId?: string | null;
  onScheduleUpdate?: (data: any) => void;
  onOpenUrgenceModal?: () => void;
}

export const WorkshopPlanningInterface = ({ 
  employees = [], 
  vehicles = [], 
  waitingVehicles: waitingVehiclesProps = [],
  schedules = [], 
  planningTaches = [],
  companyId,
  onScheduleUpdate,
  onOpenUrgenceModal
}: WorkshopPlanningInterfaceProps) => {
  // Force cache refresh
  console.log('🔄 WorkshopPlanningInterface reloaded with real data');
  console.log('🔍 WorkshopPlanningInterface - Schedules received:', schedules);
  console.log('🔍 WorkshopPlanningInterface - Schedules structure:', schedules.map(s => ({
    id: s.id,
    task_type: s.task_type,
    tache: s.tache,
    etape: s.etape,
    vehicule: s.vehicule,
    technicien: s.technicien
  })));
  const { userRole, isCarrossier, isCarrossierCourtesy, isResponsable, isOwner, isLoading } = useUserRole();
  const navigate = useNavigate();
  
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
  const [currentWeekData, setCurrentWeekData] = useState<any[]>([]);

  // Gérer le changement de semaine dans le calendrier
  const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
    console.log('📅 Changement de semaine:', { weekStart, weekEnd });
    // Filtrer les données selon la semaine si nécessaire
    // Pour l'instant, on utilise toutes les données planningTaches
    setCurrentWeekData(planningTaches);
  };

  // Initialiser les données de la semaine courante
  useEffect(() => {
    setCurrentWeekData(planningTaches);
  }, [planningTaches]);

  // Déterminer si l'utilisateur peut changer de vue
  const canSwitchView = isOwner;

  // Helper functions - MUST be defined before workflowSteps
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

  const mapTaskStatus = (status: string): 'En cours' | 'À planifier' | 'Terminé' => {
    switch (status) {
      case 'en_cours': 
      case 'En cours': 
        return 'En cours';
      case 'termine': 
      case 'Terminé': 
        return 'Terminé';
      case 'En attente':
        return 'À planifier';
      case 'planifie':
      case 'À planifier':
      default: 
        return 'À planifier';
    }
  };

  // Normaliser le type d'étape à partir des différentes sources (task_type, etape, tache)
  const getScheduleType = (s: any): string => {
    const raw = typeof s.task_type === 'string' ? s.task_type : (s.etape || s.tache || '');
    return String(raw).trim();
  };

  // Convert real data to workflow steps format from database
  const workflowSteps = [
    {
      id: 'accueil',
      title: 'Accueil & Préparation du dossier',
      color: 'bg-blue-600',
      vehicles: schedules.filter(s => getScheduleType(s) === 'Accueil & Préparation du dossier').map(s => ({
        id: s.id,
        brand: s.modele?.split(' ')[0] || 'Marque',
        model: s.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        licensePlate: s.vehicule || 'N/A',
        client: s.client || 'Client',
        price: '0€',
        duration: s.heure || '0h',
        description: s.tache || 'Tâche',
        technician: s.technicien || 'Non assigné',
        status: mapTaskStatus(s.status)
      }))
    },
    {
      id: 'remplacement',
      title: 'Remplacement ou débosselage',
      color: 'bg-orange-500',
      vehicles: schedules.filter(s => getScheduleType(s) === 'Remplacement ou débosselage').map(s => ({
        id: s.id,
        brand: s.modele?.split(' ')[0] || 'Marque',
        model: s.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        licensePlate: s.vehicule || 'N/A',
        client: s.client || 'Client',
        price: '0€',
        duration: s.heure || '0h',
        description: s.tache || 'Tâche',
        technician: s.technicien || 'Non assigné',
        status: mapTaskStatus(s.status)
      }))
    },
    {
      id: 'preparation',
      title: 'Préparation peinture',
      color: 'bg-purple-600',
      vehicles: schedules.filter(s => getScheduleType(s) === 'Préparation peinture').map(s => ({
        id: s.id,
        brand: s.modele?.split(' ')[0] || 'Marque',
        model: s.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        licensePlate: s.vehicule || 'N/A',
        client: s.client || 'Client',
        price: '0€',
        duration: s.heure || '0h',
        description: s.tache || 'Tâche',
        technician: s.technicien || 'Non assigné',
        status: mapTaskStatus(s.status)
      }))
    },
    {
      id: 'peinture',
      title: 'Mise en peinture',
      color: 'bg-green-600',
      vehicles: schedules.filter(s => getScheduleType(s) === 'Mise en peinture').map(s => ({
        id: s.id,
        brand: s.modele?.split(' ')[0] || 'Marque',
        model: s.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        licensePlate: s.vehicule || 'N/A',
        client: s.client || 'Client',
        price: '0€',
        duration: s.heure || '0h',
        description: s.tache || 'Tâche',
        technician: s.technicien || 'Non assigné',
        status: mapTaskStatus(s.status)
      }))
    },
    {
      id: 'finitions',
      title: 'Finitions & remontage',
      color: 'bg-indigo-600',
      vehicles: schedules.filter(s => getScheduleType(s) === 'Finitions & remontage').map(s => ({
        id: s.id,
        brand: s.modele?.split(' ')[0] || 'Marque',
        model: s.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        licensePlate: s.vehicule || 'N/A',
        client: s.client || 'Client',
        price: '0€',
        duration: s.heure || '0h',
        description: s.tache || 'Tâche',
        technician: s.technicien || 'Non assigné',
        status: mapTaskStatus(s.status)
      }))
    },
    {
      id: 'cloture',
      title: 'Clôture du dossier et livraison',
      color: 'bg-slate-600',
      vehicles: schedules.filter(s => getScheduleType(s) === 'Clôture & livraison').map(s => ({
        id: s.id,
        brand: s.modele?.split(' ')[0] || 'Marque',
        model: s.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        licensePlate: s.vehicule || 'N/A',
        client: s.client || 'Client',
        price: '0€',
        duration: s.heure || '0h',
        description: s.tache || 'Tâche',
        technician: s.technicien || 'Non assigné',
        status: mapTaskStatus(s.status)
      }))
    }
  ];

  // Helper functions moved to after useEffect hooks but kept here for reference if needed later

  const totalVehicles = workflowSteps.reduce((acc, step) => acc + step.vehicles.length, 0);
  const completedVehicles = workflowSteps.reduce((acc, step) => 
    acc + step.vehicles.filter(v => v.status === 'Terminé').length, 0
  );
  const waitingVehiclesCount = workflowSteps.reduce((acc, step) => 
    acc + step.vehicles.filter(v => v.status === 'À planifier').length, 0
  );
  const totalRevenue = workflowSteps.reduce((acc, step) => 
    acc + step.vehicles.reduce((stepAcc, vehicle) => 
      stepAcc + parseFloat(vehicle.price.replace('€', '')), 0
    ), 0
  );

  const handlePlanVehicle = async (vehicleId: string) => {
    console.log('Planning vehicle:', vehicleId);
    
    try {
      // Créer une nouvelle tâche de planning pour le véhicule
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Erreur d\'authentification:', authError);
        return;
      }

      // Trouver le premier employé disponible ou utiliser l'utilisateur actuel
      const assignedEmployee = employees.length > 0 ? employees[0] : null;
      if (!assignedEmployee) {
        console.error('Aucun employé disponible pour assigner la tâche');
        return;
      }

      // Calculer les dates de début et fin (début maintenant, durée 1h par défaut)
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (1 * 60 * 60 * 1000)); // +1 heure

      // Créer la tâche dans employee_schedule
      const { data: newTask, error: insertError } = await supabase
        .from('employee_schedule')
        .insert({
          vehicle_id: vehicleId,
          user_id: assignedEmployee.user_id,
          company_id: companyId,
          task_type: 'Accueil & Préparation du dossier',
          start_datetime: startTime.toISOString(),
          end_datetime: endTime.toISOString(),
          status: 'En cours'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de la création de la tâche:', insertError);
        return;
      }

      console.log('Tâche créée avec succès:', newTask);
      
      // Appeler onScheduleUpdate pour informer le parent
      if (onScheduleUpdate) {
        onScheduleUpdate({ 
          vehicleId, 
          action: 'plan', 
          taskId: newTask.id,
          message: 'Véhicule ajouté au planning avec succès'
        });
      }

      // TODO: Ajouter une notification de succès
      
    } catch (error) {
      console.error('Erreur inattendue lors de la planification:', error);
    }
  };

  return (
    <div className="w-full space-y-6 p-2.5">
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
          variant="destructive"
          size="sm"
          onClick={onOpenUrgenceModal}
          className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
        >
          <AlertTriangle className="w-4 h-4" />
          Véhicule Urgence
        </Button>
      </div>

      {/* Navigation Tabs - Only show for manager view */}
      {activeView === 'manager' && (
        <Tabs defaultValue="workshop" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="process" className="flex items-center gap-1">
              <Cog className="w-4 h-4" />
              <span className="hidden sm:inline">Process</span>
              <span className="sm:hidden">Proc</span>
            </TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings?tab=team')}
            className="flex items-center gap-2 ml-4"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Gérer l'équipe</span>
            <span className="sm:hidden">Équipe</span>
          </Button>
        </div>

        {/* Workshop Steps Tab */}
        <TabsContent value="workshop" className="space-y-6">
          <div>
            {/* Statistics */}
            <WorkshopStats
              totalVehicles={totalVehicles}
              completedVehicles={completedVehicles}
              waitingVehicles={waitingVehiclesCount}
              totalRevenue={totalRevenue}
            />

            {/* Summary banner */}
            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-6">
              <div className="text-sm text-yellow-800 font-medium">
                {waitingVehiclesCount} véhicules en attente
              </div>
              <div className="text-sm text-yellow-700">
                Pièces: 2 • Approbations: 1 • Techniciens: 1
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-0">
              {workflowSteps.map((step) => (
                <WorkflowStep
                  key={step.id}
                  title={step.title}
                  vehicles={step.vehicles}
                  count={step.vehicles.length}
                  stepColor={step.color}
                  onPlanVehicle={handlePlanVehicle}
                />
              ))}
            </div>
          </div>
        </TabsContent>

            <TabsContent value="waiting" className="space-y-6">
              <VehiclesWaitingTab 
                vehicles={waitingVehiclesProps}
                schedules={schedules}
                employees={employees}
                onAddToWorkflow={handlePlanVehicle}
                companyId={companyId}
                onRefresh={() => onScheduleUpdate && onScheduleUpdate({ action: 'refresh' })}
              />
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <PlanningCalendar 
                schedules={currentWeekData}
                employees={employees}
                vehicles={vehicles}
                onWeekChange={handleWeekChange}
              />
            </TabsContent>

            <TabsContent value="employee-planning" className="space-y-6">
              <EmployeePlanningTab 
                employees={employees}
                schedules={planningTaches}
              />
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
