import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { usePlanning } from '@/contexts/PlanningContext';

const PlanningStats: React.FC = () => {
  const { state } = usePlanning();
  const { stats } = state;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.vehicles}</div>
          <div className="text-sm text-muted-foreground">VÉHICULES</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">TERMINÉS</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
          <div className="text-sm text-muted-foreground">EN ATTENTE</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.revenue.toLocaleString()}€</div>
          <div className="text-sm text-muted-foreground">CA EN COURS</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningStats;