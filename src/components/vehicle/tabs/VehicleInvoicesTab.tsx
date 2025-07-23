import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useInvoices } from '@/hooks/use-invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface VehicleInvoicesTabProps {
  vehicleId: string;
}

const VehicleInvoicesTab: React.FC<VehicleInvoicesTabProps> = ({ vehicleId }) => {
  const { invoices, isLoading } = useInvoices();

  const vehicleInvoices = invoices?.filter(invoice => invoice.vehicle_id === vehicleId) || [];

  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente de paiement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Paiement partiel': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'En retard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement des factures...</div>;
  }

  if (vehicleInvoices.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune facture</h3>
        <p className="mt-1 text-sm text-gray-500">Ce véhicule n'a pas encore de facture.</p>
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
            <TableHead>Échéance</TableHead>
            <TableHead>N° Rapport</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleInvoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {invoice.reference || 'Non spécifié'}
              </TableCell>
              <TableCell>
                {format(new Date(invoice.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                {formatAmount(invoice.amount)}
              </TableCell>
              <TableCell>
                {invoice.due_date ? format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
              </TableCell>
              <TableCell>
                {invoice.report_number || 'N/A'}
              </TableCell>
              <TableCell>
                {invoice.expert_name || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(invoice.status || 'En attente de paiement')}>
                  {invoice.status || 'En attente de paiement'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleInvoicesTab;