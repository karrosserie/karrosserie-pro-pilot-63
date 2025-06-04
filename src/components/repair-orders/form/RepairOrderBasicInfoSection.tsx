
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';

interface RepairOrderBasicInfoSectionProps {
  formData: Partial<RepairOrder>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

export const RepairOrderBasicInfoSection = ({ formData, errors, onFieldChange }: RepairOrderBasicInfoSectionProps) => {
  const statusOptions = [
    { value: 'En cours', label: 'En cours' },
    { value: 'En attente de pièces', label: 'En attente de pièces' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'En attente', label: 'En attente' },
    { value: 'En attente de signature', label: 'En attente de signature' },
    { value: 'Signature annulée', label: 'Signature annulée' },
    { value: 'Signé', label: 'Signé' },
    { value: 'Annulé', label: 'Annulé' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Numéro, date et statut de l'ordre de réparation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="reference">Numéro *</Label>
            <Input
              id="reference"
              value={formData.reference || ''}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="Généré automatiquement"
            />
            {errors.reference && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reference}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="start_date">Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => onFieldChange('start_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || 'En cours'}
              onValueChange={(value) => onFieldChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
