
import React from 'react';
import { Button } from '@/components/ui/button';

interface FleetReturnFormNavigationProps {
  activeTab: string;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isFormValid: boolean;
  isPending: boolean;
  isFirstTab: boolean;
  isLastTab: boolean;
}

const FleetReturnFormNavigation: React.FC<FleetReturnFormNavigationProps> = ({
  onCancel,
  onPrevious,
  onNext,
  onSubmit,
  isFormValid,
  isPending,
  isFirstTab,
  isLastTab
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:justify-between items-stretch sm:items-center pt-4 sm:pt-6 flex-shrink-0">
      {/* Previous button - hidden on first tab */}
      <div className="order-2 sm:order-1">
        {!isFirstTab && (
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
      
      {/* Cancel and Next/Submit buttons */}
      <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2 w-full sm:w-auto">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Annuler
        </Button>
        
        {!isLastTab ? (
          <Button 
            type="button" 
            className="w-full sm:w-auto bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={onNext}
          >
            Suivant
          </Button>
        ) : (
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={onSubmit}
            disabled={!isFormValid || isPending}
          >
            {isPending ? 'Enregistrement...' : 'Valider le retour'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FleetReturnFormNavigation;
