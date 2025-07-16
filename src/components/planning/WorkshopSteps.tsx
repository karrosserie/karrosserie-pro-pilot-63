import React from 'react';
import { usePlanning } from '@/contexts/PlanningContext';
import VehicleCard from './VehicleCard';

const WorkshopSteps: React.FC = () => {
  const { state } = usePlanning();
  const { steps } = state;

  const getStepColorClass = (color: string) => {
    switch (color) {
      case 'border-l-blue-500': return 'border-l-4 border-l-blue-500';
      case 'border-l-green-500': return 'border-l-4 border-l-green-500';
      case 'border-l-yellow-500': return 'border-l-4 border-l-yellow-500';
      case 'border-l-orange-500': return 'border-l-4 border-l-orange-500';
      case 'border-l-purple-500': return 'border-l-4 border-l-purple-500';
      case 'border-l-red-500': return 'border-l-4 border-l-red-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {steps.map((step) => (
        <div key={step.id} className="bg-white">
          {/* Step Header */}
          <div className={`${getStepColorClass(step.color)} bg-white rounded-lg shadow-sm`}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {step.count} véhicule(s)
                </span>
              </div>
            </div>
            
            {/* Vehicles Grid */}
            <div className="p-4">
              <div className="grid gap-4 md:grid-cols-2">
                {step.vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopSteps;