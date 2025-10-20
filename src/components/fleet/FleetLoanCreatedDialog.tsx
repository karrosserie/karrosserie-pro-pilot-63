import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FleetLoanCreatedDialogProps {
  open: boolean;
  onClose: () => void;
  targetSectionId?: string;
  title: string;
  description: React.ReactNode;
}

export function FleetLoanCreatedDialog({ open, onClose, targetSectionId, title, description }: FleetLoanCreatedDialogProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open && targetSectionId) {
      // Trouver la section cible
      const section = document.getElementById(targetSectionId);
      if (section) {
        if (!isMobile) {
          // Sur desktop: positionner le dialog à côté
          const rect = section.getBoundingClientRect();
          setPosition({
            top: rect.top + 50,
            left: Math.max(20, rect.left - 650),
          });
        } else {
          // Sur mobile: scroll vers la section avec un délai pour laisser le drawer s'ouvrir
          setTimeout(() => {
            section.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' // Centrer la section à l'écran
            });
          }, 300);
        }
        // Ajouter la classe de surbrillance
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
  }, [open, targetSectionId, isMobile]);

  // Sur mobile, on affiche toujours en Drawer centré
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl">
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-base leading-relaxed pt-2">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center px-4 pb-6 pt-2">
            <Button 
              onClick={onClose}
              className="min-w-[100px]"
            >
              Compris
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Sur desktop, on garde le Dialog avec positionnement
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
