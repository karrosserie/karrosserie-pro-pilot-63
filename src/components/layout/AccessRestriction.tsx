import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockIcon, CrownIcon, CalendarIcon } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { formatDate, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface AccessRestrictionProps {
  children: React.ReactNode;
  requiresFullAccess?: boolean;
}

export const AccessRestriction: React.FC<AccessRestrictionProps> = ({ 
  children, 
  requiresFullAccess = false 
}) => {
  const { 
    hasFullAccess, 
    isTrialSubscription, 
    isTrialExpired, 
    trialEndDate,
    isLoading 
  } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Vérification de l'abonnement...</p>
        </div>
      </div>
    );
  }

  // Si l'accès complet n'est pas requis ou si l'utilisateur a un accès complet
  if (!requiresFullAccess || hasFullAccess) {
    return <>{children}</>;
  }

  // Si l'essai est expiré ou pas d'abonnement actif
  const daysRemaining = trialEndDate ? differenceInDays(trialEndDate, new Date()) : 0;
  
  return (
    <div className="p-6 space-y-6">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <LockIcon className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            {isTrialExpired ? 'Essai gratuit expiré' : 'Accès restreint'}
          </CardTitle>
          <CardDescription>
            {isTrialExpired 
              ? 'Votre période d\'essai de 30 jours a expiré. Choisissez un plan pour continuer à utiliser toutes les fonctionnalités.'
              : 'Cette fonctionnalité nécessite un abonnement actif.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTrialSubscription && trialEndDate && !isTrialExpired && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-amber-800">
                <CalendarIcon className="w-5 h-5" />
                <span className="font-medium">
                  Essai gratuit - {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Expire le {formatDate(trialEndDate, 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <CrownIcon className="w-5 h-5" />
              <span>Fonctionnalité Premium</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Accédez à toutes les fonctionnalités avec un abonnement :
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Rapports d'expertise illimités</li>
                <li>• Gestion complète des véhicules</li>
                <li>• Suivi des réparations</li>
                <li>• Support prioritaire</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => navigate('/settings?tab=subscription')}
              className="w-full"
            >
              Voir les plans d'abonnement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRestriction;