import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AmountInput } from '@/components/ui/amount-input';
import { Label } from '@/components/ui/label';
import { Package, Plus, Trash } from 'lucide-react';
import { CreditItem } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Mobile card component for credit items
  const CreditItemMobileCard = ({ item }: { item: CreditItem }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div>
        <Label className="text-xs text-muted-foreground">Désignation</Label>
        <Input
          value={item.description}
          onChange={(e) => !readOnly && onUpdateItem(item.id, 'description', e.target.value)}
          placeholder="Désignation de l'article"
          readOnly={readOnly}
          className={readOnly ? "bg-muted cursor-not-allowed" : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Qté</Label>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => !readOnly && onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            readOnly={readOnly}
            className={readOnly ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Montant TTC (€)</Label>
          <AmountInput
            value={item.total_ttc}
            onChange={(value) => !readOnly && onUpdateItem(item.id, 'total_ttc', value)}
            readOnly={readOnly}
            className={readOnly ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Remise (%)</Label>
          <AmountInput
            value={item.discount}
            onChange={(value) => !readOnly && onUpdateItem(item.id, 'discount', value)}
            readOnly={readOnly}
            className={readOnly ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">TVA (%)</Label>
          <Input
            type="number"
            value={item.vat}
            onChange={(e) => !readOnly && onUpdateItem(item.id, 'vat', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            readOnly={readOnly}
            className={readOnly ? "bg-muted cursor-not-allowed" : ""}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div>
          <div className="font-medium text-lg">
            Total TTC : {item.total_ttc.toFixed(2)} €
          </div>
          <div className="text-sm text-muted-foreground">
            P.U. HT : {item.unit_price.toFixed(2)} €
          </div>
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
    </div>
  );

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
          <div className="text-center py-8 text-muted-foreground">
            Aucun article ajouté
          </div>
        ) : isMobile ? (
          // Mobile: Card layout
          <div className="space-y-4">
            {items.map((item) => (
              <CreditItemMobileCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          // Desktop: Grid layout
          <div className="space-y-2">
            {/* Header */}
            <div className="grid gap-2 text-sm font-medium text-muted-foreground pb-2 border-b" style={{ gridTemplateColumns: readOnly ? '4fr 1fr 1.5fr 1fr 1fr 1.5fr' : '4fr 1fr 1.5fr 1fr 1fr auto' }}>
              <div>Désignation</div>
              <div>Qté</div>
              <div>Montant TTC (€)</div>
              <div>Remise (%)</div>
              <div>TVA (%)</div>
              <div>P.U. HT (€)</div>
              {!readOnly && <div></div>}
            </div>

            {/* Item rows */}
            {items.map((item) => (
              <div key={item.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: readOnly ? '4fr 1fr 1.5fr 1fr 1fr 1.5fr' : '4fr 1fr 1.5fr 1fr 1fr auto' }}>
                <Input
                  value={item.description}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="Désignation de l'article"
                  readOnly={readOnly}
                  className={readOnly ? "bg-muted cursor-not-allowed" : ""}
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  readOnly={readOnly}
                  className={readOnly ? "bg-muted cursor-not-allowed" : ""}
                />
                <AmountInput
                  value={item.total_ttc}
                  onChange={(value) => !readOnly && onUpdateItem(item.id, 'total_ttc', value)}
                  readOnly={readOnly}
                  className={readOnly ? "bg-muted cursor-not-allowed" : ""}
                />
                <AmountInput
                  value={item.discount}
                  onChange={(value) => !readOnly && onUpdateItem(item.id, 'discount', value)}
                  readOnly={readOnly}
                  className={readOnly ? "bg-muted cursor-not-allowed" : ""}
                />
                <Input
                  type="number"
                  value={item.vat}
                  onChange={(e) => !readOnly && onUpdateItem(item.id, 'vat', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  readOnly={readOnly}
                  className={readOnly ? "bg-muted cursor-not-allowed" : ""}
                />
                <div className="text-right font-medium text-muted-foreground text-sm">
                  {item.unit_price.toFixed(2)} €
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
              {isMobile ? 'Ajouter' : 'Ajouter un article'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
