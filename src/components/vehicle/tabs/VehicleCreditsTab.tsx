import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/hooks/use-credits';
import { useInvoices } from '@/hooks/use-invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface VehicleCreditsTabProps {
  vehicleId: string;
}

const VehicleCreditsTab: React.FC<VehicleCreditsTabProps> = ({ vehicleId }) => {
  const { credits, isLoading: creditsLoading } = useCredits();
  const { invoices, isLoading: invoicesLoading } = useInvoices();

  // Filter credits related to this vehicle through invoices
  const vehicleCredits = credits?.filter(credit => {
    if (credit.invoice_id && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === credit.invoice_id);
      return relatedInvoice?.vehicle_id === vehicleId;
    }
    return false;
  }) || [];

  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Appliqué': return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Refusé': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (creditsLoading || invoicesLoading) {
    return <div className="p-4">Chargement des avoirs...</div>;
  }

  if (vehicleCredits.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun avoir</h3>
        <p className="mt-1 text-sm text-gray-500">Ce véhicule n'a pas encore d'avoir.</p>
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
            <TableHead>Facture associée</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleCredits.map((credit) => {
            const relatedInvoice = invoices?.find(invoice => invoice.id === credit.invoice_id);
            
            return (
              <TableRow key={credit.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {credit.reference || 'Non spécifié'}
                </TableCell>
                <TableCell>
                  {format(new Date(credit.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </TableCell>
                <TableCell>
                  {formatAmount(credit.amount)}
                </TableCell>
                <TableCell>
                  {relatedInvoice?.reference || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(credit.status || 'En attente')}>
                    {credit.status || 'En attente'}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleCreditsTab;