
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

const FleetViolations: React.FC = () => {
  return (
    <div className="card-container">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Contraventions</h2>
      
      <div className="text-center py-8">
        <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucune contravention en attente</p>
        <Button className="mt-4" variant="outline">
          Importer une contravention
        </Button>
      </div>
    </div>
  );
};

export default FleetViolations;
