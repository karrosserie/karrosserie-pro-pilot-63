import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coffee, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { terminerPause } from '@/utils/pointageUtils';

interface RetourPauseModalProps {
  isOpen: boolean;
  onRevenir: () => void;
  employeNom: string;
  employeId: string;  // Changé de number à string pour supporter les UUID
}

export const RetourPauseModal: React.FC<RetourPauseModalProps> = ({
  isOpen,
  onRevenir,
  employeNom,
  employeId
}) => {
  const { toast } = useToast();

  const handleRevenirDePause = async () => {
    const success = await terminerPause(employeId);  // employeId est maintenant déjà une string
    
    if (success) {
      onRevenir();
      
      toast({
        title: "🎯 Retour de pause",
        description: `Bon retour ${employeNom} ! Retour enregistré avec succès`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Aucune pause en cours à terminer",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Coffee className="w-8 h-8 text-orange-600" />
          </div>
          <DialogTitle className="text-xl">
            Bon retour {employeNom} !
          </DialogTitle>
          <DialogDescription className="text-base">
            Vous étiez en pause. Souhaitez-vous reprendre le travail ?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className="text-center text-sm text-muted-foreground mb-2">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleRevenirDePause}
            size="lg"
            className="w-full max-w-xs h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700"
          >
            <Coffee className="w-5 h-5 mr-2" />
            Revenir de pause
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};