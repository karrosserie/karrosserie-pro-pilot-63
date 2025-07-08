
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface BasicInfoSectionProps {
  formData: Partial<ExpertiseReport>;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  onFieldChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations de base</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="report_number">Numéro de rapport</Label>
          <Input
            id="report_number"
            value={formData.report_number || ''}
            onChange={(e) => onFieldChange('report_number', e.target.value)}
            placeholder="Saisir le numéro de rapport"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="report_date">Date du rapport</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.report_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.report_date ? (
                  format(new Date(formData.report_date), "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.report_date ? new Date(formData.report_date) : undefined}
                onSelect={(date) => onFieldChange('report_date', date?.toISOString().split('T')[0])}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="claim_number">Numéro de sinistre</Label>
          <Input
            id="claim_number"
            value={formData.claim_number || ''}
            onChange={(e) => onFieldChange('claim_number', e.target.value)}
            placeholder="Saisir le numéro de sinistre"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="incident_date">Date du sinistre</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.incident_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.incident_date ? (
                  format(new Date(formData.incident_date), "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.incident_date ? new Date(formData.incident_date) : undefined}
                onSelect={(date) => onFieldChange('incident_date', date?.toISOString().split('T')[0])}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="policy_number">Numéro de police</Label>
          <Input
            id="policy_number"
            value={formData.policy_number || ''}
            onChange={(e) => onFieldChange('policy_number', e.target.value)}
            placeholder="Saisir le numéro de police"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expert_name">Nom de l'expert</Label>
          <Input
            id="expert_name"
            value={formData.expert_name || ''}
            onChange={(e) => onFieldChange('expert_name', e.target.value)}
            placeholder="Saisir le nom de l'expert"
          />
          {errors.expert_name && (
            <span className="text-sm text-red-500">{errors.expert_name}</span>
          )}
        </div>
      </div>
    </div>
  );
};
