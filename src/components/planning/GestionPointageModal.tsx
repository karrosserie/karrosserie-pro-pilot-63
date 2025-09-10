import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enregistrerDepart, nettoyerPointageJour } from '@/utils/pointageUtils';

interface GestionPointageModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeNom: string;
  employeId: number;
  onDepointer: () => void;
  
}

export const GestionPointageModal: React.FC<GestionPointageModalProps> = ({
  isOpen,
  onClose,
  employeNom,
  employeId,
  onDepointer,
}) => {
  const { toast } = useToast();


  const handleDepointer = async () => {
    const success = await enregistrerDepart(employeId.toString());
    
    onDepointer(); // Appeler la fonction pour remettre aPointe à false
    onClose();
    
    toast({
      title: "👋 Fin de journée",
      description: success ? "Départ enregistré avec succès. À bientôt !" : "Erreur lors de l'enregistrement",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Gestion des pointages
          </DialogTitle>
          <DialogDescription className="text-base">
            {employeNom}, choisissez votre action de pointage :
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 pt-4">
          <Button 
            onClick={handleDepointer}
            variant="secondary"
            size="lg"
            className="w-full h-12 text-base font-medium hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Dépointer
          </Button>
          
          <Button 
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="mt-4"
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};