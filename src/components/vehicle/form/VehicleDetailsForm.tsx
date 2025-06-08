
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import FuelGauge from './FuelGauge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleDetailsFormProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onFuelLevelChange: (value: number) => void;
  onAddWorkItem: () => void;
  onRemoveWorkItem: (index: number) => void;
  onWorkItemChange: (index: number, value: string) => void;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange,
  onFuelLevelChange,
  onAddWorkItem,
  onRemoveWorkItem,
  onWorkItemChange
}) => {
  const roadTestOptions = [
    { value: 'Aucun', label: 'Aucun' },
    { value: 'Avec le client', label: 'Avec le client' },
    { value: 'Avec le client et le mécanicien', label: 'Avec le client et le mécanicien' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Road test fields - taking 3/5 of the space */}
        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roadTest">Test routier</Label>
            <Select 
              disabled={isViewMode} 
              value={formData.roadTest} 
              onValueChange={(value) => onSelectChange('roadTest', value)}
            >
              <SelectTrigger id="roadTest">
                <SelectValue placeholder="Sélectionner un type de test" />
              </SelectTrigger>
              <SelectContent>
                {roadTestOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roadTestNotes">Notes sur le test routier</Label>
            <Textarea
              id="roadTestNotes"
              name="roadTestNotes"
              value={formData.roadTestNotes}
              onChange={onInputChange}
              disabled={isViewMode}
              rows={3}
            />
          </div>
        </div>

        {/* Right column: Fuel Gauge - taking 2/5 of the space */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-center">
            <Label>Niveau de carburant</Label>
          </div>
          <div className="flex justify-center">
            <FuelGauge
              value={formData.fuelLevel || 50}
              onChange={onFuelLevelChange}
              disabled={isViewMode}
            />
          </div>
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
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {(!formData.workItems || formData.workItems.length === 0) && (
            <Input
              value=""
              onChange={(e) => onWorkItemChange(0, e.target.value)}
              disabled={isViewMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
