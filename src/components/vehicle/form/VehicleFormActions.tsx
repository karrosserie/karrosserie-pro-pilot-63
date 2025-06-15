
import React from 'react';
import { Button } from '@/components/ui/button';

interface VehicleFormActionsProps {
  isViewMode: boolean;
  defaultValues: any;
  onCancel: () => void;
}

const VehicleFormActions: React.FC<VehicleFormActionsProps> = ({
  isViewMode,
  defaultValues,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        {isViewMode ? "Fermer" : "Annuler"}
      </Button>
      {!isViewMode && (
        <Button type="submit" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
          {defaultValues?.id ? "Mettre à jour" : "Enregistrer"}
        </Button>
      )}
    </div>
  );
};

export default VehicleFormActions;
