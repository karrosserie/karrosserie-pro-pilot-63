import { useState, useEffect } from "react";
import { Calendar, Clock, User, Car, Euro, AlertTriangle, Wrench, Users, Cog, X, ArrowLeft, Edit, CheckCircle, BarChart, Phone, Mail, MapPin, FileText, Settings, Package, History, Pencil, Trash, Play, Crown, UserCheck, Eye } from "lucide-react";
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

const Planning = () => {
  const { companyInfo } = useCompany();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("manager");
  const [activeProcessStep, setActiveProcessStep] = useState("accueil");
  const [showWaitingVehiclesModal, setShowWaitingVehiclesModal] = useState(false);
  const [showVehicleDetailModal, setShowVehicleDetailModal] = useState(false);
  const [showUrgentVehicleModal, setShowUrgentVehicleModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showScheduleConfigModal, setShowScheduleConfigModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    teamMemberId: "",
    qualifications: [] as string[]
  });
  const [configData, setConfigData] = useState({
    accueil: "01:00",
    debosselage: "02:30", 
    preparation: "02:30",
    peinture: "05:00",
    finitions: "02:00",
    cloture: "00:30"
  });
  const [scheduleConfig, setScheduleConfig] = useState({
    monday: { 
      enabled: true, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    },
    tuesday: { 
      enabled: true, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    },
    wednesday: { 
      enabled: true, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    },
    thursday: { 
      enabled: true, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    },
    friday: { 
      enabled: true, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    },
    saturday: { 
      enabled: false, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    },
    sunday: { 
      enabled: false, 
      morning: { start: "08:00", end: "12:00" },
      afternoon: { start: "14:00", end: "18:00" },
      fullDay: false
    }
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { employees, createEmployee, updateEmployee } = useEmployees();
  const { workflowSteps } = useVehicleWorkflow(companyInfo?.id);

  // Charger les temps de configuration depuis la base de données
  useEffect(() => {
    const loadConfigData = async () => {
      if (!companyInfo?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('company_preferences')
          .select('accueil_preparation_time, remplacement_debosselage_time, preparation_peinture_time, mise_en_peinture_time, finitions_remontage_time, cloture_livraison_time')
          .eq('company_id', companyInfo.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setConfigData({
            accueil: data.accueil_preparation_time?.slice(0, 5) || "01:00",
            debosselage: data.remplacement_debosselage_time?.slice(0, 5) || "02:30",
            preparation: data.preparation_peinture_time?.slice(0, 5) || "02:30",
            peinture: data.mise_en_peinture_time?.slice(0, 5) || "05:00",
            finitions: data.finitions_remontage_time?.slice(0, 5) || "02:00",
            cloture: data.cloture_livraison_time?.slice(0, 5) || "00:30"
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des temps de configuration:', error);
      }
    };

    loadConfigData();
  }, [companyInfo?.id]);

  // Charger les horaires d'ouverture depuis la base de données
  useEffect(() => {
    const loadScheduleData = async () => {
      if (!companyInfo?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('workshop_schedule')
          .select('*')
          .eq('company_id', companyInfo.id);

        if (error) throw error;
        
        if (data && data.length > 0) {
          const scheduleMap = {};
          data.forEach(schedule => {
            scheduleMap[schedule.day_of_week] = {
              enabled: schedule.enabled,
              fullDay: schedule.full_day,
              morning: {
                start: schedule.morning_start?.slice(0, 5) || "08:00",
                end: schedule.morning_end?.slice(0, 5) || "12:00"
              },
              afternoon: {
                start: schedule.afternoon_start?.slice(0, 5) || "14:00",
                end: schedule.afternoon_end?.slice(0, 5) || "18:00"
              }
            };
          });
          setScheduleConfig(prevConfig => ({
            ...prevConfig,
            ...scheduleMap
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des horaires d\'ouverture:', error);
      }
    };

    loadScheduleData();
  }, [companyInfo?.id]);

  // Charger les données des étapes de workflow depuis la base de données
  useEffect(() => {
    const loadWorkflowData = async () => {
      if (!companyInfo?.id) return;
      
      try {
        // Récupérer les véhicules avec leurs étapes de workflow
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select(`
            id,
            license_plate,
            client_id,
            brand_id,
            model_id,
            clients (
              first_name,
              last_name
            ),
            car_brands (
              name
            ),
            car_models (
              name
            )
          `)
          .eq('company_id', companyInfo.id);

        if (vehiclesError) throw vehiclesError;

        // Récupérer les étapes de workflow pour ces véhicules
        const { data: workflowData, error: workflowError } = await supabase
          .from('vehicle_workflow_steps')
          .select('*')
          .eq('company_id', companyInfo.id);

        if (workflowError) throw workflowError;

        // Organiser les données par étapes
        const stepMap = {
          'accueil_preparation': {
            title: "Accueil & Préparation du dossier",
            color: "border-l-karrosserie-orange",
            vehicles: []
          },
          'remplacement_debosselage': {
            title: "Remplacement ou débosselage",
            color: "border-l-green-500",
            vehicles: []
          },
          'preparation_peinture': {
            title: "Préparation peinture",
            color: "border-l-yellow-500",
            vehicles: []
          },
          'mise_en_peinture': {
            title: "Mise en peinture",
            color: "border-l-blue-500",
            vehicles: []
          },
          'finitions_remontage': {
            title: "Finitions & remontage",
            color: "border-l-purple-500",
            vehicles: []
          },
          'cloture_livraison': {
            title: "Clôture du dossier et livraison",
            color: "border-l-red-500",
            vehicles: []
          }
        };

        // Associer chaque véhicule à sa bonne étape
        vehiclesData?.forEach(vehicle => {
          const workflowStep = workflowData?.find(w => w.vehicle_id === vehicle.id);
          const currentStep = workflowStep?.current_step || 'accueil_preparation';
          
          if (stepMap[currentStep]) {
            stepMap[currentStep].vehicles.push({
              id: vehicle.id,
              brand: `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim() || 'Véhicule',
              plate: vehicle.license_plate,
              client: `${vehicle.clients?.first_name || ''} ${vehicle.clients?.last_name || ''}`.trim() || 'Client inconnu',
              price: "0€", // À calculer depuis les devis/factures
              duration: "0h", // À calculer selon la configuration
              status: "En attente",
              inProgress: workflowStep?.progress_percentage > 0,
              technician: workflowStep?.technician_id ? "Assigné" : null,
              workflowId: workflowStep?.id
            });
          }
        });

        // Convertir en array avec les counts
        const steps = Object.values(stepMap).map(step => ({
          ...step,
          count: step.vehicles.length
        }));

        // Les steps sont maintenant gérés par le hook useVehicleWorkflow
        
      } catch (error) {
        console.error('Erreur lors du chargement des données de workflow:', error);
      }
    };

    loadWorkflowData();
  }, [companyInfo?.id]);

  // Récupérer les membres de l'équipe
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!companyInfo?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select(`
            id,
            user_id,
            role,
            active,
            created_at
          `)
          .eq('company_id', companyInfo.id);

        if (error) throw error;
        
        // Récupérer les profils séparément pour chaque utilisateur
        const membersWithProfiles = await Promise.all(
          (data || []).map(async (member) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, email, phone_number')
              .eq('id', member.user_id)
              .single();
            
            return {
              ...member,
              profiles: profile || null
            };
          })
        );
        
        setTeamMembers(membersWithProfiles);
      } catch (error) {
        console.error('Erreur lors du chargement des membres de l\'équipe:', error);
        setTeamMembers([]);
      }
    };

    fetchTeamMembers();
  }, [companyInfo?.id, user]);
  const [urgentVehicleFormData, setUrgentVehicleFormData] = useState({
    licensePlate: "",
    assignmentTime: "",
    clientFirstName: "",
    clientLastName: "",
    assignedEmployee: ""
  });

  const stats = {
    vehicles: 8,
    completed: 0,
    waiting: 5,
    revenue: 18700
  };

  const waitingVehicles = [
    {
      id: 1,
      model: "Peugeot 308",
      licensePlate: "AB-123-CD",
      status: "Normale",
      client: "M. Dupont",
      price: "2500€",
      blockedStep: "Réparation carrosserie",
      waitingDays: 210,
      blockageReason: "Attente pièces",
      blockageDetails: "Pare-chocs avant en commande - Délai 5-7 jours"
    },
    {
      id: 2,
      model: "Renault Clio",
      licensePlate: "FG-456-GH",
      status: "Urgent",
      client: "Mme Martin",
      price: "1200€",
      blockedStep: "Expertise",
      waitingDays: 211,
      blockageReason: "Accord expert assurance",
      blockageDetails: "En attente validation devis par expert AXA"
    },
    {
      id: 3,
      model: "BMW Série 3",
      licensePlate: "PQ-012-UV",
      status: "Normale",
      client: "M. Bernard",
      price: "3200€",
      blockedStep: "Peinture",
      waitingDays: 5,
      blockageReason: "Disponibilité technicien",
      blockageDetails: "En attente d'un slot libre cabine peinture"
    },
    {
      id: 4,
      model: "Volkswagen Golf",
      licensePlate: "WX-789-YZ",
      status: "Normale",
      client: "Mme Rousseau",
      price: "850€",
      blockedStep: "Débosselage",
      waitingDays: 12,
      blockageReason: "Validation client",
      blockageDetails: "Devis en attente d'approbation client"
    },
    {
      id: 5,
      model: "Ford Focus",
      licensePlate: "ST-345-UV",
      status: "Urgent",
      client: "M. Leblanc",
      price: "1800€",
      blockedStep: "Réparation",
      waitingDays: 45,
      blockageReason: "Problème technique",
      blockageDetails: "Dommage structurel nécessitant expertise complémentaire"
    }
  ];

  const blockageStats = {
    pieces: 2,
    expertise: 1,
    technicien: 1,
    problemes: 1
  };

  // Charger les données des étapes de workflow depuis la base de données
  useEffect(() => {
    const loadWorkflowData = async () => {
      if (!companyInfo?.id) return;
      
      try {
        // Récupérer les véhicules avec leurs étapes de workflow
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select(`
            id,
            license_plate,
            client_id,
            brand_id,
            model_id,
            clients (
              first_name,
              last_name
            ),
            car_brands (
              name
            ),
            car_models (
              name
            )
          `)
          .eq('company_id', companyInfo.id);

        if (vehiclesError) throw vehiclesError;

        // Récupérer les étapes de workflow pour ces véhicules
        const { data: workflowData, error: workflowError } = await supabase
          .from('vehicle_workflow_steps')
          .select('*')
          .eq('company_id', companyInfo.id);

        if (workflowError) throw workflowError;

        // Organiser les données par étapes
        const stepMap = {
          'accueil_preparation': {
            title: "Accueil & Préparation du dossier",
            color: "border-l-karrosserie-orange",
            vehicles: []
          },
          'remplacement_debosselage': {
            title: "Remplacement ou débosselage",
            color: "border-l-green-500",
            vehicles: []
          },
          'preparation_peinture': {
            title: "Préparation peinture",
            color: "border-l-yellow-500",
            vehicles: []
          },
          'mise_en_peinture': {
            title: "Mise en peinture",
            color: "border-l-blue-500",
            vehicles: []
          },
          'finitions_remontage': {
            title: "Finitions & remontage",
            color: "border-l-purple-500",
            vehicles: []
          },
          'cloture_livraison': {
            title: "Clôture du dossier et livraison",
            color: "border-l-red-500",
            vehicles: []
          }
        };

        // Associer chaque véhicule à sa bonne étape
        vehiclesData?.forEach(vehicle => {
          const workflowStep = workflowData?.find(w => w.vehicle_id === vehicle.id);
          const currentStep = workflowStep?.current_step || 'accueil_preparation';
          
          if (stepMap[currentStep]) {
            stepMap[currentStep].vehicles.push({
              id: vehicle.id,
              brand: `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim(),
              plate: vehicle.license_plate,
              client: `${vehicle.clients?.first_name || ''} ${vehicle.clients?.last_name || ''}`.trim(),
              price: "0€", // À calculer depuis les devis/factures
              duration: "0h", // À calculer selon la configuration
              status: "En attente",
              inProgress: workflowStep?.progress_percentage > 0,
              technician: workflowStep?.technician_id ? "Assigné" : null,
              workflowId: workflowStep?.id
            });
          }
        });

        // Convertir en array avec les counts
        const steps = Object.values(stepMap).map(step => ({
          ...step,
          count: step.vehicles.length
        }));

        // Les steps sont maintenant gérés par le hook useVehicleWorkflow
        
      } catch (error) {
        console.error('Erreur lors du chargement des données de workflow:', error);
      }
    };

    loadWorkflowData();
  }, [companyInfo?.id]);

  return (
    <div className="min-h-screen bg-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Planning atelier</h1>
            <p className="text-muted-foreground">Parcours complet avec synchronisation planning automatique</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "manager" ? "default" : "outline"}
              onClick={() => setActiveView("manager")}
              size="sm"
              className={activeView === "manager" ? "bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white" : ""}
            >
              <Crown className="w-4 h-4 mr-2" />
              Vue Manager
            </Button>
            <Button
              variant={activeView === "employee" ? "default" : "outline"}
              onClick={() => setActiveView("employee")}
              size="sm"
              className={activeView === "employee" ? "bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white" : ""}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Vue Employé
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowUrgentVehicleModal(true)}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Véhicule en urgence
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowConfigModal(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Vue Employé - Liste déroulante simplifiée */}
        {activeView === "employee" && (
          <div className="space-y-6">
            {/* Sélecteur d'employé */}
            <div className="flex items-center gap-4">
              <Label htmlFor="employee_select_simple">Employé :</Label>
              <Select defaultValue="martin">
                <SelectTrigger
                  id="employee_select_simple"
                  className="w-[200px]"
                >
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-md z-50">
                  <SelectItem value="sophie">Sophie Martin</SelectItem>
                  <SelectItem value="martin">Martin Dubois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Planning de l'employé */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mon Planning - Martin Dubois</h3>
              
              {/* Tâche 1 */}
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">08h-10h</span>
                        <Badge variant="destructive" className="ml-2">Urgent</Badge>
                      </div>
                      <div className="font-semibold">CX-145-DT</div>
                      <div className="text-sm text-muted-foreground">Citroën C4</div>
                      <div className="text-sm">Expertise assurance</div>
                      <div className="text-sm text-muted-foreground">Accord Préparation dossier</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedVehicle({
                          brand: "Citroën C4",
                          plate: "EZ-787-KL",
                          client: "M. Durand",
                          technician: "Martin Dubois"
                        });
                        setShowVehicleDetailModal(true);
                      }}>Détails</Button>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                          <Play className="w-4 h-4 mr-2" />
                          Démarrer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tâche 2 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600">12h-14h</span>
                        <Badge variant="secondary" className="ml-2">Normal</Badge>
                      </div>
                      <div className="font-semibold">EZ-757-AL</div>
                      <div className="text-sm text-muted-foreground">Audi A3</div>
                      <div className="text-sm">Remplacement</div>
                      <div className="text-sm text-muted-foreground">Accord Préparation dossier</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedVehicle({
                          brand: "Mercedes Classe C",
                          plate: "QR-345-ST",
                          client: "Mme Leclerc",
                          technician: null
                        });
                        setShowVehicleDetailModal(true);
                      }}>Détails</Button>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                          <Play className="w-4 h-4 mr-2" />
                          Démarrer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tâche 3 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600">09h-12h</span>
                        <Badge variant="secondary" className="ml-2">Normal</Badge>
                      </div>
                      <div className="font-semibold">AB-783-KY</div>
                      <div className="text-sm text-muted-foreground">BMW X1</div>
                      <div className="text-sm">Ponçage & retouches</div>
                      <div className="text-sm text-muted-foreground">Accord Finitions</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedVehicle({
                          brand: "Audi A3",
                          plate: "EZ-757-AL",
                          client: "M. Durand",
                          technician: "Martin Dubois"
                        });
                        setShowVehicleDetailModal(true);
                      }}>Détails</Button>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                          <Play className="w-4 h-4 mr-2" />
                          Démarrer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tâche 4 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600">13h-15h30</span>
                        <Badge variant="secondary" className="ml-2">Normal</Badge>
                      </div>
                      <div className="font-semibold">SF-345-UV</div>
                      <div className="text-sm text-muted-foreground">Volkswagen Golf</div>
                      <div className="text-sm">Ponçage final</div>
                      <div className="text-sm text-muted-foreground">Accord dossier livraison</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedVehicle({
                          brand: "BMW X1",
                          plate: "AB-783-KY",
                          client: "M. Durand",
                          technician: "Martin Dubois"
                        });
                        setShowVehicleDetailModal(true);
                      }}>Détails</Button>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Terminer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tâche 5 */}
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">08h-10h30</span>
                        <Badge variant="destructive" className="ml-2">Urgent</Badge>
                      </div>
                      <div className="font-semibold">EF-345-UV</div>
                      <div className="text-sm text-muted-foreground">Ford Focus</div>
                      <div className="text-sm">Accueil client</div>
                      <div className="text-sm text-muted-foreground">Accord Remontage</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedVehicle({
                          brand: "Volkswagen Golf",
                          plate: "SF-345-UV",
                          client: "M. Durand",
                          technician: "Martin Dubois"
                        });
                        setShowVehicleDetailModal(true);
                      }}>Détails</Button>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                          <Play className="w-4 h-4 mr-2" />
                          Démarrer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tâche 6 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600">08h-14h</span>
                        <Badge variant="secondary" className="ml-2">Normal</Badge>
                      </div>
                      <div className="font-semibold">EZ-757-AL</div>
                      <div className="text-sm text-muted-foreground">Citroën C3</div>
                      <div className="text-sm">Débosselage léger</div>
                      <div className="text-sm text-muted-foreground">Accord dossier livraison</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedVehicle({
                          brand: "Ford Focus",
                          plate: "EF-345-UV",
                          client: "M. Durand",
                          technician: "Martin Dubois"
                        });
                        setShowVehicleDetailModal(true);
                      }}>Détails</Button>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Terminer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-karrosserie-orange" />
                  Notifications (1)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm font-medium text-orange-800">Tâche reportée, voir le détail</div>
                  <div className="text-sm text-orange-700 mt-1">Véhicule CX-145-DT nécessite validation expert</div>
                  <Button variant="outline" size="sm" className="mt-2 text-karrosserie-orange border-karrosserie-orange hover:bg-karrosserie-orange hover:text-white">
                    Marquer comme lu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vue Manager - Onglets complets */}
        {activeView === "manager" && (
        <Tabs defaultValue="workshop" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
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
            <TabsTrigger value="process" className="flex items-center gap-2">
              <Cog className="w-4 h-4" />
              Process
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
                title="Terminés" 
                value={stats.completed}
                icon={<CheckCircle className="h-8 w-8 text-green-600" />}
                iconBg="bg-green-100"
              />
              <StatsCard 
                title="En attente" 
                value={stats.waiting}
                icon={<Clock className="h-8 w-8 text-orange-600" />}
                iconBg="bg-orange-100"
              />
            </div>

            {/* Alert */}
            <Card className="bg-orange-50 border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => setShowWaitingVehiclesModal(true)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">5 véhicules en attente</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Pièces: 2 • Approbations: 1 • Techniciens: 1
                </p>
              </CardContent>
            </Card>

            {/* Workflow Steps */}
            <div className="space-y-6">
              {workflowSteps.map((step, stepIndex) => (
                <Card key={stepIndex} className={`border-l-4 ${step.color}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{step.title}</span>
                      <Badge variant="secondary">{step.count} véhicule(s)</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {step.vehicles.map((vehicle, vehicleIndex) => (
                        <Card key={vehicleIndex} className="p-4 hover:shadow-md transition-shadow">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{vehicle.brand}</h4>
                                <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                                <p className="text-sm text-muted-foreground">Client : {vehicle.client}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600">{vehicle.price}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {vehicle.duration}
                                </div>
                              </div>
                            </div>
                            
                            {vehicle.technician && (
                              <div className="flex items-center text-sm">
                                <User className="w-3 h-3 mr-1" />
                                {vehicle.technician}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              {vehicle.inProgress ? (
                                <Badge className="bg-orange-100 text-karrosserie-orange hover:bg-orange-100">
                                  En cours
                                </Badge>
                              ) : (
                                <Badge variant="secondary">À planifier</Badge>
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
                                
                                {!vehicle.inProgress && (
                                  <Button size="sm" variant="outline">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Planifier
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            {/* Résumé de la semaine */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Résumé de la semaine</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard 
                  title="Tâches totales" 
                  value={14}
                  icon={<CheckCircle className="h-8 w-8 text-blue-600" />}
                  iconBg="bg-blue-100"
                />
                <StatsCard 
                  title="Véhicules traités" 
                  value={8}
                  icon={<Car className="h-8 w-8 text-green-600" />}
                  iconBg="bg-green-100"
                />
                <StatsCard 
                  title="Techniciens mobilisés" 
                  value={2}
                  icon={<User className="h-8 w-8 text-orange-600" />}
                  iconBg="bg-orange-100"
                />
              </div>
            </div>

            {/* Planning détaillé */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Planning détaillé</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowScheduleConfigModal(true)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Planning Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Lundi */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-600">Lundi</CardTitle>
                  <p className="text-sm text-muted-foreground">3 tâche(s)</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Tâche 1 */}
                  <Card className="border-l-4 border-l-orange-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Citroën C4",
                      plate: "EZ-787-KL",
                      client: "M. Durand",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="w-3 h-3" />
                        9h-10h
                      </div>
                      <div className="font-semibold text-sm">EZ-787-KL</div>
                      <div className="text-xs text-muted-foreground">Citroën C4</div>
                      <div className="text-xs text-muted-foreground">Accueil & Préparation</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Durand</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Accueil & Préparation du dossier</Badge>
                    </div>
                  </Card>

                  {/* Tâche 2 */}
                  <Card className="border-l-4 border-l-green-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Audi A4",
                      plate: "VS-901-AB",
                      client: "M. Bernard",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Clock className="w-3 h-3" />
                        10h-12h
                      </div>
                      <div className="font-semibold text-sm">VS-901-AB</div>
                      <div className="text-xs text-muted-foreground">Audi A4</div>
                      <div className="text-xs text-muted-foreground">Débosselage portière</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Bernard</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Remplacement ou débosselage</Badge>
                    </div>
                  </Card>

                  {/* Tâche 3 */}
                  <Card className="border-l-4 border-l-orange-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Peugeot 308",
                      plate: "AB-789-XY",
                      client: "Mme Moreau",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="w-3 h-3" />
                        14h-16h30
                      </div>
                      <div className="font-semibold text-sm">AB-789-XY</div>
                      <div className="text-xs text-muted-foreground">Peugeot 308</div>
                      <div className="text-xs text-muted-foreground">Ponçage aile avant</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: Mme Moreau</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Préparation peinture</Badge>
                    </div>
                  </Card>
                </CardContent>
              </Card>

              {/* Mardi */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-600">Mardi</CardTitle>
                  <p className="text-sm text-muted-foreground">3 tâche(s)</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Tâche 1 */}
                  <Card className="border-l-4 border-l-orange-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Mercedes Classe C",
                      plate: "QR-345-ST",
                      client: "Mme Leclerc",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="w-3 h-3" />
                        8h-9h
                      </div>
                      <div className="font-semibold text-sm">QR-345-ST</div>
                      <div className="text-xs text-muted-foreground">Mercedes Classe C</div>
                      <div className="text-xs text-muted-foreground">Expertise assurance</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: Mme Leclerc</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Accueil & Préparation du dossier</Badge>
                    </div>
                  </Card>

                  {/* Tâche 2 */}
                  <Card className="border-l-4 border-l-orange-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Renault Clio",
                      plate: "CD-123-ZW",
                      client: "M. Petit",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="w-3 h-3" />
                        9h-13h
                      </div>
                      <div className="font-semibold text-sm">CD-123-ZW</div>
                      <div className="text-xs text-muted-foreground">Renault Clio</div>
                      <div className="text-xs text-muted-foreground">Application base peinture</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Petit</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Mise en peinture</Badge>
                    </div>
                  </Card>

                  {/* Tâche 3 */}
                  <Card className="border-l-4 border-l-purple-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Volkswagen Golf",
                      plate: "EF-456-UV",
                      client: "Mme Blanc",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Clock className="w-3 h-3" />
                        14h-15h30
                      </div>
                      <div className="font-semibold text-sm">EF-456-UV</div>
                      <div className="text-xs text-muted-foreground">Volkswagen Golf</div>
                      <div className="text-xs text-muted-foreground">Polissage final</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: Mme Blanc</div>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">Finitions & remontage</Badge>
                    </div>
                  </Card>
                </CardContent>
              </Card>

              {/* Mercredi */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-600">Mercredi</CardTitle>
                  <p className="text-sm text-muted-foreground">3 tâche(s)</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Tâche 1 */}
                  <Card className="border-l-4 border-l-green-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "BMW Série 1",
                      plate: "HT-556-GH",
                      client: "M. Rousseau",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Clock className="w-3 h-3" />
                        8h-11h
                      </div>
                      <div className="font-semibold text-sm">HT-556-GH</div>
                      <div className="text-xs text-muted-foreground">BMW Série 1</div>
                      <div className="text-xs text-muted-foreground">Remplacement pare-chocs</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Rousseau</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Remplacement ou débosselage</Badge>
                    </div>
                  </Card>

                  {/* Tâche 2 */}
                  <Card className="border-l-4 border-l-red-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Ford Focus",
                      plate: "GH-789-ST",
                      client: "M. Roux",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <Clock className="w-3 h-3" />
                        11h-11h30
                      </div>
                      <div className="font-semibold text-sm">GH-789-ST</div>
                      <div className="text-xs text-muted-foreground">Ford Focus</div>
                      <div className="text-xs text-muted-foreground">Contrôle qualité</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Roux</div>
                      <Badge className="bg-red-100 text-red-800 text-xs">Clôture du dossier et livraison</Badge>
                    </div>
                  </Card>

                  {/* Tâche 3 */}
                  <Card className="border-l-4 border-l-purple-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Renault Clio",
                      plate: "CD-123-ZW",
                      client: "M. Petit",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Clock className="w-3 h-3" />
                        14h-15h
                      </div>
                      <div className="font-semibold text-sm">CD-123-ZW</div>
                      <div className="text-xs text-muted-foreground">Renault Clio</div>
                      <div className="text-xs text-muted-foreground">Finitions peinture</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Petit</div>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">Finitions & remontage</Badge>
                    </div>
                  </Card>
                </CardContent>
              </Card>

              {/* Jeudi */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-600">Jeudi</CardTitle>
                  <p className="text-sm text-muted-foreground">2 tâche(s)</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Tâche 1 */}
                  <Card className="border-l-4 border-l-orange-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Peugeot 308",
                      plate: "AB-789-XY",
                      client: "Mme Moreau",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="w-3 h-3" />
                        9h-12h
                      </div>
                      <div className="font-semibold text-sm">AB-789-XY</div>
                      <div className="text-xs text-muted-foreground">Peugeot 308</div>
                      <div className="text-xs text-muted-foreground">Application peinture</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: Mme Moreau</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Mise en peinture</Badge>
                    </div>
                  </Card>

                  {/* Tâche 2 */}
                  <Card className="border-l-4 border-l-green-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Citroën C4",
                      plate: "EZ-787-KL",
                      client: "M. Durand",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Clock className="w-3 h-3" />
                        14h-16h
                      </div>
                      <div className="font-semibold text-sm">EZ-787-KL</div>
                      <div className="text-xs text-muted-foreground">Citroën C4</div>
                      <div className="text-xs text-muted-foreground">Débosselage léger</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Durand</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Remplacement ou débosselage</Badge>
                    </div>
                  </Card>
                </CardContent>
              </Card>

              {/* Vendredi */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-600">Vendredi</CardTitle>
                  <p className="text-sm text-muted-foreground">3 tâche(s)</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Tâche 1 */}
                  <Card className="border-l-4 border-l-orange-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "BMW Série 1",
                      plate: "HT-556-GH",
                      client: "M. Rousseau",
                      technician: "Sophie Martin"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="w-3 h-3" />
                        8h-10h
                      </div>
                      <div className="font-semibold text-sm">HT-556-GH</div>
                      <div className="text-xs text-muted-foreground">BMW Série 1</div>
                      <div className="text-xs text-muted-foreground">Préparation peinture</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Sophie Martin
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Rousseau</div>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">Préparation peinture</Badge>
                    </div>
                  </Card>

                  {/* Tâche 2 */}
                  <Card className="border-l-4 border-l-purple-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Peugeot 308",
                      plate: "AB-789-XY",
                      client: "Mme Moreau",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Clock className="w-3 h-3" />
                        10h-12h
                      </div>
                      <div className="font-semibold text-sm">AB-789-XY</div>
                      <div className="text-xs text-muted-foreground">Peugeot 308</div>
                      <div className="text-xs text-muted-foreground">Finitions & remontage</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: Mme Moreau</div>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">Finitions & remontage</Badge>
                    </div>
                  </Card>

                  {/* Tâche 3 */}
                  <Card className="border-l-4 border-l-red-500 p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedVehicle({
                      brand: "Citroën C4",
                      plate: "EZ-787-KL",
                      client: "M. Durand",
                      technician: "Martin Dubois"
                    });
                    setShowVehicleDetailModal(true);
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <Clock className="w-3 h-3" />
                        14h-14h30
                      </div>
                      <div className="font-semibold text-sm">EZ-787-KL</div>
                      <div className="text-xs text-muted-foreground">Citroën C4</div>
                      <div className="text-xs text-muted-foreground">Livraison client</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Martin Dubois
                      </div>
                      <div className="text-xs text-muted-foreground">Client: M. Durand</div>
                      <Badge className="bg-red-100 text-red-800 text-xs">Clôture du dossier et livraison</Badge>
                    </div>
                  </Card>
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            {/* Sélecteur d'employé */}
            <div className="flex items-center gap-4">
              <Label htmlFor="employee_select">Employé :</Label>
              <Select defaultValue="sophie">
                <SelectTrigger
                  id="employee_select"
                  className="w-[200px]"
                >
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-md z-50">
                  <SelectItem value="sophie">Sophie Martin</SelectItem>
                  <SelectItem value="martin">Martin Dubois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card data-lov-id="src/pages/Planning.tsx:844:10">
              <CardContent className="p-6">
                {/* En-tête employé */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-primary mb-1">Sophie Martin</h2>
                      <p className="text-sm text-muted-foreground mb-3">sophie.martin@carrosserie.fr</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">Préparation peinture</Badge>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">Mise en peinture</Badge>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">Finitions & remontage</Badge>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">5</div>
                        <div className="text-sm text-muted-foreground">En cours</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">2</div>
                        <div className="text-sm text-muted-foreground">Terminées</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">7</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section titre avec icône */}
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Planning de Sophie Martin</h3>
                </div>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="text-sm text-muted-foreground">Tâches en cours</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm text-muted-foreground">Terminées aujourd'hui</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-sm text-muted-foreground">Total du jour</div>
                  </div>
                </div>

                {/* Tâches en cours */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <h4 className="font-semibold">Tâches en cours</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-muted-foreground">Tri chronologique</button>
                      <Badge variant="outline">5</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Tâche 1 */}
                    <Card className="border-l-4 border-l-orange-500 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                            <Clock className="w-3 h-3" />
                            8h-11h
                          </div>
                          <div className="font-semibold mb-1">Remplacement pare-chocs</div>
                          <div className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Véhicule :</span> HT-556-GH
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Modèle :</span> BMW Série 1
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Client :</span> M. Rousseau
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">Durée estimée:</span> 3h
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-orange-100 text-karrosserie-orange">En cours</Badge>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terminer
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Tâche 2 */}
                    <Card className="border-l-4 border-l-orange-500 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                            <Clock className="w-3 h-3" />
                            14h-15h
                          </div>
                          <div className="font-semibold mb-1">Finitions peinture</div>
                          <div className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Véhicule :</span> CD-123-ZW
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Modèle :</span> Renault Clio
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Client :</span> M. Petit
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">Durée estimée:</span> 1h
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-orange-100 text-orange-800">Planifié</Badge>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terminer
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Tâches terminées aujourd'hui */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold">Tâches terminées aujourd'hui</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-muted-foreground">Tri chronologique</button>
                      <Badge variant="outline">2</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Tâche terminée 1 */}
                    <Card className="border-l-4 border-l-green-500 p-4 bg-green-50/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                            <Clock className="w-3 h-3" />
                            8h-10h
                          </div>
                          <div className="font-semibold mb-1">Préparation peinture</div>
                          <div className="text-sm text-muted-foreground">
                            HT-556-GH - BMW Série 1 - M. Rousseau
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedVehicle({
                              brand: "BMW Série 1",
                              plate: "HT-556-GH",
                              client: "M. Rousseau",
                              technician: "Sophie Martin"
                            });
                            setShowVehicleDetailModal(true);
                          }}>
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Tâche terminée 2 */}
                    <Card className="border-l-4 border-l-green-500 p-4 bg-green-50/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                            <Clock className="w-3 h-3" />
                            10h-12h
                          </div>
                          <div className="font-semibold mb-1">Débosselage portière</div>
                          <div className="text-sm text-muted-foreground">
                            VS-901-AB - Audi A4 - M. Bernard
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedVehicle({
                              brand: "Audi A4",
                              plate: "VS-901-AB",
                              client: "M. Bernard",
                              technician: "Sophie Martin"
                            });
                            setShowVehicleDetailModal(true);
                          }}>
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </Card>
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

          <TabsContent value="process" className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">Process de réparation</h3>
                </div>
                <div className="flex items-center gap-2 bg-orange-100 text-karrosserie-orange px-3 py-1 rounded-full text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Temps indicatifs - Variables selon complexité</span>
                </div>
              </div>
            </div>

            {/* Processus avec navigation */}
            <div className="w-full">
              {/* Navigation des étapes */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={activeProcessStep === "accueil" ? "validation" : "outline"}
                  onClick={() => setActiveProcessStep("accueil")}
                  size="sm"
                  className="text-xs"
                >
                  ACCUEIL & PRÉPARATION DU DOSSIER
                </Button>
                <Button
                  variant={activeProcessStep === "remplacement" ? "validation" : "outline"}
                  onClick={() => setActiveProcessStep("remplacement")}
                  size="sm"
                  className="text-xs"
                >
                  REMPLACEMENT OU DÉBOSSELAGE
                </Button>
                <Button
                  variant={activeProcessStep === "preparation" ? "validation" : "outline"}
                  onClick={() => setActiveProcessStep("preparation")}
                  size="sm"
                  className="text-xs"
                >
                  PRÉPARATION PEINTURE
                </Button>
                <Button
                  variant={activeProcessStep === "peinture" ? "validation" : "outline"}
                  onClick={() => setActiveProcessStep("peinture")}
                  size="sm"
                  className="text-xs"
                >
                  MISE EN PEINTURE
                </Button>
                <Button
                  variant={activeProcessStep === "finitions" ? "validation" : "outline"}
                  onClick={() => setActiveProcessStep("finitions")}
                  size="sm"
                  className="text-xs"
                >
                  FINITIONS & REMONTAGE
                </Button>
                <Button
                  variant={activeProcessStep === "cloture" ? "validation" : "outline"}
                  onClick={() => setActiveProcessStep("cloture")}
                  size="sm"
                  className="text-xs"
                >
                  CLÔTURE & LIVRAISON
                </Button>
              </div>

              {/* ACCUEIL & PRÉPARATION */}
              {activeProcessStep === "accueil" && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-karrosserie-orange">
                    <CardHeader>
                      <CardTitle className="text-lg">ACCUEIL & PRÉPARATION DU DOSSIER</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Sinistre simple (rayure, petite bosse)</div>
                            <div className="text-sm text-muted-foreground">Devis rapide, photos basiques</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">30-45 min</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Sinistre moyen (plusieurs éléments)</div>
                            <div className="text-sm text-muted-foreground">Devis détaillé, multiples photos, recherche pièces</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">45-75 min</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Gros sinistre (structure touchée)</div>
                            <div className="text-sm text-muted-foreground">Expertise approfondie, mesures, diagnostique expert</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">1-2 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Véhicule de luxe/collection</div>
                            <div className="text-sm text-muted-foreground">Documentation spéciale, photos détaillées, recherche pièces spécifiques</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">1-3 heures</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Section récapitulatif commune */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart className="w-4 h-4" />
                          Récapitulatif par type de sinistre
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 items-center gap-2 font-medium text-muted-foreground">
                          <span>Catégorie de Sinistre</span>
                          <span className="text-center text-xs">Temps Total</span>
                          <span className="text-center text-xs">Durée Calendaire</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Micro rayure/retouche</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">2-4 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1 jour</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">6-12 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-2 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">12-20 heures</span>
                          <span className="text-center text-muted-foreground text-xs">2-3 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre important (3+ éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">20-40 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-7 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Gros sinistre (structure touchée)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">40-80 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-3 semaines</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2">
                          <span className="font-medium">Sinistre majeur (reconstruction)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">80-200 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-8 semaines</span>
                        </div>
                      </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'allongement des délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Attente pièces</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Variable selon constructeur/modèle</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Expertise assurance</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* REMPLACEMENT OU DÉBOSSELAGE */}
              {activeProcessStep === "remplacement" && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-lg">REMPLACEMENT OU DÉBOSSELAGE</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">Petit impact (grêle, parking)</div>
                            <div className="text-sm text-muted-foreground">Impact débosselage sans peinture</div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">30 min - 1h</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">Bosse moyenne</div>
                            <div className="text-sm text-muted-foreground">Débosselage traditionnel ou à la ventouse</div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">1-3 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">Grosse déformation</div>
                            <div className="text-sm text-muted-foreground">Marteaux, planage, multiples passes</div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">3-6 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">Pare-chocs avant/arrière</div>
                            <div className="text-sm text-muted-foreground">Démontage, préparation, montage</div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">2-4 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">Aile avant</div>
                            <div className="text-sm text-muted-foreground">Soudure nécessaire</div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">3-5 heures</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart className="w-4 h-4" />
                         Récapitulatif par type de sinistre
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 items-center gap-2 font-medium text-muted-foreground">
                          <span>Catégorie de Sinistre</span>
                          <span className="text-center text-xs">Temps Total</span>
                          <span className="text-center text-xs">Durée Calendaire</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Micro rayure/retouche</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">2-4 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1 jour</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">6-12 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-2 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">12-20 heures</span>
                          <span className="text-center text-muted-foreground text-xs">2-3 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre important (3+ éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">20-40 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-7 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Gros sinistre (structure touchée)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">40-80 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-3 semaines</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2">
                          <span className="font-medium">Sinistre majeur (reconstruction)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">80-200 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-8 semaines</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'allongement des délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Attente pièces</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Variable selon constructeur/modèle</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Expertise assurance</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              )}

              {/* PRÉPARATION PEINTURE */}
              {activeProcessStep === "preparation" && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="text-lg">PRÉPARATION PEINTURE</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Retouche localisée</div>
                            <div className="text-sm text-muted-foreground">Ponçage local, masquage précis</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">1-2 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Un élément (aile, portière)</div>
                            <div className="text-sm text-muted-foreground">Ponçage complet, apprêt et retouche</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">2-3 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Plusieurs éléments adjacents</div>
                            <div className="text-sm text-muted-foreground">Raccordement des teintes</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">3-4 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium">Véhicule complet</div>
                            <div className="text-sm text-muted-foreground">Ponçage intégral, masquage complet</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">6-8 heures</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart className="w-4 h-4" />
                         Récapitulatif par type de sinistre
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 items-center gap-2 font-medium text-muted-foreground">
                          <span>Catégorie de Sinistre</span>
                          <span className="text-center text-xs">Temps Total</span>
                          <span className="text-center text-xs">Durée Calendaire</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Micro rayure/retouche</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">2-4 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1 jour</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">6-12 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-2 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">12-20 heures</span>
                          <span className="text-center text-muted-foreground text-xs">2-3 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre important (3+ éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">20-40 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-7 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Gros sinistre (structure touchée)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">40-80 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-3 semaines</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2">
                          <span className="font-medium">Sinistre majeur (reconstruction)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">80-200 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-8 semaines</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'allongement des délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Attente pièces</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Variable selon constructeur/modèle</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Expertise assurance</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              )}

              {/* MISE EN PEINTURE */}
              {activeProcessStep === "peinture" && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="text-lg">MISE EN PEINTURE</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Retouche au pinceau</div>
                            <div className="text-sm text-muted-foreground">Petites rayures, éclats mineurs</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">30 min</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Retouche pistolet (petit élément)</div>
                            <div className="text-sm text-muted-foreground">2 couches + vernis</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">1-2 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Un élément standard</div>
                            <div className="text-sm text-muted-foreground">Base + vernis, séchage étuvé</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">2-3 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Plusieurs éléments</div>
                            <div className="text-sm text-muted-foreground">Plusieurs passages cabine</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">3-5 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Véhicule complet</div>
                            <div className="text-sm text-muted-foreground">Multiples couches, séchage étuvé</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">6-10 heures</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart className="w-4 h-4" />
                         Récapitulatif par type de sinistre
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 items-center gap-2 font-medium text-muted-foreground">
                          <span>Catégorie de Sinistre</span>
                          <span className="text-center text-xs">Temps Total</span>
                          <span className="text-center text-xs">Durée Calendaire</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Micro rayure/retouche</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">2-4 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1 jour</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">6-12 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-2 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">12-20 heures</span>
                          <span className="text-center text-muted-foreground text-xs">2-3 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre important (3+ éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">20-40 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-7 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Gros sinistre (structure touchée)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">40-80 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-3 semaines</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2">
                          <span className="font-medium">Sinistre majeur (reconstruction)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">80-200 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-8 semaines</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'allongement des délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Attente pièces</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Variable selon constructeur/modèle</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Expertise assurance</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              )}

              {/* FINITIONS & REMONTAGE */}
              {activeProcessStep === "finitions" && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-lg">FINITIONS & REMONTAGE</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium">Finitions simples</div>
                            <div className="text-sm text-muted-foreground">Polissage léger, remontage basique</div>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">1-2 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium">Finitions standard</div>
                            <div className="text-sm text-muted-foreground">Polissage, lustrage, remontage complet</div>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">2-3 heures</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium">Finitions haut de gamme</div>
                            <div className="text-sm text-muted-foreground">Polissage multi-étapes, cire protection</div>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">3-5 heures</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart className="w-4 h-4" />
                         Récapitulatif par type de sinistre
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 items-center gap-2 font-medium text-muted-foreground">
                          <span>Catégorie de Sinistre</span>
                          <span className="text-center text-xs">Temps Total</span>
                          <span className="text-center text-xs">Durée Calendaire</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Micro rayure/retouche</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">2-4 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1 jour</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">6-12 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-2 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">12-20 heures</span>
                          <span className="text-center text-muted-foreground text-xs">2-3 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre important (3+ éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">20-40 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-7 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Gros sinistre (structure touchée)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">40-80 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-3 semaines</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2">
                          <span className="font-medium">Sinistre majeur (reconstruction)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">80-200 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-8 semaines</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'allongement des délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Attente pièces</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Variable selon constructeur/modèle</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Expertise assurance</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              )}

              {/* CLÔTURE & LIVRAISON */}
              {activeProcessStep === "cloture" && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="text-lg">CLÔTURE DU DOSSIER ET LIVRAISON</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Contrôle qualité</div>
                            <div className="text-sm text-muted-foreground">Vérification finale, checklist qualité</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">15-30 min</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Nettoyage véhicule</div>
                            <div className="text-sm text-muted-foreground">Lavage complet, aspirateur intérieur</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">30-45 min</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <div className="font-medium">Livraison client</div>
                            <div className="text-sm text-muted-foreground">Explication travaux, remise clés</div>
                          </div>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">15-30 min</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart className="w-4 h-4" />
                        Récapitulatif par type de sinistre
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 items-center gap-2 font-medium text-muted-foreground">
                          <span>Catégorie de Sinistre</span>
                          <span className="text-center text-xs">Temps Total</span>
                          <span className="text-center text-xs">Durée Calendaire</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Micro rayure/retouche</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">2-4 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1 jour</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">6-12 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-2 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">12-20 heures</span>
                          <span className="text-center text-muted-foreground text-xs">2-3 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Sinistre important (3+ éléments)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">20-40 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-7 jours</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2 border-b">
                          <span className="font-medium">Gros sinistre (structure touchée)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">40-80 heures</span>
                          <span className="text-center text-muted-foreground text-xs">1-3 semaines</span>
                        </div>
                        
                        <div className="grid grid-cols-3 items-center gap-2 py-2">
                          <span className="font-medium">Sinistre majeur (reconstruction)</span>
                          <span className="text-center text-karrosserie-orange font-medium text-xs">80-200 heures</span>
                          <span className="text-center text-muted-foreground text-xs">3-8 semaines</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'allongement des délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Attente pièces</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Variable selon constructeur/modèle</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Expertise assurance</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-gray-800 mb-2">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-karrosserie-orange mb-1">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        )}

        {/* Modal des véhicules en attente */}
        <Dialog open={showWaitingVehiclesModal} onOpenChange={setShowWaitingVehiclesModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div>
                <DialogTitle className="text-xl font-semibold">Véhicules en attente</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {waitingVehicles.length} véhicule(s) bloqué(s) dans les étapes atelier
                </p>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-3 mt-4">
              {waitingVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      {/* Section gauche - Informations véhicule */}
                      <div className="flex items-center gap-4 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">{vehicle.model}</h3>
                            <span className="text-sm text-muted-foreground">{vehicle.licensePlate}</span>
                            <Badge 
                              variant={vehicle.status === "Urgent" ? "destructive" : "secondary"}
                              className={`text-xs ${vehicle.status === "Urgent" ? "bg-red-500 text-white" : ""}`}
                            >
                              {vehicle.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Client :</span>
                              <span className="ml-1 font-medium">{vehicle.client}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Prix :</span>
                              <span className="ml-1 font-semibold text-green-600">{vehicle.price}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm mt-1">
                            <div>
                              <span className="text-muted-foreground">Étape bloquée :</span>
                              <span className="ml-1">{vehicle.blockedStep}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">En attente depuis :</span>
                              <span className="ml-1 text-red-600 font-medium">{vehicle.waitingDays} jour(s)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section droite - Boutons d'action */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white h-8 px-3">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Débloquer
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          Planifier
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          <Edit className="w-3 h-3 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>

                    {/* Section blocage - plus compacte */}
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-2 mt-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-orange-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-orange-800">
                          Raison du blocage : {vehicle.blockageReason}
                        </span>
                      </div>
                      <p className="text-xs text-orange-700 mt-1 ml-5">{vehicle.blockageDetails}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex-shrink-0 border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">Répartition des blocages :</span>
                  <Badge variant="outline" className="bg-orange-50">Pièces: {blockageStats.pieces}</Badge>
                  <Badge variant="outline" className="bg-orange-50">Expertise: {blockageStats.expertise}</Badge>
                  <Badge variant="outline" className="bg-green-50">Technicien: {blockageStats.technicien}</Badge>
                  <Badge variant="outline" className="bg-red-50">Problèmes: {blockageStats.problemes}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600">
                    <BarChart className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        {/* Modal détail véhicule */}
        <Dialog open={showVehicleDetailModal} onOpenChange={setShowVehicleDetailModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-semibold">
                  Détails du véhicule - {selectedVehicle?.plate}
                </DialogTitle>
                <Badge className="bg-orange-100 text-karrosserie-orange">En cours</Badge>
              </div>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="flex-1 overflow-y-auto space-y-6 mt-4">
                {/* Section informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations véhicule */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Informations véhicule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modèle:</span>
                        <span className="font-medium">{selectedVehicle.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plaque:</span>
                        <span className="font-medium">{selectedVehicle.plate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Étape actuelle:</span>
                        <span className="font-medium">{selectedVehicle.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temps estimé:</span>
                        <span className="font-medium">{selectedVehicle.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prix total:</span>
                        <span className="font-medium text-orange-600">{selectedVehicle.price}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informations client */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informations client
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{selectedVehicle.client}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>06.12.34.56.78</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>client@example.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>123 Rue de la République, 75001 Paris</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progression des étapes atelier */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Progression des étapes atelier (27%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: "27%" }}></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="font-medium">Accueil & Préparation</span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-600 text-white">100%</Badge>
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="font-medium">Remplacement ou débosselage</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">60%</Badge>
                          <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      {["Préparation peinture", "Mise en peinture", "Finitions & remontage", "Clôture & livraison"].map((step, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-muted-foreground">{step}</span>
                          <Badge variant="outline">0%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Section inférieure avec 4 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assurance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="w-4 h-4" />
                        Assurance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Compagnie:</span>
                          <div className="font-medium">AXA Assurance</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">N° Sinistre:</span>
                          <div className="font-medium">SIN-2025-001234</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Expert:</span>
                          <div className="font-medium">M. Dupont</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Franchise:</span>
                          <div className="font-medium">300€</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Réparations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Settings className="w-4 h-4" />
                        Réparations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">Pare-chocs avant</div>
                              <div className="text-sm text-muted-foreground">Remplacement</div>
                            </div>
                            <span className="font-medium">450€</span>
                          </div>
                          <div className="flex justify-end">
                            <Badge className="bg-green-100 text-green-800 text-xs">Terminé</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">Aile avant droite</div>
                              <div className="text-sm text-muted-foreground">Débosselage + peinture</div>
                            </div>
                            <span className="font-medium">680€</span>
                          </div>
                          <div className="flex justify-end">
                            <Badge className="bg-orange-100 text-karrosserie-orange text-xs">En cours</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">Optique avant</div>
                              <div className="text-sm text-muted-foreground">Remplacement</div>
                            </div>
                            <span className="font-medium">220€</span>
                          </div>
                          <div className="flex justify-end">
                            <Badge variant="secondary" className="text-xs">À planifier</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pièces */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Package className="w-4 h-4" />
                        Pièces
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">Pare-chocs avant</div>
                              <div className="text-sm text-muted-foreground">PC-AV-001</div>
                            </div>
                            <span className="font-medium">180€</span>
                          </div>
                          <div className="flex justify-end">
                            <Badge className="bg-orange-100 text-orange-800 text-xs">Disponible</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">Optique avant droite</div>
                              <div className="text-sm text-muted-foreground">OPT-AV-R</div>
                            </div>
                            <span className="font-medium">95€</span>
                          </div>
                          <div className="flex justify-end">
                            <Badge variant="outline" className="text-xs">Commande</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">Peinture RAL 9003</div>
                              <div className="text-sm text-muted-foreground">PEIN-RAL</div>
                            </div>
                            <span className="font-medium">45€</span>
                          </div>
                          <div className="flex justify-end">
                            <Badge className="bg-orange-100 text-orange-800 text-xs">Disponible</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historique */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <History className="w-4 h-4" />
                        Historique
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-1 h-12 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                          <div className="flex-1">
                            <div className="font-medium">Réception véhicule</div>
                            <div className="text-sm text-muted-foreground">08/01/2025 09:00 - Martin Dubois</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-1 h-12 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                          <div className="flex-1">
                            <div className="font-medium">Début démontage pare-chocs</div>
                            <div className="text-sm text-muted-foreground">08/01/2025 10:30 - Martin Dubois</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-1 h-12 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                          <div className="flex-1">
                            <div className="font-medium">Démontage terminé</div>
                            <div className="text-sm text-muted-foreground">08/01/2025 14:00 - Martin Dubois</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-1 h-12 bg-orange-600 rounded-full flex-shrink-0 mt-1"></div>
                          <div className="flex-1">
                            <div className="font-medium">Début débosselage aile</div>
                            <div className="text-sm text-muted-foreground">09/01/2025 08:00 - Sophie Martin</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Footer avec technicien */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Technicien: {selectedVehicle.technician || "Non assigné"}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog d'ajout/modification d'employé */}
        <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Modifier l'employé" : "Ajouter un employé"}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee 
                  ? "Modifiez les informations de l'employé" 
                  : "Créez un nouveau profil employé avec ses qualifications"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Membre de l'équipe */}
              <div className="space-y-2">
                <Label htmlFor="teamMember">Membre de l'équipe <span className="text-red-500">*</span></Label>
                {editingEmployee ? (
                  // Mode modification - lecture seule
                  <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                    {teamMembers.find(member => member.id === employeeFormData.teamMemberId)?.profiles?.first_name}{' '}
                    {teamMembers.find(member => member.id === employeeFormData.teamMemberId)?.profiles?.last_name} - {' '}
                    {teamMembers.find(member => member.id === employeeFormData.teamMemberId)?.role}
                  </div>
                ) : (
                  // Mode ajout - filtrer les membres déjà utilisés
                  <Select 
                    value={employeeFormData.teamMemberId}
                    onValueChange={(value) => setEmployeeFormData(prev => ({ ...prev, teamMemberId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre de l'équipe" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-md z-50">
                      {(() => {
                        // Filtrer les membres déjà utilisés dans des employés existants
                        const usedTeamMemberIds = employees.map(emp => emp.team_member_id).filter(Boolean);
                        const availableMembers = teamMembers.filter(member => !usedTeamMemberIds.includes(member.id));
                        
                        if (availableMembers.length === 0) {
                          return (
                            <SelectItem value="no-members" disabled>
                              Tous les membres d'équipe ont déjà un profil employé
                            </SelectItem>
                          );
                        }
                        
                        return availableMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.profiles?.first_name} {member.profiles?.last_name} - {member.role}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <Label>Qualifications <span className="text-red-500">*</span> (sélectionnez une ou plusieurs)</Label>
                <div className="max-h-40 overflow-y-auto border rounded-md p-3 space-y-2">
                  {[
                    "Accueil & Préparation du dossier",
                    "Remplacement ou débosselage", 
                    "Préparation peinture",
                    "Mise en peinture",
                    "Finitions & remontage",
                    "Clôture du dossier et livraison"
                  ].map((qualification) => (
                    <div key={qualification} className="flex items-center space-x-2">
                      <Checkbox 
                        id={qualification}
                        checked={employeeFormData.qualifications.includes(qualification)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEmployeeFormData(prev => ({
                              ...prev,
                              qualifications: [...prev.qualifications, qualification]
                            }));
                          } else {
                            setEmployeeFormData(prev => ({
                              ...prev,
                              qualifications: prev.qualifications.filter(q => q !== qualification)
                            }));
                          }
                        }}
                      />
                      <Label 
                        htmlFor={qualification} 
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {qualification}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {employeeFormData.qualifications.length} qualification(s) sélectionnée(s)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEmployeeDialog(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                onClick={async () => {
                  // Validation
                  if (!employeeFormData.teamMemberId) {
                    toast({
                      title: "Erreur",
                      description: "Veuillez sélectionner un membre de l'équipe",
                      variant: "destructive"
                    });
                    return;
                  }

                  if (employeeFormData.qualifications.length === 0) {
                    toast({
                      title: "Erreur", 
                      description: "Veuillez sélectionner au moins une qualification",
                      variant: "destructive"
                    });
                    return;
                  }

                  try {
                    if (editingEmployee) {
                      // Modification
                      await updateEmployee.mutateAsync({
                        id: editingEmployee.id,
                        data: {
                          team_member_id: employeeFormData.teamMemberId,
                          qualifications: employeeFormData.qualifications
                        }
                      });
                    } else {
                      // Création
                      await createEmployee.mutateAsync({
                        team_member_id: employeeFormData.teamMemberId,
                        qualifications: employeeFormData.qualifications
                      });
                    }
                    
                    setShowEmployeeDialog(false);
                    setEmployeeFormData({
                      teamMemberId: "",
                      qualifications: []
                    });
                    setEditingEmployee(null);
                  } catch (error) {
                    // L'erreur est déjà gérée par les mutations
                  }
                }}
              >
                {editingEmployee ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Véhicule en urgence */}
        <Dialog open={showUrgentVehicleModal} onOpenChange={setShowUrgentVehicleModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajout immédiat au planning</DialogTitle>
              <DialogDescription className="mb-4">
                Ajouter un véhicule en urgence avec traitement prioritaire.
              </DialogDescription>
              <div className="flex justify-center mt-2">
                <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  URGENCE - Traitement immédiat
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Plaque d'immatriculation */}
              <div className="space-y-2">
                <Label htmlFor="licensePlate" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Plaque d'immatriculation <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="licensePlate" 
                  value={urgentVehicleFormData.licensePlate}
                  onChange={(e) => setUrgentVehicleFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                  placeholder="XX-123-XX"
                  className="uppercase"
                />
              </div>

              {/* Heure d'affectation */}
              <div className="space-y-2">
                <Label htmlFor="assignmentTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Heure d'affectation <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={urgentVehicleFormData.assignmentTime}
                  onValueChange={(value) => setUrgentVehicleFormData(prev => ({ ...prev, assignmentTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'heure" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-md z-50">
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="08:30">08:30</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="13:30">13:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="16:30">16:30</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nom et Prénom du client */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientLastName">Nom du client <span className="text-red-500">*</span></Label>
                  <Input 
                    id="clientLastName" 
                    value={urgentVehicleFormData.clientLastName}
                    onChange={(e) => setUrgentVehicleFormData(prev => ({ ...prev, clientLastName: e.target.value }))}
                    placeholder="Nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientFirstName">Prénom du client <span className="text-red-500">*</span></Label>
                  <Input 
                    id="clientFirstName" 
                    value={urgentVehicleFormData.clientFirstName}
                    onChange={(e) => setUrgentVehicleFormData(prev => ({ ...prev, clientFirstName: e.target.value }))}
                    placeholder="Prénom"
                  />
                </div>
              </div>

              {/* Employé assigné */}
              <div className="space-y-2">
                <Label htmlFor="assignedEmployee" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employé assigné <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={urgentVehicleFormData.assignedEmployee}
                  onValueChange={(value) => setUrgentVehicleFormData(prev => ({ ...prev, assignedEmployee: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-md z-50">
                    <SelectItem value="sophie">Sophie Martin</SelectItem>
                    <SelectItem value="martin">Martin Dubois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-border mt-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowUrgentVehicleModal(false)}
                disabled={false}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={false}
                className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                onClick={() => {
                  // Ici on pourrait ajouter la logique de soumission
                  setShowUrgentVehicleModal(false);
                  setUrgentVehicleFormData({
                    licensePlate: "",
                    assignmentTime: "",
                    clientFirstName: "",
                    clientLastName: "",
                    assignedEmployee: ""
                  });
                }}
              >
                Ajouter au planning
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuration des temps */}
        <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration des temps par défaut
              </DialogTitle>
              <DialogDescription>
                Définissez les temps moyens par défaut pour chaque étape du workflow
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
               {/* Accueil & Préparation */}
               <div className="space-y-2">
                 <Label htmlFor="accueil">Accueil & Préparation du dossier</Label>
                 <Input
                   id="accueil"
                   type="time"
                   value={configData.accueil}
                   onChange={(e) => setConfigData(prev => ({ ...prev, accueil: e.target.value }))}
                   className="w-24"
                 />
               </div>

               {/* Remplacement ou débosselage */}
               <div className="space-y-2">
                 <Label htmlFor="debosselage">Remplacement ou débosselage</Label>
                 <Input
                   id="debosselage"
                   type="time"
                   value={configData.debosselage}
                   onChange={(e) => setConfigData(prev => ({ ...prev, debosselage: e.target.value }))}
                   className="w-24"
                 />
               </div>

               {/* Préparation peinture */}
               <div className="space-y-2">
                 <Label htmlFor="preparation">Préparation peinture</Label>
                 <Input
                   id="preparation"
                   type="time"
                   value={configData.preparation}
                   onChange={(e) => setConfigData(prev => ({ ...prev, preparation: e.target.value }))}
                   className="w-24"
                 />
               </div>

               {/* Mise en peinture */}
               <div className="space-y-2">
                 <Label htmlFor="peinture">Mise en peinture</Label>
                 <Input
                   id="peinture"
                   type="time"
                   value={configData.peinture}
                   onChange={(e) => setConfigData(prev => ({ ...prev, peinture: e.target.value }))}
                   className="w-24"
                 />
               </div>

               {/* Finitions & remontage */}
               <div className="space-y-2">
                 <Label htmlFor="finitions">Finitions & remontage</Label>
                 <Input
                   id="finitions"
                   type="time"
                   value={configData.finitions}
                   onChange={(e) => setConfigData(prev => ({ ...prev, finitions: e.target.value }))}
                   className="w-24"
                 />
               </div>

               {/* Clôture & livraison */}
               <div className="space-y-2">
                 <Label htmlFor="cloture">Clôture & livraison</Label>
                 <Input
                   id="cloture"
                   type="time"
                   value={configData.cloture}
                   onChange={(e) => setConfigData(prev => ({ ...prev, cloture: e.target.value }))}
                   className="w-24"
                 />
               </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowConfigModal(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                onClick={async () => {
                  try {
                    if (!companyInfo?.id) {
                      toast({
                        title: "Erreur",
                        description: "Informations de l'entreprise non trouvées",
                        variant: "destructive"
                      });
                      return;
                    }

                    // Convertir les temps au format TIME PostgreSQL (HH:MM:SS)
                    const timeData = {
                      accueil_preparation_time: `${configData.accueil}:00`,
                      remplacement_debosselage_time: `${configData.debosselage}:00`,
                      preparation_peinture_time: `${configData.preparation}:00`,
                      mise_en_peinture_time: `${configData.peinture}:00`,
                      finitions_remontage_time: `${configData.finitions}:00`,
                      cloture_livraison_time: `${configData.cloture}:00`
                    };

                    const { error } = await supabase
                      .from('company_preferences')
                      .upsert([
                        {
                          company_id: companyInfo.id,
                          ...timeData
                        }
                      ], {
                        onConflict: 'company_id'
                      });

                    if (error) throw error;

                    toast({
                      title: "Configuration sauvegardée",
                      description: "Les temps par défaut ont été mis à jour avec succès"
                    });
                    setShowConfigModal(false);
                  } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    toast({
                      title: "Erreur",
                      description: "Impossible de sauvegarder la configuration",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Configuration Horaires */}
        <Dialog open={showScheduleConfigModal} onOpenChange={setShowScheduleConfigModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configuration des horaires d'ouverture</DialogTitle>
              <DialogDescription>
                Configurez les jours et heures d'ouverture de votre atelier
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {Object.entries(scheduleConfig).map(([day, config]) => {
                const dayNames = {
                  monday: "Lundi",
                  tuesday: "Mardi", 
                  wednesday: "Mercredi",
                  thursday: "Jeudi",
                  friday: "Vendredi",
                  saturday: "Samedi",
                  sunday: "Dimanche"
                };
                
                 return (
                   <div key={day} className="space-y-3 p-4 border rounded-lg">
                     <div className="flex items-center space-x-2">
                       <Checkbox
                         id={`${day}-enabled`}
                         checked={config.enabled}
                         onCheckedChange={(checked) => 
                           setScheduleConfig(prev => ({
                             ...prev,
                             [day]: { ...config, enabled: !!checked }
                           }))
                         }
                       />
                       <Label htmlFor={`${day}-enabled`} className="text-sm font-medium">
                         {dayNames[day]}
                       </Label>
                     </div>
                     
                     {config.enabled && (
                       <div className="space-y-3 pl-6">
                         <div className="flex items-center space-x-2">
                           <Checkbox
                             id={`${day}-fullday`}
                             checked={config.fullDay}
                             onCheckedChange={(checked) => 
                               setScheduleConfig(prev => ({
                                 ...prev,
                                 [day]: { ...config, fullDay: !!checked }
                               }))
                             }
                           />
                           <Label htmlFor={`${day}-fullday`} className="text-sm">
                             Journée continue
                           </Label>
                         </div>
                         
                         {config.fullDay ? (
                           <div className="flex items-center gap-2">
                             <span className="text-sm text-muted-foreground w-32">De</span>
                             <Input
                               type="time"
                               value={config.morning.start}
                               onChange={(e) => 
                                 setScheduleConfig(prev => ({
                                   ...prev,
                                   [day]: { 
                                     ...config, 
                                     morning: { ...config.morning, start: e.target.value }
                                   }
                                 }))
                               }
                               className="w-30"
                             />
                             <span className="text-muted-foreground">à</span>
                             <Input
                               type="time"
                               value={config.afternoon.end}
                               onChange={(e) => 
                                 setScheduleConfig(prev => ({
                                   ...prev,
                                   [day]: { 
                                     ...config, 
                                     afternoon: { ...config.afternoon, end: e.target.value }
                                   }
                                 }))
                               }
                               className="w-30"
                             />
                           </div>
                         ) : (
                           <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <span className="text-sm text-muted-foreground w-32">Matin</span>
                               <Input
                                 type="time"
                                 value={config.morning.start}
                                 onChange={(e) => 
                                   setScheduleConfig(prev => ({
                                     ...prev,
                                     [day]: { 
                                       ...config, 
                                       morning: { ...config.morning, start: e.target.value }
                                     }
                                   }))
                                 }
                                 className="w-30"
                               />
                               <span className="text-muted-foreground">à</span>
                               <Input
                                 type="time"
                                 value={config.morning.end}
                                 onChange={(e) => 
                                   setScheduleConfig(prev => ({
                                     ...prev,
                                     [day]: { 
                                       ...config, 
                                       morning: { ...config.morning, end: e.target.value }
                                     }
                                   }))
                                 }
                                 className="w-30"
                               />
                             </div>
                             
                             <div className="flex items-center gap-2">
                               <span className="text-sm text-muted-foreground w-32">Après-midi</span>
                               <Input
                                 type="time"
                                 value={config.afternoon.start}
                                 onChange={(e) => 
                                   setScheduleConfig(prev => ({
                                     ...prev,
                                     [day]: { 
                                       ...config, 
                                       afternoon: { ...config.afternoon, start: e.target.value }
                                     }
                                   }))
                                 }
                                 className="w-30"
                               />
                               <span className="text-muted-foreground">à</span>
                               <Input
                                 type="time"
                                 value={config.afternoon.end}
                                 onChange={(e) => 
                                   setScheduleConfig(prev => ({
                                     ...prev,
                                     [day]: { 
                                       ...config, 
                                       afternoon: { ...config.afternoon, end: e.target.value }
                                     }
                                   }))
                                 }
                                 className="w-30"
                               />
                             </div>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                 );
              })}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowScheduleConfigModal(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                onClick={async () => {
                  try {
                    if (!companyInfo?.id) {
                      toast({
                        title: "Erreur",
                        description: "Informations de l'entreprise non trouvées",
                        variant: "destructive"
                      });
                      return;
                    }

                    // Préparer les données à sauvegarder
                    const scheduleData = Object.entries(scheduleConfig).map(([day, config]) => ({
                      company_id: companyInfo.id,
                      day_of_week: day,
                      enabled: config.enabled,
                      full_day: config.fullDay,
                      morning_start: config.enabled ? `${config.morning.start}:00` : null,
                      morning_end: config.enabled ? `${config.morning.end}:00` : null,
                      afternoon_start: config.enabled ? `${config.afternoon.start}:00` : null,
                      afternoon_end: config.enabled ? `${config.afternoon.end}:00` : null
                    }));

                    // Supprimer les anciens horaires et insérer les nouveaux
                    const { error: deleteError } = await supabase
                      .from('workshop_schedule')
                      .delete()
                      .eq('company_id', companyInfo.id);

                    if (deleteError) throw deleteError;

                    const { error: insertError } = await supabase
                      .from('workshop_schedule')
                      .insert(scheduleData);

                    if (insertError) throw insertError;

                    toast({
                      title: "Configuration sauvegardée",
                      description: "Les horaires d'ouverture ont été mis à jour avec succès"
                    });
                    setShowScheduleConfigModal(false);
                  } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    toast({
                      title: "Erreur",
                      description: "Impossible de sauvegarder la configuration",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Planning;