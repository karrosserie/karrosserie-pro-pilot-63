
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
import { Eye, Pencil, UserPlus } from 'lucide-react';
import ClientDeleteDialog from '@/components/client/ClientDeleteDialog';
import { Client } from '@/services/supabase/clients';

interface ClientsTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient
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
            <TableHead>Société</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.first_name} {client.last_name}
                </TableCell>
                <TableCell>{client.email || '-'}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.city}</TableCell>
                <TableCell>{(client as any).company || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onViewClient(client)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEditClient(client)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ClientDeleteDialog 
                      client={client}
                      onDelete={onDeleteClient}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
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
