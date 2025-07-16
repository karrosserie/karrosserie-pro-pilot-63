import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlanning } from '@/contexts/PlanningContext';
import VehicleCard from './VehicleCard';

const WorkshopSteps: React.FC = () => {
  const { state } = usePlanning();
  const { steps } = state;

  return (
    <div className="space-y-6">
      {steps.map((step) => (
        <Card key={step.id} className={`border-l-4 ${step.color}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{step.title}</span>
              <Badge variant="secondary">{step.count} véhicule(s)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {step.vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkshopSteps;