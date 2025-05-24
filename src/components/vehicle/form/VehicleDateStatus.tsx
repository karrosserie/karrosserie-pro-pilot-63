
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleDateStatusProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleDateStatus: React.FC<VehicleDateStatusProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Diagnostic', label: 'Diagnostic' },
    { value: 'En réparation', label: 'En réparation' },
    { value: 'Terminé', label: 'Terminé' }
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6 md:col-span-3 space-y-2">
        <Label htmlFor="arrivalDate">Date d'arrivée</Label>
        <Input
          id="arrivalDate"
          name="arrivalDate"
          type="date"
          value={formData.arrivalDate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="col-span-6 md:col-span-3 space-y-2">
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="col-span-6 md:col-span-3 space-y-2">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="col-span-12 md:col-span-3 space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          disabled={isViewMode} 
          value={formData.status || 'En attente'} 
          onValueChange={(value) => onSelectChange('status', value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleDateStatus;
