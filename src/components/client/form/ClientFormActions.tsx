
import React from 'react';
import { Button } from '@/components/ui/button';

interface ClientFormActionsProps {
  isViewMode: boolean;
  onCancel: () => void;
  hasId: boolean;
}

const ClientFormActions: React.FC<ClientFormActionsProps> = ({
  isViewMode,
  onCancel,
  hasId
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        {isViewMode ? "Fermer" : "Annuler"}
      </Button>
      {!isViewMode && (
        <Button type="submit" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
          {hasId ? "Mettre à jour" : "Enregistrer"}
        </Button>
      )}
    </div>
  );
};

export default ClientFormActions;
