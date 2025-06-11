
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
    <div className="flex justify-between items-center pt-6 border-t flex-shrink-0">
      <div>
        {!isFirstTab && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        
        {!isLastTab ? (
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
            {isPending ? 'Enregistrement...' : 'Valider le retour'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FleetReturnFormNavigation;
