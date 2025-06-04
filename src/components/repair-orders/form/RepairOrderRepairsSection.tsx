
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Plus, Trash2 } from 'lucide-react';
import { RepairOrderRepairItem } from './types';

interface RepairOrderRepairsSectionProps {
  repairs: RepairOrderRepairItem[];
  onRepairsChange: (repairs: RepairOrderRepairItem[]) => void;
  isReadOnly?: boolean;
}

export const RepairOrderRepairsSection = ({ repairs, onRepairsChange, isReadOnly }: RepairOrderRepairsSectionProps) => {
  const addRepair = () => {
    const newRepair: RepairOrderRepairItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitCost: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    onRepairsChange([...repairs, newRepair]);
  };

  const updateRepair = (id: string, field: keyof RepairOrderRepairItem, value: any) => {
    const updatedRepairs = repairs.map(repair => {
      if (repair.id === id) {
        const updatedRepair = { ...repair, [field]: value };
        
        // Recalculer le total
        const subtotal = updatedRepair.quantity * updatedRepair.unitCost;
        const discountAmount = subtotal * (updatedRepair.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const vatAmount = afterDiscount * (updatedRepair.vat / 100);
        updatedRepair.total = afterDiscount + vatAmount;
        
        return updatedRepair;
      }
      return repair;
    });
    onRepairsChange(updatedRepairs);
  };

  const removeRepair = (id: string) => {
    onRepairsChange(repairs.filter(repair => repair.id !== id));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Wrench className="h-5 w-5 mr-2" />
          Réparations
        </CardTitle>
        <CardDescription>
          Détail des réparations à effectuer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {repairs.map((repair) => (
          <div key={repair.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
            <div className="md:col-span-2">
              <Label htmlFor={`repair-description-${repair.id}`}>Description</Label>
              <Input
                id={`repair-description-${repair.id}`}
                value={repair.description}
                onChange={(e) => updateRepair(repair.id, 'description', e.target.value)}
                placeholder="Description de la réparation"
                readOnly={isReadOnly}
              />
            </div>
            
            <div>
              <Label htmlFor={`repair-quantity-${repair.id}`}>Quantité</Label>
              <Input
                id={`repair-quantity-${repair.id}`}
                type="number"
                min="1"
                value={repair.quantity}
                onChange={(e) => updateRepair(repair.id, 'quantity', parseInt(e.target.value) || 0)}
                readOnly={isReadOnly}
              />
            </div>
            
            <div>
              <Label htmlFor={`repair-cost-${repair.id}`}>Prix unitaire (€)</Label>
              <Input
                id={`repair-cost-${repair.id}`}
                type="number"
                min="0"
                step="0.01"
                value={repair.unitCost}
                onChange={(e) => updateRepair(repair.id, 'unitCost', parseFloat(e.target.value) || 0)}
                readOnly={isReadOnly}
              />
            </div>
            
            <div>
              <Label htmlFor={`repair-vat-${repair.id}`}>TVA (%)</Label>
              <Input
                id={`repair-vat-${repair.id}`}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={repair.vat}
                onChange={(e) => updateRepair(repair.id, 'vat', parseFloat(e.target.value) || 0)}
                readOnly={isReadOnly}
              />
            </div>
            
            <div className="flex items-end">
              <div className="flex-1">
                <Label>Total: {repair.total.toFixed(2)} €</Label>
              </div>
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeRepair(repair.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            onClick={addRepair}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une réparation
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
