
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

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

  const renderDamageSection = (title: string, items: DamageItem[]) => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">{title}</h4>
      <div className="space-y-2 min-w-[500px]">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-7 gap-2 md:gap-4 items-center py-2 border-b border-gray-100">
            <div className="col-span-4 text-xs md:text-sm text-gray-600">{item.name}</div>
            <div className="flex justify-center">
              <div 
                className={`w-full h-8 md:h-10 rounded cursor-pointer border transition-colors ${
                  item.type === 'rayure'
                    ? 'bg-karrosserie-orange border-karrosserie-orange' 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                } ${isViewMode ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => !isViewMode && handleDamageChange(item.id, 'rayure')}
              />
            </div>
            <div className="flex justify-center">
              <div 
                className={`w-full h-8 md:h-10 rounded cursor-pointer border transition-colors ${
                  item.type === 'choc'
                    ? 'bg-karrosserie-orange border-karrosserie-orange' 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                } ${isViewMode ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => !isViewMode && handleDamageChange(item.id, 'choc')}
              />
            </div>
            <div className="flex justify-center">
              <div 
                className={`w-full h-8 md:h-10 rounded cursor-pointer border transition-colors ${
                  item.type === 'hs'
                    ? 'bg-karrosserie-orange border-karrosserie-orange' 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                } ${isViewMode ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => !isViewMode && handleDamageChange(item.id, 'hs')}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const partieAvant = currentDamages.slice(0, 8);
  const partieArriere = currentDamages.slice(8, 15);
  const partieLatGauche = currentDamages.slice(15, 22);
  const partieLatDroite = currentDamages.slice(22);

  return (
    <div className="space-y-6 overflow-hidden" data-tour="damage-assessment">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 pb-2 border-b border-gray-200 min-w-[500px]">
            <div className="col-span-4 font-medium text-gray-700 text-xs md:text-sm">Partie Avant</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Rayure</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Choc</div>
            <div className="text-center text-xs md:text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieAvant)}
        </Card>

        <Card className="p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 pb-2 border-b border-gray-200 min-w-[500px]">
            <div className="col-span-4 font-medium text-gray-700 text-xs md:text-sm">Partie Arrière</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Rayure</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Choc</div>
            <div className="text-center text-xs md:text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieArriere)}
        </Card>

        <Card className="p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 pb-2 border-b border-gray-200 min-w-[500px]">
            <div className="col-span-4 font-medium text-gray-700 text-xs md:text-sm">Partie Latérale Gauche</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Rayure</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Choc</div>
            <div className="text-center text-xs md:text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieLatGauche)}
        </Card>

        <Card className="p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 pb-2 border-b border-gray-200 min-w-[500px]">
            <div className="col-span-4 font-medium text-gray-700 text-xs md:text-sm">Partie Latérale Droite</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Rayure</div>
            <div className="text-center text-xs md:text-sm text-gray-600">Choc</div>
            <div className="text-center text-xs md:text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieLatDroite)}
        </Card>
      </div>
    </div>
  );
};

export default DamageAssessmentTab;
