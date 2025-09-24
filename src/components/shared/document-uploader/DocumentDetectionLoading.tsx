import React from 'react';
import { Loader2, Scan, FileImage } from 'lucide-react';

export function DocumentDetectionLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="relative">
        <FileImage className="h-16 w-16 text-gray-400 mb-4" />
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <Scan className="h-6 w-6 text-blue-500" />
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin absolute top-1 left-1" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Détection automatique du document
        </h3>
        <p className="text-sm text-gray-600 max-w-sm">
          Analyse de l'image en cours pour détecter automatiquement les contours du document...
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}