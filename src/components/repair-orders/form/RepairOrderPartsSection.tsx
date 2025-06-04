
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { RepairOrderPartItem } from './types';

interface RepairOrderPartsSectionProps {
  parts: RepairOrderPartItem[];
  onPartsChange: (parts: RepairOrderPartItem[]) => void;
  isReadOnly?: boolean;
}

export const RepairOrderPartsSection = ({ parts, onPartsChange, isReadOnly }: RepairOrderPartsSectionProps) => {
  const addPart = () => {
    const newPart: RepairOrderPartItem = {
      id: crypto.randomUUID(),
      reference: '',
      description: '',
      quantity: 1,
      unitCost: 0,
      discount: 0,
      vat: 20,
      total: 0
    };
    onPartsChange([...parts, newPart]);
  };

  const updatePart = (id: string, field: keyof RepairOrderPartItem, value: any) => {
    const updatedParts = parts.map(part => {
      if (part.id === id) {
        const updatedPart = { ...part, [field]: value };
        
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

  const removePart = (id: string) => {
    onPartsChange(parts.filter(part => part.id !== id));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Settings className="h-5 w-5 mr-2" />
          Pièces détachées
        </CardTitle>
        <CardDescription>
          Liste des pièces nécessaires à la réparation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {parts.map((part) => (
          <div key={part.id} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor={`part-reference-${part.id}`}>Référence</Label>
              <Input
                id={`part-reference-${part.id}`}
                value={part.reference}
                onChange={(e) => updatePart(part.id, 'reference', e.target.value)}
                placeholder="Référence"
                readOnly={isReadOnly}
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor={`part-description-${part.id}`}>Description</Label>
              <Input
                id={`part-description-${part.id}`}
                value={part.description}
                onChange={(e) => updatePart(part.id, 'description', e.target.value)}
                placeholder="Description de la pièce"
                readOnly={isReadOnly}
              />
            </div>
            
            <div>
              <Label htmlFor={`part-quantity-${part.id}`}>Quantité</Label>
              <Input
                id={`part-quantity-${part.id}`}
                type="number"
                min="1"
                value={part.quantity}
                onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 0)}
                readOnly={isReadOnly}
              />
            </div>
            
            <div>
              <Label htmlFor={`part-cost-${part.id}`}>Prix unitaire (€)</Label>
              <Input
                id={`part-cost-${part.id}`}
                type="number"
                min="0"
                step="0.01"
                value={part.unitCost}
                onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value) || 0)}
                readOnly={isReadOnly}
              />
            </div>
            
            <div>
              <Label htmlFor={`part-vat-${part.id}`}>TVA (%)</Label>
              <Input
                id={`part-vat-${part.id}`}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={part.vat}
                onChange={(e) => updatePart(part.id, 'vat', parseFloat(e.target.value) || 0)}
                readOnly={isReadOnly}
              />
            </div>
            
            <div className="flex items-end">
              <div className="flex-1">
                <Label>Total: {part.total.toFixed(2)} €</Label>
              </div>
              {!isReadOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removePart(part.id)}
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
            onClick={addPart}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une pièce
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
