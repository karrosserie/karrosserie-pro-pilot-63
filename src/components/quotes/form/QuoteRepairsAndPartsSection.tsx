import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Settings, Plus, Trash } from 'lucide-react';
import { QuoteRepairItem, QuotePartItem } from './types';
import { calculateLineTotal } from './utils/calculations';

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
  const [activeTab, setActiveTab] = useState<'repairs' | 'parts'>('repairs');

  // Ensure there's always at least one item on mount
  useEffect(() => {
    if (repairs.length === 0 && !isReadOnly) {
      addRepair();
    }
    if (parts.length === 0 && !isReadOnly) {
      addPart();
    }
  }, []);

  // Repairs functions
  const addRepair = () => {
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
  };

  const removeRepair = (id: string) => {
    if (isReadOnly) return;
    onRepairsChange(repairs.filter(repair => repair.id !== id));
  };

  const updateRepair = (id: string, field: keyof QuoteRepairItem, value: string | number) => {
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
  };

  // Parts functions
  const addPart = () => {
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
  };

  const removePart = (id: string) => {
    if (isReadOnly) return;
    onPartsChange(parts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: keyof QuotePartItem, value: string | number) => {
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
  };

  // Combined calculations
  const calculateTotals = () => {
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
  };

  const totals = calculateTotals();
  const hasItems = repairs.length > 0 || parts.length > 0;

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
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('repairs')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'repairs'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wrench className="h-4 w-4 mr-1 inline" />
            Réparations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'parts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-4 w-4 mr-1 inline" />
            Pièces
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'repairs' && (
          <div className="space-y-4">
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
                  <Input
                    value={repair.description}
                    onChange={(e) => updateRepair(repair.id, 'description', e.target.value)}
                    placeholder="Désignation de la réparation"
                    readOnly={isReadOnly}
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
                    step="0.01"
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
                  <Input
                    type="number"
                    value={isNaN(Number(repair.total)) ? 0 : Number(repair.total)}
                    onChange={(e) => updateRepair(repair.id, 'total', parseFloat(e.target.value) || 0)}
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
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="space-y-4">
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
              {parts.map((part) => (
                <div key={part.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: '4fr 1fr 1.5fr 1fr 1fr 1.5fr auto' }}>
                  <Input
                    value={part.description}
                    onChange={(e) => updatePart(part.id, 'description', e.target.value)}
                    placeholder="Désignation de la pièce"
                    readOnly={isReadOnly}
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
                  <Input
                    type="number"
                    value={part.unitCost}
                    onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    readOnly={isReadOnly}
                    className={isReadOnly ? 'bg-gray-50' : ''}
                  />
                  <Input
                    type="number"
                    value={part.discount}
                    onChange={(e) => updatePart(part.id, 'discount', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.01"
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
                  <Input
                    type="number"
                    value={isNaN(Number(part.total)) ? 0 : Number(part.total)}
                    onChange={(e) => updatePart(part.id, 'total', parseFloat(e.target.value) || 0)}
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
          </div>
        )}

        {/* Totaux combinés */}
        {hasItems && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-end space-x-8 text-sm">
              <div>Sous-total : <span className="font-medium">{totals.combined.subTotal.toFixed(2)} €</span></div>
              <div>TVA : <span className="font-medium">{totals.combined.totalVat.toFixed(2)} €</span></div>
              <div>Remise TTC : <span className="font-medium">{totals.combined.totalDiscount.toFixed(2)} €</span></div>
            </div>
            <div className="flex justify-end text-lg font-bold">
              Total : <span className="ml-2">{totals.combined.total.toFixed(2)} €</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};