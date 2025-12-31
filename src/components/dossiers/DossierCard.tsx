import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, MoreVertical, Eye, Archive, Car, Building2, Calendar, FileText, Trash2 } from 'lucide-react';
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

  const dossierReference = dossier.reference || `DOS-${dossier.id.slice(0, 8).toUpperCase()}`;

  return (
    <div 
      className={cn(
        "group bg-card transition-colors duration-150 cursor-pointer",
        "hover:bg-muted/40"
      )}
      onClick={() => onView(dossier.id)}
    >
      {/* Mobile Layout */}
      <div className="md:hidden p-4 space-y-3">
        {/* Header: Reference + Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-sm font-semibold text-[hsl(var(--karrosserie-orange))]">
              {dossierReference}
            </span>
            {statusConfig && (
              <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-[10px] px-2 py-0.5 shrink-0')}>
                {statusConfig.label}
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(dossier.id); }}>
                <Eye className="h-4 w-4 mr-2" />
                Voir le dossier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(dossier.id); }}>
                <Archive className="h-4 w-4 mr-2" />
                Archiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Client Info */}
        <div className="space-y-1">
          <p className="font-medium text-foreground truncate">{clientName}</p>
          {client?.phone && (
            <a 
              href={`tel:${client.phone}`}
              className="text-sm text-muted-foreground hover:text-[hsl(var(--karrosserie-orange))] flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-3.5 w-3.5" />
              {client.phone}
            </a>
          )}
        </div>

        {/* Vehicle & Date Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {vehicle?.license_plate && (
              <Badge variant="outline" className="font-mono text-xs bg-muted/50">
                <Car className="h-3 w-3 mr-1.5" />
                {vehicle.license_plate}
              </Badge>
            )}
            {vehicleInfo && (
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{vehicleInfo}</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(dossier.created_at), 'dd MMM', { locale: fr })}
          </span>
        </div>
      </div>

      {/* Desktop Layout - Table row matching header columns */}
      <div className="hidden md:grid md:grid-cols-[180px_1.2fr_1fr_1fr_100px_48px] md:items-center md:gap-4 md:px-5 md:py-3">
        {/* Reference */}
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold text-[hsl(var(--karrosserie-orange))] truncate">
            {dossierReference}
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            {format(new Date(dossier.created_at), 'dd/MM/yyyy', { locale: fr })}
          </span>
        </div>

        {/* Client */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{clientName}</p>
          {client?.phone && (
            <a 
              href={`tel:${client.phone}`}
              className="text-xs text-muted-foreground hover:text-[hsl(var(--karrosserie-orange))] flex items-center gap-1 mt-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-3 w-3" />
              {client.phone}
            </a>
          )}
        </div>

        {/* Vehicle */}
        <div className="min-w-0">
          {vehicle?.license_plate && (
            <Badge variant="outline" className="font-mono text-xs bg-muted/30 mb-0.5">
              {vehicle.license_plate}
            </Badge>
          )}
          {vehicleInfo && (
            <p className="text-xs text-muted-foreground truncate">{vehicleInfo}</p>
          )}
          {!vehicle?.license_plate && !vehicleInfo && (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        {/* Insurance */}
        <div className="min-w-0">
          {insurance?.name ? (
            <>
              <span className="text-sm text-foreground truncate block">{insurance.name}</span>
              {dossier.claim_number && (
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                  N° {dossier.claim_number}
                </p>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        {/* Status */}
        <div>
          {statusConfig && (
            <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-[11px] font-medium whitespace-nowrap')}>
              {statusConfig.label}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(dossier.id); }}>
                <Eye className="h-4 w-4 mr-2" />
                Voir le dossier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
