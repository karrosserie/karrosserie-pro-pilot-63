
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Calendar, User } from 'lucide-react';

interface CurrentLoan {
  id: string;
  vehicle: string;
  client: string;
  startDate: string;
  expectedReturnDate: string;
}

interface FleetCurrentLoansProps {
  currentLoans: CurrentLoan[];
}

const FleetCurrentLoans: React.FC<FleetCurrentLoansProps> = ({ currentLoans }) => {
  return (
    <div className="card-container">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Prêts en cours</h2>
      
      <div className="space-y-4">
        {currentLoans.map((loan) => (
          <div 
            key={loan.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center mb-2">
              <Car className="h-4 w-4 text-gray-600 mr-2" />
              <h4 className="font-medium">{loan.vehicle}</h4>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 ml-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{loan.client}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Du {loan.startDate} au {loan.expectedReturnDate}</span>
              </div>
            </div>
            
            <div className="mt-4 space-x-2">
              <Button variant="outline" size="sm">Détails</Button>
              <Button className="btn-primary" size="sm">Retour</Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button className="w-full" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Nouveau prêt
        </Button>
      </div>
    </div>
  );
};

export default FleetCurrentLoans;
