
import React from 'react';

export const ExpertiseReportTableLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Chargement des rapports d'expertise...</span>
    </div>
  );
};
