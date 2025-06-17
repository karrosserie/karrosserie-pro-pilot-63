
import React from 'react';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientExpertiseReportsTabProps {
  clientId: string;
}

const ClientExpertiseReportsTab: React.FC<ClientExpertiseReportsTabProps> = ({ clientId }) => {
  const { reports, isLoading } = useExpertiseReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientReports = reports?.filter(report => report.client_id === clientId) || [];

  if (clientReports.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun rapport d'expertise</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de rapport d'expertise.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {clientReports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Rapport #{report.report_number || 'Non défini'}</span>
                </div>
                <Badge variant="outline">
                  Expertise
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="font-medium">Date:</span> {report.report_date ? new Date(report.report_date).toLocaleDateString() : 'Non définie'}
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  <span className="font-medium">Montant:</span> {report.amount ? `${report.amount}€` : 'Non défini'}
                </div>
                {report.claim_number && (
                  <div>
                    <span className="font-medium">N° Sinistre:</span> {report.claim_number}
                  </div>
                )}
                {report.vehicles && (
                  <div>
                    <span className="font-medium">Véhicule:</span> {report.vehicles.license_plate}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientExpertiseReportsTab;
