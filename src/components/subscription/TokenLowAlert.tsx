import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, CreditCardIcon } from "lucide-react";
import { useSubscription } from '@/hooks/use-subscription';
import { supabase } from '@/integrations/supabase/client';

interface TokenLowAlertProps {
  tokensRemaining: number;
  companyId: string;
}

const TOKEN_THRESHOLDS = [100, 50, 10];

const TokenLowAlert: React.FC<TokenLowAlertProps> = ({ tokensRemaining, companyId }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState<number | null>(null);
  const { addTokens, isAddingTokens } = useSubscription();

  useEffect(() => {
    // Check if we should show an alert for any threshold
    const shouldAlert = TOKEN_THRESHOLDS.find(threshold => {
      if (tokensRemaining <= threshold) {
        const alertKey = `token_alert_${threshold}_${companyId}`;
        const lastAlert = localStorage.getItem(alertKey);
        
        // Show alert if we haven't shown it for this threshold yet, or if it was more than 24 hours ago
        if (!lastAlert || Date.now() - parseInt(lastAlert) > 24 * 60 * 60 * 1000) {
          return true;
        }
      }
      return false;
    });

    if (shouldAlert) {
      setAlertThreshold(shouldAlert);
      setShowAlert(true);
      
      // Mark this threshold as alerted and send webhook
      const alertKey = `token_alert_${shouldAlert}_${companyId}`;
      localStorage.setItem(alertKey, Date.now().toString());
      
      // Send webhook notification
      sendTokenAlert(companyId, tokensRemaining, shouldAlert);
    }
  }, [tokensRemaining, companyId]);

  const sendTokenAlert = async (companyId: string, tokensRemaining: number, threshold: number) => {
    try {
      await supabase.functions.invoke('send-token-alert', {
        body: {
          company_id: companyId,
          tokens_remaining: tokensRemaining,
          threshold
        }
      });
    } catch (error) {
      console.error('Failed to send token alert:', error);
    }
  };

  const getAlertMessage = () => {
    if (!alertThreshold) return '';
    
    switch (alertThreshold) {
      case 100:
        return `Attention ! Il vous reste seulement ${tokensRemaining} jetons. Nous vous recommandons d'acheter des jetons supplémentaires pour éviter toute interruption de service.`;
      case 50:
        return `Alerte importante ! Il ne vous reste que ${tokensRemaining} jetons. Vos opérations pourraient bientôt être limitées.`;
      case 10:
        return `Alerte critique ! Il ne vous reste que ${tokensRemaining} jetons. Vous devez acheter des jetons immédiatement pour continuer vos opérations.`;
      default:
        return `Il vous reste ${tokensRemaining} jetons.`;
    }
  };

  const getAlertColor = () => {
    if (!alertThreshold) return 'text-yellow-600';
    
    switch (alertThreshold) {
      case 100:
        return 'text-yellow-600';
      case 50:
        return 'text-orange-600';
      case 10:
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const handleBuyTokens = () => {
    // Buy the smallest token package (assuming it's the first one)
    addTokens({ tokenCount: 100 }); // Default to 100 tokens, adjust based on your packages
    setShowAlert(false);
  };

  if (!showAlert || !alertThreshold) {
    return null;
  }

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className={`h-5 w-5 ${getAlertColor()}`} />
            Solde de jetons faible
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {getAlertMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogAction
            onClick={() => setShowAlert(false)}
            className="order-2 sm:order-1"
          >
            Compris
          </AlertDialogAction>
          <Button
            onClick={handleBuyTokens}
            disabled={isAddingTokens}
            className="order-1 sm:order-2"
          >
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Acheter des jetons
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TokenLowAlert;