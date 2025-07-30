import { useState } from "react";
import { Calendar, Clock, User, Car, Euro, AlertTriangle, Wrench, Users, Cog, X, ArrowLeft, Edit, CheckCircle, BarChart, Phone, Mail, MapPin, FileText, Settings, Package, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatsCard from '@/components/dashboard/StatsCard';

const Planning = () => {
  const [activeView, setActiveView] = useState("manager");
  const [showWaitingVehiclesModal, setShowWaitingVehiclesModal] = useState(false);
  const [showVehicleDetailModal, setShowVehicleDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

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
      color: "border-l-blue-500",
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
      color: "border-l-yellow-500",
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
              variant={activeView === "manager" ? "default" : "outline"}
              onClick={() => setActiveView("manager")}
              size="sm"
            >
              Vue Manager
            </Button>
            <Button
              variant={activeView === "employee" ? "default" : "outline"}
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

          <TabsContent value="workshop" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                icon={<Clock className="h-8 w-8 text-yellow-600" />}
                iconBg="bg-yellow-100"
              />
              <StatsCard 
                title="CA en cours" 
                value={`${stats.revenue}€`}
                icon={<Euro className="h-8 w-8 text-orange-600" />}
                iconBg="bg-orange-100"
              />
            </div>

            {/* Alert */}
            <Card className="bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => setShowWaitingVehiclesModal(true)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">5 véhicules en attente</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
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
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
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

          <TabsContent value="planning">
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vue Planning</h3>
                <p className="text-muted-foreground">Interface de planning détaillée en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Planning Employés</h3>
                <p className="text-muted-foreground">Gestion des plannings individuels des employés</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Employés</h3>
                <p className="text-muted-foreground">Gestion des employés et de leurs compétences</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process">
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Process</h3>
                <p className="text-muted-foreground">Configuration des processus d'atelier</p>
              </CardContent>
            </Card>
          </TabsContent>
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
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-yellow-800">
                          Raison du blocage : {vehicle.blockageReason}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1 ml-5">{vehicle.blockageDetails}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex-shrink-0 border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">Répartition des blocages :</span>
                  <Badge variant="outline" className="bg-blue-50">Pièces: {blockageStats.pieces}</Badge>
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
                  Détail du véhicule - {selectedVehicle?.plate}
                </DialogTitle>
                <Badge className="bg-orange-600 text-white">En cours</Badge>
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
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Pare-chocs avant</div>
                            <div className="text-sm text-muted-foreground">Remplacement</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">450€</span>
                            <Badge className="bg-green-600 text-white text-xs">Terminé</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Aile avant droite</div>
                            <div className="text-sm text-muted-foreground">Débosselage + peinture</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">680€</span>
                            <Badge className="bg-orange-600 text-white text-xs">En cours</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Optique avant</div>
                            <div className="text-sm text-muted-foreground">Remplacement</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">220€</span>
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
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Pare-chocs avant</div>
                            <div className="text-sm text-muted-foreground">PC-AV-001</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">180€</span>
                            <Badge className="bg-yellow-600 text-white text-xs">Disponible</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Optique avant droite</div>
                            <div className="text-sm text-muted-foreground">OPT-AV-R</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">95€</span>
                            <Badge variant="outline" className="text-xs">Commande</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">Peinture RAL 9003</div>
                            <div className="text-sm text-muted-foreground">PEIN-RAL</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">45€</span>
                            <Badge className="bg-yellow-600 text-white text-xs">Disponible</Badge>
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
      </div>
    </div>
  );
};

export default Planning;