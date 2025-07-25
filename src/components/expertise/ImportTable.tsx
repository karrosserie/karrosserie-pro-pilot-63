import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, FileText } from 'lucide-react';
import { Import } from '@/services/supabase/imports';

interface ImportTableProps {
  imports: Import[];
  isLoading: boolean;
}

const ImportTable: React.FC<ImportTableProps> = ({ imports, isLoading }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En cours d\'analyse':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En cours d'analyse
          </Badge>
        );
      case 'En erreur':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            En erreur
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getClientName = (report: Import['expertise_reports']) => {
    if (!report?.clients) return 'Client non assigné';
    return `${report.clients.first_name} ${report.clients.last_name}`;
  };

  const getVehicleInfo = (report: Import['expertise_reports']) => {
    if (!report?.vehicles) return 'Véhicule non assigné';
    const { vehicles } = report;
    const brand = vehicles.car_brands?.name || 'Marque inconnue';
    const model = vehicles.car_models?.name || 'Modèle inconnu';
    return `${brand} ${model} - ${vehicles.license_plate}`;
  };

  if (isLoading) {
    return (
      <div className="card-container">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Rapports en cours d'analyse</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Les rapports d'expertise en cours d'analyse par notre IA s'affichent ici et nous vous notifierons par un signal sonore dès qu'il sera disponible
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'import</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imports.map((importItem) => (
            <TableRow key={importItem.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="font-medium truncate max-w-[200px]" title={importItem.document || 'Fichier inconnu'}>
                    {importItem.document || 'Fichier inconnu'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(importItem.status)}
              </TableCell>
              <TableCell>
                {format(new Date(importItem.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                {importItem.error ? (
                  <div className="text-sm text-red-600 max-w-[200px] truncate" title={importItem.error}>
                    {importItem.error}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImportTable;