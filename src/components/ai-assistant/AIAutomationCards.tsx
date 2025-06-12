
import React from 'react';
import { FileText, Car, Receipt, Users, Clock, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AIAutomationCards = () => {
  const automations = [
    {
      id: 'smart-quotes',
      title: 'Devis Intelligents',
      description: 'Génération automatique de devis à partir des photos de véhicules',
      icon: FileText,
      status: 'active',
      impact: '+60% plus rapide',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      savings: '45 min/devis'
    },
    {
      id: 'damage-detection',
      title: 'Détection de Dégâts IA',
      description: 'Analyse automatique des dommages via reconnaissance visuelle',
      icon: Car,
      status: 'active',
      impact: '99% précision',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      savings: '30 min/expertise'
    },
    {
      id: 'smart-invoicing',
      title: 'Facturation Prédictive',
      description: 'Création automatique des factures basée sur les ordres de réparation',
      icon: Receipt,
      status: 'active',
      impact: 'Zéro erreur',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      savings: '20 min/facture'
    },
    {
      id: 'client-insights',
      title: 'Insights Clients IA',
      description: 'Analyse comportementale et recommandations personnalisées',
      icon: Users,
      status: 'beta',
      impact: '+25% fidélisation',
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
      savings: 'ROI +15%'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">ACTIF</Badge>;
      case 'beta':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">BÊTA</Badge>;
      default:
        return <Badge variant="outline">INACTIF</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-karrosserie-orange" />
            Automatisations IA
          </h2>
          <p className="text-gray-600 mt-1">Vos gains de productivité en temps réel</p>
        </div>
        <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
          <TrendingUp className="h-4 w-4 mr-2" />
          Voir les statistiques
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((automation) => (
          <Card key={automation.id} className={`${automation.color} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/70 p-2 rounded-lg mr-3">
                    <automation.icon className={`h-5 w-5 ${automation.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg">{automation.title}</CardTitle>
                </div>
                {getStatusBadge(automation.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {automation.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="font-medium text-green-700">{automation.impact}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="font-medium text-gray-700">{automation.savings}</span>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-white/70 text-gray-800 hover:bg-white/90 border-0"
              >
                Configurer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIAutomationCards;
