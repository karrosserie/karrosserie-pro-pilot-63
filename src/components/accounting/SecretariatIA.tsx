
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RelanceCard from './RelanceCard';
import RelanceTable from './RelanceTable';

const SecretariatIA: React.FC = () => {
  const [currentView, setCurrentView] = useState<'cards' | 'table'>('cards');

  const relancesData = [
    {
      factureNumber: 'F-2023-124',
      client: 'Durand Auto',
      amount: '2 450,75 €',
      project: 'RENAULT MEGANE',
      projectRef: 'OR-007-142',
      echeance: '10/04/2025',
      prochaine: '19/05/2025',
      banque: 'DEMO FR 455 845 897',
      relanceType: 'Relance 1' as const,
      moyensUtilises: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      derniereRelance: '12/05/2025'
    },
    {
      factureNumber: 'F-2023-122',
      client: 'Martin SARL',
      amount: '3 825,5 €',
      project: 'PEUGEOT 308',
      projectRef: 'OR-007-139',
      echeance: '05/04/2025',
      prochaine: '17/05/2025',
      banque: 'DEMO FR 455 845 897',
      relanceType: 'Relance 2' as const,
      moyensUtilises: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      derniereRelance: '10/05/2025'
    },
    {
      factureNumber: 'F-2023-120',
      client: 'Dubois et Fils',
      amount: '6 120,25 €',
      project: 'CITROEN C3',
      projectRef: 'OR-007-135',
      echeance: '28/03/2025',
      prochaine: '12/05/2025',
      banque: 'DEMO FR 455 845 897',
      relanceType: 'Relance 3' as const,
      moyensUtilises: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      derniereRelance: '05/05/2025'
    },
    {
      factureNumber: 'F-2023-118',
      client: 'Garage Central',
      amount: '4 250 €',
      project: 'BMW X3',
      projectRef: 'OR-007-129',
      echeance: '15/03/2025',
      prochaine: '08/05/2025',
      banque: 'DEMO FR 455 845 897',
      relanceType: 'Relance 4' as const,
      moyensUtilises: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      derniereRelance: '01/05/2025'
    }
  ];

  const totalFactures = relancesData.length;
  const totalMontant = relancesData.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace(/[^\d,]/g, '').replace(',', '.'));
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Secrétariat IA</CardTitle>
              <p className="text-gray-600 mt-1">
                {totalFactures} factures impayées | Montant total: {totalMontant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={currentView === 'cards' ? 'default' : 'outline'}
                onClick={() => setCurrentView('cards')}
                className={`${
                  currentView === 'cards' 
                    ? 'bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Vue détaillée
              </Button>
              <Button 
                variant={currentView === 'table' ? 'default' : 'outline'}
                onClick={() => setCurrentView('table')}
                className={`${
                  currentView === 'table' 
                    ? 'bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Vue tableau
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contenu principal */}
      <div className="w-full">
        {currentView === 'cards' ? (
          <div className="space-y-4">
            {relancesData.map((relance, index) => (
              <RelanceCard key={index} {...relance} />
            ))}
          </div>
        ) : (
          <RelanceTable />
        )}
      </div>
    </div>
  );
};

export default SecretariatIA;
