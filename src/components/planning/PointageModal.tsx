import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, User, MapPin, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { clockIn } from '@/utils/pointageSupabaseUtils';

interface PointageModalProps {
  isOpen: boolean;
  onPointer: () => void;
  employeNom: string;
  employeId: string;
}

export const PointageModal: React.FC<PointageModalProps> = ({
  isOpen,
  onPointer,
  employeNom,
  employeId
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePointer = async () => {
    setIsLoading(true);
    
    try {
      const result = await clockIn(employeId);
      
      if (result.success) {
        onPointer();
        toast({
          title: "✅ Pointage effectué",
          description: result.message,
        });
      } else {
        toast({
          title: "❌ Pointage refusé",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Erreur lors du pointage",
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
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Bonjour {employeNom} !
          </DialogTitle>
          <DialogDescription className="text-base">
            Bienvenue pour cette nouvelle journée de travail. 
            Veuillez effectuer votre pointage d'arrivée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-4 h-4" />
              <span>Employé: {employeNom}</span>
            </div>
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
            onClick={handlePointer}
            disabled={isLoading}
            size="lg"
            className="w-full max-w-xs h-12 text-lg font-semibold"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Clock className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Vérification...' : 'Pointer'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            Vérification de position dans un rayon de 100m
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};