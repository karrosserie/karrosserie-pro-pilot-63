
import React from 'react';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { SimpleTable } from '@/components/ui/simple-table';
import { FileText, Eye, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientExpertiseReportsTabProps {
  clientId: string;
}

const ClientExpertiseReportsTab: React.FC<ClientExpertiseReportsTabProps> = ({ clientId }) => {
  const { reports, isLoading, deleteReport } = useExpertiseReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientReports = reports?.filter(report => report.client_id === clientId) || [];

  const handleView = (report: any) => {
    console.log('View report:', report);
  };

  const handleEdit = (report: any) => {
    console.log('Edit report:', report);
  };

  const handleDelete = (report: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce rapport d'expertise ?`)) {
      deleteReport.mutate(report.id);
    }
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "report_number",
      header: "Numéro de rapport",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("report_number") || "Non défini"}</span>
      )
    },
    {
      accessorKey: "report_date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("report_date");
        return date ? new Date(date as string).toLocaleDateString('fr-FR') : "Non définie";
      }
    },
    {
      accessorKey: "clients",
      header: "Client",
      cell: ({ row }) => {
        const client = row.getValue("clients") as any;
        return client ? `${client.first_name} ${client.last_name}` : "-";
      }
    },
    {
      accessorKey: "vehicles",
      header: "Véhicule",
      cell: ({ row }) => {
        const vehicle = row.getValue("vehicles") as any;
        if (!vehicle) return "-";
        return `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`;
      }
    },
    {
      accessorKey: "expert_name",
      header: "Expert",
      cell: ({ row }) => row.getValue("expert_name") || "-"
    },
    {
      accessorKey: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const amount = row.getValue("amount");
        return formatAmount(amount as number);
      }
    },
    {
      header: "Statut",
      cell: () => (
        <Badge variant="outline">Expertise</Badge>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(report)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(report)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(report)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
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
    <SimpleTable
      columns={columns}
      data={clientReports}
    />
  );
};

export default ClientExpertiseReportsTab;
