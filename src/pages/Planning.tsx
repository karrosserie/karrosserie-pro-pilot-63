import { useState } from "react";
import { Calendar, Clock, User, Car, Euro, AlertTriangle, Wrench, Users, Cog, X, ArrowLeft, Edit, CheckCircle, BarChart, Phone, Mail, MapPin, FileText, Settings, Package, History, Pencil, Trash } from "lucide-react";
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

const Planning = () => {
  const [activeView, setActiveView] = useState("manager");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeProcessStep, setActiveProcessStep] = useState("accueil");
  const [showWaitingVehiclesModal, setShowWaitingVehiclesModal] = useState(false);
  const [showVehicleDetailModal, setShowVehicleDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualifications: [] as string[]
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

  const workflowSteps = [
    {
      title: "Accueil & Préparation du dossier",
      count: 2,
      color: "border-l-karrosserie-orange",
      vehicles: [
        {
          brand: "Citroën C4",
          plate: "EZ-787-KL",
          client: "M. Durand",
          price: "800€",
          duration: "0.5h",
          status: "Devis en cours",
          technician: "Martin Dubois",
          inProgress: true
        },
        {
          brand: "Mercedes Classe C",
          plate: "QR-345-ST",
          client: "Mme Leclerc",
          price: "400€",
          duration: "1h",
          status: "Expertise assurance",
          technician: null,
          inProgress: false
        }
      ]
    },
    {
      title: "Remplacement ou débosselage",
      count: 2,
      color: "border-l-green-500",
      vehicles: [
        {
          brand: "Audi A4",
          plate: "VS-901-AB",
          client: "M. Bernard",
          price: "520€",
          duration: "2h",
          status: "Débosselage portière",
          technician: "Sophie Martin",
          inProgress: true
        },
        {
          brand: "BMW Série 1",
          plate: "HT-556-GH",
          client: "M. Rousseau",
          price: "950€",
          duration: "3h",
          status: "Remplacement pare-chocs",
          technician: null,
          inProgress: false
        }
      ]
    },
    {
      title: "Préparation peinture",
      count: 1,
      color: "border-l-orange-500",
      vehicles: [
        {
          brand: "Peugeot 308",
          plate: "AB-789-XY",
          client: "Mme Moreau",
          price: "680€",
          duration: "2.5h",
          status: "Ponçage aile avant",
          technician: "Sophie Martin",
          inProgress: true
        }
      ]
    },
    {
      title: "Mise en peinture",
      count: 1,
      color: "border-l-orange-500",
      vehicles: [
        {
          brand: "Renault Clio",
          plate: "CD-123-ZW",
          client: "M. Petit",
          price: "1200€",
          duration: "4h",
          status: "Application base",
          technician: "Sophie Martin",
          inProgress: true
        }
      ]
    },
    {
      title: "Finitions & remontage",
      count: 1,
      color: "border-l-purple-500",
      vehicles: [
        {
          brand: "Volkswagen Golf",
          plate: "EF-456-UV",
          client: "Mme Blanc",
          price: "350€",
          duration: "1.5h",
          status: "Polissage final",
          technician: "Martin Dubois",
          inProgress: true
        }
      ]
    },
    {
      title: "Clôture du dossier et livraison",
      count: 1,
      color: "border-l-red-500",
      vehicles: [
        {
          brand: "Ford Focus",
          plate: "GH-789-ST",
          client: "M. Roux",
          price: "80€",
          duration: "0.5h",
          status: "Contrôle qualité",
          technician: "Martin Dubois",
          inProgress: true
        }
      ]
    }
  ];

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
              variant={activeView === "manager" ? "validation" : "outline"}
              onClick={() => {
                setActiveView("manager");
                setSelectedEmployee(null);
              }}
              size="sm"
            >
              Vue Manager
            </Button>
            <Button
              variant={activeView === "employee" ? "validation" : "outline"}
              onClick={() => setActiveView("employee")}
              size="sm"
            >
              Vue Employé
            </Button>
            <Button variant="destructive" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Véhicule Urgence
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
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

          {/* Vue Employé - Sélection du profil */}
          {activeView === "employee" && !selectedEmployee && (
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-2xl">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold">Sélectionnez votre profil employé</h2>
                      <p className="text-muted-foreground">
                        Choisissez un employé dans le sélecteur ci-dessous pour accéder à son planning personnel
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <Card 
                        className="p-6 cursor-pointer hover:shadow-md transition-all border-2 hover:border-karrosserie-orange/50"
                        onClick={() => setSelectedEmployee({ name: "Martin Dubois", id: "martin" })}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 bg-karrosserie-orange/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-karrosserie-orange" />
                          </div>
                          <span className="font-medium text-lg">Martin Dubois</span>
                        </div>
                      </Card>

                      <Card 
                        className="p-6 cursor-pointer hover:shadow-md transition-all border-2 hover:border-karrosserie-orange/50"
                        onClick={() => setSelectedEmployee({ name: "Sophie Martin", id: "sophie" })}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 bg-karrosserie-orange/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-karrosserie-orange" />
                          </div>
                          <span className="font-medium text-lg">Sophie Martin</span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vue Employé - Planning personnel */}
          {activeView === "employee" && selectedEmployee && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedEmployee(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la sélection
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-karrosserie-orange/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-karrosserie-orange" />
                    </div>
                    <h2 className="text-xl font-semibold">Planning de {selectedEmployee.name}</h2>
                  </div>
                </div>
              </div>

              {/* Planning employé simplifié */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map((day, index) => (
                  <Card key={day}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-karrosserie-orange">{day}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmployee.id === "martin" ? 
                          (index === 0 ? "2 tâche(s)" : index === 4 ? "3 tâche(s)" : "1 tâche") :
                          (index === 1 ? "2 tâche(s)" : index === 4 ? "1 tâche" : "1 tâche")
                        }
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedEmployee.id === "martin" && index === 0 && (
                        <>
                          <Card className="border-l-4 border-l-karrosserie-orange p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-karrosserie-orange">
                                <Clock className="w-3 h-3" />
                                9h-10h
                              </div>
                              <div className="font-semibold text-sm">EZ-787-KL</div>
                              <div className="text-xs text-muted-foreground">Accueil & Préparation</div>
                              <Badge className="bg-orange-100 text-karrosserie-orange text-xs">En cours</Badge>
                            </div>
                          </Card>
                          <Card className="border-l-4 border-l-green-500 p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <Clock className="w-3 h-3" />
                                14h-16h
                              </div>
                              <div className="font-semibold text-sm">EZ-787-KL</div>
                              <div className="text-xs text-muted-foreground">Débosselage léger</div>
                              <Badge className="bg-green-100 text-green-800 text-xs">Planifié</Badge>
                            </div>
                          </Card>
                        </>
                      )}
                      {selectedEmployee.id === "sophie" && index === 1 && (
                        <>
                          <Card className="border-l-4 border-l-karrosserie-orange p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-karrosserie-orange">
                                <Clock className="w-3 h-3" />
                                8h-10h
                              </div>
                              <div className="font-semibold text-sm">HT-556-GH</div>
                              <div className="text-xs text-muted-foreground">Préparation peinture</div>
                              <Badge className="bg-orange-100 text-karrosserie-orange text-xs">En cours</Badge>
                            </div>
                          </Card>
                          <Card className="border-l-4 border-l-red-500 p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-red-600">
                                <Clock className="w-3 h-3" />
                                14h-17h
                              </div>
                              <div className="font-semibold text-sm">CD-123-ZW</div>
                              <div className="text-xs text-muted-foreground">Mise en peinture</div>
                              <Badge className="bg-red-100 text-red-800 text-xs">Planifié</Badge>
                            </div>
                          </Card>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeView === "manager" && (
            <>
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
                        <Card key={vehicleIndex} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowVehicleDetailModal(true);
                        }}>
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{vehicle.brand}</h4>
                                <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                                <p className="text-sm text-muted-foreground">{vehicle.client}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600">{vehicle.price}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {vehicle.duration}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">{vehicle.status}</div>
                            
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
                                <span className="text-sm text-muted-foreground">À planifier</span>
                              )}
                              
                              {!vehicle.inProgress && (
                                <Button size="sm" variant="outline">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Planifier
                                </Button>
                              )}
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
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Planning détaillé</h3>
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
            <div className="space-y-6">
              {/* En-tête avec bouton d'ajout */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestion des Employés</h2>
                  <p className="text-gray-600 mt-1">Créer et gérer les profils avec leurs qualifications</p>
                </div>
                <Button 
                  className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
                  onClick={() => {
                    setEditingEmployee(null);
                    setEmployeeFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      qualifications: []
                    });
                    setShowEmployeeDialog(true);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Ajouter un employé
                </Button>
              </div>


              {/* Liste des employés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Martin Dubois */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Martin Dubois</h3>
                        <p className="text-sm text-gray-600">martin.dubois@carrosserie.fr</p>
                        <p className="text-sm text-gray-600">06.12.34.56.78</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingEmployee({
                              fullName: "Martin Dubois",
                              email: "martin.dubois@carrosserie.fr",
                              phone: "06.12.34.56.78",
                              qualifications: ["Accueil & Préparation du dossier", "Remplacement ou débosselage", "Finitions & remontage"]
                            });
                            setEmployeeFormData({
                              fullName: "Martin Dubois",
                              email: "martin.dubois@carrosserie.fr",
                              phone: "06.12.34.56.78",
                              qualifications: ["Accueil & Préparation du dossier", "Remplacement ou débosselage", "Finitions & remontage"]
                            });
                            setShowEmployeeDialog(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Qualifications :</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                          Accueil & Préparation du dossier
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs">
                          Remplacement ou débosselage
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-200 text-xs">
                          Finitions & remontage
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-200 text-xs">
                          Clôture du dossier et livraison
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sophie Martin */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Sophie Martin</h3>
                        <p className="text-sm text-gray-600">sophie.martin@carrosserie.fr</p>
                        <p className="text-sm text-gray-600">06.23.45.67.89</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingEmployee({
                              fullName: "Sophie Martin",
                              email: "sophie.martin@carrosserie.fr",
                              phone: "06.23.45.67.89",
                              qualifications: ["Préparation peinture", "Mise en peinture", "Finitions & remontage"]
                            });
                            setEmployeeFormData({
                              fullName: "Sophie Martin",
                              email: "sophie.martin@carrosserie.fr",
                              phone: "06.23.45.67.89",
                              qualifications: ["Préparation peinture", "Mise en peinture", "Finitions & remontage"]
                            });
                            setShowEmployeeDialog(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Qualifications :</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-orange-100 text-orange-800 border border-orange-200 text-xs">
                          Préparation peinture
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs">
                          Mise en peinture
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800 border border-gray-200 text-xs">
                          Finitions & remontage
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Catégorie de Sinistre</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Temps Total</span>
                              <span className="text-muted-foreground">Durée Calendaire</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Micro rayure/retouche</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">2-4 heures</span>
                              <span className="text-muted-foreground">1 jour</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">6-12 heures</span>
                              <span className="text-muted-foreground">1-2 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">12-20 heures</span>
                              <span className="text-muted-foreground">2-3 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre important (3+ éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">20-40 heures</span>
                              <span className="text-muted-foreground">3-7 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gros sinistre (structure touchée)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">40-80 heures</span>
                              <span className="text-muted-foreground">1-3 semaines</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Sinistre majeur (reconstruction)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">80-200 heures</span>
                              <span className="text-muted-foreground">3-8 semaines</span>
                            </div>
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
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Attente pièces</div>
                            <div className="text-2xl font-bold text-orange-600">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules salon constructeur/modèle</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Expertise assurance</div>
                            <div className="text-2xl font-bold text-orange-600">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-orange-600">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-orange-600">+20-100%</div>
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
                  <Card className="border-l-4 border-l-karrosserie-orange">
                      <CardHeader>
                        <CardTitle className="text-lg">REMPLACEMENT OU DÉBOSSELAGE</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <div className="font-medium">Petit impact (grêle, parking)</div>
                              <div className="text-sm text-muted-foreground">Impact débosselage sans peinture</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">30 min - 1h</Badge>
                          </div>
                          
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <div className="font-medium">Bosse moyenne</div>
                              <div className="text-sm text-muted-foreground">Débosselage traditionnel ou à la ventouse</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">1-3 heures</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <div className="font-medium">Grosse déformation</div>
                              <div className="text-sm text-muted-foreground">Marteaux, planage, multiples passes</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">3-6 heures</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <div className="font-medium">Pare-chocs avant/arrière</div>
                              <div className="text-sm text-muted-foreground">Démontage, préparation, montage</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">2-4 heures</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div>
                              <div className="font-medium">Aile avant</div>
                              <div className="text-sm text-muted-foreground">Soudure nécessaire</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-karrosserie-orange">3-5 heures</Badge>
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
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Attente pièces</div>
                            <div className="text-2xl font-bold text-orange-600">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules salon constructeur/modèle</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Expertise assurance</div>
                            <div className="text-2xl font-bold text-orange-600">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-orange-600">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-orange-600">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
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
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Catégorie de Sinistre</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Temps Total</span>
                              <span className="text-muted-foreground">Durée Calendaire</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Micro rayure/retouche</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">2-4 heures</span>
                              <span className="text-muted-foreground">1 jour</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">6-12 heures</span>
                              <span className="text-muted-foreground">1-2 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">12-20 heures</span>
                              <span className="text-muted-foreground">2-3 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre important (3+ éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">20-40 heures</span>
                              <span className="text-muted-foreground">3-7 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gros sinistre (structure touchée)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">40-80 heures</span>
                              <span className="text-muted-foreground">1-3 semaines</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Sinistre majeur (reconstruction)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-karrosserie-orange font-medium">80-200 heures</span>
                              <span className="text-muted-foreground">3-8 semaines</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* PRÉPARATION PEINTURE */}
              {activeProcessStep === "preparation" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
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
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart className="w-4 h-4" />
                          Récapitulatif par Type de Sinistre
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Catégorie de Sinistre</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Temps Total</span>
                              <span className="text-muted-foreground">Durée Calendaire</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Micro rayure/retouche</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">2-4 heures</span>
                              <span className="text-muted-foreground">1 jour</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">6-12 heures</span>
                              <span className="text-muted-foreground">1-2 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">12-20 heures</span>
                              <span className="text-muted-foreground">2-3 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre important (3+ éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">20-40 heures</span>
                              <span className="text-muted-foreground">3-7 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gros sinistre (structure touchée)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">40-80 heures</span>
                              <span className="text-muted-foreground">1-3 semaines</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Sinistre majeur (reconstruction)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">80-200 heures</span>
                              <span className="text-muted-foreground">3-8 semaines</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'Allongement des Délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Attente pièces</div>
                            <div className="text-2xl font-bold text-orange-600">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules salon constructeur/modèle</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Expertise assurance</div>
                            <div className="text-2xl font-bold text-orange-600">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-orange-600">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-orange-600">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* MISE EN PEINTURE */}
              {activeProcessStep === "peinture" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border-l-4 border-l-red-500">
                      <CardHeader>
                        <CardTitle className="text-lg">MISE EN PEINTURE</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                              <div className="font-medium">Retouche au pinceau</div>
                              <div className="text-sm text-muted-foreground">Séchage rapide</div>
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
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart className="w-4 h-4" />
                          Récapitulatif par Type de Sinistre
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Catégorie de Sinistre</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Temps Total</span>
                              <span className="text-muted-foreground">Durée Calendaire</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Micro rayure/retouche</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">2-4 heures</span>
                              <span className="text-muted-foreground">1 jour</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">6-12 heures</span>
                              <span className="text-muted-foreground">1-2 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">12-20 heures</span>
                              <span className="text-muted-foreground">2-3 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre important (3+ éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">20-40 heures</span>
                              <span className="text-muted-foreground">3-7 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gros sinistre (structure touchée)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">40-80 heures</span>
                              <span className="text-muted-foreground">1-3 semaines</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Sinistre majeur (reconstruction)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">80-200 heures</span>
                              <span className="text-muted-foreground">3-8 semaines</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'Allongement des Délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Attente pièces</div>
                            <div className="text-2xl font-bold text-orange-600">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules salon constructeur/modèle</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Expertise assurance</div>
                            <div className="text-2xl font-bold text-orange-600">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-orange-600">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-orange-600">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* FINITIONS & REMONTAGE */}
              {activeProcessStep === "finitions" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
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
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart className="w-4 h-4" />
                          Récapitulatif par Type de Sinistre
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Catégorie de Sinistre</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Temps Total</span>
                              <span className="text-muted-foreground">Durée Calendaire</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Micro rayure/retouche</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">2-4 heures</span>
                              <span className="text-muted-foreground">1 jour</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">6-12 heures</span>
                              <span className="text-muted-foreground">1-2 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">12-20 heures</span>
                              <span className="text-muted-foreground">2-3 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre important (3+ éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">20-40 heures</span>
                              <span className="text-muted-foreground">3-7 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gros sinistre (structure touchée)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">40-80 heures</span>
                              <span className="text-muted-foreground">1-3 semaines</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Sinistre majeur (reconstruction)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">80-200 heures</span>
                              <span className="text-muted-foreground">3-8 semaines</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'Allongement des Délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Attente pièces</div>
                            <div className="text-2xl font-bold text-orange-600">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules salon constructeur/modèle</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Expertise assurance</div>
                            <div className="text-2xl font-bold text-orange-600">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-orange-600">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-orange-600">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* CLÔTURE & LIVRAISON */}
              {activeProcessStep === "cloture" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border-l-4 border-l-gray-500">
                      <CardHeader>
                        <CardTitle className="text-lg">CLÔTURE & LIVRAISON</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">Livraison simple</div>
                              <div className="text-sm text-muted-foreground">Nettoyage, contrôle cité</div>
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">15-30 min</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">Livraison avec explications</div>
                              <div className="text-sm text-muted-foreground">Tour du véhicule, conseils entretien</div>
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">30-45 min</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">Formalités assurance</div>
                              <div className="text-sm text-muted-foreground">Signatures, photos finales</div>
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">+15-30 min</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart className="w-4 h-4" />
                          Récapitulatif par Type de Sinistre
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Catégorie de Sinistre</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Temps Total</span>
                              <span className="text-muted-foreground">Durée Calendaire</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Micro rayure/retouche</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">2-4 heures</span>
                              <span className="text-muted-foreground">1 jour</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre léger (pare-chocs, rayures)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">6-12 heures</span>
                              <span className="text-muted-foreground">1-2 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre moyen (1-2 éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">12-20 heures</span>
                              <span className="text-muted-foreground">2-3 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Sinistre important (3+ éléments)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">20-40 heures</span>
                              <span className="text-muted-foreground">3-7 jours</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Gros sinistre (structure touchée)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">40-80 heures</span>
                              <span className="text-muted-foreground">1-3 semaines</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Sinistre majeur (reconstruction)</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-blue-600 font-medium">80-200 heures</span>
                              <span className="text-muted-foreground">3-8 semaines</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <AlertTriangle className="w-4 h-4" />
                          Facteurs d'Allongement des Délais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Attente pièces</div>
                            <div className="text-2xl font-bold text-orange-600">+2-15 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules salon constructeur/modèle</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Expertise assurance</div>
                            <div className="text-2xl font-bold text-orange-600">+1-5 jours</div>
                            <div className="text-xs text-muted-foreground">Rendez-vous expert</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Pièces sur commande</div>
                            <div className="text-2xl font-bold text-orange-600">+3-30 jours</div>
                            <div className="text-xs text-muted-foreground">Véhicules anciens/rares</div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="font-medium text-orange-600">Problèmes découverts</div>
                            <div className="text-2xl font-bold text-orange-600">+20-100%</div>
                            <div className="text-xs text-muted-foreground">Dégâts cachés révélés</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
            </>
          )}
        </Tabs>

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
              {/* Nom complet */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet <span className="text-red-500">*</span></Label>
                <Input 
                  id="fullName" 
                  value={employeeFormData.fullName}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Martin Dubois"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input 
                  id="email" 
                  type="email"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="martin.dubois@carrosserie.fr"
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={employeeFormData.phone}
                  onChange={(e) => setEmployeeFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="06.12.34.56.78"
                />
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
                onClick={() => {
                  // Handle form submission
                  console.log("Employee data:", employeeFormData);
                  setShowEmployeeDialog(false);
                }}
              >
                {editingEmployee ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Planning;