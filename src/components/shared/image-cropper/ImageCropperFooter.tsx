
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface ImageCropperFooterProps {
  isLoading: boolean;
  onCancel: () => void;
  onApply: () => void;
}

export const ImageCropperFooter: React.FC<ImageCropperFooterProps> = ({
  isLoading,
  onCancel,
  onApply
}) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button onClick={onApply} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          'Appliquer'
        )}
      </Button>
    </DialogFooter>
  );
};
