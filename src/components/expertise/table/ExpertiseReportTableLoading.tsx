
import React from 'react';

export const ExpertiseReportTableLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Chargement des rapports d'expertise...</p>
      </div>
    </div>
  );
};
