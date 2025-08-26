
import React from 'react';
import { Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';

const IAStatusHeader = () => {
  const { preferences, isLoading, updateAiRelanceStatus } = useCompanyPreferences();
  
  const isRelanceActive = preferences?.ai_relance_enabled ?? false;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                Assistant IA Karrosserie.pro
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                Votre IA gère les messages, appels, impayés et courriers pendant que vous réparez.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-start sm:items-end space-y-2 w-full sm:w-auto">
            <Button 
              onClick={() => updateAiRelanceStatus && updateAiRelanceStatus(!isRelanceActive)}
              disabled={isLoading || !updateAiRelanceStatus}
              className={`${
                isRelanceActive 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } px-3 py-2 text-xs sm:text-sm w-full sm:w-auto disabled:opacity-50`}
            >
              {isLoading ? '⏳ Chargement...' : (isRelanceActive ? '✅ Relance IA activée' : '❌ Relance IA désactivée')}
            </Button>
            <Badge className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse flex-shrink-0"></div>
              <span className="truncate">Statut IA : Actif</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IAStatusHeader;
