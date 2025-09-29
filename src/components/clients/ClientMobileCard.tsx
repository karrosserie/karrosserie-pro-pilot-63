import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/ui/status-badge';
import { Eye, Pencil, Trash, FileText, Receipt, CreditCard, User, Mail, Phone, MapPin, Send, Car } from 'lucide-react';
import { Client } from '@/services/supabase/clients';
import { RequestDocumentsButton } from './RequestDocumentsButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientMobileCardProps {
  client: Client;
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateQuote?: (client: Client) => void;
  onCreateInvoice?: (client: Client) => void;
  onCreateCredit?: (client: Client) => void;
  onCreateVehicle?: (client: Client) => void;
  onRequestDocuments?: (client: Client) => void;
  onClientUpdate?: () => void;
}

export const ClientMobileCard = ({ 
  client, 
  onViewClient, 
  onEditClient, 
  onDeleteClient,
  onCreateQuote,
  onCreateInvoice,
  onCreateCredit,
  onCreateVehicle,
  onRequestDocuments,
  onClientUpdate
}: ClientMobileCardProps) => {
  const clientData = client as any;
  const hasFrontLicense = clientData.driver_license_front_url;
  const hasBackLicense = clientData.driver_license_back_url;
  const hasCompleteLicense = hasFrontLicense && hasBackLicense;
  const { toast } = useToast();

  const handleToggleAutoRelances = async () => {
    try {
      const currentDisabled = clientData.auto_relances_disabled || false;
      const { error } = await supabase
        .from('clients')
        .update({ auto_relances_disabled: !currentDisabled })
        .eq('id', client.id);

      if (error) {
        console.error('Error toggling auto relances:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier les relances automatiques",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: !currentDisabled ? "Relances automatiques désactivées" : "Relances automatiques activées",
      });

      // Trigger client list refresh
      onClientUpdate?.();
    } catch (error) {
      console.error('Error in handleToggleAutoRelances:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">
              {client.first_name} {client.last_name}
            </h3>
            <StatusBadge 
              status={hasCompleteLicense ? "Permis importé" : "Pas de permis"}
              className={hasCompleteLicense ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {client.email && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        
        {client.phone && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{client.phone}</span>
          </div>
        )}
        
        {client.city && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{client.city}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-2 border-t border-b">
        <span className="text-sm font-medium text-card-foreground">Relances automatiques</span>
        <div className="flex items-center space-x-2">
          <Switch
            checked={!clientData.auto_relances_disabled}
            onCheckedChange={handleToggleAutoRelances}
          />
          <span className="text-sm text-muted-foreground">
            {clientData.auto_relances_disabled ? 'Désactivées' : 'Activées'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="view" size="sm" onClick={() => onViewClient(client)}>
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
        
        <Button variant="edit" size="sm" onClick={() => onEditClient(client)}>
          <Pencil className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        
        {onCreateVehicle && (
          <Button variant="create" size="sm" onClick={() => onCreateVehicle(client)}>
            <Car className="h-4 w-4 mr-1" />
            Nouveau véhicule
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-1 border-t">
        {onCreateQuote && (
          <Button variant="create" size="sm" onClick={() => onCreateQuote(client)}>
            <FileText className="h-4 w-4 mr-1" />
            Devis
          </Button>
        )}
        
        {onCreateInvoice && (
          <Button variant="create" size="sm" onClick={() => onCreateInvoice(client)}>
            <Receipt className="h-4 w-4 mr-1" />
            Facture
          </Button>
        )}
        
        {onCreateCredit && (
          <Button variant="create" size="sm" onClick={() => onCreateCredit(client)}>
            <CreditCard className="h-4 w-4 mr-1" />
            Avoir
          </Button>
        )}
        
        {onRequestDocuments && (
          <RequestDocumentsButton
            client={client}
            onRequestDocuments={onRequestDocuments}
          />
        )}
        
        <Button variant="delete" size="sm" onClick={() => onDeleteClient(client)}>
          <Trash className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};