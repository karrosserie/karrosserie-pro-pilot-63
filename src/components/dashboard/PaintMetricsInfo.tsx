import React from 'react';
import { PaintBucket, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaintMetrics {
  totalCost: number;
  totalReports: number;
  averageVariancePercentage: number;
  mostUsedPaintType: {
    name: string;
    brand: string;
    usage_count: number;
  } | null;
  wasteAmount: number;
  costChange: string;
  costIsPositive: boolean;
  reportsChange: string;
  reportsIsPositive: boolean;
}

interface PaintMetricsInfoProps {
  paintMetrics: PaintMetrics | null;
}

const PaintMetricsInfo: React.FC<PaintMetricsInfoProps> = ({ paintMetrics }) => {
  const handleOpenPaintApp = () => {
    window.open('https://paint.karrosserie.pro/', '_blank');
  };

  if (!paintMetrics || paintMetrics.totalReports === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PaintBucket className="h-5 w-5 mr-2 text-purple-600" />
            Contrôle de pesée peinture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <PaintBucket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Aucune donnée de pesée de peinture disponible pour ce mois.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Utilisez l'application de contrôle de pesée pour commencer à suivre
              votre consommation de peinture et optimiser vos coûts.
            </p>
            <Button onClick={handleOpenPaintApp} className="inline-flex items-center">
              <PaintBucket className="h-4 w-4 mr-2" />
              Ouvrir l'app de pesée
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <PaintBucket className="h-5 w-5 mr-2 text-purple-600" />
            Détails pesée peinture
          </div>
          <Button variant="outline" size="sm" onClick={handleOpenPaintApp}>
            <PaintBucket className="h-4 w-4 mr-2" />
            Ouvrir l'app de pesée
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paintMetrics.mostUsedPaintType && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Peinture la plus utilisée</h4>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{paintMetrics.mostUsedPaintType.name}</span>
                <br />
                <span className="text-gray-500">{paintMetrics.mostUsedPaintType.brand}</span>
                <br />
                <span className="text-sm">
                  {paintMetrics.mostUsedPaintType.usage_count} pesée{paintMetrics.mostUsedPaintType.usage_count > 1 ? 's' : ''}
                </span>
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Précision globale</h4>
            <p className="text-sm text-gray-600">
              Écart moyen de <span className="font-medium">
                {Math.abs(paintMetrics.averageVariancePercentage).toFixed(1)}%
              </span>
              <br />
              <span className={`text-xs ${Math.abs(paintMetrics.averageVariancePercentage) <= 5 ? 'text-green-600' : 'text-orange-600'}`}>
                {Math.abs(paintMetrics.averageVariancePercentage) <= 5 ? 'Excellente précision' : 'Précision à améliorer'}
              </span>
            </p>
          </div>

          {paintMetrics.wasteAmount > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Optimisation possible</h4>
              <p className="text-sm text-red-600">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(paintMetrics.wasteAmount)} de gaspillage détecté
                <br />
                <span className="text-xs">
                  Basé sur les écarts de consommation
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaintMetricsInfo;