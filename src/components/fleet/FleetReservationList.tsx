
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

interface FleetReservation {
  id: string;
  client_id: string;
  fleet_vehicle_id: string;
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  fleet_vehicles?: {
    brand: string;
    model: string;
    license_plate: string;
  };
}

interface FleetReservationListProps {
  reservations: FleetReservation[];
  onEdit: (reservation: FleetReservation) => void;
}

const FleetReservationList: React.FC<FleetReservationListProps> = ({ reservations, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminée':
        return 'bg-gray-100 text-gray-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Début</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Aucune réservation trouvée
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  {reservation.clients 
                    ? `${reservation.clients.first_name} ${reservation.clients.last_name}`
                    : 'Client inconnu'
                  }
                </TableCell>
                <TableCell>
                  {reservation.fleet_vehicles 
                    ? `${reservation.fleet_vehicles.brand} ${reservation.fleet_vehicles.model} - ${reservation.fleet_vehicles.license_plate}`
                    : 'Véhicule inconnu'
                  }
                </TableCell>
                <TableCell>{formatDate(reservation.start_date)}</TableCell>
                <TableCell>{formatDate(reservation.end_date)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(reservation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FleetReservationList;
