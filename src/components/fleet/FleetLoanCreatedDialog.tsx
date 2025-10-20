import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FleetLoanCreatedDialogProps {
  open: boolean;
  onClose: () => void;
  targetSectionId?: string;
  title: string;
  description: React.ReactNode;
}

export function FleetLoanCreatedDialog({ open, onClose, targetSectionId, title, description }: FleetLoanCreatedDialogProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (open && targetSectionId) {
      // Trouver la section cible et positionner le dialog à côté
      const section = document.getElementById(targetSectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        // Positionner le dialog à gauche de la section avec un décalage plus important
        setPosition({
          top: rect.top + 50,
          left: Math.max(20, rect.left - 650), // 650px pour décaler plus à gauche
        });
        // Ajouter la classe de surbrillance et éclaircir la section
        section.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'bg-primary/5', 'shadow-lg');
      }
    } else if (!open && targetSectionId) {
      // Retirer la surbrillance quand le dialog se ferme
      const section = document.getElementById(targetSectionId);
      if (section) {
        section.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'bg-primary/5', 'shadow-lg');
      }
    }
    
    // Si pas de section cible, centrer le dialog
    if (open && !targetSectionId) {
      setPosition(null);
    }
  }, [open, targetSectionId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-2xl animate-fade-in" 
        style={position ? {
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'none',
        } : undefined}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {targetSectionId ? (
              <>
                <div className="flex-1 text-right">
                  <DialogTitle className="text-2xl">
                    {title}
                  </DialogTitle>
                </div>
                <div className="p-3 rounded-full bg-primary/10 animate-pulse">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </>
            ) : (
              <div className="flex-1 text-center">
                <DialogTitle className="text-2xl">
                  {title}
                </DialogTitle>
              </div>
            )}
          </div>
          <DialogDescription className={`text-lg leading-relaxed pt-2 ${targetSectionId ? 'text-right pr-16' : 'text-center'}`}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className={`flex ${targetSectionId ? 'justify-end pr-16' : 'justify-center'} pt-4`}>
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
