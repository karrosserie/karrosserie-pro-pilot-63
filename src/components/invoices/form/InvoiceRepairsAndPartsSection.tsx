import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { AmountInput } from '@/components/ui/amount-input';
import { Wrench, Settings, Plus, Trash } from 'lucide-react';
import { InvoiceRepairItem, InvoicePartItem } from './types';
import { REPAIR_DESIGNATIONS } from '@/constants/predefined-values';
import { useAutomotivePartNames } from '@/hooks/use-automotive-parts';

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

  // Repair functions
  const addRepair = () => {
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
  };

  const removeRepair = (id: string) => {
    if (isReadOnly) return;
    onRepairsChange(repairs.filter(repair => repair.id !== id));
  };

  const updateRepair = (id: string, field: keyof InvoiceRepairItem, value: string | number) => {
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
  };

  // Part functions
  const addPart = () => {
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
  };

  const removePart = (id: string) => {
    if (isReadOnly) return;
    onPartsChange(parts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: keyof InvoicePartItem, value: string | number) => {
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
  };

  // Calculate totals
  const calculateRepairTotals = () => {
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

  const calculatePartTotals = () => {
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
  };

  // Always show at least one empty item for each tab
  const repairsToShow = repairs.length > 0 ? repairs : [{ id: 'temp_repair', description: '', quantity: 1, unitCost: 0, discount: 0, vat: 20, total: 0 }];
  const partsToShow = parts.length > 0 ? parts : [{ id: 'temp_part', description: '', quantity: 1, unitCost: 0, discount: 0, vat: 20, total: 0 }];

  const repairTotals = calculateRepairTotals();
  const partTotals = calculatePartTotals();
  const combinedTotals = {
    subTotal: repairTotals.subTotal + partTotals.subTotal,
    totalVat: repairTotals.totalVat + partTotals.totalVat,
    totalDiscount: repairTotals.totalDiscount + partTotals.totalDiscount,
    total: repairTotals.total + partTotals.total
  };

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
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="repairs" 
                className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
              >
                Réparations
              </TabsTrigger>
              <TabsTrigger 
                value="parts" 
                className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200"
              >
                Pièces
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="repairs" className="space-y-4">
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
              {repairsToShow.map((repair) => (
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
                  <AmountInput
                    value={repair.unitCost}
                    onChange={(value) => updateRepair(repair.id, 'unitCost', value)}
                    readOnly={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
                  />
                  <AmountInput
                    value={repair.discount}
                    onChange={(value) => updateRepair(repair.id, 'discount', value)}
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
                  <div>Sous-total : <span className="font-medium">{repairTotals.subTotal.toFixed(2)} €</span></div>
                  <div>TVA : <span className="font-medium">{repairTotals.totalVat.toFixed(2)} €</span></div>
                  <div>Remise TTC : <span className="font-medium">{repairTotals.totalDiscount.toFixed(2)} €</span></div>
                </div>
                <div className="flex justify-end text-lg font-bold">
                  Total : <span className="ml-2">{repairTotals.total.toFixed(2)} €</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
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

              {/* Part items */}
              {partsToShow.map((part) => (
                <div key={part.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                  <Combobox
                    value={part.description}
                    onChange={(value) => updatePart(part.id, 'description', value)}
                    options={partDesignations}
                    placeholder="Désignation de la pièce"
                    disabled={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
                  />
                  <Input
                    type="number"
                    value={part.quantity}
                    onChange={(e) => updatePart(part.id, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    readOnly={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
                  />
                  <AmountInput
                    value={part.unitCost}
                    onChange={(value) => updatePart(part.id, 'unitCost', value)}
                    readOnly={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
                  />
                  <AmountInput
                    value={part.discount}
                    onChange={(value) => updatePart(part.id, 'discount', value)}
                    readOnly={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
                  />
                  <Input
                    type="number"
                    value={part.vat}
                    onChange={(e) => updatePart(part.id, 'vat', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    readOnly={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
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

            {!isReadOnly && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPart}
                  className="w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une pièce
                </Button>
              </div>
            )}

            {parts.length > 0 && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-end space-x-8 text-sm">
                  <div>Sous-total : <span className="font-medium">{partTotals.subTotal.toFixed(2)} €</span></div>
                  <div>TVA : <span className="font-medium">{partTotals.totalVat.toFixed(2)} €</span></div>
                  <div>Remise TTC : <span className="font-medium">{partTotals.totalDiscount.toFixed(2)} €</span></div>
                </div>
                <div className="flex justify-end text-lg font-bold">
                  Total : <span className="ml-2">{partTotals.total.toFixed(2)} €</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Combined totals */}
        {(repairs.length > 0 || parts.length > 0) && (
          <div className="border-t pt-4 mt-6 space-y-2 bg-gray-50 rounded-lg p-4">
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