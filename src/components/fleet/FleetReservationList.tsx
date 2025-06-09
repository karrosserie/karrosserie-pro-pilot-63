
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Car, Plus, Search } from 'lucide-react';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { format } from 'date-fns';

const FleetReservationList = () => {
  const { reservations, isLoading, error } = useFleetReservations();

  const columns: ColumnDef<any>[] = [
    {
      accessorFn: (row) => `${row.clients?.first_name} ${row.clients?.last_name}`,
      header: "Client",
    },
    {
      accessorFn: (row) => `${row.fleet_vehicles?.brand} ${row.fleet_vehicles?.model}`,
      header: "Véhicule",
    },
    {
      accessorKey: "fleet_vehicles.license_plate",
      header: "Immatriculation",
    },
    {
      accessorKey: "start_date",
      header: "Début",
      cell: ({ row }) => format(new Date(row.original.start_date), 'dd/MM/yyyy'),
    },
    {
      accessorKey: "end_date",
      header: "Fin",
      cell: ({ row }) => format(new Date(row.original.end_date), 'dd/MM/yyyy'),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusClasses = {
          'Confirmée': 'bg-green-100 text-green-800',
          'En attente': 'bg-yellow-100 text-yellow-800',
          'Annulée': 'bg-red-100 text-red-800',
          'Terminée': 'bg-blue-100 text-blue-800',
        };
        const statusClass = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100';
        
        return (
          <span className={`${statusClass} px-2 py-1 rounded text-xs font-medium`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right space-x-2">
          <Button variant="ghost" size="sm">
            Voir
          </Button>
          <Button variant="outline" size="sm">
            Éditer
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="card-container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Réservations</h2>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <Button className="btn-primary">
            <Calendar className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={reservations || []}
        searchKey="clients.last_name"
        searchPlaceholder="Rechercher une réservation..."
      />
    </div>
  );
};

export default FleetReservationList;
