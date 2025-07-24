import React from 'react';
import { Loader2 } from 'lucide-react';

export const DocumentAnalysisLoading: React.FC = () => {
  return (
    <div className="border rounded-lg p-8 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-karrosserie-orange mb-4" />
      <h3 className="text-lg font-semibold mb-2">Analyse en cours</h3>
      <p className="text-sm text-gray-500 text-center">
        Veuillez patienter pendant que notre IA analyse votre preuve d'achat...
      </p>
    </div>
  );
};