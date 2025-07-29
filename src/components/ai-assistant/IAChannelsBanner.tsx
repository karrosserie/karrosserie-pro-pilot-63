
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MessageCircle, FileText, Settings, MessageSquare } from 'lucide-react';

const IAChannelsBanner = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    phone: { enabled: true, number: '+33 1 23 45 67 89', autoResponse: true },
    email: { enabled: true, address: 'contact@karrosserie.pro', autoResponse: true },
    sms: { enabled: true, number: '+33 6 12 34 56 78', autoResponse: true },
    whatsapp: { enabled: true, number: '+33 6 12 34 56 78', autoResponse: true },
    mail: { enabled: false, address: '123 Rue de la Carrosserie, 75001 Paris', autoResponse: false }
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

  return (
    <Card className="bg-white border-blue-200">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Canaux de Communication IA</h2>
            <p className="text-sm text-gray-600 mt-1">Gestion automatisée des interactions clients</p>
          </div>
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Configurer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>Configuration des Canaux de Communication IA</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Téléphone */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <Label className="text-sm font-medium">Téléphone</Label>
                    </div>
                    <Switch 
                      checked={config.phone.enabled} 
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        phone: { ...prev.phone, enabled: checked }
                      }))}
                    />
                  </div>
                  {config.phone.enabled && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Numéro</Label>
                        <Input 
                          value={config.phone.number}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            phone: { ...prev.phone, number: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={config.phone.autoResponse} 
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            phone: { ...prev.phone, autoResponse: checked }
                          }))}
                        />
                        <Label className="text-xs">Réponse automatique IA</Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label className="text-sm font-medium">Email</Label>
                    </div>
                    <Switch 
                      checked={config.email.enabled} 
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        email: { ...prev.email, enabled: checked }
                      }))}
                    />
                  </div>
                  {config.email.enabled && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Adresse</Label>
                        <Input 
                          value={config.email.address}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            email: { ...prev.email, address: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={config.email.autoResponse} 
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            email: { ...prev.email, autoResponse: checked }
                          }))}
                        />
                        <Label className="text-xs">Réponse automatique IA</Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* SMS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <Label className="text-sm font-medium">SMS</Label>
                    </div>
                    <Switch 
                      checked={config.sms.enabled} 
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        sms: { ...prev.sms, enabled: checked }
                      }))}
                    />
                  </div>
                  {config.sms.enabled && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Numéro</Label>
                        <Input 
                          value={config.sms.number}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            sms: { ...prev.sms, number: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={config.sms.autoResponse} 
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            sms: { ...prev.sms, autoResponse: checked }
                          }))}
                        />
                        <Label className="text-xs">Réponse automatique IA</Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <Label className="text-sm font-medium">WhatsApp</Label>
                    </div>
                    <Switch 
                      checked={config.whatsapp.enabled} 
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, enabled: checked }
                      }))}
                    />
                  </div>
                  {config.whatsapp.enabled && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Numéro</Label>
                        <Input 
                          value={config.whatsapp.number}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, number: e.target.value }
                          }))}
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={config.whatsapp.autoResponse} 
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, autoResponse: checked }
                          }))}
                        />
                        <Label className="text-xs">Réponse automatique IA</Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Courrier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <Label className="text-sm font-medium">Courrier postal</Label>
                    </div>
                    <Switch 
                      checked={config.mail.enabled} 
                      onCheckedChange={(checked) => setConfig(prev => ({
                        ...prev,
                        mail: { ...prev.mail, enabled: checked }
                      }))}
                    />
                  </div>
                  {config.mail.enabled && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Adresse postale</Label>
                        <Textarea 
                          value={config.mail.address}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            mail: { ...prev.mail, address: e.target.value }
                          }))}
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={config.mail.autoResponse} 
                          onCheckedChange={(checked) => setConfig(prev => ({
                            ...prev,
                            mail: { ...prev.mail, autoResponse: checked }
                          }))}
                        />
                        <Label className="text-xs">Génération automatique de courriers IA</Label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setIsConfigOpen(false)}>
                    Sauvegarder
                  </Button>
                </div>
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
