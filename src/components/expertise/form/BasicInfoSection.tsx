
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
      
      <div className="text-sm text-gray-500">
        Les détails du rapport sont maintenant dans la section "Détails de l'expertise".
      </div>
    </div>
  );
};
