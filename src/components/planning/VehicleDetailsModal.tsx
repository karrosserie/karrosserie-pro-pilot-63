import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Car, AlertTriangle, CheckCircle, Calendar, Euro } from "lucide-react";

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any | null;
  onPlan?: () => void;
  onUnblock?: () => void;
  onModify?: () => void;
}

export const VehicleDetailsModal = ({
  isOpen,
  onClose,
  vehicle,
  onPlan,
  onUnblock,
  onModify
}: VehicleDetailsModalProps) => {
  if (!vehicle) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'En cours': return 'default';
      case 'À planifier': return 'secondary';
      case 'Terminé': return 'default';
      case 'Bloqué': return 'destructive';
      default: return 'outline';
    }
  };

  const getUrgencyIcon = (isUrgent?: boolean) => {
    if (isUrgent) {
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
    return <CheckCircle className="w-4 h-4 text-primary" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Détails du véhicule - {vehicle.licensePlate || vehicle.license_plate}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations véhicule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marque & Modèle</label>
                  <p className="font-medium">{vehicle.brand || vehicle.car_brands?.name} {vehicle.model || vehicle.car_models?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Immatriculation</label>
                  <p className="font-medium">{vehicle.licensePlate || vehicle.license_plate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Client</label>
                  <p className="font-medium">{vehicle.client || `${vehicle.clients?.first_name || ''} ${vehicle.clients?.last_name || ''}`.trim()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statut</label>
                  <Badge variant={getStatusVariant(vehicle.status)} className="mt-1">
                    {vehicle.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations tâche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="font-medium">{vehicle.description || 'Aucune description'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Durée estimée</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{vehicle.duration || 'Non définie'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Technicien assigné</label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{vehicle.technician || 'Non assigné'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix</label>
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    <span className="font-medium">{vehicle.price || 'Non défini'}</span>
                  </div>
                </div>
              </div>

              {vehicle.urgency && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getUrgencyIcon(vehicle.urgency === 'high')}
                    <span className="font-medium text-destructive">Véhicule urgent</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ce véhicule nécessite une attention prioritaire
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            
            <div className="flex gap-2">
              {vehicle.status === 'À planifier' && onPlan && (
                <Button onClick={onPlan} className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Planifier
                </Button>
              )}
              
              {vehicle.status === 'Bloqué' && onUnblock && (
                <Button variant="secondary" onClick={onUnblock}>
                  Débloquer
                </Button>
              )}
              
              {onModify && (
                <Button variant="outline" onClick={onModify}>
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};