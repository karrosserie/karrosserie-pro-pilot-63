import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Banknote, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const PaymentManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des paiements et transactions</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble et gestion centralisée de tous vos paiements et transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encaissements du mois</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">45 230 €</div>
            <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12 450 €</div>
            <p className="text-xs text-muted-foreground">8 factures en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions validées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">156</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions échouées</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctions de gestion des paiements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Nouveau paiement
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Banknote className="h-6 w-6 mb-2" />
              Encaissement manuel
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Rapports
            </Button>
            <Button variant="outline" className="h-24 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Paiements récurrents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions récentes</CardTitle>
          <CardDescription>
            Dernières transactions effectuées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Paiement reçu - Facture #FAC-2024-001</p>
                  <p className="text-sm text-muted-foreground">Client: Garage Martin</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+2 450 €</p>
                <p className="text-sm text-muted-foreground">Aujourd'hui 14:30</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Virement bancaire - Fournisseur</p>
                  <p className="text-sm text-muted-foreground">Pièces Auto Plus</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">-890 €</p>
                <p className="text-sm text-muted-foreground">Hier 16:45</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Paiement CB - Facture #FAC-2024-002</p>
                  <p className="text-sm text-muted-foreground">Client: Dupont SA</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+1 200 €</p>
                <p className="text-sm text-muted-foreground">Hier 10:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;