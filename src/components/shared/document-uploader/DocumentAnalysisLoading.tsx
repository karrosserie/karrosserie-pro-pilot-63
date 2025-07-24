import React from 'react';
import { Loader2 } from 'lucide-react';

export const DocumentAnalysisLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white border rounded-lg p-8 max-w-md mx-4 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-karrosserie-orange mb-6" />
          <h3 className="text-xl font-semibold mb-3">Analyse en cours</h3>
          <p className="text-gray-600 leading-relaxed">
            Veuillez patienter pendant que notre IA analyse votre preuve d'achat...
          </p>
        </div>
      </div>
    </div>
  );
};