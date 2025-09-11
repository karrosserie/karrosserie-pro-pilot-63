import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AlertTriangle, Car, Calendar } from 'lucide-react';

interface ValidationError {
  type: 'vehicle_not_found' | 'no_active_loan';
  message: string;
  licensePlate?: string;
  violationDate?: string;
}

interface ViolationValidationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validationError: ValidationError | null;
  onContinueAnyway?: () => void;
}

export const ViolationValidationModal: React.FC<ViolationValidationModalProps> = ({
  open,
  onOpenChange,
  validationError,
  onContinueAnyway
}) => {
  if (!validationError) return null;

  const getIcon = () => {
    switch (validationError.type) {
      case 'vehicle_not_found':
        return <Car className="h-12 w-12 text-warning mx-auto mb-4" />;
      case 'no_active_loan':
        return <Calendar className="h-12 w-12 text-warning mx-auto mb-4" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />;
    }
  };

  const getTitle = () => {
    switch (validationError.type) {
      case 'vehicle_not_found':
        return 'Véhicule non trouvé dans la flotte';
      case 'no_active_loan':
        return 'Aucun prêt en cours trouvé';
      default:
        return 'Erreur de validation';
    }
  };

  const getDescription = () => {
    switch (validationError.type) {
      case 'vehicle_not_found':
        return 'Le véhicule mentionné dans la contravention ne fait pas partie de votre flotte de véhicules de prêt.';
      case 'no_active_loan':
        return 'Aucun prêt actif n\'a été trouvé pour ce véhicule à la date de l\'infraction. Il est possible que la contravention concerne votre propre usage du véhicule.';
      default:
        return 'Une erreur de validation s\'est produite lors de l\'analyse de la contravention.';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-center">
            {getIcon()}
            <DialogTitle className="text-center">{getTitle()}</DialogTitle>
            <DialogDescription className="text-center mt-2">
              {getDescription()}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <p className="text-sm text-foreground font-medium mb-2">Détails :</p>
            <p className="text-sm text-muted-foreground">{validationError.message}</p>
          </div>
          
          {validationError.licensePlate && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Plaque :</span>
              <span className="text-muted-foreground">{validationError.licensePlate}</span>
            </div>
          )}
          
          {validationError.violationDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date :</span>
              <span className="text-muted-foreground">{validationError.violationDate}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Fermer
          </Button>
          {onContinueAnyway && (
            <Button 
              onClick={() => {
                onContinueAnyway();
                onOpenChange(false);
              }}
              className="w-full sm:w-auto"
            >
              Continuer quand même
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};