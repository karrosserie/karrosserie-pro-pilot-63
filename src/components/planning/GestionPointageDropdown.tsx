import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Clock, Coffee, LogOut, Settings, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { demarrerPause, enregistrerDepart, aPauseEnCours, terminerPause } from '@/utils/pointageUtils';

interface GestionPointageDropdownProps {
  employeNom: string;
  employeId: number;
  onDepointer: () => void;
  onPauseStart: () => void;
  onPauseEnd?: () => void;
}

export const GestionPointageDropdown: React.FC<GestionPointageDropdownProps> = ({
  employeNom,
  employeId,
  onDepointer,
  onPauseStart,
  onPauseEnd
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [enPause, setEnPause] = useState(false);

  // Vérifier l'état de pause au montage du composant
  useEffect(() => {
    const checkPauseStatus = async () => {
      const hasBreak = await aPauseEnCours(employeId);
      setEnPause(hasBreak);
    };
    checkPauseStatus();
  }, [employeId]);

  const handlePartirEnPause = async () => {
    try {
      const message = await demarrerPause(employeId);
      setEnPause(true);
      onPauseStart();
      setIsOpen(false);
      
      toast({
        title: "☕ Pause commencée",
        description: message,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la pause",
        variant: "destructive"
      });
    }
  };

  const handleRevenirDePause = async () => {
    try {
      const message = await terminerPause(employeId);
      if (message) {
        setEnPause(false);
        onPauseEnd?.();
        setIsOpen(false);
        
        toast({
          title: "🔄 Retour de pause",
          description: message,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de terminer la pause",
        variant: "destructive"
      });
    }
  };

  const handleDepointer = async () => {
    try {
      const message = await enregistrerDepart(employeId);
      onDepointer();
      setIsOpen(false);
      
      toast({
        title: "👋 Fin de journée",
        description: message,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de dépointer",
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gradient-to-r from-red-400 to-red-600 text-white border-0 hover:from-red-500 hover:to-red-700">
          <Settings className="w-4 h-4" />
          Gérer les pointages
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border shadow-md z-50">
        {enPause ? (
          <DropdownMenuItem 
            onClick={handleRevenirDePause}
            className="gap-2 cursor-pointer hover:bg-green-50 hover:text-green-900"
          >
            <Play className="w-4 h-4" />
            Revenir de pause
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={handlePartirEnPause}
            className="gap-2 cursor-pointer hover:bg-orange-50 hover:text-orange-900"
          >
            <Coffee className="w-4 h-4" />
            Partir en pause
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={handleDepointer}
          className="gap-2 cursor-pointer hover:bg-red-50 hover:text-red-900"
        >
          <LogOut className="w-4 h-4" />
          Dépointer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};