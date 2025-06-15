
import React from 'react';
import { Loader2 } from 'lucide-react';

export const DocumentUploadLoading: React.FC = () => {
  return (
    <div className="border rounded-lg p-8 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-karrosserie-orange mb-4" />
      <p className="text-sm text-gray-500">Téléchargement en cours...</p>
    </div>
  );
};
