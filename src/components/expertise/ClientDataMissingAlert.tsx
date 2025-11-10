import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Send, Edit, X } from 'lucide-react';
import { Client } from '@/services/supabase/clients';

interface ClientDataMissingAlertProps {
  client: Client;
  missingFields: string[];
  onRequestDocuments: () => void;
  onManualComplete: () => void;
  onDismiss: () => void;
}

export const ClientDataMissingAlert = ({
  client,
  missingFields,
  onRequestDocuments,
  onManualComplete,
  onDismiss
}: ClientDataMissingAlertProps) => {
  return (
    <Alert variant="default" className="border-warning bg-warning/10">
      <AlertCircle className="h-4 w-4 text-warning" />
      <AlertTitle className="flex items-center justify-between">
        <span>Données client incomplètes</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-6 w-6 p-0 hover:bg-warning/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="space-y-3 mt-2">
        <p className="text-sm">
          Le client <strong>{client.first_name} {client.last_name}</strong> a été créé, 
          mais certaines informations sont manquantes pour établir un prêt de véhicule :
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm ml-2">
          {missingFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            onClick={onRequestDocuments}
            size="sm"
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Demander au client
          </Button>
          <Button
            onClick={onManualComplete}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Compléter manuellement
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
