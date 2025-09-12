import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Coffee, Clock, MapPin, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { endBreak } from '@/utils/pointageSupabaseUtils';

interface RetourPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName?: string;
  employeId?: string;
  onConfirm?: () => void;
}

export const RetourPauseModal: React.FC<RetourPauseModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  employeId,
  onConfirm
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleReturnToWork = async () => {
    if (!employeId) {
      toast({
        title: "❌ Erreur",
        description: "ID employé manquant",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await endBreak(employeId);
      
      if (result.success) {
        onConfirm?.();
        onClose();
        toast({
          title: "✅ Reprise du travail",
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
        title: "❌ Erreur",
        description: "Erreur lors de la reprise du travail",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Retour de pause
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 bg-muted rounded-lg">
            <Coffee className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <div className="font-medium text-lg">{employeeName}</div>
            <div className="text-sm text-muted-foreground mb-2">En pause depuis un moment</div>
            <div className="text-2xl font-bold text-primary">{currentTime}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Prêt à reprendre le travail ?
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Confirmez votre retour de pause pour continuer vos tâches
          </div>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            Vérification de position dans un rayon de 100m
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Rester en pause
          </Button>
          <Button 
            onClick={handleReturnToWork}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Vérification...' : 'Reprendre le travail'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};