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
import { TOKEN_COSTS, getTokenCostDescription } from '@/config/token-costs';

interface CessionEmailConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tokensRemaining: number;
  cessionReference: string;
  incidentNumber?: string;
}

export const CessionEmailConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  tokensRemaining,
  cessionReference,
  incidentNumber
}: CessionEmailConfirmationDialogProps) => {
  const operationCost = TOKEN_COSTS.CESSION_CREANCE;
  const tokensAfterOperation = tokensRemaining - operationCost;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Envoyer la cession par courrier électronique</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div>
              Vous êtes sur le point d'envoyer la cession de créance <strong>{cessionReference}</strong>
              {incidentNumber && (
                <>
                  {' '}pour le sinistre <strong>{incidentNumber}</strong>
                </>
              )} par courrier électronique à la compagnie d'assurance.
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="font-medium text-amber-800">Coût de l'opération</div>
              <div className="text-sm text-amber-700">
                {getTokenCostDescription('CESSION_CREANCE')}
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div>Jetons actuels : <span className="font-medium">{tokensRemaining}</span></div>
              <div>Jetons après envoi : <span className="font-medium">{tokensAfterOperation}</span></div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirmer l'envoi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};