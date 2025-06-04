import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { cn } from '@/lib/utils';

interface RepairOrderBasicInfoSectionProps {
  formData: Partial<RepairOrder>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  claimNumber?: string;
  currentMileage?: string;
  onClaimNumberChange?: (value: string) => void;
  onCurrentMileageChange?: (value: string) => void;
}

export const RepairOrderBasicInfoSection = ({ 
  formData, 
  errors, 
  onFieldChange,
  claimNumber = '',
  currentMileage = '',
  onClaimNumberChange,
  onCurrentMileageChange
}: RepairOrderBasicInfoSectionProps) => {
  const statusOptions = [
    { value: 'En cours', label: 'En cours' },
    { value: 'En attente de pièces', label: 'En attente de pièces' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'En attente', label: 'En attente' },
    { value: 'En attente de signature', label: 'En attente de signature' },
    { value: 'Signature annulée', label: 'Signature annulée' },
    { value: 'Signé', label: 'Signé' },
    { value: 'Facturé', label: 'Facturé' },
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
          Numéro, date, statut et informations du sinistre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className={cn(
                errors.start_date && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.start_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.start_date}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || 'En cours'}
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
