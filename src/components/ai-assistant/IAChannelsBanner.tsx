
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MessageCircle, FileText, Settings, MessageSquare, Calendar, Zap, AlertTriangle } from 'lucide-react';

const IAChannelsBanner = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    phone: { enabled: true, number: '+33 1 23 45 67 89', autoResponse: true },
    email: { enabled: true, address: 'contact@karrosserie.pro', autoResponse: true },
    sms: { enabled: true, number: '+33 6 12 34 56 78', autoResponse: true },
    whatsapp: { enabled: true, number: '+33 6 12 34 56 78', autoResponse: true },
    mail: { enabled: false, address: '123 Rue de la Carrosserie, 75001 Paris', autoResponse: false }
  });

  // Configuration du cycle de relance
  const [relanceConfig, setRelanceConfig] = useState({
    cycleLength: 21,
    escaladeExpress: {
      enabled: true,
      minAmount: 5000,
      skipToDay: 7
    },
    abTesting: {
      enabled: true,
      variant1: "Règlement en 48h requis",
      variant2: "Échéance dépassée - Action immédiate"
    },
    pauseOnResponse: 7,
    steps: [
      {
        day: 1,
        channels: ['sms', 'email'],
        tone: 'amical',
        message: 'Rappel amical',
        objective: 'Doux rappel, sans pression'
      },
      {
        day: 3,
        channels: ['phone', 'sms'],
        tone: 'ferme',
        message: 'Rappel plus ferme',
        objective: 'Accusé de réception vocal'
      },
      {
        day: 7,
        channels: ['phone', 'sms', 'whatsapp'],
        tone: 'serieux',
        message: 'Relance sérieuse',
        objective: 'Multi-canal pour maximiser la visibilité'
      },
      {
        day: 10,
        channels: ['phone', 'sms', 'email', 'courrier'],
        tone: 'ferme',
        message: 'Mise en demeure douce',
        objective: 'Formalisation écrite'
      },
      {
        day: 14,
        channels: ['phone', 'sms', 'whatsapp', 'email', 'courrier_recommande'],
        tone: 'menacant',
        message: 'Ultime rappel avant contentieux',
        objective: 'Dernier avertissement'
      },
      {
        day: 18,
        channels: ['phone', 'courrier_recommande'],
        tone: 'menacant',
        message: 'Menace de poursuite',
        objective: 'Point de non-retour'
      },
      {
        day: 21,
        channels: ['email', 'sms'],
        tone: 'ferme',
        message: 'Fin du cycle, passage au contentieux',
        objective: 'Clôture et transition'
      }
    ]
  });

  const channels = [
    {
      icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'Téléphone',
      status: 'Actif',
      count: 3,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: <Mail className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'Email',
      status: 'Actif',
      count: 12,
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'SMS',
      status: 'Actif',
      count: 5,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'WhatsApp',
      status: 'Actif',
      count: 8,
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5" />,
      name: 'Courrier',
      status: 'Configuré',
      count: 0,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'phone': return <Phone className="h-3 w-3" />;
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <MessageCircle className="h-3 w-3" />;
      case 'whatsapp': return <MessageSquare className="h-3 w-3" />;
      case 'courrier': return <FileText className="h-3 w-3" />;
      case 'courrier_recommande': return <FileText className="h-3 w-3" />;
      default: return null;
    }
  };

  const getChannelLabel = (channel: string) => {
    const labels: Record<string, string> = {
      'phone': 'Téléphone',
      'email': 'Email',
      'sms': 'SMS',
      'whatsapp': 'WhatsApp',
      'courrier': 'Courrier',
      'courrier_recommande': 'Recommandé'
    };
    return labels[channel] || channel;
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'amical': return 'bg-green-100 text-green-800';
      case 'ferme': return 'bg-orange-100 text-orange-800';
      case 'serieux': return 'bg-yellow-100 text-yellow-800';
      case 'menacant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border-blue-200">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Canaux de communication</h2>
            <p className="text-sm text-gray-600 mt-1">Gestion automatisée des interactions clients</p>
          </div>
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Configurer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Calendrier de Relance Automatisé - Cycle de {relanceConfig.cycleLength} jours
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    📅 Délai = jours depuis la date d'échéance du paiement
                  </p>
                  <p className="text-xs text-blue-600">
                    Calendrier progressif avec montée en intensité automatique
                  </p>
                </div>

                <div className="space-y-4">
                  {relanceConfig.steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Jour J+{step.day}
                            </h4>
                            <Badge className={getToneColor(step.tone)}>
                              Ton {step.tone}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{step.message}</p>
                          <p className="text-xs text-gray-600">{step.objective}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {step.channels.map((channel, channelIndex) => (
                          <div key={channelIndex} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-xs">
                            {getChannelIcon(channel)}
                            <span>{getChannelLabel(channel)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section Escalade Express */}
                <div className="mt-8 space-y-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Option "Escalade Express"
                    </h4>
                    <p className="text-sm text-red-700">
                      Passage accéléré pour les montants élevés ou clients récidivistes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Activer l'escalade express</Label>
                      <Switch 
                        checked={relanceConfig.escaladeExpress.enabled}
                        onCheckedChange={(checked) => setRelanceConfig(prev => ({
                          ...prev,
                          escaladeExpress: { ...prev.escaladeExpress, enabled: checked }
                        }))}
                      />
                    </div>

                    {relanceConfig.escaladeExpress.enabled && (
                      <div className="space-y-4 ml-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Montant minimum</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number"
                              value={relanceConfig.escaladeExpress.minAmount}
                              onChange={(e) => setRelanceConfig(prev => ({
                                ...prev,
                                escaladeExpress: { ...prev.escaladeExpress, minAmount: parseInt(e.target.value) || 5000 }
                              }))}
                              className="w-32"
                            />
                            <span className="text-sm text-gray-600">€</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Passer directement au jour</Label>
                          <Select 
                            value={relanceConfig.escaladeExpress.skipToDay.toString()}
                            onValueChange={(value) => setRelanceConfig(prev => ({
                              ...prev,
                              escaladeExpress: { ...prev.escaladeExpress, skipToDay: parseInt(value) }
                            }))}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">J+3</SelectItem>
                              <SelectItem value="7">J+7</SelectItem>
                              <SelectItem value="10">J+10</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded border">
                          <p className="text-sm text-yellow-800">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            <strong>Conditions d'activation :</strong>
                          </p>
                          <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                            <li>• Montant &gt; {relanceConfig.escaladeExpress.minAmount}€</li>
                            <li>• Historique de retards de paiement</li>
                            <li>• Client en liste de surveillance</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsConfigOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                  Sauvegarder la configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {channels.map((channel, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {channel.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{channel.name}</p>
                  <Badge className={`${channel.color} text-xs mt-1`}>
                    {channel.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg sm:text-xl font-bold text-gray-900">{channel.count}</p>
                <p className="text-xs text-gray-500">en cours</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IAChannelsBanner;
