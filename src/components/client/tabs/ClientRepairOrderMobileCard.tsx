import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, User, Car, Euro } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';

interface ClientRepairOrderMobileCardProps {
  order: any;
  onViewOrder: (order: any) => void;
}

const ClientRepairOrderMobileCard: React.FC<ClientRepairOrderMobileCardProps> = ({
  order,
  onViewOrder
}) => {
  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const calculateOrderAmount = (order: any) => {
    if (!order.items_data || !Array.isArray(order.items_data)) return 0;
    return order.items_data.reduce((total: number, item: any) => {
      const quantity = item.quantity || 1;
      const unitPrice = item.unit_price || 0;
      const discount = item.discount || 0;
      const vatRate = item.vat_rate || 20;
      const subtotal = quantity * unitPrice * (1 - discount / 100);
      return total + subtotal * (1 + vatRate / 100);
    }, 0);
  };

  return (
    <div className="card-container p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{order.reference}</h3>
          <p className="text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 inline mr-1" />
            {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <StatusBadge status={order.status || 'En attente'} />
      </div>

      {/* Vehicle Info */}
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Car className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            {order.vehicles 
              ? `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}`
              : '-'
            }
          </span>
        </div>

        <div className="flex items-center text-sm font-medium">
          <Euro className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatAmount(calculateOrderAmount(order))}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t">
        <Button variant="view" size="sm" onClick={() => onViewOrder(order)} className="w-full">
          <Eye className="h-3 w-3 mr-1" />
          Voir l'ordre de réparation
        </Button>
      </div>
    </div>
  );
};

export default ClientRepairOrderMobileCard;
