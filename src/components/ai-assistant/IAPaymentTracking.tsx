
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Mail, FileText, Filter, Download, X, Sparkles, Send, Edit, ChevronDown, History, MessageSquare, Mic } from 'lucide-react';

// Composant de suivi des impayés avec filtrage

const IAPaymentTracking = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedActionType, setSelectedActionType] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [messageData, setMessageData] = useState<any>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistoryInvoice, setSelectedHistoryInvoice] = useState<any>(null);

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
      availableActions: ['whatsapp', 'sms', 'vms', 'mail', 'recommande'],
      history: [
        {
          date: '10/04/2025',
          type: 'mail',
          status: 'envoyé',
          message: 'Premier rappel amical par email',
          recipient: 'contact@durandauto.fr'
        },
        {
          date: '15/04/2025',
          type: 'sms',
          status: 'livré',
          message: 'SMS de rappel envoyé au +33 6 12 34 56 78',
          recipient: '+33 6 12 34 56 78'
        },
        {
          date: '18/04/2025',
          type: 'whatsapp',
          status: 'lu',
          message: 'Message WhatsApp de rappel',
          recipient: '+33 6 12 34 56 78'
        }
      ]
    },
    {
      id: 'F-2023-122',
      client: 'Martin SARL',
      vehicle: 'PEUGEOT 308',
      vehicleRef: 'OR 007 139',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '3825,50 €',
      dueDate: '05/04/2025',
      lastRelanceDate: '17/05/2025',
      relanceType: 'Relance 2',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance2',
      availableActions: ['whatsapp', 'sms', 'vms', 'mail', 'recommande'],
      history: [
        {
          date: '05/04/2025',
          type: 'mail',
          status: 'envoyé',
          message: 'Email de relance initial',
          recipient: 'martin@martin-sarl.com'
        },
        {
          date: '10/04/2025',
          type: 'sms',
          status: 'livré',
          message: 'SMS de rappel urgent',
          recipient: '+33 6 23 45 67 89'
        },
        {
          date: '15/04/2025',
          type: 'vms',
          status: 'envoyé',
          message: 'Message vocal automatique',
          recipient: '+33 6 23 45 67 89'
        },
        {
          date: '17/05/2025',
          type: 'recommande',
          status: 'envoyé',
          message: 'Lettre recommandée avec accusé de réception',
          recipient: '123 Rue Martin, 69000 Lyon'
        }
      ]
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
      availableActions: ['whatsapp', 'sms', 'vms', 'mail', 'recommande'],
      history: [
        {
          date: '28/03/2025',
          type: 'mail',
          status: 'envoyé',
          message: 'Première relance automatique',
          recipient: 'contact@duboisetfils.fr'
        },
        {
          date: '05/04/2025',
          type: 'sms',
          status: 'livré',
          message: 'Rappel par SMS',
          recipient: '+33 6 34 56 78 90'
        },
        {
          date: '08/04/2025',
          type: 'whatsapp',
          status: 'lu',
          message: 'Message WhatsApp de relance',
          recipient: '+33 6 34 56 78 90'
        },
        {
          date: '12/05/2025',
          type: 'recommande',
          status: 'envoyé',
          message: 'Lettre recommandée avec accusé de réception',
          recipient: '456 Avenue Dubois, 33000 Bordeaux'
        }
      ]
    },
    {
      id: 'F-2023-118',
      client: 'Garage Central',
      vehicle: 'BMW X3',
      vehicleRef: 'OR 007 129',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '4250,00 €',
      dueDate: '15/03/2025',
      lastRelanceDate: '08/05/2025',
      relanceType: 'Relance 4',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'relance4',
      availableActions: ['whatsapp', 'sms', 'vms', 'mail', 'recommande'],
      history: [
        {
          date: '15/03/2025',
          type: 'mail',
          status: 'envoyé',
          message: 'Email de relance automatique',
          recipient: 'admin@garagecentral.com'
        },
        {
          date: '22/03/2025',
          type: 'sms',
          status: 'livré',
          message: 'SMS de rappel',
          recipient: '+33 6 45 67 89 01'
        },
        {
          date: '25/03/2025',
          type: 'vms',
          status: 'envoyé',
          message: 'Message vocal de relance',
          recipient: '+33 6 45 67 89 01'
        },
        {
          date: '01/04/2025',
          type: 'whatsapp',
          status: 'lu',
          message: 'Message WhatsApp de mise en demeure',
          recipient: '+33 6 45 67 89 01'
        },
        {
          date: '08/05/2025',
          type: 'recommande',
          status: 'envoyé',
          message: 'Dernière mise en demeure avant contentieux',
          recipient: '789 Boulevard Central, 13000 Marseille'
        }
      ]
    },
    {
      id: 'F-2023-116',
      client: 'Auto Express',
      vehicle: 'AUDI A4',
      vehicleRef: 'OR 007 122',
      garage: 'DEMO',
      garageRef: 'FR 455 845 897',
      amount: '5780,50 €',
      dueDate: '01/03/2025',
      lastRelanceDate: '25/04/2025',
      relanceType: 'Contentieux',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'contentieux',
      availableActions: ['whatsapp', 'sms', 'vms', 'mail', 'recommande'],
      history: [
        {
          date: '01/03/2025',
          type: 'mail',
          status: 'envoyé',
          message: 'Premier rappel de paiement',
          recipient: 'contact@autoexpress.fr'
        },
        {
          date: '08/03/2025',
          type: 'sms',
          status: 'livré',
          message: 'SMS de rappel urgent',
          recipient: '+33 6 56 78 90 12'
        },
        {
          date: '12/03/2025',
          type: 'vms',
          status: 'envoyé',
          message: 'Message vocal de mise en demeure',
          recipient: '+33 6 56 78 90 12'
        },
        {
          date: '15/03/2025',
          type: 'whatsapp',
          status: 'lu',
          message: 'WhatsApp de mise en demeure finale',
          recipient: '+33 6 56 78 90 12'
        },
        {
          date: '25/04/2025',
          type: 'recommande',
          status: 'envoyé',
          message: 'Mise en demeure finale - Transmission au contentieux',
          recipient: '321 Rue Express, 75012 Paris'
        }
      ]
    }
  ];

  const handleHistoryClick = (invoice: any) => {
    setSelectedHistoryInvoice(invoice);
    setIsHistoryOpen(true);
  };

  const handleActionClick = async (invoice: any, actionType: string) => {
    setSelectedInvoice(invoice);
    setSelectedActionType(actionType);
    setIsPanelOpen(true);
    setIsEditMode(true);
    
    // Initialize message data based on action type
    const initialData = getInitialMessageData(invoice, actionType);
    setMessageData(initialData);
    
    // Auto-generate message
    await generateMessage(invoice, actionType);
  };

  const getInitialMessageData = (invoice: any, actionType: string) => {
    const baseData = {
      clientName: invoice.client,
      invoiceId: invoice.id,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
    };

    switch (actionType) {
      case 'mail':
        return {
          ...baseData,
          subject: `Relance de paiement - Facture ${invoice.id}`,
          recipient: 'client@example.com'
        };
      case 'sms':
        return {
          ...baseData,
          phoneNumber: '+33 6 12 34 56 78'
        };
      case 'whatsapp':
        return {
          ...baseData,
          phoneNumber: '+33 6 12 34 56 78'
        };
      case 'vms':
        return {
          ...baseData,
          phoneNumber: '+33 6 12 34 56 78'
        };
      case 'recommande':
        return {
          ...baseData,
          address: '123 Rue du Client\n75001 Paris\nFrance'
        };
      default:
        return baseData;
    }
  };

  const generateMessage = async (invoice: any, actionType: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation - in real app, call your AI service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const messages = {
      sms: `Bonjour ${invoice.client}, votre facture ${invoice.id} de ${invoice.amount} est en retard depuis le ${invoice.dueDate}. Merci de régulariser votre situation rapidement. Cordialement, Karrosserie Pro`,
      whatsapp: `Bonjour ${invoice.client}, 
      
Nous vous informons que votre facture ${invoice.id} d'un montant de ${invoice.amount} est échue depuis le ${invoice.dueDate}.

Merci de procéder au règlement dans les plus brefs délais.

Cordialement,
Karrosserie Pro`,
      vms: `Bonjour, c'est Karrosserie Pro. Votre facture ${invoice.id} de ${invoice.amount} échue le ${invoice.dueDate} n'a pas encore été réglée. Merci de nous contacter rapidement pour régulariser cette situation.`,
      mail: `Objet: Relance de paiement - Facture ${invoice.id}\n\nMonsieur/Madame,\n\nNous vous informons que votre facture ${invoice.id} d'un montant de ${invoice.amount}, échue le ${invoice.dueDate}, n'a pas encore été réglée.\n\nNous vous prions de bien vouloir procéder au règlement dans les plus brefs délais.\n\nCordialement,\nL'équipe Karrosserie Pro`,
      recommande: `MISE EN DEMEURE\n\nMonsieur/Madame,\n\nMalgré nos précédentes relances, votre facture ${invoice.id} d'un montant de ${invoice.amount}, échue le ${invoice.dueDate}, demeure impayée.\n\nNous vous mettons en demeure de procéder au règlement sous 8 jours, faute de quoi nous serons contraints d'engager des poursuites.\n\nCordialement,\nKarrosserie Pro`
    };
    
    setGeneratedMessage(messages[actionType as keyof typeof messages] || '');
    setIsGenerating(false);
  };

  const handleSendMessage = async (autoMode = false) => {
    if (autoMode) {
      // In auto mode, send directly without user review
      console.log('Sending message in auto mode:', generatedMessage);
    } else {
      // In semi-auto mode, use the edited message
      console.log('Sending edited message:', generatedMessage);
    }
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Close panel and show success
    setIsPanelOpen(false);
    // You could add a toast notification here
  };

  const closePanelAndReset = () => {
    setIsPanelOpen(false);
    setSelectedInvoice(null);
    setSelectedActionType('');
    setGeneratedMessage('');
    setMessageData({});
    setIsEditMode(true);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sms': return <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'whatsapp': return <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'vms': return <Mic className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'mail': return <Mail className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'recommande': return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return null;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'sms': return 'SMS';
      case 'whatsapp': return 'WhatsApp';
      case 'vms': return 'VMS';
      case 'mail': return 'Mail';
      case 'recommande': return 'Recommandé';
      default: return action;
    }
  };

  const getActionStyle = (action: string) => {
    switch (action) {
      case 'sms': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'whatsapp': return 'bg-green-100 text-green-800 border-green-200';
      case 'vms': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'mail': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recommande': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filtrer les factures selon le filtre sélectionné
  const filteredInvoices = filterStatus === 'all' ? unpaidInvoices : unpaidInvoices.filter(invoice => invoice.status === filterStatus);

  const filterOptions = [
    { value: 'all', label: 'Toutes', count: unpaidInvoices.length },
    { value: 'relance1', label: 'Relance 1', count: unpaidInvoices.filter(i => i.status === 'relance1').length },
    { value: 'relance2', label: 'Relance 2', count: unpaidInvoices.filter(i => i.status === 'relance2').length },
    { value: 'relance3', label: 'Relance 3', count: unpaidInvoices.filter(i => i.status === 'relance3').length },
    { value: 'relance4', label: 'Relance 4', count: unpaidInvoices.filter(i => i.status === 'relance4').length },
    { value: 'contentieux', label: 'Contentieux', count: unpaidInvoices.filter(i => i.status === 'contentieux').length }
  ];

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
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Filtrer
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filtrer par statut</h4>
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        filterStatus === option.value ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                       onClick={() => {
                         setFilterStatus(option.value);
                         setIsFilterOpen(false);
                       }}
                    >
                      <span className="text-sm">{option.label}</span>
                      <Badge className="bg-orange-500 text-white text-xs">{option.count}</Badge>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {filteredInvoices.map((invoice, index) => (
            <InvoiceCard 
              key={index} 
              invoice={invoice} 
              getActionIcon={getActionIcon} 
              getActionLabel={getActionLabel} 
              getActionStyle={getActionStyle}
              onActionClick={handleActionClick}
              onHistoryClick={handleHistoryClick}
            />
          ))}
        </div>
      </CardContent>

      {/* Sliding Panel */}
      <MessagePanel
        isOpen={isPanelOpen}
        onClose={closePanelAndReset}
        invoice={selectedInvoice}
        actionType={selectedActionType}
        messageData={messageData}
        setMessageData={setMessageData}
        generatedMessage={generatedMessage}
        setGeneratedMessage={setGeneratedMessage}
        isGenerating={isGenerating}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onSendMessage={handleSendMessage}
        onRegenerate={() => selectedInvoice && generateMessage(selectedInvoice, selectedActionType)}
      />

      {/* Modal Historique des relances */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              Historique des relances - {selectedHistoryInvoice?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedHistoryInvoice && (
            <div className="space-y-6">
              {/* Informations de la facture */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Informations de la facture</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Client:</span>
                    <p className="font-medium">{selectedHistoryInvoice.client}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Montant:</span>
                    <p className="font-medium text-orange-600">{selectedHistoryInvoice.amount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Échéance:</span>
                    <p className="font-medium">{selectedHistoryInvoice.dueDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Statut:</span>
                    <Badge className={selectedHistoryInvoice.relanceTypeColor}>
                      {selectedHistoryInvoice.relanceType}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Timeline des relances */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Historique chronologique des relances</h3>
                <div className="relative">
                  {/* Ligne de timeline */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {selectedHistoryInvoice.history?.map((historyItem: any, index: number) => (
                    <div key={index} className="relative flex items-start space-x-4 pb-6">
                      {/* Icône de timeline */}
                      <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                        {getActionIcon(historyItem.type)}
                      </div>
                      
                      {/* Contenu */}
                      <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {getActionLabel(historyItem.type)}
                            </h4>
                            <Badge 
                              className={`text-xs ${
                                historyItem.status === 'envoyé' ? 'bg-blue-100 text-blue-800' :
                                historyItem.status === 'livré' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {historyItem.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{historyItem.date}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{historyItem.message}</p>
                        
                        <div className="text-xs text-gray-500">
                          <strong>Destinataire:</strong> {historyItem.recipient}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">Statistiques des relances</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total relances:</span>
                    <p className="font-bold text-blue-900">{selectedHistoryInvoice.history?.length || 0}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Emails envoyés:</span>
                    <p className="font-bold text-blue-900">
                      {selectedHistoryInvoice.history?.filter((h: any) => h.type === 'email').length || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">SMS envoyés:</span>
                    <p className="font-bold text-blue-900">
                      {selectedHistoryInvoice.history?.filter((h: any) => h.type === 'sms').length || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Courriers envoyés:</span>
                    <p className="font-bold text-blue-900">
                      {selectedHistoryInvoice.history?.filter((h: any) => ['courrier', 'recommande'].includes(h.type)).length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const InvoiceCard = ({ invoice, getActionIcon, getActionLabel, getActionStyle, onActionClick, onHistoryClick }: any) => (
  <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200 animate-fade-in">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* En-tête avec numéro de facture et statut */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
            <Badge className={`${invoice.relanceTypeColor} text-xs font-medium`}>
              {invoice.relanceType}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-orange-600 mb-1">{invoice.amount}</p>
            <Button
              className="bg-karrosserie-orange text-white hover:bg-karrosserie-orange/90 h-8 text-xs px-3 mb-1"
              size="sm"
              onClick={() => onHistoryClick(invoice)}
            >
              <History className="h-3 w-3 mr-1" />
              Historique
            </Button>
            <p className="text-xs text-gray-500">
              Dernière relance: {invoice.lastRelanceDate}
            </p>
          </div>
        </div>

        {/* Informations client et véhicule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
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
                onClick={() => onActionClick(invoice, action)}
                className={`text-xs px-3 py-1 ${getActionStyle(action)} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                {getActionIcon(action)}
                <span className="ml-1">{getActionLabel(action)}</span>
              </Button>
            ))}
          </div>
        </div>


      </div>
    </div>
  </div>
);

// Message Panel Component
const MessagePanel = ({ 
  isOpen, 
  onClose, 
  invoice, 
  actionType, 
  messageData, 
  setMessageData, 
  generatedMessage, 
  setGeneratedMessage, 
  isGenerating, 
  isEditMode, 
  setIsEditMode, 
  onSendMessage, 
  onRegenerate 
}: any) => {
  if (!isOpen || !invoice) return null;

  const getActionTitle = (action: string) => {
    switch (action) {
      case 'sms': return 'Envoi de SMS';
      case 'email': return 'Envoi d\'Email';
      case 'courrier': return 'Envoi de Courrier';
      case 'recommande': return 'Envoi de Recommandé';
      default: return 'Message';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sms': return <MessageCircle className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'courrier': return <FileText className="h-5 w-5" />;
      case 'recommande': return <FileText className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl border-l z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            {getActionIcon(actionType)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getActionTitle(actionType)}</h2>
              <p className="text-sm text-gray-600">Facture {invoice.id} - {invoice.client}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Invoice Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Informations facture</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Client:</span>
                <span className="ml-2 font-medium">{invoice.client}</span>
              </div>
              <div>
                <span className="text-gray-600">Montant:</span>
                <span className="ml-2 font-medium">{invoice.amount}</span>
              </div>
              <div>
                <span className="text-gray-600">Échéance:</span>
                <span className="ml-2 font-medium">{invoice.dueDate}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{invoice.relanceType}</span>
              </div>
            </div>
          </div>

          {/* Message Configuration */}
          {actionType === 'email' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Destinataire</Label>
                <Input
                  id="recipient"
                  value={messageData.recipient || ''}
                  onChange={(e) => setMessageData(prev => ({ ...prev, recipient: e.target.value }))}
                  placeholder="email@client.com"
                />
              </div>
              <div>
                <Label htmlFor="subject">Objet</Label>
                <Input
                  id="subject"
                  value={messageData.subject || ''}
                  onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Objet de l'email"
                />
              </div>
            </div>
          )}

          {actionType === 'sms' && (
            <div>
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                value={messageData.phoneNumber || ''}
                onChange={(e) => setMessageData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          )}

          {(actionType === 'courrier' || actionType === 'recommande') && (
            <div>
              <Label htmlFor="address">Adresse postale</Label>
              <Textarea
                id="address"
                value={messageData.address || ''}
                onChange={(e) => setMessageData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse complète du client"
                rows={3}
              />
            </div>
          )}

          {/* AI Generation Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-gray-900">Message généré par IA</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isEditMode}
                    onCheckedChange={setIsEditMode}
                  />
                  <Label className="text-sm">Mode édition</Label>
                </div>
                <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isGenerating}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Régénérer
                </Button>
              </div>
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Génération en cours...</span>
              </div>
            ) : (
              <div>
                {isEditMode ? (
                  <Textarea
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    rows={8}
                    placeholder="Le message généré apparaîtra ici..."
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded border font-mono text-sm whitespace-pre-wrap">
                    {generatedMessage || 'Aucun message généré'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onSendMessage(false)}
                disabled={!generatedMessage || isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-1" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IAPaymentTracking;
