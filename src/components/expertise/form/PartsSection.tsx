import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Settings, Plus, Trash } from 'lucide-react';
import { PartItem } from './types';
import { useAutomotivePartNames } from '@/hooks/use-automotive-parts';
import { useIsMobile } from '@/hooks/use-mobile';

interface PartsSectionProps {
  parts: PartItem[];
  onPartsChange: (parts: PartItem[]) => void;
  isReadOnly?: boolean;
}

export const PartsSection = ({ parts, onPartsChange, isReadOnly = false }: PartsSectionProps) => {
  const { data: partDesignations = [] } = useAutomotivePartNames();
  const isMobile = useIsMobile();

  const addPart = () => {
    if (isReadOnly) return;
    const newPart: PartItem = {
      id: `part_${Date.now()}`,
      description: '',
      quantity: 1,
      unitCost: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    onPartsChange([...parts, newPart]);
  };

  const removePart = (id: string) => {
    if (isReadOnly) return;
    onPartsChange(parts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: keyof PartItem, value: string | number) => {
    if (isReadOnly) return;
    const updatedParts = parts.map(part => {
      if (part.id === id) {
        const updated = { ...part, [field]: value };
        // Calculate total
        const subtotal = updated.quantity * updated.unitCost;
        const discountAmount = subtotal * (updated.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const vatAmount = afterDiscount * (updated.vat / 100);
        updated.total = afterDiscount + vatAmount;
        return updated;
      }
      return part;
    });
    onPartsChange(updatedParts);
  };

  const calculateTotals = () => {
    const subTotal = parts.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0);
    const totalVat = parts.reduce((sum, part) => {
      const subtotal = part.quantity * part.unitCost;
      const discountAmount = subtotal * (part.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      return sum + (afterDiscount * (part.vat / 100));
    }, 0);
    const totalDiscount = parts.reduce((sum, part) => {
      const subtotal = part.quantity * part.unitCost;
      return sum + (subtotal * (part.discount / 100));
    }, 0);
    const total = parts.reduce((sum, part) => sum + part.total, 0);

    return { subTotal, totalVat, totalDiscount, total };
  };

  const totals = calculateTotals();

  // Mobile card component for parts
  const PartMobileCard = ({ part }: { part: PartItem }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div>
        <Label className="text-xs text-muted-foreground">Désignation</Label>
        <Combobox
          value={part.description}
          onChange={(value) => updatePart(part.id, 'description', value)}
          options={partDesignations}
          placeholder="Désignation de la pièce"
          disabled={isReadOnly}
          className={isReadOnly ? 'bg-muted' : ''}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Qté</Label>
          <Input
            type="number"
            value={part.quantity}
            onChange={(e) => updatePart(part.id, 'quantity', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Coût Unitaire (€)</Label>
          <Input
            type="number"
            value={part.unitCost}
            onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Remise (%)</Label>
          <Input
            type="number"
            value={part.discount}
            onChange={(e) => updatePart(part.id, 'discount', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.1"
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">TVA (%)</Label>
          <Input
            type="number"
            value={part.vat}
            onChange={(e) => updatePart(part.id, 'vat', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="font-medium text-lg">
          Total : {part.total.toFixed(2)} €
        </div>
        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removePart(part.id)}
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
          <Settings className="h-5 w-5 mr-2" />
          Pièces
        </CardTitle>
        <CardDescription>
          Liste des pièces à remplacer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {parts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune pièce ajoutée
          </div>
        ) : isMobile ? (
          // Mobile: Card layout
          <div className="space-y-4">
            {parts.map((part) => (
              <PartMobileCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          // Desktop: Grid layout
          <div className="space-y-2">
            {/* Header */}
            <div className="grid gap-2 text-sm font-medium text-muted-foreground pb-2 border-b" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
              <div>Désignation</div>
              <div>Qté</div>
              <div>Coût Unitaire (€)</div>
              <div>Remise (%)</div>
              <div>TVA (%)</div>
              <div>Total (€)</div>
              <div></div>
            </div>

            {/* Part items */}
            {parts.map((part) => (
              <div key={part.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                <Combobox
                  value={part.description}
                  onChange={(value) => updatePart(part.id, 'description', value)}
                  options={partDesignations}
                  placeholder="Désignation de la pièce"
                  disabled={isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                <Input
                  type="number"
                  value={part.quantity}
                  onChange={(e) => updatePart(part.id, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                <Input
                  type="number"
                  value={part.unitCost}
                  onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                <Input
                  type="number"
                  value={part.discount}
                  onChange={(e) => updatePart(part.id, 'discount', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                <Input
                  type="number"
                  value={part.vat}
                  onChange={(e) => updatePart(part.id, 'vat', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  readOnly={isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                <div className="text-right font-medium">
                  {part.total.toFixed(2)} €
                </div>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePart(part.id)}
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
              onClick={addPart}
              className="w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isMobile ? 'Ajouter' : 'Ajouter une pièce'}
            </Button>
          </div>
        )}

        {parts.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            {isMobile ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total :</span>
                  <span className="font-medium">{totals.subTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA :</span>
                  <span className="font-medium">{totals.totalVat.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remise TTC :</span>
                  <span className="font-medium">{totals.totalDiscount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total :</span>
                  <span>{totals.total.toFixed(2)} €</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-end space-x-8 text-sm">
                  <div>Sous-total : <span className="font-medium">{totals.subTotal.toFixed(2)} €</span></div>
                  <div>TVA : <span className="font-medium">{totals.totalVat.toFixed(2)} €</span></div>
                  <div>Remise TTC : <span className="font-medium">{totals.totalDiscount.toFixed(2)} €</span></div>
                </div>
                <div className="flex justify-end text-lg font-bold">
                  Total : <span className="ml-2">{totals.total.toFixed(2)} €</span>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
