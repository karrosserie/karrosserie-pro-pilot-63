import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ClipboardCheck, 
  FileText, 
  Wrench, 
  Receipt,
  Car,
  FileSignature,
  Download,
  Calendar,
  Euro,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

type DocumentType = 'expertise' | 'quote' | 'repair_order' | 'invoice' | 'cession' | 'fleet';

interface DocumentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DocumentType;
  data: any;
}

const DOCUMENT_CONFIG: Record<DocumentType, {
  title: string;
  icon: React.ElementType;
  iconColor: string;
}> = {
  expertise: {
    title: "Rapport d'expertise",
    icon: ClipboardCheck,
    iconColor: 'text-purple-500',
  },
  quote: {
    title: 'Devis',
    icon: FileText,
    iconColor: 'text-indigo-500',
  },
  repair_order: {
    title: 'Ordre de réparation',
    icon: Wrench,
    iconColor: 'text-green-500',
  },
  invoice: {
    title: 'Facture',
    icon: Receipt,
    iconColor: 'text-cyan-500',
  },
  cession: {
    title: 'Cession',
    icon: FileSignature,
    iconColor: 'text-amber-500',
  },
  fleet: {
    title: 'Réservation véhicule',
    icon: Car,
    iconColor: 'text-blue-500',
  },
};

export const DocumentPreviewModal = ({ 
  open, 
  onOpenChange, 
  type, 
  data 
}: DocumentPreviewModalProps) => {
  const config = DOCUMENT_CONFIG[type];
  const Icon = config.icon;

  const handleDownload = () => {
    toast.info(`Téléchargement du ${config.title} en cours...`);
  };

  const handlePreview = () => {
    // For expertise, just show the file if available
    if (type === 'expertise' && data?.file_url) {
      window.open(data.file_url, '_blank');
    } else {
      toast.info(`Aperçu du ${config.title}`);
    }
  };

  const renderContent = () => {
    if (!data) return null;

    switch (type) {
      case 'expertise':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Numéro de rapport</p>
                <p className="font-medium">{data.report_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <Badge variant="outline">{data.status || 'En cours'}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date du rapport</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.report_date ? format(new Date(data.report_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Montant</p>
                <p className="font-medium text-[hsl(var(--karrosserie-orange))] flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  {data.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || 'N/A'}
                </p>
              </div>
            </div>
            {data.expert_name && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Expert</p>
                <p className="font-medium">{data.expert_name}</p>
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Référence</p>
                <p className="font-medium font-mono">{data.reference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <Badge variant="outline">{data.status || 'Brouillon'}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date de création</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.created_at ? format(new Date(data.created_at), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Montant TTC</p>
                <p className="font-medium text-[hsl(var(--karrosserie-orange))] flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  {data.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || 'N/A'}
                </p>
              </div>
            </div>
            {data.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{data.notes}</p>
              </div>
            )}
          </div>
        );

      case 'repair_order':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Référence</p>
                <p className="font-medium font-mono">{data.reference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <Badge variant="outline">{data.status || 'En cours'}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date d'arrivée</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.arrival_date ? format(new Date(data.arrival_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date de fin prévue</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.end_date ? format(new Date(data.end_date), 'dd/MM/yyyy', { locale: fr }) : 'En cours'}
                </p>
              </div>
            </div>
            {data.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{data.notes}</p>
              </div>
            )}
          </div>
        );

      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Référence</p>
                <p className="font-medium font-mono">{data.reference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <Badge variant="outline">{data.status || 'Brouillon'}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date d'émission</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.issue_date ? format(new Date(data.issue_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Montant TTC</p>
                <p className="font-medium text-[hsl(var(--karrosserie-orange))] flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  {data.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || 'N/A'}
                </p>
              </div>
            </div>
            {data.due_date && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date d'échéance</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(data.due_date), 'dd/MM/yyyy', { locale: fr })}
                </p>
              </div>
            )}
          </div>
        );

      case 'cession':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Référence</p>
                <p className="font-medium font-mono">{data.reference}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <Badge variant="outline">
                  {data.cession_type === 'creance' ? 'Cession de créance' : 'Cession'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <Badge variant="outline">{data.status || 'En attente'}</Badge>
              </div>
              {data.loan_amount && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Montant</p>
                  <p className="font-medium text-[hsl(var(--karrosserie-orange))] flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {data.loan_amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'fleet':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <Badge variant="outline">{data.status || 'Actif'}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Période</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.start_date ? format(new Date(data.start_date), 'dd/MM', { locale: fr }) : '...'} - {data.expected_return_date ? format(new Date(data.expected_return_date), 'dd/MM', { locale: fr }) : '...'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // For expertise type, only show download and preview (no "voir détails" navigation)
  const isFileBasedDocument = type === 'expertise';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-muted`}>
              <Icon className={`h-4 w-4 ${config.iconColor}`} />
            </div>
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {renderContent()}
        </div>

        <Separator />

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Télécharger PDF
          </Button>
          {isFileBasedDocument ? (
            <Button 
              className="flex-1 gap-2 bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
              Aperçu
            </Button>
          ) : (
            <Button 
              variant="secondary"
              className="flex-1 gap-2"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
