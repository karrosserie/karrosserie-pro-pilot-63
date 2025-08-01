
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash, Download, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ExpertiseReportTableRowProps {
  report: ExpertiseReport;
  onEditReport: (report: ExpertiseReport) => void;
  onDeleteReport: (id: string) => void;
  onConvertToQuote?: (report: ExpertiseReport) => void;
  isConverting?: boolean;
  isConverted?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Importé':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'En cours d\'analyse':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'En attente':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Validé':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Rejeté':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Converti':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatAmount = (amount: number | null) => {
  if (!amount) return 'Non spécifié';
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount);
};

export const ExpertiseReportTableRow: React.FC<ExpertiseReportTableRowProps> = ({
  report,
  onEditReport,
  onDeleteReport,
  onConvertToQuote,
  isConverting = false,
  isConverted = false
}) => {
  const getStatusDisplay = () => {
    const status = isConverted ? 'Converti' : (report.status || 'Importé');
    return (
      <Badge 
        variant="outline" 
        className={`${getStatusColor(status)} font-medium`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <>
      <TableRow className="hover:bg-gray-50 border-b-0">
        <TableCell>
          {report.report_number || 'Non spécifié'}
        </TableCell>
        <TableCell>
          {report.report_date ? new Date(report.report_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
        </TableCell>
        <TableCell>
          {report.clients ? (
            <span>
              {report.clients.first_name} {report.clients.last_name}
            </span>
          ) : (
            <span className="text-gray-400 italic">Non assigné</span>
          )}
        </TableCell>
        <TableCell>
          {report.vehicles 
            ? `${report.vehicles.car_brands?.name || 'Marque inconnue'} ${report.vehicles.car_models?.name || 'Modèle inconnu'} - ${report.vehicles.license_plate || 'Plaque non spécifiée'}`
            : 'Non assigné'
          }
        </TableCell>
        <TableCell>
          {formatAmount(report.amount)}
        </TableCell>
        <TableCell>
          {getStatusDisplay()}
        </TableCell>
      </TableRow>
      <TableRow className="border-t-0">
        <TableCell colSpan={6} className="py-3 border-t-0">
          <div className="flex flex-wrap gap-2 justify-end px-4">

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(report.document_url, '_blank')}
                  disabled={!report.document_url}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!report.document_url ? 'Aucun document disponible' : 'Télécharger le rapport'}
              </TooltipContent>
            </Tooltip>

            {onConvertToQuote && !isConverted && (
              <Tooltip>
                <TooltipTrigger asChild>
            <Button 
              size="sm"
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={() => onConvertToQuote(report)}
              disabled={isConverting || !report.client_id || !report.vehicle_id}
            >
              {isConverting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-1" />
              )}
              {isConverting ? 'Conversion...' : 'Convertir'}
            </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isConverting 
                    ? 'Conversion en cours...' 
                    : !report.client_id || !report.vehicle_id 
                      ? 'Client et véhicule requis pour la conversion' 
                      : 'Convertir en devis'
                  }
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                  onClick={() => onDeleteReport(report.id)}
                  disabled={isConverted}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isConverted ? 'Impossible de supprimer un rapport converti' : 'Supprimer le rapport'}
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
