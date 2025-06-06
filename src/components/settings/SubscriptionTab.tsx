
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SubscriptionTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information d'abonnement</CardTitle>
        <CardDescription>
          Gérez votre abonnement à Karrosserie Pro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Plan Professionnel</h3>
                <p className="text-sm text-gray-500">49,99€ / mois</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Actif
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm">Prochain prélèvement: 15/06/2025</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Jetons disponibles</h3>
            <div className="flex justify-between items-center mt-2">
              <p>Signatures électroniques</p>
              <span className="font-bold">25 / 50</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p>Lettres recommandées</p>
              <span className="font-bold">10 / 20</span>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Acheter des jetons supplémentaires
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline">Changer de plan</Button>
            <Button variant="destructive">Annuler l'abonnement</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionTab;
