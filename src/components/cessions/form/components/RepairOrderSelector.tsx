
import React from 'react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useRepairOrders } from '@/hooks/use-repair-orders';

interface RepairOrderSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const RepairOrderSelector = ({ value, onChange, disabled }: RepairOrderSelectorProps) => {
  const { orders } = useRepairOrders();

  // Prepare repair order options for searchable select
  const repairOrderOptions = orders?.map(order => {
    const clientName = order.clients 
      ? `${order.clients.first_name} ${order.clients.last_name}`
      : 'Client inconnu';
    const vehicleInfo = order.vehicles 
      ? `${order.vehicles.brand} ${order.vehicles.model} - ${order.vehicles.license_plate}`
      : 'Véhicule inconnu';
    
    return {
      value: order.id,
      label: `${order.reference} - ${clientName} - ${vehicleInfo}`
    };
  }) || [];

  return (
    <SearchableSelect
      options={repairOrderOptions}
      value={value}
      onValueChange={onChange}
      placeholder="Sélectionner un ordre de réparation"
      searchPlaceholder="Rechercher un ordre..."
      disabled={disabled}
    />
  );
};
