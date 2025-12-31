import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, MoreVertical, Eye, Archive, Car, Building2, Calendar } from 'lucide-react';
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
  const insurance = dossier.insurance_companies;
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
      className={cn(
        "bg-card rounded-lg p-4 cursor-pointer border transition-all",
        "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
        "hover:bg-muted/30"
      )}
      onClick={() => onView(dossier.id)}
    >
      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">{clientName}</p>
            {client?.phone && (
              <a 
                href={`tel:${client.phone}`}
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3 w-3" />
                {client.phone}
              </a>
            )}
          </div>
          {statusConfig && (
            <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-xs shrink-0')}>
              {statusConfig.label}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {vehicle?.license_plate && (
            <Badge variant="outline" className="font-mono text-xs">
              <Car className="h-3 w-3 mr-1" />
              {vehicle.license_plate}
            </Badge>
          )}
          {vehicleInfo && (
            <span className="text-xs text-muted-foreground">{vehicleInfo}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(dossier.created_at), 'dd/MM/yyyy', { locale: fr })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(dossier.id); }}>
                <Eye className="h-4 w-4 mr-2" />
                Voir le dossier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(dossier.id); }}>
                <Archive className="h-4 w-4 mr-2" />
                Archiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Layout - Table-like row */}
      <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_120px_100px_auto] md:items-center md:gap-4">
        {/* Reference / Client */}
        <div className="min-w-0">
          <p className="font-mono text-sm text-primary font-medium truncate">
            {dossier.reference || `DOS-${dossier.id.slice(0, 8).toUpperCase()}`}
          </p>
          <p className="text-sm text-foreground truncate">{clientName}</p>
          {client?.phone && (
            <p className="text-xs text-muted-foreground">{client.phone}</p>
          )}
        </div>

        {/* Vehicle */}
        <div className="min-w-0">
          {vehicle?.license_plate && (
            <Badge variant="outline" className="font-mono text-xs mb-1">
              {vehicle.license_plate}
            </Badge>
          )}
          {vehicleInfo && (
            <p className="text-xs text-muted-foreground truncate">{vehicleInfo}</p>
          )}
        </div>

        {/* Insurance */}
        <div className="min-w-0">
          {insurance?.name ? (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate">{insurance.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        {/* Status */}
        <div>
          {statusConfig && (
            <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-xs')}>
              {statusConfig.label}
            </Badge>
          )}
        </div>

        {/* Date */}
        <div className="text-sm text-muted-foreground">
          {format(new Date(dossier.created_at), 'dd/MM/yyyy', { locale: fr })}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(dossier.id); }}>
                <Eye className="h-4 w-4 mr-2" />
                Voir le dossier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(dossier.id); }}>
                <Archive className="h-4 w-4 mr-2" />
                Archiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
