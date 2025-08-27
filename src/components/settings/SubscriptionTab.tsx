
import React from 'react';
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
import { CheckIcon, CreditCardIcon, PackageIcon, PlusIcon } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnement actuel</CardTitle>
          <CardDescription>
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

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
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

      {/* Available Plans */}
      {(!hasActiveSubscription || (hasActiveSubscription && (companySubscription as any).subscription_plans?.price === 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {hasActiveSubscription && (companySubscription as any).subscription_plans?.price === 0 
                ? 'Passez à un plan payant' 
                : 'Plans d\'abonnement'
              }
            </CardTitle>
            <CardDescription>
              {hasActiveSubscription && (companySubscription as any).subscription_plans?.price === 0
                ? 'Continuez à utiliser toutes les fonctionnalités après votre essai gratuit.'
                : 'Choisissez le plan qui correspond à vos besoins.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {subscriptionPlans?.filter(plan => plan.price > 0).map((plan) => (
                <div key={plan.id} className="border rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-3xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">
                      / {plan.billing_period === 'monthly' ? 'mois' : 'an'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{plan.tokens_included} jetons inclus</p>
                    {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {String(feature)}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => createSubscription({ planId: plan.id, tokensIncluded: plan.tokens_included })}
                    disabled={isCreatingSubscription}
                  >
                    <CreditCardIcon className="w-4 h-4 mr-2" />
                    {hasActiveSubscription && (companySubscription as any).subscription_plans?.price === 0
                      ? 'Passer à ce plan'
                      : 'Choisir ce plan'
                    }
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Packages (always visible for easy access) */}
      <Card>
        <CardHeader>
          <CardTitle>Packs de jetons</CardTitle>
          <CardDescription>
            Jetons supplémentaires disponibles à l'achat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
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
