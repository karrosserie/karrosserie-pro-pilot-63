import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CrownIcon, AlertTriangleIcon } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { differenceInDays, formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface ExpiryAlert {
  daysRemaining: number;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  ctaText: string;
}

const getExpiryAlert = (daysRemaining: number, trialEndDate: Date): ExpiryAlert | null => {
  const endDateStr = formatDate(trialEndDate, 'dd MMMM yyyy', { locale: fr });
  
  if (daysRemaining <= 1) {
    return {
      daysRemaining,
      type: 'urgent',
      title: '🚨 Votre essai expire aujourd\'hui !',
      message: `Votre période d'essai gratuite se termine ${daysRemaining === 0 ? 'aujourd\'hui' : 'demain'} (${endDateStr}). Choisissez un plan maintenant pour continuer à accéder à toutes les fonctionnalités.`,
      ctaText: 'Choisir un plan maintenant'
    };
  } else if (daysRemaining <= 7) {
    return {
      daysRemaining,
      type: 'warning',
      title: '⚠️ Votre essai expire bientôt',
      message: `Il vous reste ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} d'essai gratuit (jusqu'au ${endDateStr}). Choisissez un plan pour continuer sans interruption.`,
      ctaText: 'Voir les plans disponibles'
    };
  } else if (daysRemaining <= 30) {
    return {
      daysRemaining,
      type: 'info',
      title: 'Rappel : Votre essai gratuit',
      message: `Votre période d'essai gratuite se termine dans ${daysRemaining} jours (le ${endDateStr}). Pensez à choisir un plan pour continuer à profiter de toutes les fonctionnalités.`,
      ctaText: 'Découvrir nos plans'
    };
  }
  
  return null;
};

const SubscriptionExpiryAlert: React.FC = () => {
  const { companySubscription, isTrialSubscription, trialEndDate, hasFullAccess } = useSubscription();
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<ExpiryAlert | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ne pas afficher d'alerte si pas d'essai ou si l'utilisateur a déjà un plan payant
    if (!isTrialSubscription || !trialEndDate || hasFullAccess) {
      return;
    }

    const daysRemaining = differenceInDays(trialEndDate, new Date());
    const alert = getExpiryAlert(daysRemaining, trialEndDate);
    
    if (!alert) return;

    // Vérifier si cette alerte a déjà été vue aujourd'hui
    const alertKey = `expiry-alert-${alert.daysRemaining}-${formatDate(new Date(), 'yyyy-MM-dd')}`;
    const hasSeenToday = localStorage.getItem(alertKey) === 'seen';
    
    if (!hasSeenToday && (daysRemaining <= 30)) {
      setCurrentAlert(alert);
      setShowAlert(true);
    }
  }, [isTrialSubscription, trialEndDate, hasFullAccess]);

  const handleClose = () => {
    setShowAlert(false);
    // Marquer comme vu pour aujourd'hui
    if (currentAlert) {
      const alertKey = `expiry-alert-${currentAlert.daysRemaining}-${formatDate(new Date(), 'yyyy-MM-dd')}`;
      localStorage.setItem(alertKey, 'seen');
    }
  };

  const handleViewPlans = () => {
    handleClose();
    navigate('/settings?tab=subscription');
  };

  if (!showAlert || !currentAlert) {
    return null;
  }

  const getIcon = () => {
    switch (currentAlert.type) {
      case 'urgent':
        return <AlertTriangleIcon className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <CalendarIcon className="w-12 h-12 text-amber-500" />;
      case 'info':
        return <CrownIcon className="w-12 h-12 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (currentAlert.type) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent className={`max-w-md ${getBgColor()}`}>
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4">
            {getIcon()}
          </div>
          <AlertDialogTitle className="text-lg font-semibold">
            {currentAlert.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            {currentAlert.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0">
          <AlertDialogAction asChild>
            <Button onClick={handleViewPlans} className="w-full">
              {currentAlert.ctaText}
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="ghost" onClick={handleClose} className="w-full">
              Me rappeler plus tard
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubscriptionExpiryAlert;