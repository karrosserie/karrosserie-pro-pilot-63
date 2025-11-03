
import React from 'react';
import { Button } from '@/components/ui/button';

interface FleetLoanFormNavigationProps {
  activeTab: string;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isFormValid: boolean;
  isPending: boolean;
  isFirstTab: boolean;
  isLastTab: boolean;
  isViewMode?: boolean;
}

const FleetLoanFormNavigation: React.FC<FleetLoanFormNavigationProps> = ({
  onCancel,
  onPrevious,
  onNext,
  onSubmit,
  isFormValid,
  isPending,
  isFirstTab,
  isLastTab,
  isViewMode = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t flex-shrink-0">
      <div className="w-full sm:w-auto">
        {!isFirstTab && !isViewMode && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="w-full sm:w-auto"
          >
            Précédent
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {isViewMode ? 'Fermer' : 'Annuler'}
        </Button>
        
        {!isViewMode && (
          !isLastTab ? (
            <Button 
              type="button"
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 w-full sm:w-auto order-1 sm:order-2"
              onClick={onNext}
            >
              Suivant
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 w-full sm:w-auto order-1 sm:order-2"
              onClick={onSubmit}
              disabled={!isFormValid || isPending}
            >
              {isPending ? 'Enregistrement...' : 'Confirmer le prêt'}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default FleetLoanFormNavigation;
