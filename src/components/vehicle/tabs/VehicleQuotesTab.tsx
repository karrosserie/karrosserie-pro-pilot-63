import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuotes } from '@/hooks/use-quotes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface VehicleQuotesTabProps {
  vehicleId: string;
}

const VehicleQuotesTab: React.FC<VehicleQuotesTabProps> = ({ vehicleId }) => {
  const { quotes, isLoading } = useQuotes();

  const vehicleQuotes = quotes?.filter(quote => quote.vehicle_id === vehicleId) || [];

  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepté': return 'bg-green-100 text-green-800 border-green-200';
      case 'Refusé': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement des devis...</div>;
  }

  if (vehicleQuotes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun devis</h3>
        <p className="mt-1 text-sm text-gray-500">Ce véhicule n'a pas encore de devis.</p>
      </div>
    );
  }

  return (
    <div className="card-container p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Validité</TableHead>
            <TableHead>N° Rapport</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleQuotes.map((quote) => (
            <TableRow key={quote.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {quote.reference || 'Non spécifié'}
              </TableCell>
              <TableCell>
                {format(new Date(quote.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                {formatAmount(quote.amount)}
              </TableCell>
              <TableCell>
                {quote.valid_until ? format(new Date(quote.valid_until), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
              </TableCell>
              <TableCell>
                {quote.report_number || 'N/A'}
              </TableCell>
              <TableCell>
                {quote.expert_name || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(quote.status || 'En attente')}>
                  {quote.status || 'En attente'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleQuotesTab;