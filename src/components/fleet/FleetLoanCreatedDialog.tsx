import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface FleetLoanCreatedDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FleetLoanCreatedDialog({ open, onClose }: FleetLoanCreatedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl animate-fade-in">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-primary/10 animate-bounce">
              <ArrowDown className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl text-center">
              Prêt créé avec succès !
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg leading-relaxed pt-2 text-center">
            Ici vous retrouverez vos véhicules en cours de prêt
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            className="min-w-[100px]"
          >
            Compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
