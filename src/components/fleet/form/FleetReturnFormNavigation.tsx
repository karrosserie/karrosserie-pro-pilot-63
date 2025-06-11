
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  isViewMode?: boolean;
}

const FleetReturnFormNavigation: React.FC<FleetReturnFormNavigationProps> = ({
  activeTab,
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
  if (isViewMode) {
    return (
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between pt-6 border-t">
      <div className="flex space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        {!isFirstTab && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
        )}
      </div>

      <div className="flex space-x-3">
        {!isLastTab ? (
          <Button type="button" onClick={onNext}>
            Suivant
          </Button>
        ) : (
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={!isFormValid || isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmer le retour
          </Button>
        )}
      </div>
    </div>
  );
};

export default FleetReturnFormNavigation;
