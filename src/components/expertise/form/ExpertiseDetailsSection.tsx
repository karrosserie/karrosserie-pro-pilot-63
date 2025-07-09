
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, AlertCircle, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { GlobalTotals } from './types';

interface ExpertiseDetailsSectionProps {
  formData: Partial<ExpertiseReport>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
}

export const ExpertiseDetailsSection = ({ formData, errors, onFieldChange, globalTotals }: ExpertiseDetailsSectionProps) => {
  const isReadOnly = formData.status !== 'Importé';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Détails de l'expertise
        </CardTitle>
        <CardDescription>
          Expert, sinistre et totaux de l'expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="report_number">Numéro de rapport</Label>
            <Input
              id="report_number"
              value={formData.report_number || ''}
              onChange={(e) => onFieldChange('report_number', e.target.value)}
              placeholder="Ex: RAP-2024-1234"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="policy_number">Numéro de police</Label>
            <Input
              id="policy_number"
              value={formData.policy_number || ''}
              onChange={(e) => onFieldChange('policy_number', e.target.value)}
              placeholder="Ex: POL-2024-1234"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="report_date">Date du rapport</Label>
            <Input
              id="report_date"
              type="date"
              value={formData.report_date || ''}
              onChange={(e) => onFieldChange('report_date', e.target.value)}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expert_name">Nom de l'expert</Label>
            <Input
              id="expert_name"
              value={formData.expert_name || ''}
              onChange={(e) => onFieldChange('expert_name', e.target.value)}
              className={errors.expert_name ? 'border-yellow-500' : ''}
              placeholder="Ex: Jean Dupont"
              readOnly={isReadOnly}
            />
            {errors.expert_name && (
              <p className="text-sm text-yellow-600 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.expert_name}
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
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="incident_date">Date du sinistre</Label>
            <Input
              id="incident_date"
              type="date"
              value={formData.incident_date || ''}
              onChange={(e) => onFieldChange('incident_date', e.target.value)}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        {/* Totaux globaux */}
        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Totaux de l'expertise</h4>
          <div className="flex justify-end space-x-8 text-sm">
            <div>Sous-total : <span className="font-medium">{globalTotals.subTotal.toFixed(2)} €</span></div>
            <div>TVA : <span className="font-medium">{globalTotals.totalVat.toFixed(2)} €</span></div>
            <div>Remise TTC : <span className="font-medium">{globalTotals.totalDiscount.toFixed(2)} €</span></div>
          </div>
          <div className="flex justify-end text-lg font-bold">
            Total : <span className="ml-2">{globalTotals.total.toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
