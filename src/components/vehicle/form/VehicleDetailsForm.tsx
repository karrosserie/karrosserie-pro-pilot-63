
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import FuelGauge from './FuelGauge';

interface VehicleDetailsFormProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFuelLevelChange: (value: number) => void;
  onAddWorkItem: () => void;
  onRemoveWorkItem: (index: number) => void;
  onWorkItemChange: (index: number, value: string) => void;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onFuelLevelChange,
  onAddWorkItem,
  onRemoveWorkItem,
  onWorkItemChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vin">Numéro de série (VIN)</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineNumber">Numéro de moteur</Label>
          <Input
            id="engineNumber"
            name="engineNumber"
            value={formData.engineNumber}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Niveau de carburant</Label>
        <div className="flex justify-center">
          <FuelGauge
            value={formData.fuelLevel || 50}
            onChange={onFuelLevelChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="preAccidentDefects">Pré-accident / Autres défauts</Label>
        <Textarea
          id="preAccidentDefects"
          name="preAccidentDefects"
          value={formData.preAccidentDefects || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          placeholder="Pré-accident / Autres défauts"
          className="min-h-[120px]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Travaux demandés / Instructions du propriétaire</Label>
          {!isViewMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddWorkItem}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un article
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {(formData.workItems || []).map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => onWorkItemChange(index, e.target.value)}
                disabled={isViewMode}
                placeholder="Travaux demandés / Instructions du propriétaire"
                className="flex-1"
              />
              {!isViewMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveWorkItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {(!formData.workItems || formData.workItems.length === 0) && (
            <Input
              value=""
              onChange={(e) => onWorkItemChange(0, e.target.value)}
              disabled={isViewMode}
              placeholder="Travaux demandés / Instructions du propriétaire"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
