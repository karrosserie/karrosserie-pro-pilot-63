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

  const handleNextFeature = () => {
    if (!currentFeature) return;
    
    // Trouver l'index de la fonctionnalité actuelle
    const currentIndex = WELCOME_FEATURES.findIndex(f => f.id === currentFeature.id);
    
    // S'il y a une fonctionnalité suivante
    if (currentIndex !== -1 && currentIndex < WELCOME_FEATURES.length - 1) {
      const nextFeature = WELCOME_FEATURES[currentIndex + 1];
      
      // Marquer l'actuelle comme complétée
      markFeatureCompleted(currentFeature.id);
      
      // Fermer le modal
      setShowFallbackModal(false);
      
      // Naviguer vers la fonctionnalité suivante
      setCurrentFeature(nextFeature.id, 0);
      navigate(nextFeature.route);
    } else {
      // C'était la dernière fonctionnalité
      handleCloseFallbackModal();
      navigate('/');
    }
  };

  const handlePreviousFeature = () => {
    if (!currentFeature) return;
    
    // Trouver l'index de la fonctionnalité actuelle
    const currentIndex = WELCOME_FEATURES.findIndex(f => f.id === currentFeature.id);
    
    // S'il y a une fonctionnalité précédente
    if (currentIndex > 0) {
      const previousFeature = WELCOME_FEATURES[currentIndex - 1];
      
      // Fermer le modal
      setShowFallbackModal(false);
      
      // Naviguer vers la fonctionnalité précédente
      setCurrentFeature(previousFeature.id, 0);
      navigate(previousFeature.route);
    }
  };

  const getCurrentFeatureIndex = () => {
    if (!currentFeature) return { current: 0, total: 0 };
    const currentIndex = WELCOME_FEATURES.findIndex(f => f.id === currentFeature.id);
    return {
      current: currentIndex + 1,
      total: WELCOME_FEATURES.length
    };
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

      {/* Bouton flottant pour naviguer dans le parcours */}
      {state.currentFeatureId && !showFallbackModal && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="bg-background border border-border rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm font-medium">
              Étape {getCurrentFeatureIndex().current} / {getCurrentFeatureIndex().total}
            </p>
          </div>
          <div className="flex gap-2">
            {getCurrentFeatureIndex().current > 1 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePreviousFeature}
                className="shadow-lg"
              >
                ← Précédent
              </Button>
            )}
            <Button
              size="lg"
              onClick={handleNextFeature}
              className="shadow-lg"
            >
              {getCurrentFeatureIndex().current === getCurrentFeatureIndex().total 
                ? 'Terminer le parcours' 
                : 'Étape suivante →'}
            </Button>
          </div>
        </div>
      )}

      {/* Modal explicatif si les éléments de la page n'existent pas */}
      <Dialog open={showFallbackModal} onOpenChange={setShowFallbackModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <AlertCircle className="h-6 w-6 text-primary" />
                {currentFeature?.title}
              </DialogTitle>
              <div className="text-sm text-muted-foreground">
                {getCurrentFeatureIndex().current} / {getCurrentFeatureIndex().total}
              </div>
            </div>
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
                Actions à réaliser
              </h4>
              <div className="grid gap-3">
                {getFeatureActions(currentFeature?.id, navigate, setShowFallbackModal).map((action, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50" onClick={action.onClick}>
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

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              <Button 
                variant="outline" 
                onClick={handlePreviousFeature}
                disabled={getCurrentFeatureIndex().current === 1}
                className="flex-1"
              >
                ← Précédent
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCloseFallbackModal}
                className="flex-1"
              >
                Plus tard
              </Button>
            </div>
            <div className="flex gap-2 flex-1">
              <Button 
                onClick={() => {
                  const firstAction = getFeatureActions(currentFeature?.id, navigate, setShowFallbackModal)[0];
                  if (firstAction) {
                    firstAction.onClick();
                  }
                }}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Essayer maintenant
              </Button>
              <Button 
                onClick={handleNextFeature}
                className="flex-1"
              >
                {getCurrentFeatureIndex().current === getCurrentFeatureIndex().total ? 'Terminer' : 'Suivant →'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getFeatureActions(
  featureId: string | undefined,
  navigate: ReturnType<typeof useNavigate>,
  setShowFallbackModal: (show: boolean) => void
): Array<{
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
        title: 'Configurer les relances automatiques',
        description: 'Accédez aux paramètres de relance IA',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/settings?tab=relance-ia');
        }
      },
      {
        title: 'Voir mes paramètres',
        description: 'Gérez tous vos paramètres de relance',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/settings?tab=relance-ia');
        }
      }
    ],
    'accounting': [
      {
        title: 'Ajouter mon premier compte',
        description: 'Accédez à la gestion des comptes bancaires',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/payments/management');
          // Activer l'onglet comptes et ouvrir le dialog de création
          setTimeout(() => {
            // Cliquer sur la carte "Comptes actifs" pour activer l'onglet
            const accountsCard = Array.from(document.querySelectorAll('.cursor-pointer')).find(
              el => el.textContent?.includes('Comptes actifs')
            ) as HTMLElement;
            if (accountsCard) {
              accountsCard.click();
              // Attendre que l'onglet soit activé puis cliquer sur le bouton d'ajout
              setTimeout(() => {
                const addButton = document.querySelector('[data-action="create-account"]') as HTMLButtonElement;
                if (addButton) {
                  addButton.click();
                }
              }, 500);
            }
          }, 1000);
        }
      },
      {
        title: 'Voir mes comptes',
        description: 'Consultez la liste de vos comptes bancaires',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/payments/management');
          // Activer l'onglet comptes
          setTimeout(() => {
            const accountsCard = Array.from(document.querySelectorAll('.cursor-pointer')).find(
              el => el.textContent?.includes('Comptes actifs')
            ) as HTMLElement;
            if (accountsCard) {
              accountsCard.click();
            }
          }, 1000);
        }
      }
    ],
    'expertise-import': [
      {
        title: 'Importer mon premier rapport',
        description: 'Accédez à la page des rapports d\'expertise',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/documents/expertise');
        }
      },
      {
        title: 'Voir mes rapports',
        description: 'Accédez à l\'historique de vos rapports',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/documents/expertise');
        }
      }
    ],
    'painting': [
      {
        title: 'Accéder au module peinture',
        description: 'Découvrez les fonctionnalités de gestion peinture',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/painting');
        }
      },
      {
        title: 'Explorer le module',
        description: 'Découvrez toutes les fonctionnalités',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/painting');
        }
      }
    ],
    'registered-mail': [
      {
        title: 'Gérer les cessions de créance',
        description: 'Accédez à vos cessions et envoyez des recommandés',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/cessions');
        }
      },
      {
        title: 'Voir mes cessions',
        description: 'Liste de toutes vos cessions de créance',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/cessions');
        }
      }
    ],
    'loan-vehicle-pv': [
      {
        title: 'Gérer les véhicules de prêt',
        description: 'Accédez à la gestion de votre flotte',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/fleet');
        }
      },
      {
        title: 'Voir ma flotte',
        description: 'Consultez tous vos véhicules',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/fleet');
        }
      }
    ],
    'litigation': [
      {
        title: 'Créer un dossier contentieux',
        description: 'Accédez à la création de dossier',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/contentieux/creation-dossier');
        }
      },
      {
        title: 'Voir mes dossiers',
        description: 'Consultez vos dossiers de contentieux',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/contentieux/creation-dossier');
        }
      }
    ],
    'planning': [
      {
        title: 'Explorer le nouveau planning',
        description: 'Découvrez l\'interface modernisée',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/planning');
        }
      },
      {
        title: 'Voir les véhicules en attente',
        description: 'Accédez aux véhicules à planifier',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/planning');
        }
      }
    ],
    'ai-secretary': [
      {
        title: 'Découvrir Mission Control',
        description: 'Consultez le tableau de bord intelligent',
        icon: <Play className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/ai-assistant');
        }
      },
      {
        title: 'Explorer Mission Control',
        description: 'Découvrez toutes les capacités de l\'IA',
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        onClick: () => {
          setShowFallbackModal(false);
          navigate('/ai-assistant');
        }
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
