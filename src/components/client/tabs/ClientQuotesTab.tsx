
import React from 'react';
import { useQuotes } from '@/hooks/use-quotes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientQuotesTabProps {
  clientId: string;
}

const ClientQuotesTab: React.FC<ClientQuotesTabProps> = ({ clientId }) => {
  const { quotes, isLoading } = useQuotes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientQuotes = quotes?.filter(quote => quote.client_id === clientId) || [];

  if (clientQuotes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun devis</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de devis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Devis ({clientQuotes.length})</h3>
      
      <div className="grid gap-4">
        {clientQuotes.map((quote) => (
          <Card key={quote.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Devis #{quote.reference}</span>
                </div>
                <Badge variant={quote.status === 'Accepté' ? 'default' : 'secondary'}>
                  {quote.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="font-medium">Créé:</span> {new Date(quote.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  <span className="font-medium">Montant:</span> {quote.amount}€
                </div>
                {quote.vehicles && (
                  <div>
                    <span className="font-medium">Véhicule:</span> {quote.vehicles.license_plate}
                  </div>
                )}
                {quote.valid_until && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="font-medium">Valide jusqu'au:</span> {new Date(quote.valid_until).toLocaleDateString()}
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

export default ClientQuotesTab;
