import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, 
  FileText, 
  Wrench, 
  Receipt,
  Car,
  FileSignature,
  ExternalLink,
  Download
} from 'lucide-react';
import { DossierWithDetails } from '@/types/dossier';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DossierDocumentsProps {
  dossier: DossierWithDetails;
}

interface DocumentCardProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  reference?: string;
  status?: string;
  statusColor?: string;
  date?: string;
  amount?: number;
  onClick?: () => void;
  onDownload?: () => void;
}

interface PlaceholderCardProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  onAction: () => void;
  actionLabel: string;
}

const DocumentCard = ({ 
  icon: Icon, 
  iconColor, 
  title, 
  reference, 
  status, 
  statusColor,
  date,
  amount,
  onClick,
  onDownload
}: DocumentCardProps) => (
  <Card 
    className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm text-foreground truncate">{title}</h4>
          <div className="flex items-center gap-1">
            {onDownload && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); onDownload(); }}
              >
                <Download className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </div>
        {reference && (
          <p className="text-xs text-muted-foreground font-mono">{reference}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {status && (
            <Badge variant="outline" className={`text-xs ${statusColor || ''}`}>
              {status}
            </Badge>
          )}
          {date && (
            <span className="text-xs text-muted-foreground">{date}</span>
          )}
        </div>
        {amount !== undefined && (
          <p className="text-sm font-semibold text-foreground mt-1">
            {amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        )}
      </div>
    </div>
  </Card>
);

const PlaceholderCard = ({
  icon: Icon,
  iconColor,
  title,
  description,
  onAction,
  actionLabel
}: PlaceholderCardProps) => (
  <Card className="p-4 border-dashed">
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <Button 
          onClick={onAction}
          className="mt-3 w-full bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
          size="sm"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  </Card>
);

export const DossierDocuments = ({ dossier }: DossierDocumentsProps) => {
  const navigate = useNavigate();

  // Normalize to arrays (handle single object or array from API)
  const expertiseReports = dossier.expertise_reports 
    ? (Array.isArray(dossier.expertise_reports) ? dossier.expertise_reports : [dossier.expertise_reports])
    : [];
  const quotes = dossier.quotes
    ? (Array.isArray(dossier.quotes) ? dossier.quotes : [dossier.quotes])
    : [];
  const repairOrders = dossier.repair_orders
    ? (Array.isArray(dossier.repair_orders) ? dossier.repair_orders : [dossier.repair_orders])
    : [];
  const invoices = dossier.invoices || [];
  const cessions = dossier.cessions
    ? (Array.isArray(dossier.cessions) ? dossier.cessions : [dossier.cessions])
    : [];
  const fleetReservations = dossier.fleet_reservations
    ? (Array.isArray(dossier.fleet_reservations) ? dossier.fleet_reservations : [dossier.fleet_reservations])
    : [];

  const handleDownload = (type: string, reference?: string) => {
    toast.info(`Téléchargement du ${type} ${reference || ''} en cours...`);
  };

  return (
    <div className="space-y-6">`
      {/* Expertise Reports */}
      {expertiseReports.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-purple-600" />
            Rapports d'expertise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertiseReports.map((report: any) => (
              <DocumentCard
                key={report.id}
                icon={ClipboardCheck}
                iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                title="Rapport d'expertise"
                reference={report.report_number}
                status={report.status}
                statusColor="text-purple-700 dark:text-purple-300"
                date={report.report_date ? format(new Date(report.report_date), 'dd MMM yyyy', { locale: fr }) : undefined}
                amount={report.amount}
                onClick={() => navigate(`/documents/expertise?openReport=${report.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quotes */}
      {quotes.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            Devis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote: any) => (
              <DocumentCard
                key={quote.id}
                icon={FileText}
                iconColor="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                title="Devis"
                reference={quote.reference}
                status={quote.status}
                statusColor="text-indigo-700 dark:text-indigo-300"
                date={quote.created_at ? format(new Date(quote.created_at), 'dd MMM yyyy', { locale: fr }) : undefined}
                amount={quote.amount}
                onClick={() => navigate(`/documents/devis?openQuote=${quote.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Repair Orders */}
      {repairOrders.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-green-600" />
            Ordres de réparation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repairOrders.map((ro: any) => (
              <DocumentCard
                key={ro.id}
                icon={Wrench}
                iconColor="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                title="Ordre de réparation"
                reference={ro.reference}
                status={ro.status}
                statusColor="text-green-700 dark:text-green-300"
                date={ro.arrival_date ? format(new Date(ro.arrival_date), 'dd MMM yyyy', { locale: fr }) : undefined}
                onClick={() => navigate(`/documents/ordres?openOrder=${ro.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Invoices */}
      {invoices.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Receipt className="h-4 w-4 text-cyan-600" />
            Factures
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice: any) => (
              <DocumentCard
                key={invoice.id}
                icon={Receipt}
                iconColor="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400"
                title="Facture"
                reference={invoice.reference}
                status={invoice.status}
                statusColor="text-cyan-700 dark:text-cyan-300"
                date={invoice.issue_date ? format(new Date(invoice.issue_date), 'dd MMM yyyy', { locale: fr }) : undefined}
                amount={invoice.amount}
                onClick={() => navigate(`/documents/factures?openInvoice=${invoice.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cessions */}
      {cessions.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-amber-600" />
            Cessions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cessions.map((cession: any) => (
              <DocumentCard
                key={cession.id}
                icon={FileSignature}
                iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                title={cession.cession_type === 'creance' ? 'Cession de créance' : 'Cession'}
                reference={cession.reference}
                status={cession.status}
                statusColor="text-amber-700 dark:text-amber-300"
                onClick={() => navigate(`/cessions?openCession=${cession.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fleet Reservations */}
      {fleetReservations.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Car className="h-4 w-4 text-blue-600" />
            Véhicules de remplacement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fleetReservations.map((reservation: any) => (
              <DocumentCard
                key={reservation.id}
                icon={Car}
                iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                title="Réservation véhicule"
                status={reservation.status}
                statusColor="text-blue-700 dark:text-blue-300"
                date={reservation.start_date ? `${format(new Date(reservation.start_date), 'dd/MM', { locale: fr })} - ${reservation.expected_return_date ? format(new Date(reservation.expected_return_date), 'dd/MM', { locale: fr }) : '...'}` : undefined}
                onClick={() => navigate(`/fleet/reservations?openReservation=${reservation.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
