
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export const ForecastContent = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Prévisions de trésorerie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Janvier 2025</span>
                <span className="font-bold text-green-600">+8 450 €</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Février 2025</span>
                <span className="font-bold text-green-600">+12 200 €</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Mars 2025</span>
                <span className="font-bold text-green-600">+15 800 €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              Échéances importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium">TVA Q4 2024</p>
                  <p className="text-sm text-gray-600">Échéance dans 5 jours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Bilan annuel</p>
                  <p className="text-sm text-gray-600">Préparation en cours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
