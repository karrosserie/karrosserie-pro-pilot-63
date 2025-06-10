
import React from 'react';
import { Calendar, User } from 'lucide-react';

interface Reservation {
  id: string;
  start_date: string;
  end_date?: string;
  status: string;
  notes?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  repair_orders?: {
    reference: string;
  };
}

interface FleetLoansHistoryTabProps {
  reservations?: Reservation[];
}

const FleetLoansHistoryTab: React.FC<FleetLoansHistoryTabProps> = ({
  reservations
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Historique des prêts</h3>
      
      {reservations && reservations.length > 0 ? (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div 
              key={reservation.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-600 mr-2" />
                  <h4 className="font-medium">
                    {reservation.clients?.first_name} {reservation.clients?.last_name}
                  </h4>
                </div>
                <span className="text-sm text-gray-500">
                  Réservation #{reservation.id.slice(0, 8)}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Du {new Date(reservation.start_date).toLocaleDateString('fr-FR')} 
                    {reservation.end_date && (
                      ` au ${new Date(reservation.end_date).toLocaleDateString('fr-FR')}`
                    )}
                  </span>
                </div>
                
                {reservation.repair_orders?.reference && (
                  <div className="text-sm">
                    <span className="font-medium">Ordre de réparation: </span>
                    {reservation.repair_orders.reference}
                  </div>
                )}
                
                {reservation.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes: </span>
                    {reservation.notes}
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  reservation.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : reservation.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {reservation.status === 'active' && 'En cours'}
                  {reservation.status === 'completed' && 'Terminé'}
                  {reservation.status === 'cancelled' && 'Annulé'}
                  {reservation.status === 'pending' && 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun prêt enregistré pour ce véhicule</p>
        </div>
      )}
    </div>
  );
};

export default FleetLoansHistoryTab;
