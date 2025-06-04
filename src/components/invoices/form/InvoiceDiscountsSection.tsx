
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent } from 'lucide-react';
import { InvoiceRepairItem, InvoicePartItem } from './types';

interface InvoiceDiscountsSectionProps {
  repairs: InvoiceRepairItem[];
  parts: InvoicePartItem[];
  onRepairsChange: (repairs: InvoiceRepairItem[]) => void;
  onPartsChange: (parts: InvoicePartItem[]) => void;
  isReadOnly?: boolean;
}

export const InvoiceDiscountsSection = ({ 
  repairs, 
  parts, 
  onRepairsChange, 
  onPartsChange, 
  isReadOnly = false
}: InvoiceDiscountsSectionProps) => {
  const updateRepairDiscount = (id: string, discount: number) => {
    if (isReadOnly) return;
    
    const updatedRepairs = repairs.map(repair => {
      if (repair.id === id) {
        const updatedRepair = { ...repair, discount };
        
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

  const updatePartDiscount = (id: string, discount: number) => {
    if (isReadOnly) return;
    
    const updatedParts = parts.map(part => {
      if (part.id === id) {
        const updatedPart = { ...part, discount };
        
        // Recalculer le total
        const subtotal = updatedPart.quantity * updatedPart.unitCost;
        const discountAmount = subtotal * (updatedPart.discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const vatAmount = afterDiscount * (updatedPart.vat / 100);
        updatedPart.total = afterDiscount + vatAmount;
        
        return updatedPart;
      }
      return part;
    });
    onPartsChange(updatedParts);
  };

  if (repairs.length === 0 && parts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Percent className="h-5 w-5 mr-2" />
          Remises individuelles
        </CardTitle>
        <CardDescription>
          Appliquez des remises individuelles sur chaque élément
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {repairs.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Réparations</h4>
            <div className="space-y-3">
              {repairs.map((repair) => (
                <div key={repair.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{repair.description || 'Réparation sans description'}</p>
                    <p className="text-sm text-gray-500">
                      {repair.quantity} × {repair.unitCost.toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`repair-discount-${repair.id}`} className="text-sm">
                      Remise:
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id={`repair-discount-${repair.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={repair.discount}
                        onChange={(e) => updateRepairDiscount(repair.id, parseFloat(e.target.value) || 0)}
                        className={`w-20 ${isReadOnly ? 'bg-gray-50' : ''}`}
                        readOnly={isReadOnly}
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parts.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Pièces détachées</h4>
            <div className="space-y-3">
              {parts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{part.description || 'Pièce sans description'}</p>
                    <p className="text-sm text-gray-500">
                      {part.quantity} × {part.unitCost.toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`part-discount-${part.id}`} className="text-sm">
                      Remise:
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id={`part-discount-${part.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={part.discount}
                        onChange={(e) => updatePartDiscount(part.id, parseFloat(e.target.value) || 0)}
                        className={`w-20 ${isReadOnly ? 'bg-gray-50' : ''}`}
                        readOnly={isReadOnly}
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
