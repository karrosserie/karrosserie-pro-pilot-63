
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Package } from 'lucide-react';
import { CreditItem } from './types';

interface CreditItemsSectionProps {
  items: CreditItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof CreditItem, value: any) => void;
  onRemoveItem: (id: string) => void;
  calculateTotal: () => number;
}

export const CreditItemsSection = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  calculateTotal
}: CreditItemsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Package className="h-5 w-5 mr-2" />
          Articles de l'avoir
        </CardTitle>
        <CardDescription>
          Ajoutez les articles à créditer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {items.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead className="w-[15%]">Quantité</TableHead>
                    <TableHead className="w-[20%]">Prix unitaire</TableHead>
                    <TableHead className="w-[20%]">Total</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Description de l'article"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => onUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => onUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.total.toFixed(2)} €
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun article ajouté
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button type="button" variant="outline" onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un article
          </Button>
          
          <div className="text-right">
            <Label className="text-lg font-semibold">
              Total: {calculateTotal().toFixed(2)} €
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
