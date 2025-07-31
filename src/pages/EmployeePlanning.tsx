import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, User, AlertTriangle, CheckCircle, Calendar, Eye, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeePlanning = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  const employees = {
    martin: {
      name: "Martin Dubois",
      role: "Technicien Carrosserie"
    },
    sophie: {
      name: "Sophie Martin", 
      role: "Technicienne Peinture"
    }
  };

  const employee = employees[employeeId as keyof typeof employees];

  const planningData = {
    martin: [
      {
        id: 1,
        plate: "08-148-ST",
        time: "8h-9h",
        duration: "1h estimée",
        task: "Expertise assurance",
        description: "Accueil & Préparation du dossier",
        status: "pending",
        client: "M. Dupont"
      },
      {
        id: 2,
        plate: "5C-787-AL",
        time: "9h-11h",
        duration: "2h estimées",
        task: "Accueil & Préparation du dossier",
        description: "Accueil & Préparation du dossier",
        status: "pending",
        client: "Mme Martin"
      },
      {
        id: 3,
        plate: "AB-789-XY",
        time: "11h-14h",
        duration: "3h estimées",
        task: "Débosselage léger",
        description: "Remplacement ou débosselage",
        status: "planned",
        client: "M. Bernard"
      },
      {
        id: 4,
        plate: "CD-123-ZW",
        time: "14h-15h30",
        duration: "1h30 estimées",
        task: "Contrôle qualité",
        description: "Finitions & remontage",
        status: "in_progress",
        client: "M. Petit"
      },
      {
        id: 5,
        plate: "EF-456-UV",
        time: "15h30-16h",
        duration: "30min estimées",
        task: "Livraison final",
        description: "Clôture du dossier et livraison",
        status: "pending",
        client: "Mme Blanc"
      },
      {
        id: 6,
        plate: "GH-789-ST",
        time: "16h-18h",
        duration: "2h estimées",
        task: "Débosselage léger",
        description: "Remplacement ou débosselage",
        status: "completed",
        client: "M. Roux"
      },
      {
        id: 7,
        plate: "IJ-012-KL",
        time: "18h-18h30",
        duration: "30min estimées",
        task: "Livraison final",
        description: "Clôture du dossier et livraison",
        status: "completed",
        client: "Mme Durand"
      }
    ],
    sophie: [
      {
        id: 1,
        plate: "AB-123-CD",
        time: "8h-10h",
        duration: "2h estimées",
        task: "Préparation peinture",
        description: "Préparation peinture",
        status: "in_progress",
        client: "M. Laurent"
      },
      {
        id: 2,
        plate: "FG-456-GH",
        time: "10h-14h",
        duration: "4h estimées",
        task: "Mise en peinture",
        description: "Mise en peinture",
        status: "planned",
        client: "Mme Rousseau"
      },
      {
        id: 3,
        plate: "HI-789-JK",
        time: "14h-16h",
        duration: "2h estimées",
        task: "Finitions peinture",
        description: "Finitions & remontage",
        status: "pending",
        client: "M. Leblanc"
      }
    ]
  };

  const tasks = planningData[employeeId as keyof typeof planningData] || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-100 text-karrosserie-orange">En cours</Badge>;
      case "planned":
        return <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-l-green-500";
      case "in_progress":
        return "border-l-karrosserie-orange";
      case "planned":
        return "border-l-blue-500";
      default:
        return "border-l-gray-400";
    }
  };

  const getActionButton = (status: string, taskId: number) => {
    switch (status) {
      case "completed":
        return (
          <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Button>
        );
      case "in_progress":
        return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminer
          </Button>
        );
      case "planned":
        return (
          <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
            <Play className="w-3 h-3 mr-1" />
            Planifier
          </Button>
        );
      default:
        return (
          <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
            <Play className="w-3 h-3 mr-1" />
            Planifier
          </Button>
        );
    }
  };

  if (!employee) {
    return (
      <div className="min-h-screen bg-muted/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-destructive">Employé introuvable</h1>
            <Button onClick={() => navigate('/planning')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au planning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/planning')}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Mon Planning - {employee.name}</h1>
              <p className="text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/planning')}
            size="sm"
            className="bg-karrosserie-orange text-white hover:bg-karrosserie-orange/90"
          >
            Vue Manager
          </Button>
        </div>

        {/* Planning Tasks */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className={`border-l-4 ${getStatusColor(task.status)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-karrosserie-orange">
                        {task.plate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {task.time} • {task.duration}
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="font-medium">{task.task}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Client: {task.client}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Détails
                    </Button>
                    {getActionButton(task.status, task.id)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-karrosserie-orange" />
              Notifications (2)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">Tâche planifiée pour demain</div>
                <div className="text-sm text-muted-foreground">
                  Accueil & Préparation du dossier pour le véhicule PQ-012-UV à 9h
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-karrosserie-orange border-karrosserie-orange">
                Marquer comme lu
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">Tâche terminée avec succès</div>
                <div className="text-sm text-muted-foreground">
                  Débosselage terminé pour le véhicule ST-345-UV hier à 16h30
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-karrosserie-orange border-karrosserie-orange">
                Marquer comme lu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeePlanning;