import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useWelcomeTour } from '@/hooks/tour/useWelcomeTour';
import { WELCOME_FEATURES } from '@/config/welcomeFeatures';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function TourGuide() {
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <AlertCircle className="h-6 w-6 text-primary" />
              {currentFeature?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {currentFeature?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📋 À propos de cette fonctionnalité</h4>
              <p className="text-sm text-muted-foreground">
                {getFeatureExplanation(currentFeature?.id)}
              </p>
            </div>

            {currentFeature?.tourSteps && (
              <div className="space-y-3">
                <h4 className="font-semibold">✨ Points clés</h4>
                {currentFeature.tourSteps.map((step: any, index: number) => (
                  <div key={index} className="border-l-2 border-primary pl-4 py-2">
                    <h5 className="font-medium text-sm">{step.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{step.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleCloseFallbackModal}>
              J'ai compris
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
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
