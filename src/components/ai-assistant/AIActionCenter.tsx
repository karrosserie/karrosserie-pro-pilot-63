
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Camera, Calculator, MessageSquare, Download, Zap } from 'lucide-react';

const AIActionCenter = () => {
  const quickActions = [
    {
      id: 'generate-quote',
      title: 'Devis IA',
      description: 'Photo → Devis en 30s',
      icon: Camera,
      color: 'bg-blue-600 hover:bg-blue-700',
      urgent: true
    },
    {
      id: 'damage-analysis',
      title: 'Analyser Dégâts',
      description: 'IA expertise instantanée',
      icon: FileText,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'cost-calculator',
      title: 'Calcul Coûts',
      description: 'Prix automatique précis',
      icon: Calculator,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'ai-chat',
      title: 'Assistant Chat',
      description: 'Questions métier instantanées',
      icon: MessageSquare,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'reports',
      title: 'Rapports IA',
      description: 'Analyses & insights',
      icon: Download,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Zap className="h-5 w-5 mr-2 text-karrosserie-orange" />
          Actions Rapides IA
          <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
            URGENT
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <div key={action.id} className="relative">
              {action.urgent && (
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10"></div>
              )}
              <Button
                className={`${action.color} w-full h-auto p-4 flex flex-col items-center text-white hover:scale-105 transition-all duration-200`}
              >
                <action.icon className="h-6 w-6 mb-2" />
                <span className="font-semibold text-sm mb-1">{action.title}</span>
                <span className="text-xs opacity-90 text-center leading-tight">
                  {action.description}
                </span>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-karrosserie-orange/10 to-orange-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Mode Turbo IA</h4>
              <p className="text-sm text-gray-600">Traitement prioritaire instantané</p>
            </div>
            <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
              Activer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIActionCenter;
