import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';
import { AmountInput } from '@/components/ui/amount-input';
import { Label } from '@/components/ui/label';
import { Wrench, Settings, Plus, Trash } from 'lucide-react';
import { QuoteRepairItem, QuotePartItem } from './types';
import { calculateLineTotal } from './utils/calculations';
import { REPAIR_DESIGNATIONS } from '@/constants/predefined-values';
import { useAutomotivePartNames } from '@/hooks/use-automotive-parts';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuoteRepairsAndPartsSectionProps {
  repairs: QuoteRepairItem[];
  parts: QuotePartItem[];
  onRepairsChange: (repairs: QuoteRepairItem[]) => void;
  onPartsChange: (parts: QuotePartItem[]) => void;
  isReadOnly?: boolean;
}

export const QuoteRepairsAndPartsSection = ({ 
  repairs, 
  parts, 
  onRepairsChange, 
  onPartsChange, 
  isReadOnly = false 
}: QuoteRepairsAndPartsSectionProps) => {
  const { data: partDesignations = [] } = useAutomotivePartNames();
  const [activeTab, setActiveTab] = useState<'repairs' | 'parts'>('repairs');
  const isMobile = useIsMobile();

  // Ensure there's always at least one item on mount
  useEffect(() => {
    if (repairs.length === 0 && !isReadOnly) {
      addRepair();
    }
    if (parts.length === 0 && !isReadOnly) {
      addPart();
    }
  }, []);

  // Repairs functions - memoized with useCallback
  const addRepair = useCallback(() => {
    if (isReadOnly) return;
    const newRepair: QuoteRepairItem = {
      id: `repair_${Date.now()}`,
      description: '',
      quantity: 1,
      unitCost: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    onRepairsChange([...repairs, newRepair]);
  }, [isReadOnly, repairs, onRepairsChange]);

  const removeRepair = useCallback((id: string) => {
    if (isReadOnly) return;
    onRepairsChange(repairs.filter(repair => repair.id !== id));
  }, [isReadOnly, repairs, onRepairsChange]);

  const updateRepair = useCallback((id: string, field: keyof QuoteRepairItem, value: string | number) => {
    if (isReadOnly) return;
    const updatedRepairs = repairs.map(repair => {
      if (repair.id === id) {
        const updated = { ...repair, [field]: value } as QuoteRepairItem;

        // If user edits the total, respect it and calculate unit cost
        if (field === 'total') {
          const manualTotal = isNaN(Number(value)) ? 0 : Number(value);
          updated.total = manualTotal;
          // Calculate unit cost as total * 0.8
          updated.unitCost = manualTotal * 0.8;
          return updated;
        }

        // Ensure numeric values are valid numbers
        const quantity = isNaN(Number(updated.quantity)) ? 0 : Number(updated.quantity);
        const unitCost = isNaN(Number(updated.unitCost)) ? 0 : Number(updated.unitCost);
        const discount = isNaN(Number(updated.discount)) ? 0 : Number(updated.discount);
        const vat = isNaN(Number(updated.vat)) ? 0 : Number(updated.vat);
        
        // Update the repair item with validated values
        updated.quantity = quantity;
        updated.unitCost = unitCost;
        updated.discount = discount;
        updated.vat = vat;
        
        // Calculate total using the centralized function when not manually overridden
        updated.total = calculateLineTotal(quantity, unitCost, discount, vat);
        return updated;
      }
      return repair;
    });
    onRepairsChange(updatedRepairs);
  }, [isReadOnly, repairs, onRepairsChange]);

  // Parts functions - memoized with useCallback
  const addPart = useCallback(() => {
    if (isReadOnly) return;
    const newPart: QuotePartItem = {
      id: `part_${Date.now()}`,
      description: '',
      quantity: 1,
      unitCost: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    onPartsChange([...parts, newPart]);
  }, [isReadOnly, parts, onPartsChange]);

  const removePart = useCallback((id: string) => {
    if (isReadOnly) return;
    onPartsChange(parts.filter(part => part.id !== id));
  }, [isReadOnly, parts, onPartsChange]);

  const updatePart = useCallback((id: string, field: keyof QuotePartItem, value: string | number) => {
    if (isReadOnly) return;
    const updatedParts = parts.map(part => {
      if (part.id === id) {
        const updated = { ...part, [field]: value } as QuotePartItem;

        // If user edits the total, respect it and calculate unit cost
        if (field === 'total') {
          const manualTotal = isNaN(Number(value)) ? 0 : Number(value);
          updated.total = manualTotal;
          // Calculate unit cost as total * 0.8
          updated.unitCost = manualTotal * 0.8;
          return updated;
        }
        
        // Ensure numeric values are valid numbers
        const quantity = isNaN(Number(updated.quantity)) ? 0 : Number(updated.quantity);
        const unitCost = isNaN(Number(updated.unitCost)) ? 0 : Number(updated.unitCost);
        const discount = isNaN(Number(updated.discount)) ? 0 : Number(updated.discount);
        const vat = isNaN(Number(updated.vat)) ? 0 : Number(updated.vat);
        
        // Update values
        updated.quantity = quantity;
        updated.unitCost = unitCost;
        updated.discount = discount;
        updated.vat = vat;
        
        // Calculate total using the centralized function when not manually overridden
        updated.total = calculateLineTotal(quantity, unitCost, discount, vat);
        return updated;
      }
      return part;
    });
    onPartsChange(updatedParts);
  }, [isReadOnly, parts, onPartsChange]);

  // Memoized totals calculation
  const totals = useMemo(() => {
    const repairTotals = {
      subTotal: repairs.reduce((sum, repair) => sum + (repair.quantity * repair.unitCost), 0),
      totalVat: repairs.reduce((sum, repair) => {
        const quantity = isNaN(Number(repair.quantity)) ? 0 : Number(repair.quantity);
        const unitCost = isNaN(Number(repair.unitCost)) ? 0 : Number(repair.unitCost);
        const discount = isNaN(Number(repair.discount)) ? 0 : Number(repair.discount);
        const vat = isNaN(Number(repair.vat)) ? 0 : Number(repair.vat);
        
        const subtotal = quantity * unitCost;
        const discountAmount = subtotal * (discount / 100);
        const afterDiscount = subtotal - discountAmount;
        return sum + (afterDiscount * (vat / 100));
      }, 0),
      totalDiscount: repairs.reduce((sum, repair) => {
        const quantity = isNaN(Number(repair.quantity)) ? 0 : Number(repair.quantity);
        const unitCost = isNaN(Number(repair.unitCost)) ? 0 : Number(repair.unitCost);
        const discount = isNaN(Number(repair.discount)) ? 0 : Number(repair.discount);
        
        const subtotal = quantity * unitCost;
        return sum + (subtotal * (discount / 100));
      }, 0),
      total: repairs.reduce((sum, repair) => sum + (isNaN(Number(repair.total)) ? 0 : Number(repair.total)), 0)
    };

    const partTotals = {
      subTotal: parts.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0),
      totalVat: parts.reduce((sum, part) => {
        const quantity = isNaN(Number(part.quantity)) ? 0 : Number(part.quantity);
        const unitCost = isNaN(Number(part.unitCost)) ? 0 : Number(part.unitCost);
        const discount = isNaN(Number(part.discount)) ? 0 : Number(part.discount);
        const vat = isNaN(Number(part.vat)) ? 0 : Number(part.vat);
        
        const subtotal = quantity * unitCost;
        const discountAmount = subtotal * (discount / 100);
        const afterDiscount = subtotal - discountAmount;
        return sum + (afterDiscount * (vat / 100));
      }, 0),
      totalDiscount: parts.reduce((sum, part) => {
        const quantity = isNaN(Number(part.quantity)) ? 0 : Number(part.quantity);
        const unitCost = isNaN(Number(part.unitCost)) ? 0 : Number(part.unitCost);
        const discount = isNaN(Number(part.discount)) ? 0 : Number(part.discount);
        
        const subtotal = quantity * unitCost;
        return sum + (subtotal * (discount / 100));
      }, 0),
      total: parts.reduce((sum, part) => sum + (isNaN(Number(part.total)) ? 0 : Number(part.total)), 0)
    };

    return {
      combined: {
        subTotal: repairTotals.subTotal + partTotals.subTotal,
        totalVat: repairTotals.totalVat + partTotals.totalVat,
        totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount,
        total: repairTotals.total + partTotals.total
      },
      repairs: repairTotals,
      parts: partTotals
    };
  }, [repairs, parts]);

  const hasItems = repairs.length > 0 || parts.length > 0;

  // Mobile card component for repairs
  const RepairMobileCard = ({ repair }: { repair: QuoteRepairItem }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div>
        <Label className="text-xs text-muted-foreground">Désignation</Label>
        <AutocompleteInput
          value={repair.description}
          onChange={(value) => updateRepair(repair.id, 'description', value)}
          options={REPAIR_DESIGNATIONS}
          placeholder="Tapez pour rechercher..."
          disabled={isReadOnly}
          className={isReadOnly ? 'bg-muted' : ''}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Qté</Label>
          <Input
            type="number"
            value={repair.quantity}
            onChange={(e) => updateRepair(repair.id, 'quantity', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Coût Unitaire (€)</Label>
          <AmountInput
            value={repair.unitCost}
            onChange={(value) => updateRepair(repair.id, 'unitCost', value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Remise (%)</Label>
          <AmountInput
            value={repair.discount}
            onChange={(value) => updateRepair(repair.id, 'discount', value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">TVA (%)</Label>
          <Input
            type="number"
            value={repair.vat}
            onChange={(e) => updateRepair(repair.id, 'vat', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="font-medium text-lg">
          Total : <AmountInput
            value={isNaN(Number(repair.total)) ? 0 : Number(repair.total)}
            onChange={(value) => updateRepair(repair.id, 'total', value)}
            readOnly={isReadOnly}
            className={`w-24 inline-block ${isReadOnly ? 'bg-muted' : ''}`}
          /> €
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
    </div>
  );

  // Mobile card component for parts
  const PartMobileCard = ({ part }: { part: QuotePartItem }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div>
        <Label className="text-xs text-muted-foreground">Désignation</Label>
        <AutocompleteInput
          value={part.description}
          onChange={(value) => updatePart(part.id, 'description', value)}
          options={partDesignations}
          placeholder="Tapez pour rechercher..."
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
          <AmountInput
            value={part.unitCost}
            onChange={(value) => updatePart(part.id, 'unitCost', value)}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-muted' : ''}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Remise (%)</Label>
          <AmountInput
            value={part.discount}
            onChange={(value) => updatePart(part.id, 'discount', value)}
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
          Total : <AmountInput
            value={isNaN(Number(part.total)) ? 0 : Number(part.total)}
            onChange={(value) => updatePart(part.id, 'total', value)}
            readOnly={isReadOnly}
            className={`w-24 inline-block ${isReadOnly ? 'bg-muted' : ''}`}
          /> €
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

  // Totals component (responsive)
  const TotalsSection = ({ sectionTotals }: { sectionTotals: typeof totals.repairs }) => (
    <div className="border-t pt-4 space-y-2">
      {isMobile ? (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sous-total :</span>
            <span className="font-medium">{sectionTotals.subTotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TVA :</span>
            <span className="font-medium">{sectionTotals.totalVat.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remise TTC :</span>
            <span className="font-medium">{sectionTotals.totalDiscount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total :</span>
            <span>{sectionTotals.total.toFixed(2)} €</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end space-x-8 text-sm">
            <div>Sous-total : <span className="font-medium">{sectionTotals.subTotal.toFixed(2)} €</span></div>
            <div>TVA : <span className="font-medium">{sectionTotals.totalVat.toFixed(2)} €</span></div>
            <div>Remise TTC : <span className="font-medium">{sectionTotals.totalDiscount.toFixed(2)} €</span></div>
          </div>
          <div className="flex justify-end text-lg font-bold">
            Total : <span className="ml-2">{sectionTotals.total.toFixed(2)} €</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Wrench className="h-5 w-5 mr-2" />
          Réparations et pièces
        </CardTitle>
        <CardDescription>
          Liste des réparations à effectuer et des pièces à remplacer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Onglets */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('repairs')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
              activeTab === 'repairs'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wrench className="h-4 w-4 mr-1" />
            {!isMobile && 'Réparations'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
              activeTab === 'parts'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-4 w-4 mr-1" />
            {!isMobile && 'Pièces'}
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'repairs' && (
          <div className="space-y-4">
            {isMobile ? (
              // Mobile: Card layout
              <div className="space-y-4">
                {repairs.map((repair) => (
                  <RepairMobileCard key={repair.id} repair={repair} />
                ))}
              </div>
            ) : (
              // Desktop: Grid layout
              <div className="space-y-2">
                <div className="grid gap-2 text-sm font-medium text-muted-foreground pb-2 border-b" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                  <div>Désignation</div>
                  <div>Qté</div>
                  <div>Coût Unitaire (€)</div>
                  <div>Remise (%)</div>
                  <div>TVA (%)</div>
                  <div>Total (€)</div>
                  <div></div>
                </div>
                {repairs.map((repair) => (
                  <div key={repair.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                    <AutocompleteInput
                      value={repair.description}
                      onChange={(value) => updateRepair(repair.id, 'description', value)}
                      options={REPAIR_DESIGNATIONS}
                      placeholder="Tapez pour rechercher une réparation..."
                      disabled={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
                    <Input
                      type="number"
                      value={repair.quantity}
                      onChange={(e) => updateRepair(repair.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
                    <AmountInput
                      value={repair.unitCost}
                      onChange={(value) => updateRepair(repair.id, 'unitCost', value)}
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
                    <AmountInput
                      value={repair.discount}
                      onChange={(value) => updateRepair(repair.id, 'discount', value)}
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
                    <Input
                      type="number"
                      value={repair.vat}
                      onChange={(e) => updateRepair(repair.id, 'vat', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
                    <AmountInput
                      value={isNaN(Number(repair.total)) ? 0 : Number(repair.total)}
                      onChange={(value) => updateRepair(repair.id, 'total', value)}
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
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
                  {isMobile ? 'Ajouter' : 'Ajouter une réparation'}
                </Button>
              </div>
            )}

            {repairs.length > 0 && <TotalsSection sectionTotals={totals.repairs} />}
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="space-y-4">
            {isMobile ? (
              // Mobile: Card layout
              <div className="space-y-4">
                {parts.map((part) => (
                  <PartMobileCard key={part.id} part={part} />
                ))}
              </div>
            ) : (
              // Desktop: Grid layout
              <div className="space-y-2">
                <div className="grid gap-2 text-sm font-medium text-muted-foreground pb-2 border-b" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                  <div>Désignation</div>
                  <div>Qté</div>
                  <div>Coût Unitaire (€)</div>
                  <div>Remise (%)</div>
                  <div>TVA (%)</div>
                  <div>Total (€)</div>
                  <div></div>
                </div>
                {parts.map((part) => (
                  <div key={part.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                    <AutocompleteInput
                      value={part.description}
                      onChange={(value) => updatePart(part.id, 'description', value)}
                      options={partDesignations}
                      placeholder="Tapez pour rechercher une pièce..."
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
                    <AmountInput
                      value={part.unitCost}
                      onChange={(value) => updatePart(part.id, 'unitCost', value)}
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
                    <AmountInput
                      value={part.discount}
                      onChange={(value) => updatePart(part.id, 'discount', value)}
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
                    <AmountInput
                      value={isNaN(Number(part.total)) ? 0 : Number(part.total)}
                      onChange={(value) => updatePart(part.id, 'total', value)}
                      readOnly={isReadOnly}
                      className={isReadOnly ? 'bg-muted' : ''}
                    />
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

            {parts.length > 0 && <TotalsSection sectionTotals={totals.parts} />}
          </div>
        )}

        {/* Combined totals */}
        {hasItems && (
          <div className="border-t pt-4 mt-6 space-y-2 bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span>Total Sous-total :</span>
              <span className="font-medium">{totals.combined.subTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total TVA :</span>
              <span className="font-medium">{totals.combined.totalVat.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Remises :</span>
              <span className="font-medium">{totals.combined.totalDiscount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Général :</span>
              <span>{totals.combined.total.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
