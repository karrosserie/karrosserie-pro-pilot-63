
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent, Plus, Trash } from 'lucide-react';
import { RepairOrderDiscountItem } from './types';

interface RepairOrderDiscountsSectionProps {
  discounts: RepairOrderDiscountItem[];
  onDiscountsChange: (discounts: RepairOrderDiscountItem[]) => void;
  isReadOnly?: boolean;
}

export const RepairOrderDiscountsSection = ({ discounts, onDiscountsChange, isReadOnly = false }: RepairOrderDiscountsSectionProps) => {
  const addDiscount = () => {
    if (isReadOnly) return;
    const newDiscount: RepairOrderDiscountItem = {
      id: `discount_${Date.now()}`,
      description: '',
      amount: 0
    };
    onDiscountsChange([...discounts, newDiscount]);
  };

  const removeDiscount = (id: string) => {
    if (isReadOnly) return;
    onDiscountsChange(discounts.filter(discount => discount.id !== id));
  };

  const updateDiscount = (id: string, field: keyof RepairOrderDiscountItem, value: string | number) => {
    if (isReadOnly) return;
    const updatedDiscounts = discounts.map(discount => {
      if (discount.id === id) {
        return { ...discount, [field]: value };
      }
      return discount;
    });
    onDiscountsChange(updatedDiscounts);
  };

  const totalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Percent className="h-5 w-5 mr-2" />
          Remises
        </CardTitle>
        <CardDescription>
          Remises appliquées à l'ordre de réparation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {/* Header */}
          <div className="grid gap-2 text-sm font-medium text-gray-700 pb-2 border-b" style={{ gridTemplateColumns: '4fr 2fr auto' }}>
            <div>Description</div>
            <div>Montant (€)</div>
            <div></div>
          </div>

          {/* Discount items - Always show at least one */}
          {(discounts.length > 0 ? discounts : [{ id: 'temp', description: '', amount: 0 }]).map((discount) => (
            <div key={discount.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 2fr auto' }}>
              <Input
                value={discount.description}
                onChange={(e) => updateDiscount(discount.id, 'description', e.target.value)}
                placeholder="Description de la remise"
                readOnly={isReadOnly}
                className={isReadOnly ? 'bg-gray-50' : ''}
              />
              <Input
                type="number"
                value={discount.amount}
                onChange={(e) => updateDiscount(discount.id, 'amount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                readOnly={isReadOnly}
                className={isReadOnly ? 'bg-gray-50' : ''}
              />
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDiscount(discount.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={addDiscount}
              className="w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une remise
            </Button>
          </div>
        )}

        {discounts.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-end text-lg font-bold">
              Total des remises : <span className="ml-2">{totalDiscounts.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
