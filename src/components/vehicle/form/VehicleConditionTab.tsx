
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface VehicleConditionTabProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onConditionChange: (section: string, item: string, field: string, value: any) => void;
}

const VehicleConditionTab: React.FC<VehicleConditionTabProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onConditionChange
}) => {
  const conditionSections = {
    'Partie Avant': [
      'Capot', 'Calandre', 'Phare', 'Clignotants', 'Pare Chocs', 'Passages De Roues', 'Pare Brise', 'Pavillon'
    ],
    'Partie Arrière': [
      'Hayon', 'Feux arrière', 'Clignotants', 'Pare Chocs', 'Passages De Roues', 'Lunette Arrière', 'Pavillon'
    ],
    'Partie Laterale Gauche': [
      'Aile Av', 'Porte Av', 'Porte Ar', 'Panneau Caisse', 'Aile Ar', 'Bas De Caise', 'Retroviseur'
    ],
    'Partie Laterale Droite': [
      'Aile Av', 'Porte Av', 'Porte Ar', 'Panneau Caisse', 'Aile Ar', 'Bas De Caise', 'Retroviseur'
    ]
  };

  const renderConditionSection = (sectionTitle: string, items: string[]) => (
    <div key={sectionTitle} className="border rounded-lg p-4">
      <h4 className="font-semibold mb-4 text-blue-600">{sectionTitle}</h4>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="grid grid-cols-5 gap-2 items-center">
            <div className="text-sm text-gray-600">{item}</div>
            <div className="space-y-1">
              <Label className="text-xs">Rayure</Label>
              <Checkbox
                checked={formData.condition?.[sectionTitle]?.[item]?.rayure || false}
                onCheckedChange={(checked) => onConditionChange(sectionTitle, item, 'rayure', checked)}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Choc</Label>
              <Checkbox
                checked={formData.condition?.[sectionTitle]?.[item]?.choc || false}
                onCheckedChange={(checked) => onConditionChange(sectionTitle, item, 'choc', checked)}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">HS</Label>
              <Checkbox
                checked={formData.condition?.[sectionTitle]?.[item]?.hs || false}
                onCheckedChange={(checked) => onConditionChange(sectionTitle, item, 'hs', checked)}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Observations</Label>
              <Input
                className="text-xs"
                value={formData.condition?.[sectionTitle]?.[item]?.observations || ''}
                onChange={(e) => onConditionChange(sectionTitle, item, 'observations', e.target.value)}
                disabled={isViewMode}
                placeholder="Notes..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(conditionSections).map(([sectionTitle, items]) =>
          renderConditionSection(sectionTitle, items)
        )}
      </div>
    </div>
  );
};

export default VehicleConditionTab;
