import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  CreditCard,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";

const PaymentDashboard = () => {
  // Données d'exemple - à remplacer par de vraies données
  const stats = [
    {
      title: "Encaissements du mois",
      value: "€24,580",
      change: "+12.5% vs mois dernier",
      isPositive: true,
      icon: TrendingUp
    },
    {
      title: "Dépenses du mois", 
      value: "€8,240",
      change: "-3.2% vs mois dernier",
      isPositive: false,
      icon: TrendingDown
    },
    {
      title: "Comptes actifs",
      value: "15",
      change: "+2 vs mois dernier",
      isPositive: true,
      icon: Wallet
    }
  ];

  const quickActions = [
    {
      title: "Encaissements",
      description: "Gérer les recettes",
      icon: ArrowUpCircle,
      path: "/payments/receipts",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Dépenses", 
      description: "Suivre les coûts",
      icon: ArrowDownCircle,
      path: "/payments/expenses",
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100"
    },
    {
      title: "Comptes",
      description: "Gérer les comptes",
      icon: CreditCard,
      path: "/payments/accounts", 
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      name: "Société ABC",
      type: "Encaissement",
      time: "Aujourd'hui",
      amount: "+€2,450",
      status: "Confirmé",
      isPositive: true
    },
    {
      id: 2,
      name: "Fournisseur XYZ", 
      type: "Dépense",
      time: "Hier",
      amount: "-€890",
      status: "Payé",
      isPositive: false
    },
    {
      id: 3,
      name: "Client DEF",
      type: "Encaissement", 
      time: "Il y a 2 jours",
      amount: "+€1,200",
      status: "En attente",
      isPositive: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-600 mt-1">Gestion des paiements et transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            + Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className={`flex items-center text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? (
                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.path}>
            <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${action.bgColor} border-none`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full bg-white/80 ${action.color}`}>
                    <action.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${action.color}`}>
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Transactions récentes</CardTitle>
            <div className="flex-1 max-w-md ml-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10 h-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {recentTransactions.map((transaction, index) => (
              <div 
                key={transaction.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== recentTransactions.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${transaction.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.isPositive ? (
                      <ArrowUpCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.name}</div>
                    <div className="text-sm text-gray-500">
                      {transaction.type} • {transaction.time}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`font-semibold ${transaction.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'Confirmé' ? 'bg-green-100 text-green-700' :
                    transaction.status === 'Payé' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDashboard;