import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download,
  Eye,
  Calendar,
  Euro,
  User,
  FileText,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExpertisePreviewContentProps {
  data: any;
  onClose: () => void;
}

export const ExpertisePreviewContent = ({ data, onClose }: ExpertisePreviewContentProps) => {
  const handleDownload = async () => {
    if (!data?.file_url) {
      toast.error("Aucun fichier disponible pour ce rapport");
      return;
    }

    try {
      // Get the file from storage
      const fileName = data.file_url.split('/').pop();
      const { data: fileData, error } = await supabase.storage
        .from('expertise-reports')
        .download(fileName);

      if (error) {
        console.error('Download error:', error);
        toast.error("Erreur lors du téléchargement");
        return;
      }

      // Create download link
      const url = URL.createObjectURL(fileData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-expertise-${data.report_number || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Téléchargement réussi");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handlePreview = () => {
    if (data?.file_url) {
      window.open(data.file_url, '_blank');
    } else {
      toast.error("Aucun fichier disponible pour l'aperçu");
    }
  };

  const handlePrint = () => {
    if (data?.file_url) {
      const printWindow = window.open(data.file_url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      toast.error("Aucun fichier disponible pour l'impression");
    }
  };

  return (
    <div className="space-y-4">
      {/* Document info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Numéro de rapport</p>
          <p className="font-medium font-mono">{data?.report_number || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Statut</p>
          <Badge variant="outline">{data?.status || 'En cours'}</Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Date du rapport</p>
          <p className="font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {data?.report_date ? format(new Date(data.report_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Montant</p>
          <p className="font-medium text-primary flex items-center gap-1">
            <Euro className="h-3 w-3" />
            {data?.amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || 'N/A'}
          </p>
        </div>
      </div>

      {data?.expert_name && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Expert</p>
          <p className="font-medium flex items-center gap-1">
            <User className="h-3 w-3" />
            {data.expert_name}
          </p>
        </div>
      )}

      {data?.notes && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Notes</p>
          <p className="text-sm">{data.notes}</p>
        </div>
      )}

      {!data?.file_url && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Aucun fichier attaché à ce rapport</p>
        </div>
      )}

      <Separator />

      {/* Action buttons - matching main Documents module CTAs */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 gap-2"
          onClick={handleDownload}
          disabled={!data?.file_url}
        >
          <Download className="h-4 w-4" />
          Télécharger
        </Button>
        <Button 
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handlePrint}
          disabled={!data?.file_url}
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
        <Button 
          size="sm"
          className="flex-1 gap-2"
          onClick={handlePreview}
          disabled={!data?.file_url}
        >
          <Eye className="h-4 w-4" />
          Aperçu
        </Button>
      </div>
    </div>
  );
};
