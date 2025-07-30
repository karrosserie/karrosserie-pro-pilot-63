
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
import { Eye, Pencil, Trash, UserPlus, MoreVertical, FileText, Receipt, CreditCard, Wrench } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { Client } from '@/services/supabase/clients';

interface ClientsTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateQuote?: (client: Client) => void;
  onCreateInvoice?: (client: Client) => void;
  onCreateCredit?: (client: Client) => void;
  onCreateIntervention?: (client: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient,
  onCreateQuote,
  onCreateInvoice,
  onCreateCredit,
  onCreateIntervention
}) => {
  
  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Permis de conduire</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => {
              const clientData = client as any;
              const hasFrontLicense = clientData.driver_license_front_url;
              const hasBackLicense = clientData.driver_license_back_url;
              const hasCompleteLicense = hasFrontLicense && hasBackLicense;

              const handleCreateQuote = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Creating quote for client:', client);
                onCreateQuote?.(client);
              };

              const handleCreateInvoice = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Creating invoice for client:', client);
                onCreateInvoice?.(client);
              };

              const handleCreateCredit = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Creating credit for client:', client);
                onCreateCredit?.(client);
              };

              const handleCreateIntervention = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Creating intervention for client:', client);
                onCreateIntervention?.(client);
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
                        <Button variant="outline" size="sm" onClick={() => onViewClient(client)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEditClient(client)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCreateQuote}>
                          <FileText className="h-4 w-4 mr-1" />
                          Créer devis
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCreateInvoice}>
                          <Receipt className="h-4 w-4 mr-1" />
                          Créer facture
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCreateCredit}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Créer avoir
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCreateIntervention}>
                          <Wrench className="h-4 w-4 mr-1" />
                          Créer fiche
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700" 
                          onClick={() => onDeleteClient(client)}
                          >
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
