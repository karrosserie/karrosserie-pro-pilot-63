import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { usePlanningContext } from '@/contexts/OriginalPlanningContext';
import VehicleCard from './OriginalVehicleCard';

const WorkshopSteps: React.FC = () => {
  const { steps, setShowWaitingModal } = usePlanningContext();

  const waitingVehiclesCount = steps.reduce((total, step) => 
    total + step.vehicles.filter(v => !v.inProgress).length, 0
  );

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Étapes atelier</h1>
        <p className="text-gray-600">Parcours complet avec synchronisation planning automatique</p>
      </div>

      {/* Stats */}
      <div className="flex justify-end gap-8 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">VÉHICULES</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">TERMINÉS</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">5</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">EN ATTENTE</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">18700€</div>
          <div className="text-sm text-gray-600 uppercase tracking-wide">CA EN COURS</div>
        </div>
      </div>

      {/* Alert section */}
      <div 
        className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 cursor-pointer hover:bg-orange-100 transition-colors"
        onClick={() => setShowWaitingModal(true)}
      >
        <div className="flex items-center gap-2 text-orange-800 mb-1">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">{waitingVehiclesCount} véhicules en attente</span>
        </div>
        <div className="text-sm text-orange-700">
          Pièces: 2 • Approbations: 1 • Techniciens: 1
        </div>
      </div>

      {/* Workshop steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className={`border-l-4 ${step.borderColor} bg-white rounded-lg shadow-sm`}>
            {/* Step header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {step.count} véhicule(s)
                </span>
              </div>
            </div>
            
            {/* Vehicles grid */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step.vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopSteps;