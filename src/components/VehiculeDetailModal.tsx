import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Wrench } from 'lucide-react';

interface VehiculeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule?: any;
}

export const VehiculeDetailModal: React.FC<VehiculeDetailModalProps> = ({
  isOpen,
  onClose,
  vehicule
}) => {
  if (!vehicule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Détails du véhicule - {vehicule.immatriculation}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Marque:</strong> {vehicule.marque}
                </div>
                <div>
                  <strong>Modèle:</strong> {vehicule.modele}
                </div>
                <div>
                  <strong>Immatriculation:</strong> {vehicule.immatriculation}
                </div>
                <div>
                  <strong>Client:</strong> {vehicule.client}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Badge variant={vehicule.urgent ? 'destructive' : 'secondary'}>
                  {vehicule.urgent ? 'Urgent' : 'Normal'}
                </Badge>
                <Badge variant="outline">{vehicule.status}</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Tâches planifiées pour ce véhicule
              </div>
            </CardContent>
          </Card>
          
          {/* Technicien assigné */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Technicien assigné
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {vehicule.technicien || 'Aucun technicien assigné'}
              </div>
            </CardContent>
          </Card>
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