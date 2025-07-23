import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, Download } from 'lucide-react';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VehicleExpertiseReportsTabProps {
  vehicleId: string;
}

const VehicleExpertiseReportsTab: React.FC<VehicleExpertiseReportsTabProps> = ({ vehicleId }) => {
  const { reports, isLoading, deleteReport } = useExpertiseReports();

  const vehicleReports = reports?.filter(report => report.vehicle_id === vehicleId) || [];

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport d\'expertise ?')) {
      deleteReport.mutate(id);
    }
  };

  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Importé': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Converti': return 'bg-green-100 text-green-800 border-green-200';
      case 'Traité': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement des rapports d'expertise...</div>;
  }

  if (vehicleReports.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Aucun rapport d'expertise trouvé pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleReports.map((report) => (
        <Card key={report.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Rapport {report.report_number || 'N/A'}
                </CardTitle>
                <CardDescription>
                  Expert: {report.expert_name || 'N/A'} • 
                  Date: {report.report_date ? format(new Date(report.report_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(report.status || 'Importé')}>
                  {report.status || 'Importé'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                    {report.document_url && (
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Montant:</span> {formatAmount(report.amount)}</p>
                <p><span className="font-medium">N° de police:</span> {report.policy_number || 'N/A'}</p>
              </div>
              <div>
                <p><span className="font-medium">N° de sinistre:</span> {report.claim_number || 'N/A'}</p>
                <p><span className="font-medium">Date d'incident:</span> {report.incident_date ? format(new Date(report.incident_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleExpertiseReportsTab;