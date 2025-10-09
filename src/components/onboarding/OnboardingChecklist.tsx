import React from 'react';
import { useOnboarding } from '@/hooks/onboarding/useOnboarding';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const stepLabels = {
  // Tunnel 1
  profileCompleted: 'Profil complété',
  companySirenCompleted: 'SIREN validé',
  addressValidated: 'Adresse confirmée',
  logoAdded: 'Logo ajouté',
  employeesAdded: 'Employé(s) ajouté(s)',
  
  // Tunnel 2
  reportImported: 'Rapport importé',
  automaticDigitization: 'Numérisation automatique',
  quoteToRepairOrder: 'Devis → Ordre de réparation',
  sentForSignature: 'Envoyé pour signature',
  orderToInvoice: 'Ordre → Facture',
  addedToPlanning: 'Ajouté au planning',
  assignmentOfClaimsCreated: 'Cession de créance',
  paintWeighingDone: 'Pesée de peinture',
  
  // Tunnel 3
  fleetVehicleAdded: 'Véhicule de prêt ajouté',
  vehicleLoanCreated: 'Prêt effectué',
  vehicleReturnCompleted: 'Retour effectué',
  violationAdded: 'Contravention ajoutée',
  antaiDenunciationGenerated: 'Dénonciation ANTAI',
};

export const OnboardingChecklist: React.FC = () => {
  const { state, getTunnelProgress } = useOnboarding();

  if (!state) return null;

  const renderTunnelSteps = (tunnel: 'tunnel1' | 'tunnel2' | 'tunnel3') => {
    const tunnelSteps = state[tunnel] as any;
    const progress = getTunnelProgress(tunnel);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {progress.completed} sur {progress.total} complétées
          </p>
        </div>

        <div className="space-y-2">
          {Object.entries(tunnelSteps).map(([stepKey, step]: [string, any]) => (
            <div
              key={stepKey}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              )}
              
              <div className="flex-1 space-y-1">
                <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stepLabels[stepKey as keyof typeof stepLabels] || stepKey}
                </p>
                
                {step.completedAt && (
                  <p className="text-xs text-muted-foreground">
                    Complété le {new Date(step.completedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Guide d'onboarding</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Suivez ces étapes pour configurer complètement votre carrosserie
          </p>
        </div>

        <Tabs defaultValue="tunnel1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tunnel1">Profil</TabsTrigger>
            <TabsTrigger value="tunnel2">Workflow</TabsTrigger>
            <TabsTrigger value="tunnel3">Véhicules</TabsTrigger>
          </TabsList>

          <TabsContent value="tunnel1" className="mt-6">
            {renderTunnelSteps('tunnel1')}
          </TabsContent>

          <TabsContent value="tunnel2" className="mt-6">
            {renderTunnelSteps('tunnel2')}
          </TabsContent>

          <TabsContent value="tunnel3" className="mt-6">
            {renderTunnelSteps('tunnel3')}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
