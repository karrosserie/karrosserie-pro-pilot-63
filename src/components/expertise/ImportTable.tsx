import React, { useState, useEffect } from 'react';
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
import { Clock, FileText } from 'lucide-react';
import { Import } from '@/services/supabase/imports';
import { useEnvironment } from '@/hooks/use-environment';

interface ImportTableProps {
  imports: Import[];
  isLoading: boolean;
}

const ImportTable: React.FC<ImportTableProps> = ({ imports, isLoading }) => {
  const { settings: environmentSettings } = useEnvironment();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour le temps actuel chaque seconde pour le décompteur
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatSecondsToTime = (seconds: number | null): string => {
    if (!seconds || seconds < 0) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateRemainingTime = (createdAt: string): number => {
    const averageTimingSeconds = environmentSettings?.average_timing || 0;
    const createdTime = new Date(createdAt).getTime();
    const elapsedSeconds = Math.floor((currentTime.getTime() - createdTime) / 1000);
    const remainingSeconds = averageTimingSeconds - elapsedSeconds;
    
    // Retourner 0 si le temps est écoulé (jamais négatif)
    return Math.max(0, remainingSeconds);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En cours d\'analyse':
        return (
          <Badge variant="secondary">
            En cours d'analyse
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
            <TableHead>Temps restant estimé</TableHead>
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
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formatSecondsToTime(calculateRemainingTime(importItem.created_at))}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImportTable;