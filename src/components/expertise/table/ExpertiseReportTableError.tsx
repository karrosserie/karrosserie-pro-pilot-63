
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExpertiseReportTableErrorProps {
  error: Error;
}

export const ExpertiseReportTableError: React.FC<ExpertiseReportTableErrorProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Impossible de charger les rapports d'expertise.
        </p>
        <p className="text-xs text-red-600">
          {error.message}
        </p>
      </div>
    </div>
  );
};
