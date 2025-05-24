
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, AlertCircle } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface ExpertiseDetailsSectionProps {
  formData: Partial<ExpertiseReport>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

export const ExpertiseDetailsSection = ({ formData, errors, onFieldChange }: ExpertiseDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Détails de l'expertise
        </CardTitle>
        <CardDescription>
          Expert, montant et informations sur le sinistre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="expert_name">Nom de l'expert</Label>
          <Input
            id="expert_name"
            value={formData.expert_name || ''}
            onChange={(e) => onFieldChange('expert_name', e.target.value)}
            className={errors.expert_name ? 'border-yellow-500' : ''}
            placeholder="Ex: Jean Dupont"
          />
          {errors.expert_name && (
            <p className="text-sm text-yellow-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.expert_name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Montant de l'expertise (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount || ''}
            onChange={(e) => onFieldChange('amount', parseFloat(e.target.value) || null)}
            className={errors.amount ? 'border-red-500' : ''}
            placeholder="Ex: 1500.00"
          />
          {errors.amount && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="claim_number">Numéro de sinistre</Label>
          <Input
            id="claim_number"
            value={formData.claim_number || ''}
            onChange={(e) => onFieldChange('claim_number', e.target.value)}
            placeholder="Ex: SIN-2024-5678"
          />
        </div>

        <div>
          <Label htmlFor="incident_date">Date du sinistre</Label>
          <Input
            id="incident_date"
            type="date"
            value={formData.incident_date || ''}
            onChange={(e) => onFieldChange('incident_date', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
