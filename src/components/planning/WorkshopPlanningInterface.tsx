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

  // Mock data based on the karrosserie-planning interface
  const mockWorkflowSteps = [
    {
      id: 'accueil',
      title: 'Accueil & Préparation du dossier',
      vehicles: [
        {
          id: '1',
          brand: 'Citroën',
          model: 'C4',
          licensePlate: 'EZ-787-KL',
          client: 'M. Durand',
          price: '800€',
          duration: '0.5h',
          description: 'Devis en cours',
          technician: 'Martin Dubois',
          status: 'En cours' as const
        },
        {
          id: '2',
          brand: 'Mercedes',
          model: 'Classe C',
          licensePlate: 'QR-345-ST',
          client: 'Mme Leclerc',
          price: '400€',
          duration: '1h',
          description: 'Expertise assurance',
          status: 'À planifier' as const
        }
      ]
    },
    {
      id: 'remplacement',
      title: 'Remplacement ou débosselage',
      vehicles: [
        {
          id: '3',
          brand: 'Audi',
          model: 'A4',
          licensePlate: 'VS-901-AB',
          client: 'M. Bernard',
          price: '520€',
          duration: '2h',
          description: 'Débosselage portière',
          technician: 'Sophie Martin',
          status: 'En cours' as const
        },
        {
          id: '4',
          brand: 'BMW',
          model: 'Série 1',
          licensePlate: 'HT-556-GH',
          client: 'M. Rousseau',
          price: '950€',
          duration: '3h',
          description: 'Remplacement pare-chocs',
          status: 'À planifier' as const
        }
      ]
    },
    {
      id: 'preparation',
      title: 'Préparation peinture',
      vehicles: [
        {
          id: '5',
          brand: 'Peugeot',
          model: '308',
          licensePlate: 'AB-789-XY',
          client: 'Mme Moreau',
          price: '680€',
          duration: '2.5h',
          description: 'Ponçage aile avant',
          technician: 'Sophie Martin',
          status: 'En cours' as const
        }
      ]
    },
    {
      id: 'peinture',
      title: 'Mise en peinture',
      vehicles: [
        {
          id: '6',
          brand: 'Renault',
          model: 'Clio',
          licensePlate: 'CD-123-ZW',
          client: 'M. Petit',
          price: '1200€',
          duration: '4h',
          description: 'Application base',
          technician: 'Sophie Martin',
          status: 'En cours' as const
        }
      ]
    },
    {
      id: 'finitions',
      title: 'Finitions & remontage',
      vehicles: [
        {
          id: '7',
          brand: 'Volkswagen',
          model: 'Golf',
          licensePlate: 'EF-456-UV',
          client: 'Mme Blanc',
          price: '350€',
          duration: '1.5h',
          description: 'Polissage final',
          technician: 'Martin Dubois',
          status: 'En cours' as const
        }
      ]
    },
    {
      id: 'cloture',
      title: 'Clôture du dossier et livraison',
      vehicles: [
        {
          id: '8',
          brand: 'Ford',
          model: 'Focus',
          licensePlate: 'GH-789-ST',
          client: 'M. Roux',
          price: '80€',
          duration: '0.5h',
          description: 'Contrôle qualité',
          technician: 'Martin Dubois',
          status: 'En cours' as const
        }
      ]
    }
  ];

  const totalVehicles = mockWorkflowSteps.reduce((acc, step) => acc + step.vehicles.length, 0);
  const completedVehicles = 0; // Aucun terminé dans les données mock
  const waitingVehicles = mockWorkflowSteps.reduce((acc, step) => 
    acc + step.vehicles.filter(v => v.status === 'À planifier').length, 0
  );
  const totalRevenue = mockWorkflowSteps.reduce((acc, step) => 
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
              {mockWorkflowSteps.map((step) => (
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
              <VehiclesWaitingTab />
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
