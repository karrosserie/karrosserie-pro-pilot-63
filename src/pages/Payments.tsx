
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, MessageCircle, Calendar, Euro, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentsList from '@/components/payments/PaymentsList';
import PaymentStats from '@/components/payments/PaymentStats';
import AISecretaryPanel from '@/components/payments/AISecretaryPanel';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    {
      title: 'Paiements en attente',
      value: '12',
      change: '+2',
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Paiements validés',
      value: '45',
      change: '+8',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Montant total',
      value: '€32,450',
      change: '+12%',
      icon: Euro,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Paiements en retard',
      value: '3',
      change: '-1',
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Paiements</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos paiements et utilisez le secrétariat IA pour automatiser vos tâches.
        </p>
      </div>

      <PaymentStats stats={stats} />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 mb-4 sm:mb-0">
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Paiements
              </TabsTrigger>
              <TabsTrigger value="secretariat-ia" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Secrétariat IA
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un paiement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button size="sm" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau paiement
              </Button>
            </div>
          </div>

          <TabsContent value="payments" className="space-y-6">
            <PaymentsList searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="secretariat-ia" className="space-y-6">
            <AISecretaryPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payments;
