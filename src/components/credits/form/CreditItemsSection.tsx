
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Trash } from 'lucide-react';
import { CreditItem } from './types';

interface CreditItemsSectionProps {
  items: CreditItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof CreditItem, value: any) => void;
  onRemoveItem: (id: string) => void;
  readOnly?: boolean;
}

export const CreditItemsSection = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  readOnly = false
}: CreditItemsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Package className="h-5 w-5 mr-2" />
          Articles de l'avoir
        </CardTitle>
        <CardDescription>
          {readOnly ? "Articles crédités" : "Ajoutez les articles à créditer"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun article ajouté
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid gap-2 text-sm font-medium text-gray-700 pb-2 border-b" style={{ gridTemplateColumns: readOnly ? '4fr 1fr 1.5fr 1fr 1fr 1.5fr' : '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
              <div>Désignation</div>
              <div>Qté</div>
              <div>Prix Unitaire (€)</div>
              <div>Remise (%)</div>
              <div>TVA (%)</div>
              <div>Total (€)</div>
              {!readOnly && <div></div>}
            </div>

            {/* Item rows */}
            {items.map((item) => (
              <div key={item.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: readOnly ? '4fr 1fr 1.5fr 1fr 1fr 1.5fr' : '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                <Input
                  value={item.description}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="Désignation de l'article"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
                <Input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
                <Input
                  type="number"
                  value={item.discount}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
                <Input
                  type="number"
                  value={item.vat}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'vat', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  readOnly={readOnly}
                  className={readOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
                <div className="text-right font-medium">
                  {item.total.toFixed(2)} €
                </div>
                {!readOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onAddItem}
              className="w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
