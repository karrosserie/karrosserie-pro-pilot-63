import { useState } from 'react';
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
  Download,
  Plus
} from 'lucide-react';
import { DossierWithDetails } from '@/types/dossier';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import ExpertiseReportDialog from '@/components/expertise/ExpertiseReportDialog';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import RepairOrderDialog from '@/components/repair-orders/RepairOrderDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { CessionDialog } from '@/components/cessions/CessionDialog';
import { useCessions } from '@/hooks/use-cessions';
import { useQueryClient } from '@tanstack/react-query';

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
  <Card className="p-4 border-dashed border-2 bg-muted/20">
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconColor} opacity-50`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
        <Button 
          onClick={onAction}
          className="mt-3 gap-2 bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
          size="sm"
        >
          <Plus className="h-3 w-3" />
          {actionLabel}
        </Button>
      </div>
    </div>
  </Card>
);

type PreviewModalType = 'expertise' | 'quote' | 'repair_order' | 'invoice' | 'cession' | 'fleet' | null;
type CreateModalType = 'expertise' | 'quote' | 'repair_order' | 'invoice' | 'cession' | null;

export const DossierDocuments = ({ dossier }: DossierDocumentsProps) => {
  const queryClient = useQueryClient();
  const { createCession } = useCessions();
  
  // Preview modal state
  const [previewModalType, setPreviewModalType] = useState<PreviewModalType>(null);
  const [previewModalData, setPreviewModalData] = useState<any>(null);
  
  // Create modal state
  const [createModalType, setCreateModalType] = useState<CreateModalType>(null);
  const [isSubmittingCession, setIsSubmittingCession] = useState(false);

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

  const openPreviewModal = (type: PreviewModalType, data: any) => {
    setPreviewModalType(type);
    setPreviewModalData(data);
  };

  const closePreviewModal = () => {
    setPreviewModalType(null);
    setPreviewModalData(null);
  };

  const openCreateModal = (type: CreateModalType) => {
    setCreateModalType(type);
  };

  const closeCreateModal = () => {
    setCreateModalType(null);
  };

  const handleCreateSuccess = () => {
    closeCreateModal();
    // Invalidate dossier query to refresh documents
    queryClient.invalidateQueries({ queryKey: ['dossier', dossier.id] });
  };

  // Get client and vehicle data for prefilling forms
  const clientData = dossier.clients;
  const vehicleData = dossier.vehicles;

  // Prefill data for new documents
  const getExpertisePrefillData = () => ({
    client_id: clientData?.id,
    vehicle_id: vehicleData?.id,
    dossier_id: dossier.id,
  });

  const getQuotePrefillData = () => ({
    client_id: clientData?.id,
    vehicle_id: vehicleData?.id,
    dossier_id: dossier.id,
  });

  const getRepairOrderPrefillData = () => ({
    client_id: clientData?.id,
    vehicle_id: vehicleData?.id,
    dossier_id: dossier.id,
  });

  const getInvoicePrefillData = () => ({
    client_id: clientData?.id,
    vehicle_id: vehicleData?.id,
    dossier_id: dossier.id,
  });

  const handleCessionSubmit = async (formData: any) => {
    setIsSubmittingCession(true);
    try {
      await createCession.mutateAsync({
        ...formData,
        dossier_id: dossier.id,
      });
      toast.success('Cession créée avec succès');
      handleCreateSuccess();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmittingCession(false);
    }
  };

  // Placeholder actions using modals
  const handleCreateExpertise = () => openCreateModal('expertise');
  const handleCreateQuote = () => openCreateModal('quote');
  const handleCreateRepairOrder = () => openCreateModal('repair_order');
  const handleCreateInvoice = () => openCreateModal('invoice');
  const handleCreateCession = () => openCreateModal('cession');
  const handleCreateFleetReservation = () => {
    // Fleet reservation might need navigation since it's a complex module
    toast.info('Réservation de véhicule - fonctionnalité en cours de développement');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Expertise Reports Section */}
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
                onClick={() => openPreviewModal('expertise', report)}
                onDownload={() => handleDownload('rapport', report.report_number)}
              />
            ))}
            {expertiseReports.length === 0 && (
              <PlaceholderCard
                icon={ClipboardCheck}
                iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                title="Aucun rapport d'expertise"
                description="Créez un rapport d'expertise pour ce dossier"
                onAction={handleCreateExpertise}
                actionLabel="Créer"
              />
            )}
          </div>
        </div>

        {/* Quotes Section */}
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
                onClick={() => openPreviewModal('quote', quote)}
                onDownload={() => handleDownload('devis', quote.reference)}
              />
            ))}
            {quotes.length === 0 && (
              <PlaceholderCard
                icon={FileText}
                iconColor="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                title="Aucun devis"
                description="Créez un devis pour ce dossier"
                onAction={handleCreateQuote}
                actionLabel="Créer"
              />
            )}
          </div>
        </div>

        {/* Repair Orders Section */}
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
                onClick={() => openPreviewModal('repair_order', ro)}
                onDownload={() => handleDownload('ordre de réparation', ro.reference)}
              />
            ))}
            {repairOrders.length === 0 && (
              <PlaceholderCard
                icon={Wrench}
                iconColor="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                title="Aucun ordre de réparation"
                description="Créez un OR pour ce dossier"
                onAction={handleCreateRepairOrder}
                actionLabel="Créer"
              />
            )}
          </div>
        </div>

        {/* Invoices Section */}
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
                onClick={() => openPreviewModal('invoice', invoice)}
                onDownload={() => handleDownload('facture', invoice.reference)}
              />
            ))}
            {invoices.length === 0 && (
              <PlaceholderCard
                icon={Receipt}
                iconColor="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400"
                title="Aucune facture"
                description="Créez une facture pour ce dossier"
                onAction={handleCreateInvoice}
                actionLabel="Créer"
              />
            )}
          </div>
        </div>

        {/* Cessions Section */}
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
                onClick={() => openPreviewModal('cession', cession)}
                onDownload={() => handleDownload('cession', cession.reference)}
              />
            ))}
            {cessions.length === 0 && (
              <PlaceholderCard
                icon={FileSignature}
                iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                title="Aucune cession"
                description="Créez une cession pour ce dossier"
                onAction={handleCreateCession}
                actionLabel="Créer"
              />
            )}
          </div>
        </div>

        {/* Fleet Reservations Section */}
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
                onClick={() => openPreviewModal('fleet', reservation)}
              />
            ))}
            {fleetReservations.length === 0 && (
              <PlaceholderCard
                icon={Car}
                iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                title="Aucune réservation"
                description="Réservez un véhicule de remplacement"
                onAction={handleCreateFleetReservation}
                actionLabel="Réserver"
              />
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModalType && (
        <DocumentPreviewModal
          open={!!previewModalType}
          onOpenChange={(open) => !open && closePreviewModal()}
          type={previewModalType}
          data={previewModalData}
        />
      )}

      {/* Create Modals */}
      <ExpertiseReportDialog
        open={createModalType === 'expertise'}
        onOpenChange={(open) => !open && closeCreateModal()}
        report={null}
        prefillData={getExpertisePrefillData()}
        onSuccess={handleCreateSuccess}
      />

      <QuoteDialog
        open={createModalType === 'quote'}
        onOpenChange={(open) => !open && closeCreateModal()}
        quote={null}
        prefillData={getQuotePrefillData()}
      />

      <RepairOrderDialog
        open={createModalType === 'repair_order'}
        onOpenChange={(open) => !open && closeCreateModal()}
        order={null}
        onSuccess={handleCreateSuccess}
        prefillData={getRepairOrderPrefillData()}
      />

      <InvoiceDialog
        open={createModalType === 'invoice'}
        onOpenChange={(open) => !open && closeCreateModal()}
        invoice={null}
        onSuccess={handleCreateSuccess}
        prefillData={getInvoicePrefillData()}
      />

      <CessionDialog
        open={createModalType === 'cession'}
        onOpenChange={(open) => !open && closeCreateModal()}
        cession={null}
        onSubmit={handleCessionSubmit}
        isSubmitting={isSubmittingCession}
      />
    </>
  );
};