
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const IAStatusHeader = () => {
  const [isRelanceActive, setIsRelanceActive] = useState(true);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assistant IA Karrosserie.pro</h1>
              <p className="text-gray-600 mt-1">Votre IA gère les messages, appels, impayés et courriers pendant que vous réparez.</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Button 
              onClick={() => setIsRelanceActive(!isRelanceActive)}
              className={`${
                isRelanceActive 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } px-4 py-2`}
            >
              {isRelanceActive ? '✅ Relance IA activée' : '❌ Relance IA désactivée'}
            </Button>
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Statut IA : Actif
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IAStatusHeader;
