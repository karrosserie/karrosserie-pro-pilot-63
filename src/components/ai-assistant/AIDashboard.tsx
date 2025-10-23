
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, DollarSign, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DocumentRequestAlerts from './DocumentRequestAlerts';

const AIDashboard = () => {
  const metrics = [
    {
      title: 'Temps Économisé',
      value: '3.2h',
      subtitle: 'aujourd\'hui',
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: '+12%'
    },
    {
      title: 'CA Généré IA',
      value: '€2,847',
      subtitle: 'cette semaine',
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+24%'
    },
    {
      title: 'Précision IA',
      value: '97.3%',
      subtitle: 'devis validés',
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: '+2%'
    }
  ];

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
    <div className="space-y-6">
      {/* Demandes de Documents */}
      <DocumentRequestAlerts />

      {/* Métriques IA */}
      <Card className="bg-gradient-to-br from-gray-50 to-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-karrosserie-orange" />
            Performance IA Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className={`${metric.bg} p-4 rounded-lg`}>
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <Badge variant="outline" className="text-xs">
                  {metric.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.subtitle}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alertes & Notifications */}
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

      {/* ROI Calculator */}
      <Card className="bg-gradient-to-br from-karrosserie-orange/5 to-orange-50 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg">ROI IA Mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-karrosserie-orange">
              €4,230
            </div>
            <div className="text-sm text-gray-600">
              Économies réalisées ce mois
            </div>
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
              ROI: +340%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDashboard;
