
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Phone, Mail, MessageCircle, MoreHorizontal, Filter, Download } from 'lucide-react';

const IAPaymentTracking = () => {
  const [selectedTab, setSelectedTab] = useState('urgent');

  const unpaidInvoices = [
    {
      id: 'F-2023-124',
      client: 'Durand Auto SARL',
      amount: '2 450,00 €',
      dueDate: '15/11/2023',
      daysOverdue: 2,
      status: 'urgent',
      lastAction: 'Relance automatique envoyée',
      actions: ['phone', 'email', 'sms']
    },
    {
      id: 'F-2023-119',
      client: 'Martin Réparations',
      amount: '1 890,50 €',
      dueDate: '12/11/2023',
      daysOverdue: 5,
      status: 'urgent',
      lastAction: 'Appel planifié',
      actions: ['phone', 'email']
    },
    {
      id: 'F-2023-110',
      client: 'Garage Dubois et Fils',
      amount: '3 250,00 €',
      dueDate: '10/11/2023',
      daysOverdue: 7,
      status: 'critical',
      lastAction: 'Mise en demeure envoyée',
      actions: ['phone', 'email', 'sms']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'phone': return <Phone className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'email': return <Mail className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'sms': return <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Suivi des Impayés IA
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Gestion automatique des relances et actions de recouvrement
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger value="urgent" className="text-xs sm:text-sm">
              Urgent ({unpaidInvoices.filter(i => i.status === 'urgent').length})
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-xs sm:text-sm">
              Critique ({unpaidInvoices.filter(i => i.status === 'critical').length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Tous ({unpaidInvoices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="urgent" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'urgent').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getStatusColor={getStatusColor} getActionIcon={getActionIcon} />
            ))}
          </TabsContent>

          <TabsContent value="critical" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'critical').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getStatusColor={getStatusColor} getActionIcon={getActionIcon} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getStatusColor={getStatusColor} getActionIcon={getActionIcon} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const InvoiceCard = ({ invoice, getStatusColor, getActionIcon }: any) => (
  <div className="border rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
      <div className="flex-1 min-w-0 w-full lg:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {invoice.id}
            </h3>
            <Badge className={`${getStatusColor(invoice.status)} text-xs w-fit`}>
              {invoice.daysOverdue} jours de retard
            </Badge>
          </div>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{invoice.amount}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          <p><span className="font-medium">Client:</span> {invoice.client}</p>
          <p><span className="font-medium">Échéance:</span> {invoice.dueDate}</p>
        </div>
        
        <p className="text-xs sm:text-sm text-blue-600 font-medium mb-3">
          {invoice.lastAction}
        </p>
      </div>
      
      <div className="flex flex-row lg:flex-col items-center gap-2 w-full lg:w-auto">
        <div className="flex gap-1 sm:gap-2 flex-1 lg:flex-none justify-center">
          {invoice.actions.map((action: string, actionIndex: number) => (
            <Button key={actionIndex} variant="outline" size="sm" className="p-1.5 sm:p-2">
              {getActionIcon(action)}
            </Button>
          ))}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="outline" size="sm" className="p-1.5 sm:p-2">
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default IAPaymentTracking;
