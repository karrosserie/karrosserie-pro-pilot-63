import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Wrench, Palette, Hammer, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Problem {
  id: string;
  title: string;
  solutions: string[];
}

interface StepProblems {
  step: string;
  icon: React.ReactNode;
  color: string;
  problems: Problem[];
}

const STEP_PROBLEMS: StepProblems[] = [
  {
    step: "Démontage",
    icon: <Wrench className="w-5 h-5" />,
    color: "blue",
    problems: [
      {
        id: "pieces-grippees",
        title: "Pièces grippées ou cassées (vis, clips…)",
        solutions: [
          "Utiliser dégrippant/WD40",
          "Chauffer légèrement la zone", 
          "Prévoir un stock de clips/vis universels en avance"
        ]
      },
      {
        id: "manque-outillage",
        title: "Manque d'outillage spécifique",
        solutions: [
          "Mettre en place une boîte à outils \"commune spéciale\" pour pièces sensibles",
          "Vérifier avant l'intervention le listing des outils nécessaires"
        ]
      },
      {
        id: "documentation-incomplete",
        title: "Documentation technique incomplète",
        solutions: [
          "Accès direct en ligne aux bases constructeur (type ServiceBox, ElsaWin…)",
          "Créer une fiche atelier interne avec photos à chaque démontage complexe"
        ]
      },
      {
        id: "attente-autorisation",
        title: "Attente d'autorisation/expertise",
        solutions: [
          "Anticiper validation via photos envoyées à l'expert",
          "Mettre la voiture en zone tampon pour libérer le pont"
        ]
      },
      {
        id: "pieces-perdues",
        title: "Pièces perdues (agrafes, visserie)",
        solutions: [
          "Installer un bac identifié par véhicule pour chaque démontage",
          "Étiquetage systématique des petits sachets de visserie"
        ]
      }
    ]
  },
  {
    step: "Débosselage & Ponçage",
    icon: <Hammer className="w-5 h-5" />,
    color: "orange",
    problems: [
      {
        id: "zone-mal-identifiee",
        title: "Zone mal identifiée / expertise incomplète",
        solutions: [
          "Valider avec le chef d'atelier avant lancement",
          "Prendre photos rapides pour validation instantanée"
        ]
      },
      {
        id: "acces-impossible",
        title: "Accès impossible (pas démonté)",
        solutions: [
          "Déplacer véhicule vers zone démontage",
          "Signaler immédiatement au responsable plutôt que d'attendre"
        ]
      },
      {
        id: "metal-endommage",
        title: "Métal trop endommagé",
        solutions: [
          "Passer directement commande pièce neuve après validation",
          "Ne pas immobiliser inutilement l'ouvrier"
        ]
      },
      {
        id: "outils-panne",
        title: "Outils en panne ou mal réglés",
        solutions: [
          "Avoir un jeu d'outils de secours",
          "Mise en place check-up hebdo des machines"
        ]
      },
      {
        id: "manque-consommables",
        title: "Manque de consommables (abrasifs, pâte)",
        solutions: [
          "Tenir un stock tampon atelier",
          "Responsable atelier vérifie chaque matin les consommables"
        ]
      },
      {
        id: "attente-validation",
        title: "Attente validation chef/expert",
        solutions: [
          "Utiliser messagerie interne / WhatsApp pro avec photos pour éviter les délais d'attente physique"
        ]
      }
    ]
  },
  {
    step: "Préparation peinture",
    icon: <Palette className="w-5 h-5" />,
    color: "green",
    problems: [
      {
        id: "code-couleur",
        title: "Code couleur manquant ou erroné",
        solutions: [
          "Vérifier dès réception véhicule le code",
          "Si absent : scan colorimétrique immédiat",
          "Créer une base interne de correspondance couleurs par constructeur"
        ]
      },
      {
        id: "produits-manquants",
        title: "Produits manquants ou inadaptés",
        solutions: [
          "Stock mini garanti (apprêt, diluant, durcisseur)",
          "Liste de sécurité affichée dans cabine pour vérifier avant chaque peinture"
        ]
      },
      {
        id: "pollution-surface",
        title: "Pollution surface (graisse, poussière)",
        solutions: [
          "Nettoyage systématique avant chaque étape",
          "Aspirateur + soufflette obligatoire",
          "Masquage soigné"
        ]
      },
      {
        id: "piece-pas-prete",
        title: "Pièce pas prête (ponçage insuffisant)",
        solutions: [
          "Mise en place fiche suivi \"état pièce\" validée avant entrée cabine",
          "Contrôle visuel par le préparateur et chef d'équipe"
        ]
      },
      {
        id: "masquage-incorrect",
        title: "Masquage incorrect ou oublié",
        solutions: [
          "Check-list avant peinture",
          "Coller check visuel signé par préparateur sur le pare-brise du véhicule"
        ]
      }
    ]
  },
  {
    step: "Mise en peinture",
    icon: <Palette className="w-5 h-5" />,
    color: "purple",
    problems: [
      {
        id: "defaut-cabine",
        title: "Défaut cabine (chauffage, filtration)",
        solutions: [
          "Maintenance préventive planifiée",
          "Avoir une cabine de secours ou créneaux partagés avec atelier partenaire"
        ]
      },
      {
        id: "temps-sechage",
        title: "Temps de séchage non respecté",
        solutions: [
          "Utiliser lampes infrarouges pour accélérer",
          "Contrôle avec hygromètre/thermomètre cabine"
        ]
      },
      {
        id: "produits-peinture",
        title: "Produits de peinture défaillants",
        solutions: [
          "Vérifier la date de péremption des produits",
          "Tester la compatibilité des mélanges",
          "Respecter les ratios de mélange constructeur"
        ]
      },
      {
        id: "conditions-cabine",
        title: "Mauvaises conditions en cabine",
        solutions: [
          "Contrôler température et hygrométrie avant peinture",
          "Vérifier la pression et filtration d'air",
          "Nettoyer les grilles d'aération"
        ]
      },
      {
        id: "defauts-application",
        title: "Défauts d'application (coulures, orange)",
        solutions: [
          "Ajuster la pression et distance du pistolet",
          "Contrôler la viscosité du produit",
          "Revoir la technique d'application"
        ]
      }
    ]
  }
];

