import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
    <Card className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Client info */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{clientName}</h3>
            {client?.phone && (
              <a 
                href={`tel:${client.phone}`}
                className="text-muted-foreground hover:text-primary flex-shrink-0"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Vehicle badge */}
          {vehicle && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                <Car className="h-3 w-3 mr-1" />
                {vehicle.license_plate || 'N/A'}
              </Badge>
              {vehicleInfo && (
                <span className="text-sm text-muted-foreground truncate">{vehicleInfo}</span>
              )}
            </div>
          )}

          {/* Claim number */}
          {dossier.claim_number && (
            <p className="text-sm text-muted-foreground">
              Sinistre: {dossier.claim_number}
            </p>
          )}

          {/* Status and date */}
          <div className="flex items-center gap-3 flex-wrap">
            {statusConfig && (
              <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0')}>
                {statusConfig.label}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              Créé le {format(new Date(dossier.created_at), 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(dossier.id)}>
              <Eye className="h-4 w-4 mr-2" />
              Voir le dossier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(dossier.id)}>
              <Archive className="h-4 w-4 mr-2" />
              Archiver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
