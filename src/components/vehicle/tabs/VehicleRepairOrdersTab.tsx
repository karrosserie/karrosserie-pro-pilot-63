import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface VehicleRepairOrdersTabProps {
  vehicleId: string;
}

const VehicleRepairOrdersTab: React.FC<VehicleRepairOrdersTabProps> = ({ vehicleId }) => {
  const { orders, isLoading } = useRepairOrders();

  const vehicleOrders = orders?.filter(order => order.vehicle_id === vehicleId) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Terminé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Signé': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement des ordres de réparation...</div>;
  }

  if (vehicleOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun ordre de réparation</h3>
        <p className="mt-1 text-sm text-gray-500">Ce véhicule n'a pas encore d'ordre de réparation.</p>
      </div>
    );
  }

  return (
    <div className="card-container p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>N° Rapport</TableHead>
            <TableHead>Expert</TableHead>
            <TableHead>N° Sinistre</TableHead>
            <TableHead>Date incident</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicleOrders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {order.reference || 'Non spécifié'}
              </TableCell>
              <TableCell>
                {format(new Date(order.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                {order.report_number || 'N/A'}
              </TableCell>
              <TableCell>
                {order.expert_name || 'N/A'}
              </TableCell>
              <TableCell>
                {order.claim_number || 'N/A'}
              </TableCell>
              <TableCell>
                {order.incident_date ? format(new Date(order.incident_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(order.status || 'En attente')}>
                  {order.status || 'En attente'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleRepairOrdersTab;