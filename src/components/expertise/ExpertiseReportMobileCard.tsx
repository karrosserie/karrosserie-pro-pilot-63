
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, FileText, Calendar, User, Car } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface ExpertiseReportMobileCardProps {
  report: ExpertiseReport;
  onEditReport: (report: ExpertiseReport) => void;
  onDeleteReport: (id: string) => void;
}

const ExpertiseReportMobileCard: React.FC<ExpertiseReportMobileCardProps> = ({
  report,
  onEditReport,
  onDeleteReport
}) => {
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
  };

  const getVehicleDisplay = () => {
    const vehicle = report.vehicles;
    if (!vehicle) return 'Aucun véhicule';
    
    const brand = vehicle.car_brands?.name || 'Marque inconnue';
    const model = vehicle.car_models?.name || 'Modèle inconnu';
    const plate = vehicle.license_plate || '';
    
    return `${brand} ${model}${plate ? ` - ${plate}` : ''}`;
  };

  const getClientDisplay = () => {
    const client = report.clients;
    return client ? `${client.first_name} ${client.last_name}` : "-";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">
              {report.report_number || "Non défini"}
            </h3>
            <Badge variant="outline" className="text-xs mt-1">Expertise</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {formatAmount(report.amount)}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>
            {report.report_date 
              ? new Date(report.report_date).toLocaleDateString('fr-FR')
              : "Non définie"
            }
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <User className="h-3 w-3" />
          <span>{getClientDisplay()}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Car className="h-3 w-3" />
          <span className="truncate">{getVehicleDisplay()}</span>
        </div>

        {report.expert_name && (
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>Expert: {report.expert_name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditReport(report)}
          className="text-xs"
        >
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 text-xs"
          onClick={() => onDeleteReport(report.id)}
        >
          <Trash className="h-3 w-3 mr-1" />
          Suppr.
        </Button>
      </div>
    </div>
  );
};

export default ExpertiseReportMobileCard;
