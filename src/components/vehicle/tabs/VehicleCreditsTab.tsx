import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/hooks/use-credits';
import { useInvoices } from '@/hooks/use-invoices';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      <div className="p-4">
        <p className="text-muted-foreground">Aucun avoir trouvé pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleCredits.map((credit) => {
        const relatedInvoice = invoices?.find(invoice => invoice.id === credit.invoice_id);
        
        return (
          <Card key={credit.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Avoir {credit.reference}
                  </CardTitle>
                  <CardDescription>
                    Créé le {format(new Date(credit.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(credit.status || 'En attente')}>
                  {credit.status || 'En attente'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Montant:</span> {formatAmount(credit.amount)}</p>
                  <p><span className="font-medium">Facture associée:</span> {relatedInvoice?.reference || 'N/A'}</p>
                </div>
                <div>
                  <p><span className="font-medium">Statut:</span> {credit.status || 'En attente'}</p>
                </div>
              </div>
              {credit.notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm"><span className="font-medium">Notes:</span> {credit.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VehicleCreditsTab;