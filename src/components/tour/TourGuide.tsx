import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useWelcomeTour } from '@/hooks/tour/useWelcomeTour';
import { WELCOME_FEATURES } from '@/config/welcomeFeatures';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Play, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TourGuide() {
  const navigate = useNavigate();
  const { state, markFeatureCompleted, setCurrentFeature } = useWelcomeTour();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [currentFeature, setCurrentFeatureData] = useState<any>(null);

  useEffect(() => {
    if (state.currentFeatureId) {
      const feature = WELCOME_FEATURES.find(f => f.id === state.currentFeatureId);
      
      if (feature) {
        setCurrentFeatureData(feature);
        
        // Convertir les TourStep en Step de react-joyride
        const joyrideSteps: Step[] = feature.tourSteps.map(step => ({
          target: step.target,
          title: step.title,
          content: step.content,
          placement: step.placement || 'auto',
          disableBeacon: true
        }));

        setSteps(joyrideSteps);
        
        // Vérifier si les éléments existent après un court délai
        setTimeout(() => {
          const firstTarget = joyrideSteps[0]?.target;
          if (typeof firstTarget === 'string') {
            const element = document.querySelector(firstTarget);
            
            if (!element) {
              // Si l'élément n'existe pas, afficher le modal explicatif
              setShowFallbackModal(true);
            } else {
              // Sinon, démarrer le tour normal
              setRun(true);
            }
          } else {
            // Si target n'est pas une string, démarrer quand même
            setRun(true);
          }
        }, 800);
      }
    }
  }, [state.currentFeatureId]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      // Tour terminé ou sauté
      setRun(false);
      
      if (state.currentFeatureId) {
        // Marquer comme complété
        markFeatureCompleted(state.currentFeatureId);
        
        // Réinitialiser l'état
        setCurrentFeature('', 0);
      }
    }
  };

  const handleCloseFallbackModal = () => {
    setShowFallbackModal(false);
    
    if (state.currentFeatureId) {
      // Marquer comme complété même si fallback
      markFeatureCompleted(state.currentFeatureId);
      
      // Réinitialiser l'état
      setCurrentFeature('', 0);
    }
  };

  return (
    <>
      {run && steps.length > 0 && (
        <Joyride
          steps={steps}
          run={run}
          continuous
          showProgress
          showSkipButton
          stepIndex={state.currentStepIndex}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: 'hsl(var(--primary))',
              zIndex: 10000,
            },
            buttonNext: {
              backgroundColor: 'hsl(var(--primary))',
            },
            buttonBack: {
              color: 'hsl(var(--primary))',
            },
          }}
          locale={{
            back: 'Retour',
            close: 'Fermer',
            last: 'Terminer',
            next: 'Suivant',
            skip: 'Passer',
          }}
        />
      )}

      {/* Modal explicatif si les éléments de la page n'existent pas */}
      <Dialog open={showFallbackModal} onOpenChange={setShowFallbackModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <AlertCircle className="h-6 w-6 text-primary" />
              {currentFeature?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {currentFeature?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Description détaillée */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                À propos de cette fonctionnalité
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getFeatureExplanation(currentFeature?.id)}
              </p>
            </div>

            {/* Étapes clés */}
            {currentFeature?.tourSteps && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Points clés à retenir
                </h4>
                <div className="grid gap-3">
                  {currentFeature.tourSteps.map((step: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm mb-1">{step.title}</h5>
                            <p className="text-sm text-muted-foreground">{step.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Actions recommandées */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Prochaines étapes recommandées
              </h4>
              <div className="grid gap-3">
                {getFeatureActions(currentFeature?.id).map((action, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.onClick}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {action.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{action.title}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCloseFallbackModal}>
              Plus tard
            </Button>
            <Button onClick={() => {
              handleCloseFallbackModal();
              const firstAction = getFeatureActions(currentFeature?.id)[0];
              if (firstAction) {
                firstAction.onClick();
              }
            }}>
              Commencer maintenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getFeatureActions(featureId: string | undefined): Array<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> {
  const actions: Record<string, Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>> = {
    'auto-reminders': [
      {
        title: 'Voir mes factures impayées',
        description: 'Accédez à la liste de vos factures en attente de paiement',
        icon: <AlertCircle className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/accounting/invoices'
      },
      {
        title: 'Configurer les relances',
        description: 'Définissez vos règles de relance automatique',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/settings/reminders'
      }
    ],
    'accounting': [
      {
        title: 'Ajouter un compte bancaire',
        description: 'Connectez votre premier compte pour synchroniser vos transactions',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/accounting'
      },
      {
        title: 'Voir le tableau de bord comptable',
        description: 'Consultez vue d\'ensemble de votre comptabilité',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/accounting/dashboard'
      }
    ],
    'expertise-import': [
      {
        title: 'Importer un rapport maintenant',
        description: 'Testez la nouvelle interface d\'importation simplifiée',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          // Trouver et cliquer sur le bouton d'import s'il existe
          const importButton = document.querySelector('.import-expertise-button') as HTMLButtonElement;
          if (importButton) {
            importButton.click();
          } else {
            window.location.href = '/documents/expertise';
          }
        }
      },
      {
        title: 'Voir mes rapports existants',
        description: 'Consultez l\'historique de vos rapports d\'expertise',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/documents/expertise'
      }
    ],
    'painting': [
      {
        title: 'Accéder au module peinture',
        description: 'Découvrez toutes les fonctionnalités de gestion peinture',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/painting'
      },
      {
        title: 'Gérer les stocks',
        description: 'Consultez et mettez à jour vos stocks de peinture',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/painting/stocks'
      }
    ],
    'registered-mail': [
      {
        title: 'Voir mes cessions de créance',
        description: 'Accédez à la liste de vos cessions',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/cessions'
      },
      {
        title: 'Envoyer un recommandé',
        description: 'Créez et envoyez une lettre recommandée',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/cessions/new'
      }
    ],
    'loan-vehicle-pv': [
      {
        title: 'Voir les véhicules de prêt',
        description: 'Consultez la liste de vos véhicules de prêt',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/fleet'
      },
      {
        title: 'Ajouter un PV',
        description: 'Documentez une nouvelle infraction',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/fleet/pv/new'
      }
    ],
    'litigation': [
      {
        title: 'Créer un dossier contentieux',
        description: 'Initiez un nouveau dossier de contentieux',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/contentieux/creation-dossier'
      },
      {
        title: 'Voir mes dossiers',
        description: 'Consultez tous vos dossiers en cours',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/contentieux'
      }
    ],
    'planning': [
      {
        title: 'Essayer le nouveau planning',
        description: 'Explorez l\'interface modernisée avec toutes les vues',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/planning'
      },
      {
        title: 'Planifier un véhicule',
        description: 'Ajoutez une nouvelle tâche au planning',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          window.location.href = '/planning';
          // Après navigation, essayer de cliquer sur l'onglet véhicules en attente
          setTimeout(() => {
            const waitingTab = document.querySelector('[value="waiting"]') as HTMLButtonElement;
            if (waitingTab) waitingTab.click();
          }, 1000);
        }
      }
    ],
    'ai-secretary': [
      {
        title: 'Voir le tableau de bord IA',
        description: 'Découvrez les alertes et suggestions intelligentes',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/ai-assistant'
      },
      {
        title: 'Configurer les alertes',
        description: 'Personnalisez les notifications que vous souhaitez recevoir',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => window.location.href = '/settings/ai'
      }
    ]
  };
  
  return actions[featureId || ''] || [
    {
      title: 'Explorer cette fonctionnalité',
      description: 'Découvrez toutes les possibilités offertes',
      icon: <Play className="h-4 w-4 text-primary" />,
      onClick: () => {}
    }
  ];
}

function getFeatureExplanation(featureId: string | undefined): string {
  const explanations: Record<string, string> = {
    'auto-reminders': 'Le système de relances automatiques vous permet de configurer des rappels automatisés pour vos factures impayées. Vous pouvez définir des seuils de délai et des modèles de messages personnalisés.',
    'accounting': 'La section comptabilité centralise toutes vos opérations financières. Vous pouvez connecter vos comptes bancaires, suivre vos transactions et générer des rapports détaillés.',
    'expertise-import': 'L\'importation de rapports d\'expertise a été considérablement améliorée avec une interface intuitive, la détection automatique des champs et une prévisualisation avant validation.',
    'painting': 'Le module peinture vous offre un suivi complet de vos opérations de peinture, la gestion des stocks de peinture, et le suivi des consommables utilisés par véhicule.',
    'registered-mail': 'Envoyez des lettres recommandées directement depuis l\'application pour vos cessions de créance. Le système génère automatiquement les documents et suit l\'envoi.',
    'loan-vehicle-pv': 'Documentez facilement les infractions sur vos véhicules de prêt. Ajoutez des photos, des descriptions et gardez un historique complet pour chaque véhicule.',
    'litigation': 'Gérez tous vos dossiers de contentieux depuis un tableau de bord centralisé. Suivez l\'avancement, les dates d\'audience et archivez les documents importants.',
    'planning': 'Le planning a été entièrement repensé avec une interface moderne, des vues multiples (étapes atelier, planning détaillé, véhicules en attente), et une meilleure organisation des tâches.',
    'ai-secretary': 'Le secrétariat IA surveille en permanence votre atelier et vous alerte sur les situations nécessitant votre attention : retards employés, véhicules bloqués, messages urgents. Il vous propose des actions concrètes pour résoudre chaque problème.'
  };
  
  return explanations[featureId || ''] || 'Cette fonctionnalité améliore considérablement votre expérience utilisateur.';
}
