import { useState } from "react";
import { Calendar, Clock, User, Car, Euro, AlertTriangle, Wrench, Users, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Planning = () => {
  const [activeView, setActiveView] = useState("manager");

  const stats = {
    vehicles: 8,
    completed: 0,
    waiting: 5,
    revenue: 18700
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Planning Atelier</h1>
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
          <TabsList className="grid w-full grid-cols-5">
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
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.vehicles}</div>
                  <div className="text-sm text-muted-foreground">VÉHICULES</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-muted-foreground">TERMINÉS</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
                  <div className="text-sm text-muted-foreground">EN ATTENTE</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.revenue}€</div>
                  <div className="text-sm text-muted-foreground">CA EN COURS</div>
                </CardContent>
              </Card>
            </div>

            {/* Alert */}
            <Card className="bg-yellow-50 border-yellow-200">
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
                        <Card key={vehicleIndex} className="p-4">
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
      </div>
    </div>
  );
};

export default Planning;