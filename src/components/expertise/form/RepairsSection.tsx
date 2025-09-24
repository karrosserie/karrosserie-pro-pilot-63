import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Wrench, Plus, Trash } from 'lucide-react';
import { RepairItem } from './types';
import { REPAIR_DESIGNATIONS } from '@/constants/predefined-values';

interface RepairsSectionProps {
  repairs: RepairItem[];
  onRepairsChange: (repairs: RepairItem[]) => void;
  isReadOnly?: boolean;
}

export const RepairsSection = ({ repairs, onRepairsChange, isReadOnly = false }: RepairsSectionProps) => {
  const addRepair = () => {
    if (isReadOnly) return;
    const newRepair: RepairItem = {
      id: `repair_${Date.now()}`,
      description: '',
      quantity: 1,
      unitCost: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    onRepairsChange([...repairs, newRepair]);
  };

  const removeRepair = (id: string) => {
    if (isReadOnly) return;
    onRepairsChange(repairs.filter(repair => repair.id !== id));
  };

  const updateRepair = (id: string, field: keyof RepairItem, value: string | number) => {
    if (isReadOnly) return;
    const updatedRepairs = repairs.map(repair => {
      if (repair.id === id) {
        const updated = { ...repair, [field]: value };
        // Calculate total
        const subtotal = updated.quantity * updated.unitCost;
        const discountAmount = subtotal * (updated.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const vatAmount = afterDiscount * (updated.vat / 100);
        updated.total = afterDiscount + vatAmount;
        return updated;
      }
      return repair;
    });
    onRepairsChange(updatedRepairs);
  };

  const calculateTotals = () => {
    const subTotal = repairs.reduce((sum, repair) => sum + (repair.quantity * repair.unitCost), 0);
    const totalVat = repairs.reduce((sum, repair) => {
      const subtotal = repair.quantity * repair.unitCost;
      const discountAmount = subtotal * (repair.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      return sum + (afterDiscount * (repair.vat / 100));
    }, 0);
    const totalDiscount = repairs.reduce((sum, repair) => {
      const subtotal = repair.quantity * repair.unitCost;
      return sum + (subtotal * (repair.discount / 100));
    }, 0);
    const total = repairs.reduce((sum, repair) => sum + repair.total, 0);

    return { subTotal, totalVat, totalDiscount, total };
  };

  const totals = calculateTotals();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Wrench className="h-5 w-5 mr-2" />
          Réparations
        </CardTitle>
        <CardDescription>
          Liste des réparations à effectuer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {repairs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune réparation ajoutée
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid gap-2 text-sm font-medium text-gray-700 pb-2 border-b" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
              <div>Désignation</div>
              <div>Qté</div>
              <div>Coût Unitaire (€)</div>
              <div>Remise (%)</div>
              <div>TVA (%)</div>
              <div>Total (€)</div>
              <div></div>
            </div>

            {/* Repair items */}
            {repairs.map((repair) => (
              <div key={repair.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                <Combobox
                  value={repair.description}
                  onChange={(value) => updateRepair(repair.id, 'description', value)}
                  options={REPAIR_DESIGNATIONS}
                  placeholder="Désignation de la réparation"
                  disabled={isReadOnly}
                  className={isReadOnly ? 'bg-gray-50' : ''}
                />
                <Input
                  type="number"
                  value={repair.quantity}
                  onChange={(e) => updateRepair(repair.id, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-gray-50' : ''}
                />
                <Input
                  type="number"
                  value={repair.unitCost}
                  onChange={(e) => updateRepair(repair.id, 'unitCost', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-gray-50' : ''}
                />
                <Input
                  type="number"
                  value={repair.discount}
                  onChange={(e) => updateRepair(repair.id, 'discount', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-gray-50' : ''}
                />
                <Input
                  type="number"
                  value={repair.vat}
                  onChange={(e) => updateRepair(repair.id, 'vat', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-gray-50' : ''}
                />
                <div className="text-right font-medium">
                  {repair.total.toFixed(2)} €
                </div>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeRepair(repair.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={addRepair}
              className="w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une réparation
            </Button>
          </div>
        )}

        {repairs.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-end space-x-8 text-sm">
              <div>Sous-total : <span className="font-medium">{totals.subTotal.toFixed(2)} €</span></div>
              <div>TVA : <span className="font-medium">{totals.totalVat.toFixed(2)} €</span></div>
              <div>Remise TTC : <span className="font-medium">{totals.totalDiscount.toFixed(2)} €</span></div>
            </div>
            <div className="flex justify-end text-lg font-bold">
              Total : <span className="ml-2">{totals.total.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
