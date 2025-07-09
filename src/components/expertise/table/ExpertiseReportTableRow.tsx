
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { FileText, Pencil, Trash, Download, User, Car, FileCheck, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      return 'bg-purple-100 text-purple-800 border-purple-200';
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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-blue-600" />
          {report.report_number || 'Non spécifié'}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {new Date(report.created_at || '').toLocaleDateString('fr-FR')}
      </TableCell>
      <TableCell>
        {report.clients ? (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">
              {report.clients.first_name} {report.clients.last_name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 italic">Non assigné</span>
        )}
      </TableCell>
      <TableCell>
        {report.vehicles ? (
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">
                {report.vehicles.car_brands?.name || 'Marque inconnue'} {report.vehicles.car_models?.name || 'Modèle inconnu'}
              </div>
              <div className="text-sm text-gray-500">
                {report.vehicles.license_plate || 'Plaque non spécifiée'}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 italic">Non assigné</span>
        )}
      </TableCell>
      <TableCell>
        <span className={report.expert_name ? 'font-medium' : 'text-gray-400 italic'}>
          {report.expert_name || 'Non spécifié'}
        </span>
      </TableCell>
      <TableCell className="font-medium">
        {formatAmount(report.amount)}
      </TableCell>
      <TableCell>
        {getStatusDisplay()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.open(report.document_url, '_blank')}
                disabled={!report.document_url}
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {report.document_url ? 'Télécharger' : 'Aucun document'}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onConvertToQuote && !isConverted && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onConvertToQuote(report)}
                    disabled={isConverting || !report.client_id || !report.vehicle_id}
                  >
                    {isConverting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileCheck className="mr-2 h-4 w-4" />
                    )}
                    Convertir en devis
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem 
                onClick={() => onEditReport(report)}
                disabled={isConverted}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDeleteReport(report.id)}
                disabled={isConverted}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
