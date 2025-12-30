import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, MoreVertical, Eye, Archive, Car } from 'lucide-react';
import { Dossier, DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DossierCardProps {
  dossier: Dossier;
  onView: (id: string) => void;
  onArchive: (id: string) => void;
}

export const DossierCard = ({ dossier, onView, onArchive }: DossierCardProps) => {
  const client = dossier.clients;
  const vehicle = dossier.vehicles;
  const status = dossier.overall_status as DossierOverallStatus;
  const statusConfig = status ? DOSSIER_STATUS_CONFIG[status] : null;

  const clientName = client 
    ? client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() 
    : 'Client inconnu';

  const vehicleInfo = vehicle 
    ? `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim() 
    : null;

  return (
    <div 
      className="bg-card shadow-sm rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer border"
      onClick={() => onView(dossier.id)}
    >
      {/* Row layout: Client | Vehicle | Status+Date | Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Client name + phone */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-bold text-foreground truncate">{clientName}</span>
          {client?.phone && (
            <a 
              href={`tel:${client.phone}`}
              className="text-muted-foreground hover:text-primary flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Center: Vehicle plate badge + marque/modèle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {vehicle?.license_plate && (
            <Badge variant="outline" className="font-mono text-xs">
              <Car className="h-3 w-3 mr-1" />
              {vehicle.license_plate}
            </Badge>
          )}
          {vehicleInfo && (
            <span className="text-sm text-muted-foreground hidden sm:inline">{vehicleInfo}</span>
          )}
        </div>

        {/* Right: Status badge + created date */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {statusConfig && (
            <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-xs')}>
              {statusConfig.label}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground hidden md:inline">
            {format(new Date(dossier.created_at), 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onView(dossier.id);
            }}>
              <Eye className="h-4 w-4 mr-2" />
              Voir le dossier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onArchive(dossier.id);
            }}>
              <Archive className="h-4 w-4 mr-2" />
              Archiver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
