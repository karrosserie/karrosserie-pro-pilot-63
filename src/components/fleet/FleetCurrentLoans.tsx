
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Calendar, User, Trash, FileText, Download } from 'lucide-react';

interface CurrentLoan {
  id: string;
  vehicle: string;
  client: string;
  startDate: string;
  expectedReturnDate: string;
}

interface FleetCurrentLoansProps {
  currentLoans: CurrentLoan[];
  onViewDetails?: (loanId: string) => void;
  onReturnVehicle?: (loanId: string) => void;
  onDeleteLoan?: (loanId: string) => void;
  onNewLoan?: () => void;
  onViewAttestation?: (loanId: string) => void;
  onDownloadAttestation?: (loanId: string) => void;
}

const FleetCurrentLoans: React.FC<FleetCurrentLoansProps> = ({ 
  currentLoans, 
  onViewDetails,
  onReturnVehicle,
  onDeleteLoan,
  onNewLoan,
  onViewAttestation,
  onDownloadAttestation
}) => {
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
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails?.(loan.id)}
              >
                Détails
              </Button>
              <Button 
                className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
                size="sm"
                onClick={() => onReturnVehicle?.(loan.id)}
              >
                Retour
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewAttestation?.(loan.id)}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDownloadAttestation?.(loan.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onDeleteLoan?.(loan.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
          onClick={() => onNewLoan?.()}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Nouveau prêt
        </Button>
      </div>
    </div>
  );
};

export default FleetCurrentLoans;
