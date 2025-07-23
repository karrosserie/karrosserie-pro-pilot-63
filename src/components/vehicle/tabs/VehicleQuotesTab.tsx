import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuotes } from '@/hooks/use-quotes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      <div className="p-4">
        <p className="text-muted-foreground">Aucun devis trouvé pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleQuotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Devis {quote.reference}
                </CardTitle>
                <CardDescription>
                  Créé le {format(new Date(quote.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(quote.status || 'En attente')}>
                {quote.status || 'En attente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Montant:</span> {formatAmount(quote.amount)}</p>
                <p><span className="font-medium">Valide jusqu'au:</span> {quote.valid_until ? format(new Date(quote.valid_until), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</p>
              </div>
              <div>
                <p><span className="font-medium">N° de rapport:</span> {quote.report_number || 'N/A'}</p>
                <p><span className="font-medium">Expert:</span> {quote.expert_name || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleQuotesTab;