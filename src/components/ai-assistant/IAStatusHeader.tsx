
import React from 'react';
import { Bot, Clock, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const IAStatusHeader = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Bot className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🤖 Assistant IA Karrosserie.pro</h1>
              <p className="text-gray-600 mt-1">Votre IA gère les messages, appels, impayés et courriers pendant que vous réparez.</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Statut IA : Actif
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Dernière exécution</span>
            </div>
            <div className="text-lg font-bold text-gray-900">08h44</div>
          </div>
          
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Relances aujourd'hui</span>
            </div>
            <div className="text-lg font-bold text-green-600">5 envoyées</div>
          </div>
          
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Performance IA</span>
            </div>
            <div className="text-lg font-bold text-purple-600">3h économisées</div>
            <div className="text-xs text-gray-500">2 règlements obtenus</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IAStatusHeader;
