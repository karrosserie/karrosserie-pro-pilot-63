
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Phone, Mail, MessageCircle, MoreHorizontal, Filter, Download, FileText } from 'lucide-react';

const IAPaymentTracking = () => {
  const [selectedTab, setSelectedTab] = useState('relance1');

  const unpaidInvoices = [
    {
      id: 'F-2023-124',
      client: 'Durand Auto',
      vehicle: 'RENAULT MEGANE',
      vehicleRef: 'OR 007 142',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '2450,75 €',
      dueDate: '10/04/2025',
      lastRelanceDate: '19/05/2025',
      relanceType: 'Relance 1',
      relanceTypeColor: 'bg-blue-100 text-blue-800',
      status: 'relance1',
      availableActions: ['sms', 'email', 'courrier', 'recommande']
    },
    {
      id: 'F-2023-122',
      client: 'Martin SARL',
      vehicle: 'PEUGEOT 308',
      vehicleRef: 'OR 007 139',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '3825,5 €',
      dueDate: '05/04/2025',
      lastRelanceDate: '17/05/2025',
      relanceType: 'Relance 2',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance2',
      availableActions: ['sms', 'email', 'courrier', 'recommande']
    },
    {
      id: 'F-2023-120',
      client: 'Dubois et Fils',
      vehicle: 'CITROEN C3',
      vehicleRef: 'OR 007 135',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '6120,25 €',
      dueDate: '28/03/2025',
      lastRelanceDate: '12/05/2025',
      relanceType: 'Relance 3',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance3',
      availableActions: ['sms', 'email', 'courrier', 'recommande']
    },
    {
      id: 'F-2023-118',
      client: 'Garage Central',
      vehicle: 'BMW X3',
      vehicleRef: 'OR 007 129',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '4250 €',
      dueDate: '15/03/2025',
      lastRelanceDate: '08/05/2025',
      relanceType: 'Relance 4',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'relance4',
      availableActions: ['sms', 'email', 'courrier', 'recommande']
    },
    {
      id: 'F-2023-116',
      client: 'Auto Express',
      vehicle: 'AUDI A4',
      vehicleRef: 'OR 007 122',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '5780,5 €',
      dueDate: '01/03/2025',
      lastRelanceDate: '25/04/2025',
      relanceType: 'Contentieux',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'contentieux',
      availableActions: ['email', 'courrier', 'recommande']
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sms': return <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'email': return <Mail className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'courrier': return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'recommande': return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return null;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      case 'courrier': return 'Courrier';
      case 'recommande': return 'Recommandé';
      default: return action;
    }
  };

  const getActionStyle = (action: string) => {
    switch (action) {
      case 'sms': return 'bg-green-100 text-green-800 border-green-200';
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'courrier': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'recommande': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Suivi des impayés
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
          <TabsList className="grid w-full grid-cols-6 mb-4 sm:mb-6">
            <TabsTrigger value="relance1" className="text-xs sm:text-sm">
              Relance 1 ({unpaidInvoices.filter(i => i.status === 'relance1').length})
            </TabsTrigger>
            <TabsTrigger value="relance2" className="text-xs sm:text-sm">
              Relance 2 ({unpaidInvoices.filter(i => i.status === 'relance2').length})
            </TabsTrigger>
            <TabsTrigger value="relance3" className="text-xs sm:text-sm">
              Relance 3 ({unpaidInvoices.filter(i => i.status === 'relance3').length})
            </TabsTrigger>
            <TabsTrigger value="relance4" className="text-xs sm:text-sm">
              Relance 4 ({unpaidInvoices.filter(i => i.status === 'relance4').length})
            </TabsTrigger>
            <TabsTrigger value="contentieux" className="text-xs sm:text-sm">
              Contentieux ({unpaidInvoices.filter(i => i.status === 'contentieux').length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Tous ({unpaidInvoices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="relance1" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance1').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getActionIcon={getActionIcon} getActionLabel={getActionLabel} getActionStyle={getActionStyle} />
            ))}
          </TabsContent>

          <TabsContent value="relance2" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance2').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getActionIcon={getActionIcon} getActionLabel={getActionLabel} getActionStyle={getActionStyle} />
            ))}
          </TabsContent>

          <TabsContent value="relance3" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance3').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getActionIcon={getActionIcon} getActionLabel={getActionLabel} getActionStyle={getActionStyle} />
            ))}
          </TabsContent>

          <TabsContent value="relance4" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance4').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getActionIcon={getActionIcon} getActionLabel={getActionLabel} getActionStyle={getActionStyle} />
            ))}
          </TabsContent>

          <TabsContent value="contentieux" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'contentieux').map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getActionIcon={getActionIcon} getActionLabel={getActionLabel} getActionStyle={getActionStyle} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.map((invoice, index) => (
              <InvoiceCard key={index} invoice={invoice} getActionIcon={getActionIcon} getActionLabel={getActionLabel} getActionStyle={getActionStyle} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const InvoiceCard = ({ invoice, getActionIcon, getActionLabel, getActionStyle }: any) => (
  <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200 animate-fade-in">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* En-tête avec numéro de facture et statut */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
            <Badge className={`${invoice.relanceTypeColor} text-xs font-medium`}>
              {invoice.relanceType}
            </Badge>
          </div>
          <p className="text-xl font-bold text-gray-900">{invoice.amount}</p>
        </div>

        {/* Informations client et véhicule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-sm text-gray-600">Client</p>
            <p className="font-medium text-gray-900">{invoice.client}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Véhicule</p>
            <div>
              <p className="font-medium text-gray-900">{invoice.vehicle}</p>
              <p className="text-xs text-gray-500">{invoice.vehicleRef}</p>
            </div>
          </div>
        </div>

        {/* Informations dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-sm text-gray-600">Échéance</p>
            <p className="font-medium text-gray-900">{invoice.dueDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Prochaine action</p>
            <p className="font-medium text-gray-900">{invoice.lastRelanceDate}</p>
          </div>
        </div>

        {/* Actions de relance */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Moyens de relance utilisés :</p>
          <div className="flex flex-wrap gap-2">
            {invoice.availableActions.map((action: string, actionIndex: number) => (
              <Button
                key={actionIndex}
                variant="outline"
                size="sm"
                className={`text-xs px-3 py-1 ${getActionStyle(action)} hover:opacity-80 transition-opacity`}
              >
                {getActionIcon(action)}
                <span className="ml-1">{getActionLabel(action)}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Dernière relance */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Dernière relance: {invoice.lastRelanceDate}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex lg:flex-col items-center gap-2 lg:w-auto justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          Actions
        </Button>
      </div>
    </div>
  </div>
);

export default IAPaymentTracking;
