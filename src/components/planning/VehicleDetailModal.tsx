import React, { useState } from 'react';
import { X, User, Clock, Phone, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePlanning } from '@/contexts/PlanningContext';

const VehicleDetailModal: React.FC = () => {
  const { state, actions } = usePlanning();
  const { isVehicleDetailModalOpen, selectedVehicleDetail } = state;
  const [newStatus, setNewStatus] = useState('');

  const vehicle = selectedVehicleDetail;

  const handleClose = () => {
    actions.closeVehicleDetailModal();
    setNewStatus('');
  };

  const handleUpdateStatus = () => {
    if (vehicle && newStatus) {
      actions.updateVehicleStatus(vehicle.id, newStatus);
      actions.closeVehicleDetailModal();
    }
  };

  const handleSchedule = () => {
    if (vehicle) {
      actions.openScheduleModal(vehicle);
      handleClose();
    }
  };

  if (!vehicle) return null;

  // Mock données supplémentaires en accord avec le style de l'original
  const vehicleInfo = {
    vin: 'WBA3A5G50DNP26082',
    year: '2020',
    mileage: '45,230 km',
    arrivalDate: '15/01/2024',
    clientPhone: '06 12 34 56 78',
    insuranceCompany: 'AXA Assurances',
    expertName: 'M. Philippe Durand',
    estimatedCompletion: '22/01/2024'
  };

  const statusOptions = [
    'En attente de pièces',
    'Prêt à débuter',
    'En cours',
    'Contrôle qualité',
    'Prêt à livrer'
  ];

  return (
    <Dialog open={isVehicleDetailModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h2>
            <div className="text-sm text-gray-600">{vehicle.plate} - {vehicle.client}</div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">VIN:</span>
              <p className="font-medium">{vehicleInfo.vin}</p>
            </div>
            <div>
              <span className="text-gray-500">Année:</span>
              <p className="font-medium">{vehicleInfo.year}</p>
            </div>
            <div>
              <span className="text-gray-500">Kilométrage:</span>
              <p className="font-medium">{vehicleInfo.mileage}</p>
            </div>
            <div>
              <span className="text-gray-500">Arrivée:</span>
              <p className="font-medium">{vehicleInfo.arrivalDate}</p>
            </div>
          </div>

          {/* Statut actuel */}
          <div className="p-3 bg-gray-50 rounded border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Statut actuel</span>
              <Badge variant={vehicle.inProgress ? "default" : "secondary"}>
                {vehicle.inProgress ? "En cours" : "En attente"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{vehicle.status}</p>
            
            {vehicle.technician && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <User className="w-3 h-3" />
                {vehicle.technician}
              </div>
            )}
          </div>

          {/* Informations client/assurance */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{vehicleInfo.clientPhone}</span>
            </div>
            <div>
              <span className="text-gray-500">Assurance:</span>
              <p className="font-medium">{vehicleInfo.insuranceCompany}</p>
            </div>
            <div>
              <span className="text-gray-500">Expert:</span>
              <p className="font-medium">{vehicleInfo.expertName}</p>
            </div>
          </div>

          {/* Coût et durée */}
          <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
            <div>
              <div className="text-lg font-semibold text-green-600">{vehicle.price}€</div>
              <div className="text-sm text-gray-600">Montant estimé</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-3 h-3" />
                {vehicle.duration}h
              </div>
              <div className="text-xs text-gray-500">Durée prévue</div>
            </div>
          </div>

          {/* Mise à jour du statut */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Changer le statut</label>
            <div className="flex gap-2">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Nouveau statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleUpdateStatus}
                disabled={!newStatus}
                size="sm"
              >
                Mettre à jour
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 p-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
          <Button onClick={handleSchedule}>
            <Calendar className="w-4 h-4 mr-2" />
            Planifier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;