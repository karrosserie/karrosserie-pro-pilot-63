
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Pencil, Trash, UserPlus, MoreVertical, Send, Car } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { Client } from '@/services/supabase/clients';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClientMobileCard } from './ClientMobileCard';
import { useClientVehicleCheck } from '@/hooks/use-client-vehicle-check';
import { RequestDocumentsButton } from './RequestDocumentsButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientsTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateVehicle?: (client: Client) => void;
  onRequestDocuments?: (client: Client) => void;
  onClientUpdate?: () => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient,
  onCreateVehicle,
  onRequestDocuments,
  onClientUpdate
}) => {
  const { sortedData: sortedClients, sortConfig, handleSort } = useTableSorting(clients, 'last_name');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleToggleAutoRelances = async (clientId: string, currentDisabled: boolean) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ auto_relances_disabled: !currentDisabled })
        .eq('id', clientId);

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
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {sortedClients.length > 0 ? (
          sortedClients.map((client) => (
            <ClientMobileCard
              key={client.id}
              client={client}
              onViewClient={onViewClient}
              onEditClient={onEditClient}
              onDeleteClient={onDeleteClient}
              onCreateVehicle={onCreateVehicle}
              onRequestDocuments={onRequestDocuments}
              onClientUpdate={onClientUpdate}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-500">
              Aucun client correspondant à votre recherche n'a été trouvé.
            </p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader sortKey="last_name" sortConfig={sortConfig} onSort={handleSort}>
              Nom
            </SortableTableHeader>
            <SortableTableHeader sortKey="email" sortConfig={sortConfig} onSort={handleSort}>
              Email
            </SortableTableHeader>
            <SortableTableHeader sortKey="phone" sortConfig={sortConfig} onSort={handleSort}>
              Téléphone
            </SortableTableHeader>
            <SortableTableHeader sortKey="city" sortConfig={sortConfig} onSort={handleSort}>
              Ville
            </SortableTableHeader>
            <TableHead>Permis de conduire</TableHead>
            <TableHead>Relances auto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClients.length > 0 ? (
            sortedClients.map((client) => {
              const clientData = client as any;
              const hasFrontLicense = clientData.driver_license_front_url;
              const hasBackLicense = clientData.driver_license_back_url;
              const hasCompleteLicense = hasFrontLicense && hasBackLicense;

              
              return (
                <React.Fragment key={client.id}>
                  <TableRow className="hover:bg-gray-50 border-b-0">
                    <TableCell className="font-medium">
                      {client.first_name} {client.last_name}
                    </TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.city}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={hasCompleteLicense ? "Permis importé" : "Pas de permis"}
                        className={hasCompleteLicense ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!clientData.auto_relances_disabled}
                          onCheckedChange={() => handleToggleAutoRelances(client.id, clientData.auto_relances_disabled || false)}
                        />
                        <span className="text-sm text-gray-600">
                          {clientData.auto_relances_disabled ? 'Désactivées' : 'Activées'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={6} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button variant="view" size="sm" onClick={() => onViewClient(client)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="edit" size="sm" onClick={() => onEditClient(client)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="create" size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white" onClick={() => onCreateVehicle?.(client)}>
                          <Car className="h-4 w-4 mr-1" />
                          Nouveau véhicule
                        </Button>
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
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <UserPlus className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                  <p className="text-gray-500 mt-1">
                    Aucun client correspondant à votre recherche n'a été trouvé.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
