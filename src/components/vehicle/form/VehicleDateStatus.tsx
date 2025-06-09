
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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        <div className="col-span-2 space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status || ''} 
            onValueChange={(value) => onSelectChange('status', value)}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Réservé">Réservé</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default VehicleDateStatus;
