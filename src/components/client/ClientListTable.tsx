import React from 'react';
import { Button } from '@/components/ui/button';
import { Client } from '@/services/supabase/clients';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from '@/components/ui/status-badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Eye, Download, Pencil, Trash2, MoreVertical, FileText, Receipt, CreditCard, Wrench } from 'lucide-react';

interface ClientListTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateQuote?: (client: Client) => void;
  onCreateInvoice?: (client: Client) => void;
  onCreateCredit?: (client: Client) => void;
  onCreateIntervention?: (client: Client) => void;
}

const ClientListTable: React.FC<ClientListTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient,
  onCreateQuote,
  onCreateInvoice,
  onCreateCredit,
  onCreateIntervention
}) => {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
    },
    {
      id: "license_status",
      header: "Permis de conduire",
      cell: ({ row }) => {
        const client = row.original as any;
        const isEntreprise = client.client_type === 'entreprise';
        const hasFrontLicense = client.driver_license_front_url;
        const hasBackLicense = client.driver_license_back_url;
        const hasCompleteLicense = hasFrontLicense && hasBackLicense;
        
        if (isEntreprise) {
          return (
            <StatusBadge 
              status="Entreprise"
              className="bg-blue-100 text-blue-800 hover:bg-blue-100"
            />
          );
        }
        
        return (
          <StatusBadge 
            status={hasCompleteLicense ? "Permis importé" : "Pas de permis"}
            className={hasCompleteLicense ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const client = row.original;

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
          <div className="text-right space-x-1 flex items-center justify-end">
            <Button variant="ghost" size="icon" onClick={() => onViewClient(client)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEditClient(client)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteClient(client)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50">
                <DropdownMenuItem onClick={handleCreateQuote} className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Créer un devis
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateInvoice} className="cursor-pointer">
                  <Receipt className="h-4 w-4 mr-2" />
                  Créer une facture
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateCredit} className="cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Créer un avoir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCreateIntervention} className="cursor-pointer">
                  <Wrench className="h-4 w-4 mr-2" />
                  Créer une fiche d'intervention
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={clients || []}
      searchKey="first_name"
      searchPlaceholder="Rechercher un client..."
    />
  );
};

export default ClientListTable;
