import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { isSameWeek, startOfWeek, addDays, parseISO, isValid, parse } from 'date-fns';
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
  const {
    userRole,
    isCarrossier,
    isCarrossierCourtesy,
    isResponsable,
    isOwner,
    isLoading
  } = useUserRole();
  const navigate = useNavigate();

  // Déterminer la vue par défaut selon le rôle
  const getDefaultView = () => {
    if (isOwner) return 'manager';
    if (isResponsable) return 'manager';
    if (isCarrossier || isCarrossierCourtesy) return 'employee';
    return 'manager'; // Par défaut pour manager
  };
  const [activeView, setActiveView] = useState<'manager' | 'employee'>(getDefaultView());
  const [currentWeekData, setCurrentWeekData] = useState<any[]>([]);

  // Source unifiée des tâches: préférer planningTaches si fourni, sinon schedules
  const allTasks = useMemo(() => {
    const pt = Array.isArray(planningTaches) ? planningTaches : [];
    return pt.length ? pt : Array.isArray(schedules) ? schedules : [];
  }, [planningTaches, schedules]);

  // Ref pour conserver la dernière valeur de la source
  const planningRef = useRef(allTasks);
  planningRef.current = allTasks;

  // Gérer le changement de semaine dans le calendrier (filtrage local + demande de rafraîchissement Supabase)
  const handleWeekChange = useCallback((weekStart: Date, weekEnd: Date) => {
    const tryParse = (raw: any): Date | null => {
      if (!raw) return null;
      try {
        if (typeof raw === 'string') {
          const iso = parseISO(raw);
          if (isValid(iso)) return iso;
          const frParsed = parse(raw, 'dd/MM/yyyy', new Date());
          if (isValid(frParsed)) return frParsed;
        } else {
          const d = new Date(raw);
          if (isValid(d)) return d;
        }
      } catch {}
      return null;
    };
    const source = Array.isArray(planningRef.current) ? planningRef.current : [];
    const filtered = source.filter((t: any) => {
      const rawDate = t.start_datetime || t.dateAssignation || t.date || t.startDate || t.date_debut || t.dateTime;
      const d = tryParse(rawDate);
      if (!d) {
        // Conserver les tâches sans date mais avec un jour explicite
        return !!t.jour;
      }
      return isSameWeek(d, weekStart, {
        weekStartsOn: 1
      });
    });
    setCurrentWeekData(prev => {
      if (prev.length === filtered.length && prev.every((p, i) => p.id === filtered[i]?.id)) return prev;
      return filtered;
    });

    // Demande au parent de rafraîchir depuis Supabase pour cette plage
    onScheduleUpdate?.({
      action: 'refresh',
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString()
    });
  }, [onScheduleUpdate]);

  // Synchroniser les données avec toutes les tâches disponibles
  useEffect(() => {
    setCurrentWeekData(prev => {
      const next = allTasks;
      if (prev.length === next.length && prev.every((p, i) => p?.id === next[i]?.id)) {
        return prev;
      }
      return next;
    });
  }, [allTasks]);

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
    const raw = typeof s.task_type === 'string' ? s.task_type : s.etape || s.tache || '';
    return String(raw).trim();
  };

  // Convert real data to workflow steps format from database
  const workflowSteps = [{
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }];

  // Helper functions moved to after useEffect hooks but kept here for reference if needed later

  const totalVehicles = workflowSteps.reduce((acc, step) => acc + step.vehicles.length, 0);
  const completedVehicles = workflowSteps.reduce((acc, step) => acc + step.vehicles.filter(v => v.status === 'Terminé').length, 0);
  const waitingVehiclesCount = workflowSteps.reduce((acc, step) => acc + step.vehicles.filter(v => v.status === 'À planifier').length, 0);
  const totalRevenue = workflowSteps.reduce((acc, step) => acc + step.vehicles.reduce((stepAcc, vehicle) => stepAcc + parseFloat(vehicle.price.replace('€', '')), 0), 0);
  const handlePlanVehicle = async (vehicleId: string) => {
    console.log('Planning vehicle:', vehicleId);
    try {
      // Créer une nouvelle tâche de planning pour le véhicule
      const {
        data: {
          user
        },
        error: authError
      } = await supabase.auth.getUser();
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
      const endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000); // +1 heure

      // Créer la tâche dans employee_schedule
      const {
        data: newTask,
        error: insertError
      } = await supabase.from('employee_schedule').insert({
        vehicle_id: vehicleId,
        user_id: assignedEmployee.user_id,
        company_id: companyId,
        task_type: 'Accueil & Préparation du dossier',
        start_datetime: startTime.toISOString(),
        end_datetime: endTime.toISOString(),
        status: 'En cours'
      }).select().single();
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
  return <div className="w-full space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header with view switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
          {/* Afficher les boutons de changement de vue uniquement pour les propriétaires */}
          {canSwitchView ? <div className="flex gap-2">
              <Button variant={activeView === 'manager' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('manager')} className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Vue Manager</span>
                <span className="sm:hidden">Manager</span>
              </Button>
              <Button variant={activeView === 'employee' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('employee')} className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Vue Employé</span>
                <span className="sm:hidden">Employé</span>
              </Button>
            </div> : (/* Afficher la vue actuelle sans possibilité de changement */
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
              {activeView === 'manager' ? <>
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Vue Manager</span>
                </> : <>
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Vue Employé</span>
                </>}
              <Badge variant="secondary" className="ml-2 text-xs">
                {userRole}
              </Badge>
            </div>)}
        </div>
        
        <Button variant="destructive" size="sm" onClick={onOpenUrgenceModal} className="flex items-center gap-2 bg-destructive hover:bg-destructive/90">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">Véhicule Urgence</span>
          <span className="sm:hidden">Urgence</span>
        </Button>
      </div>

      {/* Navigation Tabs - Only show for manager view */}
      {activeView === 'manager' && <Tabs defaultValue="workshop" className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:w-auto h-12 sm:h-11 bg-muted/60 p-1.5 rounded-xl">
            <TabsTrigger value="workshop" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Étapes atelier</span>
              <span className="sm:hidden">Étapes</span>
            </TabsTrigger>
            <TabsTrigger value="waiting" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">En attente</span>
              <span className="sm:hidden">Attente</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Planning</span>
              <span className="sm:hidden">Planning</span>
            </TabsTrigger>
            <TabsTrigger value="employee-planning" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Employés</span>
              <span className="sm:hidden">Equipe</span>
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Cog className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Process</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" onClick={() => navigate('/settings?tab=team')} className="flex items-center gap-2 w-full lg:w-auto h-10 px-4 hover:bg-accent/50 border-border/50">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Gérer l'équipe</span>
            <span className="sm:hidden">Équipe</span>
          </Button>
        </div>

        {/* Workshop Steps Tab */}
        <TabsContent value="workshop" className="space-y-6">
          <div>
            {/* Statistics */}
            <WorkshopStats totalVehicles={totalVehicles} completedVehicles={completedVehicles} waitingVehicles={waitingVehiclesCount} totalRevenue={totalRevenue} />

            {/* Summary banner */}
            <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-6">
              <div className="text-sm text-yellow-800 font-medium">
                {waitingVehiclesProps.length} véhicules en attente
              </div>
              <div className="text-sm text-yellow-700 mb-2">
                Pièces: 2 • Approbations: 1 • Techniciens: 1
              </div>
              {/* Debug temporaire */}
              <div className="text-xs text-yellow-600 border-t pt-2">
                Debug - Props: {waitingVehiclesProps.length} | Workflow: {waitingVehiclesCount}
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-0">
              {workflowSteps.map(step => <WorkflowStep key={step.id} title={step.title} vehicles={step.vehicles} count={step.vehicles.length} stepColor={step.color} onPlanVehicle={handlePlanVehicle} />)}
            </div>
          </div>
        </TabsContent>

            <TabsContent value="waiting" className="space-y-6">
              <VehiclesWaitingTab vehicles={waitingVehiclesProps} schedules={schedules} employees={employees} onAddToWorkflow={handlePlanVehicle} companyId={companyId} onRefresh={() => onScheduleUpdate && onScheduleUpdate({
          action: 'refresh'
        })} />
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <PlanningCalendar schedules={currentWeekData} employees={employees} vehicles={vehicles} onWeekChange={handleWeekChange} onTaskUpdated={() => onScheduleUpdate?.({
          action: 'refresh'
        })} />
            </TabsContent>

            <TabsContent value="employee-planning" className="space-y-6">
              <EmployeePlanningTab employees={employees} schedules={planningTaches} />
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              <ProcessConfig />
            </TabsContent>
        </Tabs>}

      {/* Employee View */}
      {activeView === 'employee' && <div className="mt-6">
          <EmployeeView />
        </div>}
    </div>;
};