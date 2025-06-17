
import React from 'react';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { DataTable } from '@/components/ui/data-table';
import { FileText } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface ClientExpertiseReportsTabProps {
  clientId: string;
}

const ClientExpertiseReportsTab: React.FC<ClientExpertiseReportsTabProps> = ({ clientId }) => {
  const { reports, isLoading } = useExpertiseReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientReports = reports?.filter(report => report.client_id === clientId) || [];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "report_number",
      header: "N° Rapport",
      cell: ({ row }) => row.getValue("report_number") || "Non défini"
    },
    {
      accessorKey: "report_date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("report_date");
        return date ? new Date(date as string).toLocaleDateString() : "Non définie";
      }
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const amount = row.getValue("amount");
        return amount ? `${amount}€` : "Non défini";
      }
    },
    {
      accessorKey: "claim_number",
      header: "N° Sinistre",
      cell: ({ row }) => row.getValue("claim_number") || "-"
    },
    {
      accessorKey: "vehicles",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicle = row.getValue("vehicles") as any;
        return vehicle?.license_plate || "-";
      }
    },
    {
      header: "Statut",
      cell: () => (
        <Badge variant="outline">Expertise</Badge>
      )
    }
  ];

  if (clientReports.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun rapport d'expertise</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de rapport d'expertise.</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={clientReports}
      searchKey="report_number"
      searchPlaceholder="Rechercher par numéro de rapport..."
    />
  );
};

export default ClientExpertiseReportsTab;
