
import React from 'react';
import { Button } from '@/components/ui/button';

const FleetLoansHistory: React.FC = () => {
  const handleViewLoan = (loanId: string) => {
    console.log('Viewing loan:', loanId);
    // TODO: Implement loan details view
  };

  return (
    <div className="card-container">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique des prêts</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Véhicule</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date de début</th>
              <th className="px-4 py-3">Date de fin</th>
              <th className="px-4 py-3 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">Peugeot 208</td>
              <td className="px-4 py-3">Jean Dupont</td>
              <td className="px-4 py-3 text-gray-600">01/05/2023</td>
              <td className="px-4 py-3 text-gray-600">09/05/2023</td>
              <td className="px-4 py-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewLoan('loan-1')}
                >
                  Voir
                </Button>
              </td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">Citroën C3</td>
              <td className="px-4 py-3">Sophie Bernard</td>
              <td className="px-4 py-3 text-gray-600">25/04/2023</td>
              <td className="px-4 py-3 text-gray-600">05/05/2023</td>
              <td className="px-4 py-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewLoan('loan-2')}
                >
                  Voir
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetLoansHistory;
