import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { Invoice } from '@/services/supabase/invoices';
import { cn } from '@/lib/utils';

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
    { value: 'En attente de paiement', label: 'En attente de paiement' },
    { value: 'Paiement partiel', label: 'Paiement partiel' },
    { value: 'Payée', label: 'Payée' }
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="reference" required>Numéro</Label>
            <Input
              id="reference"
              value={formData.reference || ''}
              readOnly
              className={cn(
                "bg-gray-50 cursor-not-allowed",
                errors.reference && "border-red-500 focus-visible:ring-red-500"
              )}
              placeholder={!formData.reference ? "Généré automatiquement" : undefined}
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
              className={cn(
                errors.due_date && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.due_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.due_date}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="payment_due_date">Date d'échéance</Label>
            <Input
              id="payment_due_date"
              type="date"
              value={formData.payment_due_date || ''}
              onChange={(e) => onFieldChange('payment_due_date', e.target.value)}
              className={cn(
                errors.payment_due_date && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.payment_due_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.payment_due_date}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || 'En attente de paiement'}
              onValueChange={(value) => onFieldChange('status', value)}
            >
              <SelectTrigger 
                id="status"
                className={cn(
                  errors.status && "border-red-500 focus-visible:ring-red-500"
                )}
              >
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
            {errors.status && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.status}
              </p>
            )}
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
              className={cn(
                errors.claim_number && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.claim_number && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.claim_number}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="current_mileage">Kilométrage actuel</Label>
            <Input
              id="current_mileage"
              type="number"
              value={currentMileage}
              onChange={(e) => onCurrentMileageChange?.(e.target.value)}
              placeholder="Kilométrage en km"
              className={cn(
                errors.current_mileage && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.current_mileage && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.current_mileage}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
