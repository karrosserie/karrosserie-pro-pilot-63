
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FleetReservationForm from './FleetReservationForm';

interface FleetReservationDialogProps {
  reservation: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FleetReservationDialog: React.FC<FleetReservationDialogProps> = ({
  reservation,
  open,
  onOpenChange
}) => {
  const title = reservation?.id ? 'Modifier la réservation' : 'Nouvelle réservation';
  const description = reservation?.id
    ? 'Modifiez les détails de la réservation.'
    : 'Créez une nouvelle réservation de véhicule de courtoisie.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FleetReservationForm 
          reservation={reservation}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FleetReservationDialog;
