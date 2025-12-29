import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DamageItem {
  id: string;
  name: string;
  type: 'none' | 'rayure' | 'choc' | 'hs';
}

interface DamageAssessmentTabProps {
  damages: DamageItem[];
  onDamageUpdate: (damages: DamageItem[]) => void;
  isViewMode?: boolean;
}

const DamageAssessmentTab: React.FC<DamageAssessmentTabProps> = ({
  damages,
  onDamageUpdate,
  isViewMode = false
}) => {
  const defaultDamages = [
    // Partie Avant
    { id: 'capot', name: 'Capot', type: 'none' },
    { id: 'calandre', name: 'Calandre', type: 'none' },
    { id: 'phare', name: 'Phare', type: 'none' },
    { id: 'clignotants-av', name: 'Clignotants', type: 'none' },
    { id: 'pare-chocs-av', name: 'Pare Chocs', type: 'none' },
    { id: 'passages-roues-av', name: 'Passages De Roues', type: 'none' },
    { id: 'pare-brise', name: 'Pare Brise', type: 'none' },
    { id: 'pavillon', name: 'Pavillon', type: 'none' },
    
    // Partie Latérale Gauche
    { id: 'aile-av-g', name: 'Aile Av', type: 'none' },
    { id: 'porte-av-g', name: 'Porte Av', type: 'none' },
    { id: 'porte-ar-g', name: 'Porte Ar', type: 'none' },
    { id: 'panneau-caisse-g', name: 'Panneau Caisse', type: 'none' },
    { id: 'aile-ar-g', name: 'Aile Ar', type: 'none' },
    { id: 'bas-caisse-g', name: 'Bas De Caisse', type: 'none' },
    { id: 'retroviseur-g', name: 'Retroviseur', type: 'none' },
    
    // Partie Arrière
    { id: 'hayon', name: 'Hayon', type: 'none' },
    { id: 'feux-arriere', name: 'Feux arrière', type: 'none' },
    { id: 'clignotants-ar', name: 'Clignotants', type: 'none' },
    { id: 'pare-chocs-ar', name: 'Pare Chocs', type: 'none' },
    { id: 'passages-roues-ar', name: 'Passages De Roues', type: 'none' },
    { id: 'lunette-arriere', name: 'Lunette Arrière', type: 'none' },
    { id: 'pavillon-ar', name: 'Pavillon', type: 'none' },
    
    // Partie Latérale Droite
    { id: 'aile-av-d', name: 'Aile Av', type: 'none' },
    { id: 'porte-av-d', name: 'Porte Av', type: 'none' },
    { id: 'porte-ar-d', name: 'Porte Ar', type: 'none' },
    { id: 'panneau-caisse-d', name: 'Panneau Caisse', type: 'none' },
    { id: 'aile-ar-d', name: 'Aile Ar', type: 'none' },
    { id: 'bas-caisse-d', name: 'Bas De Caisse', type: 'none' },
    { id: 'retroviseur-d', name: 'Retroviseur', type: 'none' }
  ] as const satisfies readonly DamageItem[];

  const currentDamages = damages.length > 0 ? damages : defaultDamages;

  const handleDamageChange = (itemId: string, newType: 'rayure' | 'choc' | 'hs') => {
    const updatedDamages = currentDamages.map(item =>
      item.id === itemId 
        ? { ...item, type: item.type === newType ? 'none' : newType } 
        : item
    );
    onDamageUpdate(updatedDamages);
  };

  const damageTypes = [
    { key: 'rayure', label: 'Ray.', mobileLabel: 'R' },
    { key: 'choc', label: 'Choc', mobileLabel: 'C' },
    { key: 'hs', label: 'HS', mobileLabel: 'HS' }
  ];

  // Mobile card view for each damage item
  const renderMobileDamageItem = (item: DamageItem) => (
    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
      <span className="text-sm font-medium text-foreground flex-1 truncate">{item.name}</span>
      <div className="flex gap-1.5">
        {damageTypes.map(({ key, mobileLabel }) => (
          <button
            key={key}
            type="button"
            disabled={isViewMode}
            onClick={() => !isViewMode && handleDamageChange(item.id, key as 'rayure' | 'choc' | 'hs')}
            className={cn(
              "w-10 h-10 text-xs font-semibold rounded-md border-2 transition-all",
              item.type === key
                ? "bg-karrosserie-orange text-white border-karrosserie-orange"
                : "bg-background border-border text-muted-foreground hover:bg-muted",
              isViewMode && "opacity-60 cursor-not-allowed"
            )}
          >
            {mobileLabel}
          </button>
        ))}
      </div>
    </div>
  );

  // Desktop table section
  const renderDesktopSection = (title: string, items: DamageItem[]) => (
    <Card className="p-2 md:p-3 overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-3 pb-2 border-b border-gray-200">
        <div className="col-span-4 font-medium text-gray-700 text-xs">{title}</div>
        {damageTypes.map(({ label }) => (
          <div key={label} className="text-center text-xs text-gray-600">{label}</div>
        ))}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-7 gap-2 items-center py-1.5 border-b border-gray-100">
            <div className="col-span-4 text-xs text-gray-600 truncate" title={item.name}>{item.name}</div>
            {damageTypes.map(({ key }) => (
              <div key={key} className="flex justify-center">
                <div 
                  className={cn(
                    "w-full h-8 rounded cursor-pointer border transition-colors",
                    item.type === key
                      ? 'bg-karrosserie-orange border-karrosserie-orange' 
                      : 'bg-gray-100 border-gray-200 hover:bg-gray-200',
                    isViewMode && 'cursor-default'
                  )}
                  onClick={() => !isViewMode && handleDamageChange(item.id, key as 'rayure' | 'choc' | 'hs')}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );

  const partieAvant = currentDamages.slice(0, 8);
  const partieArriere = currentDamages.slice(8, 15);
  const partieLatGauche = currentDamages.slice(15, 22);
  const partieLatDroite = currentDamages.slice(22);

  const sections = [
    { title: 'Partie Avant', items: partieAvant },
    { title: 'Partie Arrière', items: partieArriere },
    { title: 'Latéral Gauche', items: partieLatGauche },
    { title: 'Latéral Droit', items: partieLatDroite }
  ];

  return (
    <div className="space-y-4 sm:space-y-6" data-tour="damage-assessment">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
          <span className="text-xs text-muted-foreground">OK</span>
        </div>
        {damageTypes.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-karrosserie-orange" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {sections.map(section => (
          <div key={section.title} className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground px-1">{section.title}</h4>
            <div className="space-y-2">
              {section.items.map(item => renderMobileDamageItem(item))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map(section => renderDesktopSection(section.title, section.items))}
      </div>
    </div>
  );
};

export default DamageAssessmentTab;
