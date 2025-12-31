import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Car,
  User,
  MapPin,
  FileText,
  Pencil
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FleetReservationPreviewContentProps {
  data: any;
  onClose: () => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'actif':
      return 'default';
    case 'completed':
    case 'terminée':
      return 'secondary';
    case 'cancelled':
    case 'annulée':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const FleetReservationPreviewContent = ({ data, onClose }: FleetReservationPreviewContentProps) => {
  const vehicleInfo = data?.fleet_vehicles;
  
  return (
    <div className="space-y-4">
      {/* Reservation info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Statut</p>
          <Badge variant={getStatusBadgeVariant(data?.status)}>
            {data?.status || 'Actif'}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Période</p>
          <p className="font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {data?.start_date ? format(new Date(data.start_date), 'dd/MM/yyyy', { locale: fr }) : '...'} 
            {' - '} 
            {data?.expected_return_date ? format(new Date(data.expected_return_date), 'dd/MM/yyyy', { locale: fr }) : '...'}
          </p>
        </div>
      </div>

      {/* Vehicle info */}
      {vehicleInfo && (
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {vehicleInfo.brand} {vehicleInfo.model}
            </span>
          </div>
          {vehicleInfo.license_plate && (
            <p className="text-sm text-muted-foreground ml-6">
              Immatriculation: {vehicleInfo.license_plate}
            </p>
          )}
        </div>
      )}

      {/* Dates détaillées */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Date de départ</p>
          <p className="font-medium">
            {data?.start_date ? format(new Date(data.start_date), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Retour prévu</p>
          <p className="font-medium">
            {data?.expected_return_date ? format(new Date(data.expected_return_date), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
          </p>
        </div>
      </div>

      {data?.actual_return_date && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Retour effectif</p>
          <p className="font-medium">
            {format(new Date(data.actual_return_date), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
      )}

      {data?.notes && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Notes</p>
          <p className="text-sm">{data.notes}</p>
        </div>
      )}

      <Separator />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    </div>
  );
};
