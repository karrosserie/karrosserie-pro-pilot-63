import React from 'react';
import { PaintBucket, ExternalLink, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useVehiclePaintMetrics } from '@/hooks/dashboard/use-vehicle-paint-metrics';

interface VehiclePaintWeighingTabProps {
  vehicleId: string;
}

const VehiclePaintWeighingTab: React.FC<VehiclePaintWeighingTabProps> = ({ vehicleId }) => {
  const { vehiclePaintMetrics, isLoading } = useVehiclePaintMetrics(vehicleId);

  const handleOpenPaintApp = () => {
    const url = `https://paint.karrosserie.pro/?vehicle_id=${vehicleId}`;
    window.open(url, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(1)} g`;
  };

  const formatVariance = (variance: number | null) => {
    if (variance === null || variance === undefined) return '-';
    const absVariance = Math.abs(variance);
    const sign = variance >= 0 ? '+' : '-';
    return `${sign}${absVariance.toFixed(1)}%`;
  };

  const getVarianceColor = (variance: number | null) => {
    if (variance === null || variance === undefined) return 'text-gray-500';
    if (Math.abs(variance) <= 5) return 'text-green-600';
    if (Math.abs(variance) <= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  if (!vehiclePaintMetrics || vehiclePaintMetrics.totalReports === 0) {
    return (
      <div className="p-3 sm:p-6">
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <PaintBucket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
              Pesées peinture
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-center py-6 sm:py-8">
              <PaintBucket className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Aucune pesée de peinture
              </h3>
              <p className="text-sm text-gray-600 mb-6 px-4">
                Ce véhicule n'a pas encore de données de pesée de peinture enregistrées.
              </p>
              <Button onClick={handleOpenPaintApp} className="inline-flex items-center text-sm">
                <PaintBucket className="h-4 w-4 mr-2" />
                Commencer les pesées
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* En-tête avec bouton d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pesées peinture</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Historique et analyse des pesées pour ce véhicule
          </p>
        </div>
        <Button onClick={handleOpenPaintApp} variant="outline" size="sm" className="w-full sm:w-auto">
          <PaintBucket className="h-4 w-4 mr-2" />
          <span className="sm:inline">Nouvelle pesée</span>
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Métriques de synthèse */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mr-2 sm:mr-3">
                <PaintBucket className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Coût total</p>
                <p className="text-sm sm:text-xl font-bold text-gray-900">
                  {formatCurrency(vehiclePaintMetrics.totalCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pesées</p>
                <p className="text-sm sm:text-xl font-bold text-gray-900">
                  {vehiclePaintMetrics.totalReports}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <div className={`p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 ${
                Math.abs(vehiclePaintMetrics.averageVariancePercentage) <= 5
                  ? 'bg-green-100'
                  : 'bg-orange-100'
              }`}>
                <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  Math.abs(vehiclePaintMetrics.averageVariancePercentage) <= 5
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Précision</p>
                <p className="text-sm sm:text-xl font-bold text-gray-900">
                  {formatVariance(vehiclePaintMetrics.averageVariancePercentage)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {vehiclePaintMetrics.averageWastePercentage > 0 && (
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg mr-2 sm:mr-3">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Gaspillage</p>
                  <p className="text-sm sm:text-xl font-bold text-gray-900">
                    +{vehiclePaintMetrics.averageWastePercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informations sur les types de peinture */}
      {vehiclePaintMetrics.paintTypesUsed.length > 0 && (
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Types de peinture utilisés</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {vehiclePaintMetrics.paintTypesUsed.slice(0, 6).map((paintType, index) => (
                <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                        {paintType.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                        {paintType.brand}
                        {paintType.color_code && ` - ${paintType.color_code}`}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs ml-2">
                      {paintType.usage_count}x
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    {formatCurrency(paintType.total_cost)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des pesées */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-sm sm:text-base">Historique des pesées</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[400px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Peinture</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Théo.</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Réel</TableHead>
                  <TableHead className="text-xs">Écart</TableHead>
                  <TableHead className="text-xs">Coût</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Opérateur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehiclePaintMetrics.reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-[10px] sm:text-xs py-2">
                      {formatDate(report.weighing_timestamp)}
                    </TableCell>
                    <TableCell className="py-2">
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium truncate max-w-[80px] sm:max-w-none">
                          {report.paint_types.name}
                        </p>
                        <p className="text-[9px] sm:text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none">
                          {report.paint_types.brand}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs py-2">
                      {formatWeight(report.theoretical_weight)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs py-2">
                      {formatWeight(report.actual_weight)}
                    </TableCell>
                    <TableCell className={`text-[10px] sm:text-xs font-medium py-2 ${getVarianceColor(report.variance_percentage)}`}>
                      {formatVariance(report.variance_percentage)}
                    </TableCell>
                    <TableCell className="text-[10px] sm:text-xs py-2">
                      {report.total_cost ? formatCurrency(report.total_cost) : '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs py-2">
                      {report.operator_name || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehiclePaintWeighingTab;