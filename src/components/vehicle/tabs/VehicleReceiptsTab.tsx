import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useInvoices } from '@/hooks/use-invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VehicleReceiptsTabProps {
  vehicleId: string;
}

const VehicleReceiptsTab: React.FC<VehicleReceiptsTabProps> = ({ vehicleId }) => {
  const { receipts, isLoading: receiptsLoading } = useReceiptsData();
  const { invoices, isLoading: invoicesLoading } = useInvoices();

  // Filter receipts related to this vehicle through invoices
  const vehicleReceipts = receipts?.filter(receipt => {
    if (receipt.invoices && invoices) {
      const relatedInvoice = invoices.find(invoice => invoice.id === receipt.invoice_id);
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
      case 'Encaissé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejeté': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (receiptsLoading || invoicesLoading) {
    return <div className="p-4">Chargement des encaissements...</div>;
  }

  if (vehicleReceipts.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Aucun encaissement trouvé pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleReceipts.map((receipt) => {
        const relatedInvoice = invoices?.find(invoice => invoice.id === receipt.invoice_id);
        
        return (
          <Card key={receipt.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Encaissement {receipt.reference}
                  </CardTitle>
                  <CardDescription>
                    Date: {format(new Date(receipt.date), 'dd/MM/yyyy', { locale: fr })}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(receipt.status || 'En attente')}>
                  {receipt.status || 'En attente'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Montant:</span> {formatAmount(receipt.amount)}</p>
                  <p><span className="font-medium">Méthode:</span> {receipt.payment_method || 'N/A'}</p>
                </div>
                <div>
                  <p><span className="font-medium">Facture associée:</span> {relatedInvoice?.reference || 'N/A'}</p>
                  <p><span className="font-medium">Compte bancaire:</span> {receipt.bank_account || 'N/A'}</p>
                </div>
              </div>
              {receipt.notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm"><span className="font-medium">Notes:</span> {receipt.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VehicleReceiptsTab;