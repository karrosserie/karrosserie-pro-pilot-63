import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, BarChart } from 'lucide-react';
import { StatsPointageEmploye } from '@/components/StatsPointageEmploye';

interface EmployePointageModalProps {
  isOpen: boolean;
  onClose: () => void;
  employe?: {
    id: string;
    nom: string;
  };
}

export const EmployePointageModal: React.FC<EmployePointageModalProps> = ({
  isOpen,
  onClose,
  employe
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Statistiques de pointage - {employe?.nom}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {employe && (
            <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
              <User className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="font-medium">{employe.nom}</div>
                <div className="text-sm text-muted-foreground">ID: {employe.id}</div>
              </div>
            </div>
          )}
          
          {employe && (
            <StatsPointageEmploye employeId={employe.id} employeNom={employe.nom} />
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};