import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "pt-4 border-t",
      isMobile 
        ? "flex flex-col-reverse gap-2" 
        : "flex justify-end space-x-2"
    )}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className={cn(isMobile && "w-full")}
      >
        {isViewMode ? "Fermer" : "Annuler"}
      </Button>
      {!isViewMode && (
        <Button 
          type="submit" 
          variant="validation"
          className={cn(isMobile && "w-full")}
        >
          {hasId ? "Mettre à jour" : "Enregistrer"}
        </Button>
      )}
    </div>
  );
};

export default ClientFormActions;
