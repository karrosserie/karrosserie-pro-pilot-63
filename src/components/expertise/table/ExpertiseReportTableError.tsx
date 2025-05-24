
import React from 'react';

interface ExpertiseReportTableErrorProps {
  error: Error;
}

export const ExpertiseReportTableError: React.FC<ExpertiseReportTableErrorProps> = ({ error }) => {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">Erreur lors du chargement des rapports d'expertise.</p>
      <p className="text-sm text-gray-500 mt-2">{error.message}</p>
    </div>
  );
};
