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
import { useViewManagement } from "@/hooks/use-view-management";
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
  
  // Utiliser le hook de gestion des vues qui gère correctement les rôles
  const {
    currentView,
    selectedEmployeView,
    setCurrentView,
    setSelectedEmployeView,
    canSwitchViews,
    isEmployeeRole,
    canManageUsers
  } = useViewManagement();
  
  const navigate = useNavigate();
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

  // canSwitchViews est déjà défini par useViewManagement

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
    vehicles: schedules
      .filter(s => getScheduleType(s) === 'Accueil & Préparation du dossier' && s.status !== 'Terminé')
      .map(s => ({
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
    vehicles: schedules
      .filter(s => getScheduleType(s) === 'Remplacement ou débosselage' && s.status !== 'Terminé')
      .map(s => ({
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
    vehicles: schedules
      .filter(s => getScheduleType(s) === 'Préparation peinture' && s.status !== 'Terminé')
      .map(s => ({
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
    vehicles: schedules
      .filter(s => getScheduleType(s) === 'Mise en peinture' && s.status !== 'Terminé')
      .map(s => ({
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
    vehicles: schedules
      .filter(s => getScheduleType(s) === 'Finitions & remontage' && s.status !== 'Terminé')
      .map(s => ({
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
    vehicles: schedules
      .filter(s => getScheduleType(s) === 'Clôture & livraison' && s.status !== 'Terminé')
      .map(s => ({
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
          {canSwitchViews ? <div className="flex gap-2">
              <Button variant={currentView === 'manager' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('manager')} className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Vue Manager</span>
                <span className="sm:hidden">Manager</span>
              </Button>
              <Button variant={currentView === 'employe' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('employe')} className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Vue Employé</span>
                <span className="sm:hidden">Employé</span>
              </Button>
            </div> : (/* Afficher la vue actuelle sans possibilité de changement */
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
              {currentView === 'manager' ? <>
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

      {/* Navigation Tabs - Only show for manager view - Mobile responsive */}
      {currentView === 'manager' && <Tabs defaultValue="workshop" className="w-full">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Tabs avec scroll horizontal sur mobile */}
          <div className="relative">
            <TabsList className="w-full flex justify-start overflow-x-auto no-scrollbar h-12 sm:h-11 bg-muted/60 p-1.5 rounded-xl">
              <TabsTrigger value="workshop" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0">
                <Wrench className="w-4 h-4" />
                <span className="hidden xs:inline sm:hidden lg:inline">Étapes atelier</span>
                <span className="xs:hidden sm:inline lg:hidden">Étapes</span>
              </TabsTrigger>
              <TabsTrigger value="waiting" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0">
                <Clock className="w-4 h-4" />
                <span className="hidden xs:inline sm:hidden lg:inline">En attente</span>
                <span className="xs:hidden sm:inline lg:hidden">Attente</span>
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0">
                <BarChart className="w-4 h-4" />
                <span className="hidden xs:inline sm:hidden lg:inline">Planning</span>
                <span className="xs:hidden sm:inline lg:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger value="employee-planning" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0">
                <Users className="w-4 h-4" />
                <span className="hidden xs:inline sm:hidden lg:inline">Employés</span>
                <span className="xs:hidden sm:inline lg:hidden">Equipe</span>
              </TabsTrigger>
              <TabsTrigger value="process" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0">
                <Cog className="w-4 h-4" />
                <span className="hidden xs:inline sm:hidden lg:inline">Process</span>
                <span className="xs:hidden sm:inline lg:hidden">Config</span>
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="planning-patron" className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 text-xs sm:text-sm rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap flex-shrink-0">
                  <Crown className="w-4 h-4" />
                  <span className="hidden xs:inline sm:hidden lg:inline">Planning Patron</span>
                  <span className="xs:hidden sm:inline lg:hidden">Patron</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          {/* Button séparé sur mobile */}
          <div className="flex justify-center sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate('/settings?tab=team')} className="flex items-center gap-2 w-full sm:w-auto h-10 px-4 hover:bg-accent/50 border-border/50">
              <Users className="w-4 h-4" />
              <span className="sm:hidden">Gérer l'équipe</span>
              <span className="hidden sm:inline">Gérer l'équipe</span>
            </Button>
          </div>
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
              <div className="text-sm text-yellow-700">
                Pièces: 2 • Approbations: 1 • Techniciens: 1
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-0">
              {workflowSteps.map(step => <WorkflowStep key={step.id} title={step.title} vehicles={step.vehicles} count={step.vehicles.length} stepColor={step.color} onPlanVehicle={handlePlanVehicle} />)}
            </div>
          </div>
        </TabsContent>

            <TabsContent value="waiting" className="space-y-6">
              <VehiclesWaitingTab 
                vehicles={waitingVehiclesProps} 
                employees={employees} 
                onAddToWorkflow={handlePlanVehicle} 
                companyId={companyId} 
                onRefresh={() => onScheduleUpdate && onScheduleUpdate({
                  action: 'refresh'
                })} 
              />
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

            {isOwner && (
              <TabsContent value="planning-patron" className="space-y-6">
                <div className="p-6 bg-card rounded-lg border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    Planning Patron
                  </h2>
                  <p className="text-muted-foreground">
                    Fonctionnalités réservées au propriétaire de l'atelier.
                  </p>
                </div>
              </TabsContent>
            )}
        </Tabs>}

      {/* Employee View */}
      {currentView === 'employe' && <div className="mt-6">
          <EmployeeView employeeId={selectedEmployeView} />
        </div>}
    </div>;
};