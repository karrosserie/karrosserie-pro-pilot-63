
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { cn } from '@/lib/utils';

// Interface étendue temporaire pour les nouveaux champs
interface ExtendedQuote extends Quote {
  report_number: string;
  policy_number: string;
  report_date: string;
  expert_name: string;
  incident_date: string;
}

interface QuoteBasicInfoSectionProps {
  formData: Partial<ExtendedQuote>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  claimNumber?: string;
  currentMileage?: string;
  onClaimNumberChange?: (value: string) => void;
  onCurrentMileageChange?: (value: string) => void;
}

export const QuoteBasicInfoSection = ({ 
  formData, 
  errors, 
  onFieldChange,
  claimNumber = '',
  currentMileage = '',
  onClaimNumberChange,
  onCurrentMileageChange
}: QuoteBasicInfoSectionProps) => {
  console.log('QuoteBasicInfoSection - Errors received:', errors);
  console.log('QuoteBasicInfoSection - client_id error:', errors.client_id);
  console.log('QuoteBasicInfoSection - formData.client_id:', formData.client_id);

  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Facturé', label: 'Facturé' },
    { value: 'Refusé', label: 'Refusé' },
    { value: 'Annulé', label: 'Annulé' },
    { value: 'Converti', label: 'Converti' }
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
            <Label htmlFor="reference" required className={cn(errors.reference && "text-red-500")}>
              Numéro
            </Label>
            <Input
              id="reference"
              value={formData.reference || ''}
              readOnly
              className={cn(
                "bg-gray-50 cursor-not-allowed",
                errors.reference && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
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
            <Label htmlFor="valid_until" required className={cn(errors.valid_until && "text-red-500")}>
              Date
            </Label>
            <Input
              id="valid_until"
              type="date"
              value={formData.valid_until || ''}
              onChange={(e) => onFieldChange('valid_until', e.target.value)}
              className={cn(
                errors.valid_until && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.valid_until && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.valid_until}
              </p>
            )}
          </div>
          
          <div className="md:col-span-3">
            <Label htmlFor="status" className={cn(errors.status && "text-red-500")}>
              Statut
            </Label>
            <Select
              value={formData.status || 'En attente'}
              onValueChange={(value) => onFieldChange('status', value)}
            >
              <SelectTrigger 
                id="status"
                className={cn(
                  errors.status && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="report_number" className={cn(errors.report_number && "text-red-500")}>
              Numéro de rapport
            </Label>
            <Input
              id="report_number"
              value={formData.report_number || ''}
              onChange={(e) => onFieldChange('report_number', e.target.value)}
              placeholder="Numéro de rapport"
              className={cn(
                errors.report_number && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.report_number && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.report_number}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="policy_number" className={cn(errors.policy_number && "text-red-500")}>
              Numéro de police
            </Label>
            <Input
              id="policy_number"
              value={formData.policy_number || ''}
              onChange={(e) => onFieldChange('policy_number', e.target.value)}
              placeholder="Numéro de police"
              className={cn(
                errors.policy_number && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.policy_number && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.policy_number}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="report_date" className={cn(errors.report_date && "text-red-500")}>
              Date du rapport
            </Label>
            <Input
              id="report_date"
              type="date"
              value={formData.report_date || ''}
              onChange={(e) => onFieldChange('report_date', e.target.value)}
              className={cn(
                errors.report_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.report_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.report_date}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="expert_name" className={cn(errors.expert_name && "text-red-500")}>
              Nom de l'expert
            </Label>
            <Input
              id="expert_name"
              value={formData.expert_name || ''}
              onChange={(e) => onFieldChange('expert_name', e.target.value)}
              placeholder="Nom de l'expert"
              className={cn(
                errors.expert_name && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.expert_name && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.expert_name}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="claim_number" className={cn(errors.claim_number && "text-red-500")}>
              Numéro de sinistre
            </Label>
            <Input
              id="claim_number"
              value={claimNumber}
              onChange={(e) => onClaimNumberChange?.(e.target.value)}
              placeholder="Numéro de sinistre"
              className={cn(
                errors.claim_number && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
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
            <Label htmlFor="incident_date" className={cn(errors.incident_date && "text-red-500")}>
              Date du sinistre
            </Label>
            <Input
              id="incident_date"
              type="date"
              value={formData.incident_date || ''}
              onChange={(e) => onFieldChange('incident_date', e.target.value)}
              className={cn(
                errors.incident_date && "border-red-500 focus-visible:ring-red-500 ring-red-500/20"
              )}
            />
            {errors.incident_date && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.incident_date}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
