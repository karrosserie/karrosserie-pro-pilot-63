
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
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:space-x-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto text-sm">
        {isViewMode ? "Fermer" : "Annuler"}
      </Button>
      {!isViewMode && (
        <Button type="submit" variant="validation" className="w-full sm:w-auto text-sm">
          {defaultValues?.id ? "Mettre à jour" : "Enregistrer"}
        </Button>
      )}
    </div>
  );
};

export default VehicleFormActions;
