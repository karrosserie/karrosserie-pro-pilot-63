
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface BasicInfoSectionProps {
  formData: Partial<ExpertiseReport>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

export const BasicInfoSection = ({ formData, errors, onFieldChange }: BasicInfoSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2" />
          Informations de base
        </CardTitle>
        <CardDescription>
          Numéro de rapport, date et statut
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="reference">Numéro de rapport *</Label>
          <Input
            id="reference"
            value={formData.reference || ''}
            onChange={(e) => onFieldChange('reference', e.target.value)}
            className={errors.reference ? 'border-red-500' : ''}
            placeholder="Ex: RE-2024-1234"
          />
          {errors.reference && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.reference}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="report_date">Date du rapport</Label>
          <Input
            id="report_date"
            type="date"
            value={formData.report_date || ''}
            onChange={(e) => onFieldChange('report_date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status || 'Importé'}
            onValueChange={(value) => onFieldChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Importé">Importé</SelectItem>
              <SelectItem value="En cours d'analyse">En cours d'analyse</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Validé">Validé</SelectItem>
              <SelectItem value="Rejeté">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
