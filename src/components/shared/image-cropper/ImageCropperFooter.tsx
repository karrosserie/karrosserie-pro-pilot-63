
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
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onApply();
  };

  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={handleCancel}>
        Annuler
      </Button>
      <Button 
        type="button"
        onClick={handleApply} 
        disabled={isLoading}
        className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
      >
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
