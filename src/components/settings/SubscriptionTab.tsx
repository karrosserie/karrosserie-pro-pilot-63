import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  CheckIcon, 
  CreditCardIcon, 
  PackageIcon, 
  PlusIcon,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Ban
} from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useGoCardless } from '@/hooks/use-gocardless';
import { formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import PricingPage from '@/components/pricing/PricingPage';
import { SepaSetupDialog } from './SepaSetupDialog';

const SubscriptionTab: React.FC = () => {
  const {
    subscriptionPlans,
    tokenPackages,
    companySubscription,
    tokenUsage,
    isLoading,
    hasActiveSubscription,
    tokensRemaining,
    tokensUsed,
    createSubscription,
    addTokens,
    isCreatingSubscription,
    isAddingTokens,
  } = useSubscription();

  const {
    hasMandateConfigured,
    isMandateActive,
    isSepaEnabled,
    mandateStatus,
    mandateLoading,
    cancelMandate,
    isCancellingMandate,
  } = useGoCardless();

  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Chargement...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Abonnement actuel</CardTitle>
          <CardDescription className="text-sm">
            Gérez votre abonnement et vos jetons.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasActiveSubscription && companySubscription ? (
            <>
              {/* Trial Warning */}
              {(companySubscription as any).subscription_plans?.price === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <h4 className="font-medium text-amber-800">Période d'essai gratuit</h4>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Votre essai gratuit se termine le {companySubscription.end_date && formatDate(new Date(companySubscription.end_date), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-amber-600 mt-2">
                    Choisissez un plan payant pour continuer à accéder à toutes les fonctionnalités après cette date.
                  </p>
                </div>
              )}

              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <div className={`${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}>
                  <div>
                    <h3 className="font-semibold">{(companySubscription as any).subscription_plans?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(companySubscription as any).subscription_plans?.price === 0 
                        ? 'Gratuit pendant l\'essai'
                        : `${(companySubscription as any).subscription_plans?.price}€ / ${(companySubscription as any).subscription_plans?.billing_period === 'monthly' ? ' mois' : ' an'}`
                      }
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckIcon className="w-3 h-3 mr-1" />
                    Actif
                  </Badge>
                </div>
                {companySubscription.next_billing_date && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Prochain prélèvement: {formatDate(new Date(companySubscription.next_billing_date), 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                )}
                {companySubscription.end_date && (companySubscription as any).subscription_plans?.price === 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Fin de l'essai: {formatDate(new Date(companySubscription.end_date), 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-center">
                <PackageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-semibold">Aucun abonnement actif</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choisissez un plan pour commencer à utiliser Karrosserie Pro.
                </p>
              </div>
            </div>
          )}
          
          {/* Tokens Status */}
          {hasActiveSubscription && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Jetons disponibles</h3>
              <div className="flex justify-between items-center mb-2">
                <p>Jetons utilisés</p>
                <span className="font-bold">{tokensUsed}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p>Jetons restants</p>
                <span className="font-bold text-primary">{tokensRemaining}</span>
              </div>

              {/* Token Usage Breakdown */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Coût des opérations :</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>📞 Téléphone</span>
                    <span className="font-medium">3 jetons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📱 VMS</span>
                    <span className="font-medium">3 jetons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💬 SMS</span>
                    <span className="font-medium">1 jeton</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📮 Courrier</span>
                    <span className="font-medium">5 jetons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📧 Email</span>
                    <span className="font-medium text-green-600">Gratuit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💼 Cession</span>
                    <span className="font-medium">10 jetons</span>
                  </div>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Acheter des jetons supplémentaires
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Acheter des jetons</DialogTitle>
                    <DialogDescription>
                      Choisissez un pack de jetons à ajouter à votre abonnement.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {tokenPackages?.map((tokenPackage) => (
                      <div key={tokenPackage.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{tokenPackage.name}</h4>
                          <p className="text-sm text-muted-foreground">{tokenPackage.description}</p>
                          <p className="text-sm font-semibold">{tokenPackage.token_count} jetons</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{tokenPackage.price}€</p>
                          <Button 
                            size="sm"
                            onClick={() => addTokens({ tokenCount: tokenPackage.token_count })}
                            disabled={isAddingTokens}
                          >
                            Acheter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration SEPA avec GoCardless */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Prélèvement SEPA automatique
          </CardTitle>
          <CardDescription>
            Automatisez le paiement de vos abonnements avec le prélèvement SEPA via GoCardless.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasMandateConfigured ? (
            <div className="flex flex-col space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Avantages du prélèvement SEPA</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Paiements automatiques de vos abonnements</li>
                  <li>• Plus de risque d'oubli ou de retard</li>
                  <li>• Processus sécurisé via GoCardless</li>
                  <li>• Possibilité d'annulation à tout moment</li>
                </ul>
              </div>
              <SepaSetupDialog />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    isMandateActive ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {isMandateActive ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      Mandat SEPA {isMandateActive ? 'actif' : 'en cours de configuration'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mandateLoading ? 'Vérification du statut...' : 
                       isMandateActive ? 'Prélèvements automatiques activés' : 
                       'En attente de validation bancaire'}
                    </p>
                  </div>
                </div>
                <Badge variant={isMandateActive ? "secondary" : "secondary"}>
                  {mandateStatus?.status || 'Inconnu'}
                </Badge>
              </div>

              {isMandateActive && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Prélèvement SEPA configuré</h4>
                  <p className="text-sm text-green-800">
                    Vos abonnements seront automatiquement prélevés sur votre compte bancaire. 
                    Vous recevrez une notification avant chaque prélèvement.
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => mandateStatus?.id && cancelMandate(mandateStatus.id)}
                  disabled={isCancellingMandate}
                >
                  {isCancellingMandate ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 h-4 w-4" />
                      Annuler le mandat
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Page Button */}
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <PackageIcon className="w-4 h-4" />
              Voir la page tarifaire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Grille tarifaire complète</DialogTitle>
            </DialogHeader>
            <PricingPage />
          </DialogContent>
        </Dialog>
      </div>

      {/* Token Packages (always visible for easy access) */}
      <Card>
        <CardHeader>
          <CardTitle>Packs de jetons</CardTitle>
          <CardDescription>
            Jetons supplémentaires disponibles à l'achat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tokenPackages?.map((tokenPackage) => (
              <div key={tokenPackage.id} className="border rounded-lg p-4 text-center space-y-3">
                <div>
                  <h3 className="font-semibold">{tokenPackage.name}</h3>
                  <p className="text-sm text-muted-foreground">{tokenPackage.description}</p>
                </div>
                
                <div>
                  <span className="text-2xl font-bold">{tokenPackage.token_count}</span>
                  <span className="text-muted-foreground"> jetons</span>
                </div>
                
                <div>
                  <span className="text-lg font-bold">{tokenPackage.price}€</span>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => addTokens({ tokenCount: tokenPackage.token_count })}
                  disabled={!hasActiveSubscription || isAddingTokens}
                >
                  Acheter
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionTab;