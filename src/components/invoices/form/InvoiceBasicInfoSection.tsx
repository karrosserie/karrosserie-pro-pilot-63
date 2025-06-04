
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { Invoice } from '@/services/supabase/invoices';

interface InvoiceBasicInfoSectionProps {
  formData: Partial<Invoice>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  claimNumber?: string;
  currentMileage?: string;
  onClaimNumberChange?: (value: string) => void;
  onCurrentMileageChange?: (value: string) => void;
}

export const InvoiceBasicInfoSection = ({ 
  formData, 
  errors, 
  onFieldChange,
  claimNumber = '',
  currentMileage = '',
  onClaimNumberChange,
  onCurrentMileageChange
}: InvoiceBasicInfoSectionProps) => {
  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Payée', label: 'Payée' },
    { value: 'Annulée', label: 'Annulée' },
    { value: 'En retard', label: 'En retard' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Numéro, date, statut et informations du sinistre
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
            <Label htmlFor="due_date">Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date || ''}
              onChange={(e) => onFieldChange('due_date', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || 'En attente'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="claim_number">N° de sinistre</Label>
            <Input
              id="claim_number"
              value={claimNumber}
              onChange={(e) => onClaimNumberChange?.(e.target.value)}
              placeholder="Numéro de sinistre"
            />
          </div>

          <div>
            <Label htmlFor="current_mileage">Kilométrage actuel</Label>
            <Input
              id="current_mileage"
              type="number"
              value={currentMileage}
              onChange={(e) => onCurrentMileageChange?.(e.target.value)}
              placeholder="Kilométrage en km"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
