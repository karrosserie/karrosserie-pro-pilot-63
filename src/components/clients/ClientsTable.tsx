
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Pencil, Trash, UserPlus, MoreVertical, CreditCard, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { Client } from '@/services/supabase/clients';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClientMobileCard } from './ClientMobileCard';
import { useClientVehicleCheck } from '@/hooks/use-client-vehicle-check';
import { RequestDocumentsButton } from './RequestDocumentsButton';

interface ClientsTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateCredit?: (client: Client) => void;
  onRequestDocuments?: (client: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient,
  onCreateCredit,
  onRequestDocuments
}) => {
  const { sortedData: sortedClients, sortConfig, handleSort } = useTableSorting(clients, 'last_name');
  const isMobile = useIsMobile();
  
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
              onCreateCredit={onCreateCredit}
              onRequestDocuments={onRequestDocuments}
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClients.length > 0 ? (
            sortedClients.map((client) => {
              const clientData = client as any;
              const hasFrontLicense = clientData.driver_license_front_url;
              const hasBackLicense = clientData.driver_license_back_url;
              const hasCompleteLicense = hasFrontLicense && hasBackLicense;

              const handleCreateCredit = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Creating credit for client:', client);
                onCreateCredit?.(client);
              };

              
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
                  </TableRow>
                  <TableRow className="border-t-0">
                    <TableCell colSpan={5} className="py-3 border-t-0">
                      <div className="flex flex-wrap gap-2 justify-end px-4">
                        <Button variant="view" size="sm" onClick={() => onViewClient(client)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="edit" size="sm" onClick={() => onEditClient(client)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="create" size="sm" onClick={handleCreateCredit}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Créer un avoir
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
              <TableCell colSpan={5} className="text-center py-4">
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
