import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      <div className="p-4">
        <p className="text-muted-foreground">Aucun ordre de réparation trouvé pour ce véhicule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicleOrders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Ordre {order.reference}
                </CardTitle>
                <CardDescription>
                  Créé le {format(new Date(order.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(order.status || 'En attente')}>
                {order.status || 'En attente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">N° de rapport:</span> {order.report_number || 'N/A'}</p>
                <p><span className="font-medium">Expert:</span> {order.expert_name || 'N/A'}</p>
              </div>
              <div>
                <p><span className="font-medium">N° de sinistre:</span> {order.claim_number || 'N/A'}</p>
                <p><span className="font-medium">Date d'incident:</span> {order.incident_date ? format(new Date(order.incident_date), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}</p>
              </div>
            </div>
            {order.notes && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm"><span className="font-medium">Notes:</span> {order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleRepairOrdersTab;