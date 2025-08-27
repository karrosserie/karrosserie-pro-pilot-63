import React from 'react';
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
import { CoinsIcon, AlertTriangleIcon } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { TokenOperation, getTokenCost, TOKEN_OPERATION_LABELS } from '@/config/token-costs';
import { useNavigate } from 'react-router-dom';

interface TokenGuardProps {
  operation: TokenOperation;
  children: (props: { 
    canPerform: boolean; 
    performAction: () => void;
    tokenCost: number;
  }) => React.ReactNode;
  onSuccess?: () => void;
  confirmationTitle?: string;
  confirmationMessage?: string;
}

const TokenGuard: React.FC<TokenGuardProps> = ({ 
  operation, 
  children, 
  onSuccess,
  confirmationTitle,
  confirmationMessage
}) => {
  const { 
    canPerformOperation, 
    tokensRemaining, 
    consumeTokens, 
    isConsumingTokens,
    hasActiveSubscription 
  } = useSubscription();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [showInsufficientTokens, setShowInsufficientTokens] = React.useState(false);

  const tokenCost = getTokenCost(operation);
  const canPerform = canPerformOperation(operation);
  const operationLabel = TOKEN_OPERATION_LABELS[operation];

  const handleAction = () => {
    if (!hasActiveSubscription) {
      navigate('/settings?tab=subscription');
      return;
    }

    if (!canPerform && tokenCost > 0) {
      setShowInsufficientTokens(true);
      return;
    }

    if (tokenCost > 0) {
      setShowConfirmation(true);
    } else {
      // Free operation, execute directly
      executeAction();
    }
  };

  const executeAction = async () => {
    try {
      if (tokenCost > 0) {
        await consumeTokens({ 
          operation,
          description: `${operationLabel} effectuée`
        });
      }
      
      onSuccess?.();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error consuming tokens:', error);
    }
  };

  return (
    <>
      {children({ 
        canPerform: canPerform || tokenCost === 0, 
        performAction: handleAction,
        tokenCost 
      })}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-4">
              <CoinsIcon className="w-12 h-12 text-blue-500" />
            </div>
            <AlertDialogTitle>
              {confirmationTitle || `Confirmer ${operationLabel.toLowerCase()}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage || 
                `Cette action va consommer ${tokenCost} jeton${tokenCost > 1 ? 's' : ''}.`
              }
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Jetons actuels :</span>
                  <span className="font-medium">{tokensRemaining}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Coût de l'opération :</span>
                  <span className="font-medium text-blue-600">-{tokenCost}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                  <span>Jetons restants :</span>
                  <span>{tokensRemaining - tokenCost}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={executeAction} disabled={isConsumingTokens}>
              {isConsumingTokens ? 'Traitement...' : 'Confirmer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Insufficient Tokens Dialog */}
      <AlertDialog open={showInsufficientTokens} onOpenChange={setShowInsufficientTokens}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-4">
              <AlertTriangleIcon className="w-12 h-12 text-red-500" />
            </div>
            <AlertDialogTitle>Jetons insuffisants</AlertDialogTitle>
            <AlertDialogDescription>
              Vous n'avez pas assez de jetons pour effectuer cette action.
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Jetons disponibles :</span>
                  <span className="font-medium">{tokensRemaining}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Jetons requis :</span>
                  <span className="font-medium text-red-600">{tokenCost}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                  <span>Manquant :</span>
                  <span className="text-red-600">{tokenCost - tokensRemaining}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Fermer</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/settings?tab=subscription')}>
              Acheter des jetons
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TokenGuard;