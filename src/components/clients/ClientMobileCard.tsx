import React from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Eye, Pencil, Trash, FileText, Receipt, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import { Client } from '@/services/supabase/clients';

interface ClientMobileCardProps {
  client: Client;
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateQuote?: (client: Client) => void;
  onCreateInvoice?: (client: Client) => void;
  onCreateCredit?: (client: Client) => void;
}

export const ClientMobileCard = ({ 
  client, 
  onViewClient, 
  onEditClient, 
  onDeleteClient,
  onCreateQuote,
  onCreateInvoice,
  onCreateCredit
}: ClientMobileCardProps) => {
  const clientData = client as any;
  const hasFrontLicense = clientData.driver_license_front_url;
  const hasBackLicense = clientData.driver_license_back_url;
  const hasCompleteLicense = hasFrontLicense && hasBackLicense;

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

      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={() => onViewClient(client)}>
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => onEditClient(client)}>
          <Pencil className="h-4 w-4 mr-1" />
          Modifier
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1 border-t">
        {onCreateQuote && (
          <Button variant="outline" size="sm" onClick={() => onCreateQuote(client)}>
            <FileText className="h-4 w-4 mr-1" />
            Devis
          </Button>
        )}
        
        {onCreateInvoice && (
          <Button variant="outline" size="sm" onClick={() => onCreateInvoice(client)}>
            <Receipt className="h-4 w-4 mr-1" />
            Facture
          </Button>
        )}
        
        {onCreateCredit && (
          <Button variant="outline" size="sm" onClick={() => onCreateCredit(client)}>
            <CreditCard className="h-4 w-4 mr-1" />
            Avoir
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive" 
          onClick={() => onDeleteClient(client)}
        >
          <Trash className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};