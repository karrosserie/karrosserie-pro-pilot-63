
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ReceiptWithClient } from "@/services/supabase/receipts/types";

interface ReceiptsColumnsProps {
  onEdit: (receipt: ReceiptWithClient) => void;
  onDelete: (receipt: ReceiptWithClient) => void;
}

export const createReceiptsColumns = ({ onEdit, onDelete }: ReceiptsColumnsProps): ColumnDef<ReceiptWithClient>[] => [
  {
    accessorKey: "reference",
    header: "Référence",
    cell: ({ row }) => {
      const reference = row.getValue("reference") as string;
      return <div className="font-medium">{reference || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{new Date(date).toLocaleDateString('fr-FR')}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <div>{typeof amount === 'number' ? amount.toFixed(2) : amount || '0.00'} €</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span className={`px-2 py-1 rounded text-xs ${
          status === 'Payé' 
            ? 'bg-green-100 text-green-800'
            : status === 'En attente'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      const client = row.getValue("client") as string;
      return <div>{client || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "invoice",
    header: "Facture",
    cell: ({ row }) => {
      const invoice = row.getValue("invoice") as string;
      return <div>{invoice || 'N/A'}</div>;
    },
  },
  {
    accessorKey: "payment_method",
    header: "Mode de paiement",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const receipt = row.original;
      return (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(receipt)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(receipt)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
