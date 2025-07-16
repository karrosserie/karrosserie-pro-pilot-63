import React from 'react';
import { Calendar, User, Car, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { usePlanning } from '@/contexts/PlanningContext';
import WorkshopSteps from './WorkshopSteps';
import PlanningStats from './PlanningStats';
import { AlertTriangle } from 'lucide-react';

const PlanningTabs: React.FC = () => {
  const { state, actions } = usePlanning();

  return (
    <Tabs value={state.activeTab} onValueChange={(value) => actions.setActiveTab(value as any)}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="workshop">Étapes atelier</TabsTrigger>
        <TabsTrigger value="planning">Planning</TabsTrigger>
        <TabsTrigger value="employees">Planning Employés</TabsTrigger>
        <TabsTrigger value="staff">Employés</TabsTrigger>
        <TabsTrigger value="process">Process</TabsTrigger>
      </TabsList>

      <TabsContent value="workshop" className="space-y-6">
        <PlanningStats />
        
        {/* Alert */}
        {state.alerts.map((alert, index) => (
          <Card key={index} className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{alert.message}</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                {alert.details}
              </p>
            </CardContent>
          </Card>
        ))}

        <WorkshopSteps />
      </TabsContent>

      <TabsContent value="planning">
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vue Planning</h3>
            <p className="text-muted-foreground">Interface de planning calendaire détaillée en cours de développement</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="employees">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Planning Employés</h3>
            <p className="text-muted-foreground">Gestion des plannings individuels des employés</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="staff">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Employés</h3>
            <p className="text-muted-foreground">Gestion des employés et de leurs compétences</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="process">
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Process</h3>
            <p className="text-muted-foreground">Configuration des processus d'atelier</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PlanningTabs;