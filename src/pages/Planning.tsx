import { useState, useEffect } from "react";
import { Calendar, Clock, User, Car, Euro, AlertTriangle, Wrench, Users, Cog, X, ArrowLeft, Edit, CheckCircle, BarChart, Phone, Mail, MapPin, FileText, Settings, Package, History, Pencil, Trash, Play, Crown, UserCheck, Eye, LogOut, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import StatsCard from '@/components/dashboard/StatsCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/hooks/use-company';
import { useEmployees, Employee } from '@/hooks/use-employees';
import { EmployeesList } from '@/components/planning/EmployeesList';

import { toast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/use-company-id';
import { useVehicleWorkflow } from '@/hooks/use-vehicle-workflow';
import { useOptimalPlanning } from '@/hooks/use-optimal-planning';
import { useEmployeeSchedule } from '@/hooks/use-employee-schedule';
import { useWorkshopSchedule } from '@/hooks/use-workshop-schedule';

// Helper function to calculate duration between two timestamps
const calculateDuration = (startDateTime: string, endDateTime: string): string => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes}min`;
  }
  return diffMinutes > 0 ? `${diffHours}h${diffMinutes}min` : `${diffHours}h`;
};

const Planning = () => {
  const { companyInfo } = useCompany();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("manager");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedPlanningEmployeeId, setSelectedPlanningEmployeeId] = useState<string>('');
  const [showVehicleDetailModal, setShowVehicleDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    teamMemberId: "",
    qualifications: [] as string[]
  });

  const { employees, createEmployee, updateEmployee } = useEmployees();
  const { workflowSteps, refetch: refetchWorkflow } = useVehicleWorkflow(companyInfo?.id);
  const { schedules: employeeSchedules } = useEmployeeSchedule(selectedEmployeeId);
  const { schedules: planningEmployeeSchedules } = useEmployeeSchedule(selectedPlanningEmployeeId);
  const { schedules: workshopSchedules } = useWorkshopSchedule();

  const stats = {
    vehicles: workflowSteps?.reduce((acc, step) => acc + step.vehicles.length, 0) || 0,
    urgent: workflowSteps?.find(step => step.title === "Accueil & Préparation du dossier")?.vehicles.filter(v => v.status === 'urgent').length || 0,
    inProgress: workflowSteps?.reduce((acc, step) => acc + step.vehicles.filter(v => v.inProgress).length, 0) || 0
  };

  // Auto-select first employee when employees load
  useEffect(() => {
    if (employees && employees.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(employees[0].id);
    }
  }, [employees, selectedEmployeeId]);

  // Auto-select first employee for planning when employees load
  useEffect(() => {
    if (employees && employees.length > 0 && !selectedPlanningEmployeeId) {
      setSelectedPlanningEmployeeId(employees[0].id);
    }
  }, [employees, selectedPlanningEmployeeId]);

  // Function to update vehicle workflow step
  const updateVehicleWorkflowStep = async (vehicleId: string, newStep: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_workflow_steps')
        .update({ current_step: newStep })
        .eq('vehicle_id', vehicleId)
        .eq('company_id', companyInfo?.id);

      if (error) throw error;

      toast({
        title: "Étape mise à jour",
        description: `L'étape du véhicule a été mise à jour vers : ${newStep}`,
      });

      // Refresh workflow data
      refetchWorkflow();
    } catch (error) {
      console.error('Error updating workflow step:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'étape du véhicule",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planning atelier</h1>
            <p className="text-muted-foreground">Gestion des véhicules et planification des interventions</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={activeView === "employee" ? "default" : "outline"}
              onClick={() => setActiveView("employee")}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Vue Employé
            </Button>
            <Button
              variant={activeView === "manager" ? "default" : "outline"}
              onClick={() => setActiveView("manager")}
              className="flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Vue Manager
            </Button>
          </div>
        </div>

        {/* Vue Employé */}
        {activeView === "employee" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="employee_select_employee">Employé :</Label>
              <Select 
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger
                  id="employee_select_employee"
                  className="w-[200px]"
                >
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-md z-50">
                  {employees?.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.user_companies?.profiles?.first_name && employee.user_companies?.profiles?.last_name 
                        ? `${employee.user_companies.profiles.first_name} ${employee.user_companies.profiles.last_name}`
                        : `Employé #${employee.id.slice(0, 8)}`
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Tasks */}
            <div className="space-y-4">
              {employeeSchedules?.map((schedule) => (
                <Card key={schedule.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                          <Clock className="w-3 h-3" />
                          {new Date(schedule.start_datetime).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}-{new Date(schedule.end_datetime).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="font-semibold mb-1">{schedule.task_type}</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Véhicule :</span> {schedule.vehicles?.license_plate || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Modèle :</span> {schedule.vehicles?.car_brands?.name} {schedule.vehicles?.car_models?.name}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Client :</span> {schedule.vehicles?.clients?.first_name} {schedule.vehicles?.clients?.last_name}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            if (schedule.vehicle_id) {
                              updateVehicleWorkflowStep(schedule.vehicle_id, schedule.task_type);
                            }
                          }}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Démarrer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!employeeSchedules || employeeSchedules.length === 0) && (
                <div className="text-center text-muted-foreground py-8">
                  Aucune tâche planifiée pour cet employé
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vue Manager - Onglets complets */}
        {activeView === "manager" && (
          <>
            <Tabs defaultValue="workshop" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="workshop" className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Étapes atelier
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Planning
                </TabsTrigger>
                <TabsTrigger value="employees" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Planning Employés
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Employés
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workshop" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard 
                    title="Véhicules" 
                    value={stats.vehicles}
                    icon={<Car className="h-8 w-8 text-blue-600" />}
                    iconBg="bg-blue-100"
                  />
                  <StatsCard 
                    title="Urgents" 
                    value={stats.urgent}
                    icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
                    iconBg="bg-red-100"
                  />
                  <StatsCard 
                    title="En cours" 
                    value={stats.inProgress}
                    icon={<Wrench className="h-8 w-8 text-orange-600" />}
                    iconBg="bg-orange-100"
                  />
                </div>

                {/* Workflow Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {workflowSteps?.map((step) => (
                    <Card key={step.title}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg" style={{ color: step.color }}>
                            {step.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {step.count}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {step.vehicles.map((vehicle) => (
                          <Card key={vehicle.id} className="border-l-4 p-3" style={{ borderLeftColor: step.color }}>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm" style={{ color: step.color }}>
                                <Clock className="w-3 h-3" />
                                {vehicle.duration}
                              </div>
                              <div className="font-semibold text-sm">{vehicle.plate}</div>
                              <div className="text-xs text-muted-foreground">{vehicle.brand}</div>
                              <div className="text-xs text-muted-foreground">Client: {vehicle.client}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {vehicle.technician}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                {vehicle.inProgress ? (
                                  <Badge className="bg-orange-100 text-orange-800">
                                    En cours
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">À préparer</Badge>
                                )}
                                
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedVehicle(vehicle);
                                      setShowVehicleDetailModal(true);
                                    }}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Détails
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="planning" className="space-y-6">
                <div className="text-center text-muted-foreground py-8">
                  Planning détaillé - En cours de développement
                </div>
              </TabsContent>

              <TabsContent value="employees" className="space-y-6">
                {/* Sélecteur d'employé */}
                <div className="flex items-center gap-4">
                  <Label htmlFor="employee_select_planning">Employé :</Label>
                  <Select 
                    value={selectedPlanningEmployeeId}
                    onValueChange={setSelectedPlanningEmployeeId}
                  >
                    <SelectTrigger
                      id="employee_select_planning"
                      className="w-[200px]"
                    >
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-md z-50">
                      {employees?.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.user_companies?.profiles?.first_name && employee.user_companies?.profiles?.last_name 
                            ? `${employee.user_companies.profiles.first_name} ${employee.user_companies.profiles.last_name}`
                            : `Employé #${employee.id.slice(0, 8)}`
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardContent className="p-6">
                    {selectedPlanningEmployeeId && (() => {
                      const selectedEmployee = employees?.find(emp => emp.id === selectedPlanningEmployeeId);
                      const currentSchedules = planningEmployeeSchedules.filter(schedule => {
                        const now = new Date();
                        const startDate = new Date(schedule.start_datetime);
                        const endDate = new Date(schedule.end_datetime);
                        return startDate <= now && endDate >= now;
                      });
                      const completedSchedules = planningEmployeeSchedules.filter(schedule => {
                        const now = new Date();
                        const endDate = new Date(schedule.end_datetime);
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const scheduleDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                        return endDate < now && scheduleDate.getTime() === today.getTime();
                      });
                      
                      return (
                        <>
                          <div className="bg-muted/30 rounded-lg p-4 mb-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h2 className="text-xl font-semibold text-primary mb-1">
                                  {selectedEmployee?.user_companies?.profiles?.first_name && selectedEmployee?.user_companies?.profiles?.last_name 
                                    ? `${selectedEmployee.user_companies.profiles.first_name} ${selectedEmployee.user_companies.profiles.last_name}`
                                    : `Employé #${selectedEmployee?.id.slice(0, 8)}`
                                  }
                                </h2>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {selectedEmployee?.user_companies?.profiles?.email || 'Email non renseigné'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedEmployee?.qualifications?.map((qualification, index) => (
                                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                                      {qualification}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-6 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-primary">{currentSchedules.length}</div>
                                  <div className="text-sm text-muted-foreground">En cours</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-green-600">{completedSchedules.length}</div>
                                  <div className="text-sm text-muted-foreground">Terminées</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-orange-600">{planningEmployeeSchedules.length}</div>
                                  <div className="text-sm text-muted-foreground">Total</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section titre avec icône */}
                          <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">
                              Planning de {selectedEmployee?.user_companies?.profiles?.first_name && selectedEmployee?.user_companies?.profiles?.last_name 
                                ? `${selectedEmployee.user_companies.profiles.first_name} ${selectedEmployee.user_companies.profiles.last_name}`
                                : `Employé #${selectedEmployee?.id.slice(0, 8)}`}
                            </h3>
                          </div>

                          {/* Statistiques détaillées */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-primary/10 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-primary">{currentSchedules.length}</div>
                              <div className="text-sm text-muted-foreground">Tâches en cours</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">{completedSchedules.length}</div>
                              <div className="text-sm text-muted-foreground">Terminées aujourd'hui</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-orange-600">{planningEmployeeSchedules.length}</div>
                              <div className="text-sm text-muted-foreground">Total du jour</div>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    {/* Tâches en cours */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <h4 className="font-semibold">Tâches en cours</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {planningEmployeeSchedules.filter(schedule => {
                          const now = new Date();
                          const startDate = new Date(schedule.start_datetime);
                          const endDate = new Date(schedule.end_datetime);
                          return startDate <= now && endDate >= now;
                        }).map((schedule) => (
                          <Card key={schedule.id} className="border-l-4 border-l-orange-500 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                                  <Clock className="w-3 h-3" />
                                  {new Date(schedule.start_datetime).toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}-{new Date(schedule.end_datetime).toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                                <div className="font-semibold mb-1">{schedule.task_type}</div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  <span className="font-medium">Véhicule :</span> {schedule.vehicles?.license_plate || 'N/A'}
                                </div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  <span className="font-medium">Modèle :</span> {schedule.vehicles?.car_brands?.name} {schedule.vehicles?.car_models?.name}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  <span className="font-medium">Client :</span> {schedule.vehicles?.clients?.first_name} {schedule.vehicles?.clients?.last_name}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span className="font-medium">Durée:</span> {calculateDuration(schedule.start_datetime, schedule.end_datetime)}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className="bg-orange-100 text-orange-800">En cours</Badge>
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Terminer
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                        {planningEmployeeSchedules.filter(schedule => {
                          const now = new Date();
                          const startDate = new Date(schedule.start_datetime);
                          const endDate = new Date(schedule.end_datetime);
                          return startDate <= now && endDate >= now;
                        }).length === 0 && (
                          <div className="text-center text-muted-foreground py-4">
                            Aucune tâche en cours
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tâches terminées aujourd'hui */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold">Tâches terminées aujourd'hui</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {planningEmployeeSchedules.filter(schedule => {
                          const now = new Date();
                          const endDate = new Date(schedule.end_datetime);
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const scheduleDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                          return endDate < now && scheduleDate.getTime() === today.getTime();
                        }).map((schedule) => (
                          <Card key={schedule.id} className="border-l-4 border-l-green-500 p-4 bg-green-50/30">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                                  <Clock className="w-3 h-3" />
                                  {new Date(schedule.start_datetime).toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}-{new Date(schedule.end_datetime).toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                                <div className="font-semibold mb-1">{schedule.task_type}</div>
                                <div className="text-sm text-muted-foreground">
                                  {schedule.vehicles?.license_plate} - {schedule.vehicles?.car_brands?.name} {schedule.vehicles?.car_models?.name} - {schedule.vehicles?.clients?.first_name} {schedule.vehicles?.clients?.last_name}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                                <Button size="sm" variant="outline" onClick={() => {
                                  setSelectedVehicle({
                                    brand: `${schedule.vehicles?.car_brands?.name} ${schedule.vehicles?.car_models?.name}`,
                                    plate: schedule.vehicles?.license_plate,
                                    client: `${schedule.vehicles?.clients?.first_name} ${schedule.vehicles?.clients?.last_name}`,
                                    technician: employees?.find(emp => emp.id === selectedPlanningEmployeeId)?.user_companies?.profiles?.first_name + ' ' + employees?.find(emp => emp.id === selectedPlanningEmployeeId)?.user_companies?.profiles?.last_name
                                  });
                                  setShowVehicleDetailModal(true);
                                }}>
                                  Voir détails
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                        {planningEmployeeSchedules.filter(schedule => {
                          const now = new Date();
                          const endDate = new Date(schedule.end_datetime);
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const scheduleDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                          return endDate < now && scheduleDate.getTime() === today.getTime();
                        }).length === 0 && (
                          <div className="text-center text-muted-foreground py-4">
                            Aucune tâche terminée aujourd'hui
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="staff" className="space-y-6">
                <EmployeesList
                  onAddEmployee={() => {
                    setEditingEmployee(null);
                    setEmployeeFormData({
                      teamMemberId: "",
                      qualifications: []
                    });
                    setShowEmployeeDialog(true);
                  }}
                  onEditEmployee={(employee) => {
                    setEditingEmployee(employee);
                    setEmployeeFormData({
                      teamMemberId: employee.team_member_id || "",
                      qualifications: employee.qualifications
                    });
                    setShowEmployeeDialog(true);
                  }}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Modal des détails du véhicule */}
        <Dialog open={showVehicleDetailModal} onOpenChange={setShowVehicleDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du véhicule</DialogTitle>
              <DialogDescription>
                Informations détaillées sur le véhicule sélectionné
              </DialogDescription>
            </DialogHeader>
            {selectedVehicle && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Plaque d'immatriculation</Label>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.plate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Marque/Modèle</Label>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.brand}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Client</Label>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.client}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Technicien assigné</Label>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.technician}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default Planning;