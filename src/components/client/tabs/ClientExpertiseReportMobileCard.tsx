import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, FileText, Calendar, User, Car, Euro } from 'lucide-react';

interface ClientExpertiseReportMobileCardProps {
  report: any;
  onEditReport: (report: any) => void;
  onDeleteReport: (id: string) => void;
}

const ClientExpertiseReportMobileCard: React.FC<ClientExpertiseReportMobileCardProps> = ({
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

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground text-sm truncate">
              {report.report_number || "Non défini"}
            </h3>
            <Badge variant="outline" className="text-xs mt-1">Expertise</Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium text-foreground whitespace-nowrap">
            {formatAmount(report.amount)}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {report.report_date 
              ? new Date(report.report_date).toLocaleDateString('fr-FR')
              : "Non définie"
            }
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{getVehicleDisplay()}</span>
        </div>

        {report.expert_name && (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Expert: {report.expert_name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t">
        <Button
          variant="edit"
          size="sm"
          onClick={() => onEditReport(report)}
          className="flex-1"
        >
          <Pencil className="h-3 w-3 mr-1" />
          Modifier
        </Button>
        <Button
          variant="delete"
          size="sm"
          onClick={() => onDeleteReport(report.id)}
          className="flex-1"
        >
          <Trash className="h-3 w-3 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default ClientExpertiseReportMobileCard;
