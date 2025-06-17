
import React from 'react';
import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Calendar, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientCreditsTabProps {
  clientId: string;
}

const ClientCreditsTab: React.FC<ClientCreditsTabProps> = ({ clientId }) => {
  const { credits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientCredits = credits?.filter(credit => credit.client_id === clientId) || [];

  if (clientCredits.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun avoir</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore d'avoir.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {clientCredits.map((credit) => (
          <Card key={credit.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Avoir #{credit.reference}</span>
                </div>
                <Badge variant={credit.status === 'Payé' ? 'default' : 'secondary'}>
                  {credit.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="font-medium">Créé:</span> {new Date(credit.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  <span className="font-medium">Montant:</span> {credit.amount}€
                </div>
                {credit.notes && (
                  <div className="col-span-2">
                    <span className="font-medium">Notes:</span> {credit.notes}
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

export default ClientCreditsTab;
