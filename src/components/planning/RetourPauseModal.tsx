import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coffee, Clock, MapPin, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { endBreak } from '@/utils/pointageSupabaseUtils';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleRevenirDePause = async () => {
    setIsLoading(true);
    
    try {
      const result = await endBreak(employeId);
      
      if (result.success) {
        onRevenir();
        toast({
          title: "✅ Retour de pause",
          description: result.message,
        });
      } else {
        toast({
          title: "❌ Reprise refusée",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la reprise du travail",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            <div className="flex items-center justify-center gap-2 mb-2">
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
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              Vérification de position dans un rayon de 100m
            </p>
          </div>
          
          <Button 
            onClick={handleRevenirDePause}
            disabled={isLoading}
            size="lg"
            className="w-full max-w-xs h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Coffee className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Vérification...' : 'Revenir de pause'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};