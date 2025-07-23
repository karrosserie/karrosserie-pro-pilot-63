import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInvoices } from '@/hooks/use-invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      <div className="p-4">
        <p className="text-muted-foreground">Aucune facture trouvée pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleInvoices.map((invoice) => (
        <Card key={invoice.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Facture {invoice.reference}
                </CardTitle>
                <CardDescription>
                  Créée le {format(new Date(invoice.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(invoice.status || 'En attente de paiement')}>
                {invoice.status || 'En attente de paiement'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Montant:</span> {formatAmount(invoice.amount)}</p>
                <p><span className="font-medium">Date d'échéance:</span> {invoice.due_date ? format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</p>
              </div>
              <div>
                <p><span className="font-medium">N° de rapport:</span> {invoice.report_number || 'N/A'}</p>
                <p><span className="font-medium">Expert:</span> {invoice.expert_name || 'N/A'}</p>
              </div>
            </div>
            {invoice.notes && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm"><span className="font-medium">Notes:</span> {invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleInvoicesTab;