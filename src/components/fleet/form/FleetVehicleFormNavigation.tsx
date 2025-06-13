
import React from 'react';
import { Button } from '@/components/ui/button';

interface FleetVehicleFormNavigationProps {
  activeTab: string;
  isViewMode: boolean;
  isFormValid: boolean;
  isPending: boolean;
  mode: 'create' | 'edit' | 'view';
  onCancel: () => void;
  onNext: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FleetVehicleFormNavigation: React.FC<FleetVehicleFormNavigationProps> = ({
  activeTab,
  isViewMode,
  isFormValid,
  isPending,
  mode,
  onCancel,
  onNext,
  onSubmit
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        {isViewMode ? "Fermer" : "Annuler"}
      </Button>
      {!isViewMode && (
        <>
          {activeTab === 'vehicle-info' && (
            <Button 
              type="button" 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={onNext}
            >
              Suivant
            </Button>
          )}
          {activeTab === 'documents' && (
            <Button 
              type="submit" 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              disabled={isPending || !isFormValid}
              onClick={onSubmit}
            >
              {isPending 
                ? "Enregistrement..." 
                : (mode === 'edit' ? "Mettre à jour" : "Enregistrer")
              }
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default FleetVehicleFormNavigation;
