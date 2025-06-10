
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { CessionFormData, CessionFormErrors } from '../types';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RepairOrderSelectorProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
}

export const RepairOrderSelector = ({
  formData,
  errors,
  onFieldChange
}: RepairOrderSelectorProps) => {
  const { orders, isLoading: isLoadingOrders } = useRepairOrders();

  const formatRepairOrderDisplay = (order: any) => {
    const clientName = order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non assigné';
    const vehicleInfo = order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}` : 'Véhicule non assigné';
    const orderDate = order.created_at ? format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr }) : '';
    
    return `Ordre n°${order.reference} du ${orderDate} - ${clientName} - ${vehicleInfo}`;
  };

  // Préparer les options pour SearchableSelect
  const repairOrderOptions = (orders || []).map(order => ({
    value: order.id,
    label: formatRepairOrderDisplay(order)
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="repair_order_id">
        Ordre de réparation <span className="text-red-500">*</span>
      </Label>
      <SearchableSelect
        options={repairOrderOptions}
        value={formData.repair_order_id || ''}
        onValueChange={(value) => onFieldChange('repair_order_id', value)}
        placeholder={isLoadingOrders ? "Chargement..." : "Sélectionner un ordre de réparation"}
        searchPlaceholder="Rechercher un ordre de réparation..."
        disabled={isLoadingOrders}
      />
      {errors.repair_order_id && (
        <div className="text-sm text-red-600">{errors.repair_order_id}</div>
      )}
    </div>
  );
};
