
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CessionFormData, CessionFormErrors } from './types';

interface CessionBasicInfoSectionProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
}

export const CessionBasicInfoSection = ({
  formData,
  errors,
  onFieldChange
}: CessionBasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de base</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Référence de la cession *</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => onFieldChange('reference', e.target.value)}
            placeholder="CC-2024-001"
            className={errors.reference ? 'border-red-500' : ''}
          />
          {errors.reference && (
            <p className="text-sm text-red-500">{errors.reference}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => onFieldChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_attente">En attente d'envoi</SelectItem>
              <SelectItem value="envoyee">Envoyée à l'assurance</SelectItem>
              <SelectItem value="signee">Signée</SelectItem>
              <SelectItem value="payee">Payée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sale_amount">Montant de la vente (€) *</Label>
          <Input
            id="sale_amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.sale_amount}
            onChange={(e) => onFieldChange('sale_amount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.sale_amount ? 'border-red-500' : ''}
          />
          {errors.sale_amount && (
            <p className="text-sm text-red-500">{errors.sale_amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale_date">Date de vente *</Label>
          <Input
            id="sale_date"
            type="date"
            value={formData.sale_date}
            onChange={(e) => onFieldChange('sale_date', e.target.value)}
            className={errors.sale_date ? 'border-red-500' : ''}
          />
          {errors.sale_date && (
            <p className="text-sm text-red-500">{errors.sale_date}</p>
          )}
        </div>
      </div>
    </div>
  );
};
