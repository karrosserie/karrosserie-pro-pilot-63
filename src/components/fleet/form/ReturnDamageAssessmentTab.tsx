
import React from 'react';
import { Card } from '@/components/ui/card';
import { ReturnDamageItem } from '@/components/fleet/FleetReturnForm.types';

interface ReturnDamageAssessmentTabProps {
  damages: ReturnDamageItem[];
  onDamageUpdate: (damages: ReturnDamageItem[]) => void;
  isViewMode?: boolean;
}

const ReturnDamageAssessmentTab: React.FC<ReturnDamageAssessmentTabProps> = ({
  damages,
  onDamageUpdate,
  isViewMode = false
}) => {
  const defaultDamages: ReturnDamageItem[] = [
    // Partie Avant
    { id: 'capot', name: 'Capot', type: 'none' as const },
    { id: 'calandre', name: 'Calandre', type: 'none' as const },
    { id: 'phare', name: 'Phare', type: 'none' as const },
    { id: 'clignotants-av', name: 'Clignotants', type: 'none' as const },
    { id: 'pare-chocs-av', name: 'Pare Chocs', type: 'none' as const },
    { id: 'passages-roues-av', name: 'Passages De Roues', type: 'none' as const },
    { id: 'pare-brise', name: 'Pare Brise', type: 'none' as const },
    { id: 'pavillon', name: 'Pavillon', type: 'none' as const },
    
    // Partie Latérale Gauche
    { id: 'aile-av-g', name: 'Aile Av', type: 'none' as const },
    { id: 'porte-av-g', name: 'Porte Av', type: 'none' as const },
    { id: 'porte-ar-g', name: 'Porte Ar', type: 'none' as const },
    { id: 'panneau-caisse-g', name: 'Panneau Caisse', type: 'none' as const },
    { id: 'aile-ar-g', name: 'Aile Ar', type: 'none' as const },
    { id: 'bas-caisse-g', name: 'Bas De Caisse', type: 'none' as const },
    { id: 'retroviseur-g', name: 'Retroviseur', type: 'none' as const },
    
    // Partie Arrière
    { id: 'hayon', name: 'Hayon', type: 'none' as const },
    { id: 'feux-arriere', name: 'Feux arrière', type: 'none' as const },
    { id: 'clignotants-ar', name: 'Clignotants', type: 'none' as const },
    { id: 'pare-chocs-ar', name: 'Pare Chocs', type: 'none' as const },
    { id: 'passages-roues-ar', name: 'Passages De Roues', type: 'none' as const },
    { id: 'lunette-arriere', name: 'Lunette Arrière', type: 'none' as const },
    { id: 'pavillon-ar', name: 'Pavillon', type: 'none' as const },
    
    // Partie Latérale Droite
    { id: 'aile-av-d', name: 'Aile Av', type: 'none' as const },
    { id: 'porte-av-d', name: 'Porte Av', type: 'none' as const },
    { id: 'porte-ar-d', name: 'Porte Ar', type: 'none' as const },
    { id: 'panneau-caisse-d', name: 'Panneau Caisse', type: 'none' as const },
    { id: 'aile-ar-d', name: 'Aile Ar', type: 'none' as const },
    { id: 'bas-caisse-d', name: 'Bas De Caisse', type: 'none' as const },
    { id: 'retroviseur-d', name: 'Retroviseur', type: 'none' as const }
  ];

  const currentDamages = damages.length > 0 ? damages : defaultDamages;

  const handleDamageChange = (itemId: string, newType: 'rayure' | 'choc' | 'hs') => {
    const updatedDamages = currentDamages.map(item =>
      item.id === itemId 
        ? { ...item, type: item.type === newType ? 'none' as const : newType } 
        : item
    );
    onDamageUpdate(updatedDamages);
  };

  const renderDamageItem = (item: ReturnDamageItem) => (
    <div 
      key={item.id} 
      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
    >
      <span className="text-sm font-medium text-foreground">{item.name}</span>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
            item.type === 'rayure'
              ? 'bg-karrosserie-orange text-white border-karrosserie-orange'
              : 'bg-background border-border hover:bg-muted'
          } ${isViewMode ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
          onClick={() => !isViewMode && handleDamageChange(item.id, 'rayure')}
          disabled={isViewMode}
        >
          Ray.
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
            item.type === 'choc'
              ? 'bg-karrosserie-orange text-white border-karrosserie-orange'
              : 'bg-background border-border hover:bg-muted'
          } ${isViewMode ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
          onClick={() => !isViewMode && handleDamageChange(item.id, 'choc')}
          disabled={isViewMode}
        >
          Choc
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
            item.type === 'hs'
              ? 'bg-karrosserie-orange text-white border-karrosserie-orange'
              : 'bg-background border-border hover:bg-muted'
          } ${isViewMode ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
          onClick={() => !isViewMode && handleDamageChange(item.id, 'hs')}
          disabled={isViewMode}
        >
          HS
        </button>
      </div>
    </div>
  );

  const renderDamageSection = (title: string, items: ReturnDamageItem[]) => (
    <div className="space-y-2">
      {items.map((item) => renderDamageItem(item))}
    </div>
  );

  const partieAvant = currentDamages.slice(0, 8);
  const partieArriere = currentDamages.slice(8, 15);
  const partieLatGauche = currentDamages.slice(15, 22);
  const partieLatDroite = currentDamages.slice(22);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-foreground mb-3 pb-2 border-b">Partie Avant</h4>
          {renderDamageSection('', partieAvant)}
        </Card>

        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-foreground mb-3 pb-2 border-b">Partie Arrière</h4>
          {renderDamageSection('', partieArriere)}
        </Card>

        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-foreground mb-3 pb-2 border-b">Latéral Gauche</h4>
          {renderDamageSection('', partieLatGauche)}
        </Card>

        <Card className="p-3 sm:p-4">
          <h4 className="font-semibold text-foreground mb-3 pb-2 border-b">Latéral Droit</h4>
          {renderDamageSection('', partieLatDroite)}
        </Card>
      </div>
    </div>
  );
};

export default ReturnDamageAssessmentTab;
