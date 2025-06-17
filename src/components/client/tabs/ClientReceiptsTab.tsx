
import React from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Calendar, Euro, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientReceiptsTabProps {
  clientId: string;
}

const ClientReceiptsTab: React.FC<ClientReceiptsTabProps> = ({ clientId }) => {
  const { receipts, isLoading } = useReceiptsData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  // Filtrer les encaissements par client via les factures associées
  const clientReceipts = receipts?.filter(receipt => {
    if (receipt.invoices && receipt.invoices.client_id === clientId) {
      return true;
    }
    return false;
  }) || [];

  if (clientReceipts.length === 0) {
    return (
      <div className="text-center py-8">
        <Banknote className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun encaissement</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore d'encaissement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {clientReceipts.map((receipt) => (
          <Card key={receipt.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span>Encaissement #{receipt.reference}</span>
                </div>
                <Badge variant={receipt.status === 'Encaissé' ? 'default' : 'secondary'}>
                  {receipt.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="font-medium">Date:</span> {new Date(receipt.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  <span className="font-medium">Montant:</span> {receipt.amount}€
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span className="font-medium">Méthode:</span> {receipt.payment_method}
                </div>
                {receipt.invoices && (
                  <div>
                    <span className="font-medium">Facture:</span> #{receipt.invoices.reference}
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

export default ClientReceiptsTab;
