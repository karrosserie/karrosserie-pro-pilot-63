import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Clock,
  FolderOpen,
  ClipboardCheck,
  FileText,
  Wrench,
  Receipt,
  FileSignature,
  Car
} from 'lucide-react';
import { DossierWithDetails, DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DossierHistoryProps {
  dossier: DossierWithDetails;
}

interface HistoryEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  status?: DossierOverallStatus;
  icon?: React.ElementType;
  iconColor?: string;
}

export const DossierHistory = ({ dossier }: DossierHistoryProps) => {
  // Build timeline events from dossier data
  const historyEvents: HistoryEvent[] = [];

  // 1. Dossier creation
  historyEvents.push({
    id: 'created',
    type: 'creation',
    title: 'Dossier créé',
    description: `Dossier ouvert avec le statut initial`,
    date: dossier.created_at,
    status: 'ouvert' as DossierOverallStatus,
    icon: FolderOpen,
    iconColor: 'text-blue-500',
  });

  // 2. Expertise reports
  const expertiseReports = dossier.expertise_reports
    ? (Array.isArray(dossier.expertise_reports) ? dossier.expertise_reports : [dossier.expertise_reports])
    : [];
  expertiseReports.forEach((report: any, idx) => {
    if (report.report_date) {
      historyEvents.push({
        id: `expertise-${report.id}`,
        type: 'expertise',
        title: 'Rapport d\'expertise créé',
        description: `Rapport ${report.report_number || `#${idx + 1}`}`,
        date: report.report_date,
        icon: ClipboardCheck,
        iconColor: 'text-purple-500',
      });
    }
  });

  // 3. Quotes
  const quotes = dossier.quotes
    ? (Array.isArray(dossier.quotes) ? dossier.quotes : [dossier.quotes])
    : [];
  quotes.forEach((quote: any) => {
    if (quote.created_at) {
      historyEvents.push({
        id: `quote-${quote.id}`,
        type: 'devis',
        title: 'Devis créé',
        description: `Devis ${quote.reference}`,
        date: quote.created_at,
        icon: FileText,
        iconColor: 'text-indigo-500',
      });
    }
  });

  // 4. Repair orders
  const repairOrders = dossier.repair_orders
    ? (Array.isArray(dossier.repair_orders) ? dossier.repair_orders : [dossier.repair_orders])
    : [];
  repairOrders.forEach((ro: any) => {
    if (ro.arrival_date) {
      historyEvents.push({
        id: `ro-${ro.id}`,
        type: 'reparation',
        title: 'Réparation démarrée',
        description: `OR ${ro.reference}`,
        date: ro.arrival_date,
        icon: Wrench,
        iconColor: 'text-green-500',
      });
    }
    if (ro.end_date) {
      historyEvents.push({
        id: `ro-end-${ro.id}`,
        type: 'reparation-end',
        title: 'Réparation terminée',
        description: `OR ${ro.reference} finalisé`,
        date: ro.end_date,
        icon: Wrench,
        iconColor: 'text-green-600',
      });
    }
  });

  // 5. Invoices
  const invoices = dossier.invoices || [];
  invoices.forEach((invoice: any) => {
    if (invoice.issue_date) {
      historyEvents.push({
        id: `invoice-${invoice.id}`,
        type: 'facturation',
        title: 'Facture émise',
        description: `Facture ${invoice.reference}`,
        date: invoice.issue_date,
        icon: Receipt,
        iconColor: 'text-cyan-500',
      });
    }
  });

  // 6. Cessions
  const cessions = dossier.cessions
    ? (Array.isArray(dossier.cessions) ? dossier.cessions : [dossier.cessions])
    : [];
  cessions.forEach((cession: any) => {
    if (cession.created_at) {
      historyEvents.push({
        id: `cession-${cession.id}`,
        type: 'cession',
        title: cession.cession_type === 'creance' ? 'Cession de créance créée' : 'Cession créée',
        description: `Cession ${cession.reference}`,
        date: cession.created_at,
        icon: FileSignature,
        iconColor: 'text-amber-500',
      });
    }
  });

  // 7. Fleet reservations
  const fleetReservations = dossier.fleet_reservations
    ? (Array.isArray(dossier.fleet_reservations) ? dossier.fleet_reservations : [dossier.fleet_reservations])
    : [];
  fleetReservations.forEach((res: any) => {
    if (res.start_date) {
      historyEvents.push({
        id: `fleet-${res.id}`,
        type: 'fleet',
        title: 'Véhicule de remplacement attribué',
        description: `Réservation du ${format(new Date(res.start_date), 'dd/MM/yyyy', { locale: fr })}`,
        date: res.start_date,
        icon: Car,
        iconColor: 'text-blue-500',
      });
    }
  });

  // 8. Status change (if updated_at differs from created_at)
  if (dossier.updated_at && dossier.updated_at !== dossier.created_at) {
    const status = dossier.overall_status as DossierOverallStatus;
    const statusConfig = status ? DOSSIER_STATUS_CONFIG[status] : null;
    historyEvents.push({
      id: 'status-update',
      type: 'status-change',
      title: 'Statut mis à jour',
      description: statusConfig ? `Passage en "${statusConfig.label}"` : 'Statut modifié',
      date: dossier.updated_at,
      status: status,
      icon: History,
      iconColor: 'text-[hsl(var(--karrosserie-orange))]',
    });
  }

  // Sort by date descending (most recent first)
  const sortedEvents = historyEvents.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-6 text-foreground flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        Historique du dossier
      </h3>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun historique disponible</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
          
          <div className="space-y-6">
            {sortedEvents.map((event, index) => {
              const statusConfig = event.status ? DOSSIER_STATUS_CONFIG[event.status] : null;
              const Icon = event.icon || History;
              
              return (
                <div key={event.id} className="relative flex gap-4 pl-10">
                  {/* Timeline dot with icon */}
                  <div 
                    className={cn(
                      "absolute left-1 w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center",
                      index === 0 ? "border-[hsl(var(--karrosserie-orange))]" : "border-muted"
                    )}
                  >
                    <Icon className={cn("h-3 w-3", event.iconColor || "text-muted-foreground")} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{event.title}</span>
                      {statusConfig && (
                        <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0 text-xs')}>
                          {statusConfig.label}
                        </Badge>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(event.date), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
