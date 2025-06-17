
import React from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Calendar, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientInvoicesTabProps {
  clientId: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({ clientId }) => {
  const { invoices, isLoading } = useInvoices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientInvoices = invoices?.filter(invoice => invoice.client_id === clientId) || [];

  if (clientInvoices.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune facture</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de facture.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Factures ({clientInvoices.length})</h3>
      
      <div className="grid gap-4">
        {clientInvoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <span>Facture #{invoice.reference}</span>
                </div>
                <Badge variant={invoice.status === 'Payée' ? 'default' : 'secondary'}>
                  {invoice.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="font-medium">Date:</span> {new Date(invoice.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  <span className="font-medium">Montant:</span> {invoice.amount}€
                </div>
                {invoice.due_date && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="font-medium">Échéance:</span> {new Date(invoice.due_date).toLocaleDateString()}
                  </div>
                )}
                {invoice.vehicles && (
                  <div>
                    <span className="font-medium">Véhicule:</span> {invoice.vehicles.license_plate}
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

export default ClientInvoicesTab;
