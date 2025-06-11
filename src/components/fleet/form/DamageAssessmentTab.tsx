
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface DamageItem {
  id: string;
  name: string;
  rayure: number;
  choc: number;
  hs: number; // Hors service
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
  const defaultDamages: DamageItem[] = [
    // Partie Avant
    { id: 'capot', name: 'Capot', rayure: 0, choc: 0, hs: 0 },
    { id: 'calandre', name: 'Calandre', rayure: 0, choc: 0, hs: 0 },
    { id: 'phare', name: 'Phare', rayure: 0, choc: 0, hs: 0 },
    { id: 'clignotants-av', name: 'Clignotants', rayure: 0, choc: 0, hs: 0 },
    { id: 'pare-chocs-av', name: 'Pare Chocs', rayure: 0, choc: 0, hs: 0 },
    { id: 'passages-roues-av', name: 'Passages De Roues', rayure: 0, choc: 0, hs: 0 },
    { id: 'pare-brise', name: 'Pare Brise', rayure: 0, choc: 0, hs: 0 },
    { id: 'pavillon', name: 'Pavillon', rayure: 0, choc: 0, hs: 0 },
    
    // Partie Latérale Gauche
    { id: 'aile-av-g', name: 'Aile Av', rayure: 0, choc: 0, hs: 0 },
    { id: 'porte-av-g', name: 'Porte Av', rayure: 0, choc: 0, hs: 0 },
    { id: 'porte-ar-g', name: 'Porte Ar', rayure: 0, choc: 0, hs: 0 },
    { id: 'panneau-caisse-g', name: 'Panneau Caisse', rayure: 0, choc: 0, hs: 0 },
    { id: 'aile-ar-g', name: 'Aile Ar', rayure: 0, choc: 0, hs: 0 },
    { id: 'bas-caisse-g', name: 'Bas De Caisse', rayure: 0, choc: 0, hs: 0 },
    { id: 'retroviseur-g', name: 'Retroviseur', rayure: 0, choc: 0, hs: 0 },
    
    // Partie Arrière
    { id: 'hayon', name: 'Hayon', rayure: 0, choc: 0, hs: 0 },
    { id: 'feux-arriere', name: 'Feux arrière', rayure: 0, choc: 0, hs: 0 },
    { id: 'clignotants-ar', name: 'Clignotants', rayure: 0, choc: 0, hs: 0 },
    { id: 'pare-chocs-ar', name: 'Pare Chocs', rayure: 0, choc: 0, hs: 0 },
    { id: 'passages-roues-ar', name: 'Passages De Roues', rayure: 0, choc: 0, hs: 0 },
    { id: 'lunette-arriere', name: 'Lunette Arrière', rayure: 0, choc: 0, hs: 0 },
    { id: 'pavillon-ar', name: 'Pavillon', rayure: 0, choc: 0, hs: 0 },
    
    // Partie Latérale Droite
    { id: 'aile-av-d', name: 'Aile Av', rayure: 0, choc: 0, hs: 0 },
    { id: 'porte-av-d', name: 'Porte Av', rayure: 0, choc: 0, hs: 0 },
    { id: 'porte-ar-d', name: 'Porte Ar', rayure: 0, choc: 0, hs: 0 },
    { id: 'panneau-caisse-d', name: 'Panneau Caisse', rayure: 0, choc: 0, hs: 0 },
    { id: 'aile-ar-d', name: 'Aile Ar', rayure: 0, choc: 0, hs: 0 },
    { id: 'bas-caisse-d', name: 'Bas De Caisse', rayure: 0, choc: 0, hs: 0 },
    { id: 'retroviseur-d', name: 'Retroviseur', rayure: 0, choc: 0, hs: 0 }
  ];

  const currentDamages = damages.length > 0 ? damages : defaultDamages;

  const handleDamageChange = (itemId: string, type: 'rayure' | 'choc' | 'hs', value: number) => {
    const updatedDamages = currentDamages.map(item =>
      item.id === itemId ? { ...item, [type]: value } : item
    );
    onDamageUpdate(updatedDamages);
  };

  const renderDamageSection = (title: string, items: DamageItem[]) => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
            <div className="text-sm text-gray-600">{item.name}</div>
            <div className="flex justify-center">
              <div 
                className="w-16 h-4 bg-gray-200 rounded cursor-pointer relative"
                onClick={() => !isViewMode && handleDamageChange(item.id, 'rayure', item.rayure > 0 ? 0 : 1)}
              >
                {item.rayure > 0 && (
                  <div className="absolute inset-0 bg-blue-500 rounded"></div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div 
                className="w-16 h-4 bg-gray-200 rounded cursor-pointer relative"
                onClick={() => !isViewMode && handleDamageChange(item.id, 'choc', item.choc > 0 ? 0 : 1)}
              >
                {item.choc > 0 && (
                  <div className="absolute inset-0 bg-blue-500 rounded"></div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div 
                className="w-16 h-4 bg-gray-200 rounded cursor-pointer relative"
                onClick={() => !isViewMode && handleDamageChange(item.id, 'hs', item.hs > 0 ? 0 : 1)}
              >
                {item.hs > 0 && (
                  <div className="absolute inset-0 bg-blue-500 rounded"></div>
                )}
              </div>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b border-gray-200">
            <div className="font-medium text-gray-700">Partie Avant</div>
            <div className="text-center text-sm text-gray-600">Rayure</div>
            <div className="text-center text-sm text-gray-600">Choc</div>
            <div className="text-center text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieAvant)}
        </Card>

        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b border-gray-200">
            <div className="font-medium text-gray-700">Partie Arrière</div>
            <div className="text-center text-sm text-gray-600">Rayure</div>
            <div className="text-center text-sm text-gray-600">Choc</div>
            <div className="text-center text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieArriere)}
        </Card>

        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b border-gray-200">
            <div className="font-medium text-gray-700">Partie Latérale Gauche</div>
            <div className="text-center text-sm text-gray-600">Rayure</div>
            <div className="text-center text-sm text-gray-600">Choc</div>
            <div className="text-center text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieLatGauche)}
        </Card>

        <Card className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4 pb-2 border-b border-gray-200">
            <div className="font-medium text-gray-700">Partie Latérale Droite</div>
            <div className="text-center text-sm text-gray-600">Rayure</div>
            <div className="text-center text-sm text-gray-600">Choc</div>
            <div className="text-center text-sm text-gray-600">HS</div>
          </div>
          {renderDamageSection('', partieLatDroite)}
        </Card>
      </div>
    </div>
  );
};

export default DamageAssessmentTab;
