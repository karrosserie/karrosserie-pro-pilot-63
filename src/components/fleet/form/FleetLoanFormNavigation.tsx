
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
    <div className="flex justify-between items-center pt-6 border-t flex-shrink-0">
      <div>
        {!isFirstTab && !isViewMode && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isViewMode ? 'Fermer' : 'Annuler'}
        </Button>
        
        {!isViewMode && (
          !isLastTab ? (
            <Button type="button" onClick={onNext}>
              Suivant
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="btn-primary"
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
