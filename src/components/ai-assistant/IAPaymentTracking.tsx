
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Mail, FileText, Filter, Download, X, Sparkles, Send, Edit } from 'lucide-react';

const IAPaymentTracking = () => {
  const [selectedTab, setSelectedTab] = useState('relance1');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedActionType, setSelectedActionType] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [messageData, setMessageData] = useState<any>({});

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
      case 'email':
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
      case 'courrier':
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
      email: `Objet: Relance de paiement - Facture ${invoice.id}\n\nMonsieur/Madame,\n\nNous vous informons que votre facture ${invoice.id} d'un montant de ${invoice.amount}, échue le ${invoice.dueDate}, n'a pas encore été réglée.\n\nNous vous prions de bien vouloir procéder au règlement dans les plus brefs délais.\n\nCordialement,\nL'équipe Karrosserie Pro`,
      courrier: `Monsieur/Madame,\n\nNous vous adressons la présente lettre afin de vous rappeler que votre facture ${invoice.id} d'un montant de ${invoice.amount}, échue le ${invoice.dueDate}, demeure impayée à ce jour.\n\nNous vous prions de bien vouloir régulariser cette situation dans un délai de 15 jours.\n\nCordialement,\nKarrosserie Pro`,
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
            <TabsTrigger value="relance1" className="text-xs sm:text-sm flex items-center gap-2">
              Relance 1 
              <Badge className="bg-orange-500 text-white text-xs">{unpaidInvoices.filter(i => i.status === 'relance1').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="relance2" className="text-xs sm:text-sm flex items-center gap-2">
              Relance 2 
              <Badge className="bg-orange-500 text-white text-xs">{unpaidInvoices.filter(i => i.status === 'relance2').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="relance3" className="text-xs sm:text-sm flex items-center gap-2">
              Relance 3 
              <Badge className="bg-orange-500 text-white text-xs">{unpaidInvoices.filter(i => i.status === 'relance3').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="relance4" className="text-xs sm:text-sm flex items-center gap-2">
              Relance 4 
              <Badge className="bg-orange-500 text-white text-xs">{unpaidInvoices.filter(i => i.status === 'relance4').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="contentieux" className="text-xs sm:text-sm flex items-center gap-2">
              Contentieux 
              <Badge className="bg-orange-500 text-white text-xs">{unpaidInvoices.filter(i => i.status === 'contentieux').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm flex items-center gap-2">
              Tous 
              <Badge className="bg-orange-500 text-white text-xs">{unpaidInvoices.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="relance1" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance1').map((invoice, index) => (
              <InvoiceCard 
                key={index} 
                invoice={invoice} 
                getActionIcon={getActionIcon} 
                getActionLabel={getActionLabel} 
                getActionStyle={getActionStyle}
                onActionClick={handleActionClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="relance2" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance2').map((invoice, index) => (
              <InvoiceCard 
                key={index} 
                invoice={invoice} 
                getActionIcon={getActionIcon} 
                getActionLabel={getActionLabel} 
                getActionStyle={getActionStyle}
                onActionClick={handleActionClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="relance3" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance3').map((invoice, index) => (
              <InvoiceCard 
                key={index} 
                invoice={invoice} 
                getActionIcon={getActionIcon} 
                getActionLabel={getActionLabel} 
                getActionStyle={getActionStyle}
                onActionClick={handleActionClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="relance4" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'relance4').map((invoice, index) => (
              <InvoiceCard 
                key={index} 
                invoice={invoice} 
                getActionIcon={getActionIcon} 
                getActionLabel={getActionLabel} 
                getActionStyle={getActionStyle}
                onActionClick={handleActionClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="contentieux" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.filter(invoice => invoice.status === 'contentieux').map((invoice, index) => (
              <InvoiceCard 
                key={index} 
                invoice={invoice} 
                getActionIcon={getActionIcon} 
                getActionLabel={getActionLabel} 
                getActionStyle={getActionStyle}
                onActionClick={handleActionClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-3 sm:space-y-4">
            {unpaidInvoices.map((invoice, index) => (
              <InvoiceCard 
                key={index} 
                invoice={invoice} 
                getActionIcon={getActionIcon} 
                getActionLabel={getActionLabel} 
                getActionStyle={getActionStyle}
                onActionClick={handleActionClick}
              />
            ))}
          </TabsContent>
        </Tabs>
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
    </Card>
  );
};

const InvoiceCard = ({ invoice, getActionIcon, getActionLabel, getActionStyle, onActionClick }: any) => (
  <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200 animate-fade-in">
    <div className="flex flex-col lg:flex-row gap-4">
      {/* En-tête avec numéro de facture et statut */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
            <Badge className={`${invoice.relanceTypeColor} text-xs font-medium`}>
              {invoice.relanceType}
            </Badge>
          </div>
          <p className="text-xl font-bold text-gray-900 ml-4 text-right">{invoice.amount}</p>
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
                onClick={() => onActionClick(invoice, action)}
                className={`text-xs px-3 py-1 ${getActionStyle(action)} hover:opacity-80 transition-opacity cursor-pointer`}
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