interface ProblemReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskType: string;
  taskId?: string;
  vehicleInfo: {
    vehicule: string;
    marque: string;
    modele: string;
    client: string;
  };
}

export const ProblemReportModal: React.FC<ProblemReportModalProps> = ({
  isOpen,
  onClose,
  taskType,
  taskId,
  vehicleInfo
}) => {
  const { toast } = useToast();
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  // Mapper le type de tâche à l'étape correspondante
  const getStepFromTaskType = (taskType: string): StepProblems | null => {
    const taskTypeLower = taskType.toLowerCase().trim();
    
    console.log('Task type reçu:', taskType, 'Task type lower:', taskTypeLower);
    
    // Préparation peinture (vérifier en premier pour éviter confusion avec "préparation")
    if (taskTypeLower.includes('préparation peinture') || taskTypeLower === 'préparation peinture') {
      console.log('Mapping vers Préparation peinture');
      return STEP_PROBLEMS[2]; // Préparation peinture
    }
    
    // Mise en peinture et finitions
    if (taskTypeLower.includes('mise en peinture') || taskTypeLower.includes('finitions') ||
        taskTypeLower.includes('remontage') || taskTypeLower.includes('cloture') ||
        taskTypeLower.includes('clôture') || taskTypeLower.includes('livraison')) {
      console.log('Mapping vers Mise en peinture');
      return STEP_PROBLEMS[3]; // Mise en peinture
    }
    
    // Débosselage & Ponçage
    if (taskTypeLower.includes('débosselage') || taskTypeLower.includes('debosselage') || 
        taskTypeLower.includes('ponçage') || taskTypeLower.includes('poncage') ||
        taskTypeLower.includes('remplacement')) {
      console.log('Mapping vers Débosselage & Ponçage');
      return STEP_PROBLEMS[1]; // Débosselage & Ponçage
    }
    
    // Démontage et accueil (en dernier car "préparation" pourrait matcher)
    if (taskTypeLower.includes('démontage') || taskTypeLower.includes('demontage') || 
        taskTypeLower.includes('accueil') || taskTypeLower.includes('préparation du dossier')) {
      console.log('Mapping vers Démontage');
      return STEP_PROBLEMS[0]; // Démontage
    }
    
    // Par défaut, retourner la première étape
    console.log('Mapping par défaut vers Démontage');
    return STEP_PROBLEMS[0];
  };

  const currentStep = getStepFromTaskType(taskType);

  const toggleProblem = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handlePutOnWait = async () => {
    if (selectedProblems.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un problème",
        variant: "destructive",
      });
      return;
    }

    if (!taskId) {
      toast({
        title: "Erreur",
        description: "ID de tâche manquant",
        variant: "destructive",
      });
      return;
    }

    try {
      // Obtenir le titre du premier problème sélectionné
      const selectedProblem = currentStep?.problems.find(p => selectedProblems.includes(p.id));
      const waitingReason = selectedProblem?.title || "Problème signalé";

      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En attente',
          waiting_reason: waitingReason 
        })
        .eq('id', taskId);

      if (error) {
        console.error('Erreur lors de la mise en attente:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre la tâche en attente",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Tâche mise en attente",
        description: `Raison: ${waitingReason}`,
      });

      // Fermer le modal et réinitialiser
      setSelectedProblems([]);
      onClose();

    } catch (error) {
      console.error('Erreur lors de la mise en attente:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  if (!currentStep) return null;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          badge: 'bg-orange-100 text-orange-800'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          badge: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const colors = getColorClasses(currentStep.color);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
              {currentStep.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Signaler un problème</span>
                <Badge className={colors.badge}>
                  {currentStep.step}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <strong>Véhicule:</strong> {vehicleInfo.vehicule} • 
                <strong> Marque:</strong> {vehicleInfo.marque} {vehicleInfo.modele} • 
                <strong> Client:</strong> {vehicleInfo.client}
              </div>
              <div className="text-sm mt-1">
                <strong>Tâche:</strong> {taskType}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Sélectionnez le(s) problème(s) rencontré(s) pour mettre la tâche en attente:
          </div>

          <div className="grid gap-3">
            {currentStep.problems.map((problem) => (
              <Card 
                key={problem.id}
                className={`cursor-pointer transition-all ${
                  selectedProblems.includes(problem.id)
                    ? `${colors.bg} ${colors.border} border-2`
                    : 'hover:shadow-md border'
                }`}
                onClick={() => toggleProblem(problem.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-start gap-3 text-sm">
                    <div className="mt-1">
                      {selectedProblems.includes(problem.id) ? (
                        <CheckCircle className={`w-5 h-5 ${currentStep.color === 'blue' ? 'text-blue-600' : currentStep.color === 'orange' ? 'text-orange-600' : 'text-green-600'}`} />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${selectedProblems.includes(problem.id) ? colors.text : ''}`}>
                        {problem.title}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {selectedProblems.includes(problem.id) && (
                  <CardContent className="pt-0">
                    <div className="pl-8">
                      <div className="text-sm font-medium text-green-700 mb-2">
                        💡 Solutions recommandées:
                      </div>
                      <ul className="space-y-1">
                        {problem.solutions.map((solution, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span className="text-green-700">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedProblems.length} problème(s) sélectionné(s)
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handlePutOnWait}
                disabled={selectedProblems.length === 0}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Mettre en attente ({selectedProblems.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};