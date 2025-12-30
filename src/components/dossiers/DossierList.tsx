import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, MoreVertical, Eye, Archive, Car, FolderOpen } from 'lucide-react';
import { Dossier, DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { DossierCard } from './DossierCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DossierListProps {
  dossiers: Dossier[];
  isLoading: boolean;
  onView: (id: string) => void;
  onArchive: (id: string) => void;
  onCreateNew?: () => void;
}

export const DossierList = ({ dossiers, isLoading, onView, onArchive, onCreateNew }: DossierListProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (dossiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">Aucun dossier trouvé</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Aucun dossier ne correspond à vos critères de recherche
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="outline">
            Créer un nouveau dossier
          </Button>
        )}
      </div>
    );
  }

  // Mobile: use cards
  if (isMobile) {
    return (
      <div className="space-y-3">
        {dossiers.map((dossier) => (
          <DossierCard
            key={dossier.id}
            dossier={dossier}
            onView={onView}
            onArchive={onArchive}
          />
        ))}
      </div>
    );
  }

  // Desktop: use table
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>N° Sinistre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date création</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dossiers.map((dossier) => {
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
              <TableRow 
                key={dossier.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onView(dossier.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{clientName}</span>
                    {client?.phone && (
                      <a 
                        href={`tel:${client.phone}`}
                        className="text-muted-foreground hover:text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {vehicle?.license_plate && (
                      <Badge variant="outline" className="font-mono">
                        <Car className="h-3 w-3 mr-1" />
                        {vehicle.license_plate}
                      </Badge>
                    )}
                    {vehicleInfo && (
                      <span className="text-sm text-muted-foreground">{vehicleInfo}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {dossier.claim_number || '-'}
                </TableCell>
                <TableCell>
                  {statusConfig && (
                    <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0')}>
                      {statusConfig.label}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(dossier.created_at), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
