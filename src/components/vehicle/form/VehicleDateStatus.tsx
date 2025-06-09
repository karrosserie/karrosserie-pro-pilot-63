
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleDateStatusProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleDateStatus: React.FC<VehicleDateStatusProps> = ({
  formData,
  isViewMode,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="arrivalDate">Date d'arrivée</Label>
          <Input
            id="arrivalDate"
            name="arrivalDate"
            type="date"
            value={formData.arrivalDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDateStatus;
