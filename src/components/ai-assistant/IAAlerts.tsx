
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

const IAAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'success',
      message: '5 devis générés automatiquement ce matin',
      time: 'Il y a 15 min'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Formation IA recommandée pour équipe',
      time: 'Il y a 2h'
    },
    {
      id: 3,
      type: 'info',
      message: 'Nouvelle mise à jour IA disponible',
      time: 'Il y a 4h'
    }
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg">Alertes IA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="mr-3 mt-0.5">
                {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-600" />}
                {alert.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500">
                  {alert.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IAAlerts;
