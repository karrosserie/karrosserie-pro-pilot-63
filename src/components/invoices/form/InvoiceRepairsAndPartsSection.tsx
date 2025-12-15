import React, { useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { AmountInput } from '@/components/ui/amount-input';
import { Label } from '@/components/ui/label';
import { Wrench, Settings, Plus, Trash } from 'lucide-react';
import { InvoiceRepairItem, InvoicePartItem } from './types';
import { REPAIR_DESIGNATIONS } from '@/constants/predefined-values';
import { useAutomotivePartNames } from '@/hooks/use-automotive-parts';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvoiceRepairsAndPartsSectionProps {
  repairs: InvoiceRepairItem[];
  parts: InvoicePartItem[];
  onRepairsChange: (repairs: InvoiceRepairItem[]) => void;
  onPartsChange: (parts: InvoicePartItem[]) => void;
  isReadOnly?: boolean;
}

export const InvoiceRepairsAndPartsSection = ({ 
  repairs, 
  parts, 
  onRepairsChange, 
  onPartsChange, 
  isReadOnly = false 
}: InvoiceRepairsAndPartsSectionProps) => {
  const { data: partDesignations = [] } = useAutomotivePartNames();
  const isMobile = useIsMobile();

  // Repair functions - memoized
  const addRepair = useCallback(() => {
    if (isReadOnly) return;
    const newRepair: InvoiceRepairItem = {
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

  const updateRepair = useCallback((id: string, field: keyof InvoiceRepairItem, value: string | number) => {
    if (isReadOnly) return;
    
    // Si c'est un item temporaire, le convertir en item réel d'abord
    if (id.startsWith('temp_')) {
      const newRepair: InvoiceRepairItem = {
        id: `repair_${Date.now()}`,
        description: '',
        quantity: 1,
        unitCost: 0,
        discount: 0,
        vat: 20,
        total: 0,
        [field]: value
      };
      // Recalculer le total
      const subtotal = newRepair.quantity * newRepair.unitCost;
      const discountAmount = subtotal * (newRepair.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const vatAmount = afterDiscount * (newRepair.vat / 100);
      newRepair.total = afterDiscount + vatAmount;
      onRepairsChange([newRepair]);
      return;
    }
    
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
  }, [isReadOnly, repairs, onRepairsChange]);

  // Part functions - memoized
  const addPart = useCallback(() => {
    if (isReadOnly) return;
    const newPart: InvoicePartItem = {
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

  const updatePart = useCallback((id: string, field: keyof InvoicePartItem, value: string | number) => {
    if (isReadOnly) return;
    
    // Si c'est un item temporaire, le convertir en item réel d'abord
    if (id.startsWith('temp_')) {
      const newPart: InvoicePartItem = {
        id: `part_${Date.now()}`,
        description: '',
        quantity: 1,
        unitCost: 0,
        discount: 0,
        vat: 20,
        total: 0,
        [field]: value
      };
      // Recalculer le total
      const subtotal = newPart.quantity * newPart.unitCost;
      const discountAmount = subtotal * (newPart.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const vatAmount = afterDiscount * (newPart.vat / 100);
      newPart.total = afterDiscount + vatAmount;
      onPartsChange([newPart]);
      return;
    }
    
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
  }, [isReadOnly, parts, onPartsChange]);

  // Calculate totals - memoized
  const repairTotals = useMemo(() => {
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
  }, [repairs]);

  const partTotals = useMemo(() => {
    const subTotal = parts.reduce((sum, part) => sum + (part.quantity * part.unitCost), 0);
    const totalVat = parts.reduce((sum, part) => {
      const subtotal = part.quantity * part.unitCost;
      return sum + (subtotal * (part.vat / 100));
    }, 0);
    const totalDiscount = parts.reduce((sum, part) => {
      const subtotal = part.quantity * part.unitCost;
      return sum + (subtotal * (part.discount / 100));
    }, 0);
    const total = parts.reduce((sum, part) => sum + part.total, 0);
    return { subTotal, totalVat, totalDiscount, total };
  }, [parts]);

  // Always show at least one empty item for each tab
  const repairsToShow = useMemo(() => 
    repairs.length > 0 ? repairs : [{ id: 'temp_repair', description: '', quantity: 1, unitCost: 0, discount: 0, vat: 20, total: 0 }],
    [repairs]
  );
  const partsToShow = useMemo(() => 
    parts.length > 0 ? parts : [{ id: 'temp_part', description: '', quantity: 1, unitCost: 0, discount: 0, vat: 20, total: 0 }],
    [parts]
  );

  const combinedTotals = useMemo(() => ({
    subTotal: repairTotals.subTotal + partTotals.subTotal,
    totalVat: repairTotals.totalVat + partTotals.totalVat,
    totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount,
    total: repairTotals.total + partTotals.total
  }), [repairTotals, partTotals]);

  // Mobile card component for repairs
  const RepairMobileCard = ({ repair }: { repair: InvoiceRepairItem }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div>
        <Label className="text-xs text-muted-foreground">Désignation</Label>
        <Combobox
          value={repair.description}
          onChange={(value) => updateRepair(repair.id, 'description', value)}
          options={REPAIR_DESIGNATIONS}
          placeholder="Désignation de la réparation"
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
          Total : {repair.total.toFixed(2)} €
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
  const PartMobileCard = ({ part }: { part: InvoicePartItem }) => (
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

  // Totals component (responsive)
  const TotalsSection = ({ totals, label }: { totals: typeof repairTotals; label?: string }) => (
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
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Wrench className="h-5 w-5 mr-2" />
          Réparations et Pièces
        </CardTitle>
        <CardDescription>
          Détail des réparations effectuées et pièces utilisées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="repairs" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted p-1 rounded-lg">
              <TabsTrigger 
                value="repairs" 
                className="px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
              >
                <Wrench className="h-4 w-4 mr-1" />
                {!isMobile && 'Réparations'}
              </TabsTrigger>
              <TabsTrigger 
                value="parts" 
                className="px-4 py-2 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
              >
                <Settings className="h-4 w-4 mr-1" />
                {!isMobile && 'Pièces'}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="repairs" className="space-y-4">
            {isMobile ? (
              // Mobile: Card layout
              <div className="space-y-4">
                {repairsToShow.map((repair) => (
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
                {repairsToShow.map((repair) => (
                  <div key={repair.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                    <Combobox
                      value={repair.description}
                      onChange={(value) => updateRepair(repair.id, 'description', value)}
                      options={REPAIR_DESIGNATIONS}
                      placeholder="Désignation de la réparation"
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
                  {isMobile ? 'Ajouter' : 'Ajouter une réparation'}
                </Button>
              </div>
            )}

            {repairs.length > 0 && <TotalsSection totals={repairTotals} />}
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
            {isMobile ? (
              // Mobile: Card layout
              <div className="space-y-4">
                {partsToShow.map((part) => (
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
                {partsToShow.map((part) => (
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

            {parts.length > 0 && <TotalsSection totals={partTotals} />}
          </TabsContent>
        </Tabs>

        {/* Combined totals */}
        {(repairs.length > 0 || parts.length > 0) && (
          <div className="border-t pt-4 mt-6 space-y-2 bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span>Total Sous-total :</span>
              <span className="font-medium">{combinedTotals.subTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total TVA :</span>
              <span className="font-medium">{combinedTotals.totalVat.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Remises :</span>
              <span className="font-medium">{combinedTotals.totalDiscount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Général :</span>
              <span>{combinedTotals.total.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
