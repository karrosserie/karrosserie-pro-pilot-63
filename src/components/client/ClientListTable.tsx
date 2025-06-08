
import React from 'react';
import { Button } from '@/components/ui/button';
import { Client } from '@/services/supabase/clients';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from '@/components/ui/status-badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Eye, Download, Pencil, Trash2, MoreHorizontal, FileText, Receipt, CreditCard } from 'lucide-react';

interface ClientListTableProps {
  clients: Client[];
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

const ClientListTable: React.FC<ClientListTableProps> = ({
  clients,
  onViewClient,
  onEditClient,
  onDeleteClient
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
        const hasFrontLicense = client.driver_license_front_url;
        const hasBackLicense = client.driver_license_back_url;
        const hasCompleteLicense = hasFrontLicense && hasBackLicense;
        
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
      cell: ({ row }) => (
        <div className="text-right space-x-1 flex items-center justify-end">
          <Button variant="ghost" size="icon" onClick={() => onViewClient(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEditClient(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDeleteClient(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Créer un devis
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Receipt className="h-4 w-4 mr-2" />
                Créer une facture
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="h-4 w-4 mr-2" />
                Créer un avoir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
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
