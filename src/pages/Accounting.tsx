
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, FileText, Plus, Filter, Download, Eye, CreditCard, Receipt, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import AISecretary from '@/components/ai/AISecretary';

// Données mockées pour les transactions
const mockTransactions = [
  { 
    id: 1, 
    reference: 'P-2023-001', 
    date: '20/05/2023', 
    description: 'Paiement facture F-2023-001',
    type: 'Encaissement', 
    method: 'Carte bancaire',
    amount: '3 785,00 €'
  },
  { 
    id: 2, 
    reference: 'D-2023-001', 
    date: '18/05/2023', 
    description: 'Achat de pièces automobiles',
    type: 'Dépense', 
    method: 'Virement',
    amount: '1 250,00 €'
  },
  { 
    id: 3, 
    reference: 'P-2023-002', 
    date: '15/05/2023', 
    description: 'Paiement facture F-2023-003',
    type: 'Encaissement', 
    method: 'Chèque',
    amount: '2 100,00 €'
  },
  { 
    id: 4, 
    reference: 'D-2023-002', 
    date: '14/05/2023', 
    description: 'Frais de carburant',
    type: 'Dépense', 
    method: 'Carte bancaire',
    amount: '85,50 €'
  },
  { 
    id: 5, 
    reference: 'P-2023-003', 
    date: '10/05/2023', 
    description: 'Paiement facture F-2023-002',
    type: 'Encaissement', 
    method: 'Virement',
    amount: '2 950,00 €'
  }
];

// Données pour le graphique
const chartData = [
  { month: 'Jan', revenue: 12500, expenses: 8200 },
  { month: 'Fév', revenue: 15000, expenses: 9100 },
  { month: 'Mar', revenue: 18000, expenses: 10200 },
  { month: 'Avr', revenue: 16500, expenses: 9800 },
  { month: 'Mai', revenue: 21000, expenses: 11500 },
  { month: 'Juin', revenue: 19500, expenses: 10800 },
];

// Données pour les cartes de statistiques
const statsCards = [
  {
    title: 'Chiffre d\'affaires',
    value: '89 500,00 €',
    period: 'depuis le début de l\'année',
    trend: '+12%',
    trendUp: true
  },
  {
    title: 'Dépenses totales',
    value: '52 300,00 €',
    period: 'depuis le début de l\'année',
    trend: '+8%',
    trendUp: true
  },
  {
    title: 'Résultat net',
    value: '37 200,00 €',
    period: 'depuis le début de l\'année',
    trend: '+15%',
    trendUp: true
  },
  {
    title: 'Montant à encaisser',
    value: '8 750,00 €',
    period: 'factures en attente',
    trend: '-5%',
    trendUp: false
  }
];

const Accounting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Comptabilité</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez votre comptabilité.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {card.period}
              </p>
              <div className={`flex items-center mt-2 text-sm ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {card.trendUp ? (
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                )}
                <span>{card.trend} par rapport à l'an dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aperçu financier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" name="Chiffre d'affaires" fill="#F97316" />
                <Bar dataKey="expenses" name="Dépenses" fill="#555555" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-1">
          <AISecretary />
        </div>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-6">
          <TabsTrigger value="transactions">
            <Receipt className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="income">
            <ArrowDownCircle className="h-4 w-4 mr-2" />
            Encaissements
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Dépenses
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <Button variant="outline" size="sm" className="mr-2">
                Tous
              </Button>
              <Button variant="outline" size="sm" className="mr-2">
                Encaissements
              </Button>
              <Button variant="outline" size="sm">
                Dépenses
              </Button>
            </div>
            
            <div className="flex items-center w-full md:w-auto space-x-2">
              <div className="relative flex-1 md:w-60">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher une transaction..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle transaction
              </Button>
            </div>
          </div>
          
          <div className="card-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.reference}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'Encaissement' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell className={`font-medium ${transaction.type === 'Encaissement' ? 'text-green-600' : 'text-blue-600'}`}>
                        {transaction.type === 'Encaissement' ? '+' : '-'} {transaction.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center py-8">
                        <Receipt className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                        <p className="text-gray-500 mt-1">
                          Aucune transaction correspondant à votre recherche n'a été trouvée.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="income">
          <div className="card-container p-6">
            <h3 className="text-lg font-semibold mb-4">Gestion des encaissements</h3>
            <p>Fonctionnalité en cours de développement.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="card-container p-6">
            <h3 className="text-lg font-semibold mb-4">Gestion des dépenses</h3>
            <p>Fonctionnalité en cours de développement.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="card-container p-6">
            <h3 className="text-lg font-semibold mb-4">Rapports financiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button variant="outline" className="flex flex-col p-6 h-auto items-center justify-center">
                <FileText className="h-8 w-8 mb-2" />
                <span className="font-medium">Bilan mensuel</span>
                <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
              </Button>
              <Button variant="outline" className="flex flex-col p-6 h-auto items-center justify-center">
                <FileText className="h-8 w-8 mb-2" />
                <span className="font-medium">Bilan trimestriel</span>
                <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
              </Button>
              <Button variant="outline" className="flex flex-col p-6 h-auto items-center justify-center">
                <FileText className="h-8 w-8 mb-2" />
                <span className="font-medium">Bilan annuel</span>
                <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
              </Button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-4">Export pour cabinet comptable</h4>
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter au format FEC
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter au format CSV
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter au format Excel
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounting;
