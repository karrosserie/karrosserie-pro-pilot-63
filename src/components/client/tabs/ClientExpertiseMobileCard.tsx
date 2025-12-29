import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface ClientExpertiseMobileCardProps {
  report: ExpertiseReport;
  isConverted: boolean;
  onDownload: (report: ExpertiseReport) => void;
  onDelete: (id: string) => void;
}

const ClientExpertiseMobileCard: React.FC<ClientExpertiseMobileCardProps> = ({
  report,
  isConverted,
  onDownload,
  onDelete
}) => {
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'converti':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'en cours':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'importé':
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const status = isConverted ? 'Converti' : (report.status || 'Importé');

  const vehicleDisplay = report.vehicles 
    ? `${report.vehicles.car_brands?.name || ''} ${report.vehicles.car_models?.name || ''} - ${report.vehicles.license_plate || ''}`
    : 'Non assigné';

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-foreground">{report.report_number || 'Non spécifié'}</p>
            <p className="text-sm text-muted-foreground">{formatDate(report.report_date)}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(status)} font-medium`}
          >
            {status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Véhicule:</span>
            <p className="font-medium truncate">{vehicleDisplay}</p>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Montant:</span>
            <p className="font-semibold text-primary">{formatAmount(report.amount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDownload(report)} 
            title="Télécharger"
            disabled={!report.document_url}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(report.id)} 
            title="Supprimer"
            className="text-destructive hover:text-destructive"
            disabled={isConverted}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientExpertiseMobileCard;
