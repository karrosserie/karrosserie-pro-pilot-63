import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Settings, 
  Zap, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';

const RelanceIATab = () => {
  const { toast } = useToast();
  const { preferences, updateAiRelanceSettings, isLoading } = useCompanyPreferences();
  const [settings, setSettings] = useState({
    enabled: false,
    delayBeforeFirst: 30,
    maxRelances: 5,
    channels: {
      email: true,
      sms: true,
      whatsapp: false,
      phone: false,
      mail: false
    },
    autoMiseEnDemeure: true,
    prompt: 'Rédigez une relance de paiement professionnelle et courtoise pour la facture {facture_ref} d\'un montant de {montant}€ échue depuis {jours_retard} jours pour le client {nom_client}.',
    tonality: 'professional'
  });

  // Load settings from preferences when available
  useEffect(() => {
    if (preferences) {
      setSettings({
        enabled: preferences.ai_relance_enabled || false,
        delayBeforeFirst: preferences.ai_relance_delay_before_first || 30,
        maxRelances: preferences.ai_relance_max_relances || 5,
        channels: {
          email: preferences.ai_relance_channels_email ?? true,
          sms: preferences.ai_relance_channels_sms ?? true,
          whatsapp: preferences.ai_relance_channels_whatsapp ?? false,
          phone: preferences.ai_relance_channels_phone ?? false,
          mail: preferences.ai_relance_channels_mail ?? false
        },
        autoMiseEnDemeure: preferences.ai_relance_auto_mise_en_demeure ?? true,
        prompt: preferences.ai_relance_prompt || 'Rédigez une relance de paiement professionnelle et courtoise pour la facture {facture_ref} d\'un montant de {montant}€ échue depuis {jours_retard} jours pour le client {nom_client}.',
        tonality: preferences.ai_relance_tonality || 'professional'
      });
    }
  }, [preferences]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!updateAiRelanceSettings) return;
    
    await updateAiRelanceSettings({
      ai_relance_enabled: settings.enabled,
      ai_relance_delay_before_first: settings.delayBeforeFirst,
      ai_relance_max_relances: settings.maxRelances,
      ai_relance_channels_email: settings.channels.email,
      ai_relance_channels_sms: settings.channels.sms,
      ai_relance_channels_whatsapp: settings.channels.whatsapp,
      ai_relance_channels_phone: settings.channels.phone,
      ai_relance_channels_mail: settings.channels.mail,
      ai_relance_auto_mise_en_demeure: settings.autoMiseEnDemeure,
      ai_relance_prompt: settings.prompt,
      ai_relance_tonality: settings.tonality
    });
  };

  const handleTest = () => {
    // TODO: Implement test functionality
    toast({
      title: "Test en cours...",
      description: "Un test de génération de message va être effectué.",
    });
  };

  // Calcul dynamique des étapes du workflow basé sur les paramètres
  const workflowSteps = useMemo(() => {
    const allStepTypes = [
      {
        id: 'email-aimable',
        title: 'Email de relance aimable',
        description: 'Rappel courtois avec facture jointe',
        icon: '📧',
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        channels: ['email'],
        priority: 1
      },
      {
        id: 'sms-rappel',
        title: 'SMS de rappel',
        description: 'Message court avec lien de paiement',
        icon: '📱',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        channels: ['sms', 'whatsapp'],
        priority: 2
      },
      {
        id: 'email-ferme',
        title: 'Email de relance ferme',
        description: 'Ton plus direct, mention des pénalités',
        icon: '📩',
        color: 'bg-orange-50 border-orange-200 text-orange-700',
        channels: ['email'],
        priority: 3
      },
      {
        id: 'appel-vocal',
        title: 'Message vocal automatique',
        description: 'Appel avec message pré-enregistré',
        icon: '📞',
        color: 'bg-red-50 border-red-200 text-red-700',
        channels: ['phone'],
        priority: 4
      },
      {
        id: 'lrar',
        title: 'Courrier recommandé électronique',
        description: 'Relance officielle avec AR numérique',
        icon: '📮',
        color: 'bg-purple-50 border-purple-200 text-purple-700',
        channels: ['mail'],
        priority: 5
      }
    ];

    // Filtrer les étapes en fonction des canaux activés
    const activeSteps = allStepTypes.filter(step =>
      step.channels.some(channel => settings.channels[channel as keyof typeof settings.channels])
    );

    // Limiter au nombre max de relances
    const limitedSteps = activeSteps.slice(0, settings.maxRelances);

    // Calculer les jours dynamiquement
    const stepsWithDays = limitedSteps.map((step, index) => ({
      ...step,
      day: `J+${settings.delayBeforeFirst + (index * 7)}`
    }));

    // Ajouter la mise en demeure si activée
    if (settings.autoMiseEnDemeure && stepsWithDays.length > 0) {
      const lastStepDay = settings.delayBeforeFirst + ((stepsWithDays.length - 1) * 7);
      stepsWithDays.push({
        id: 'mise-demeure',
        title: 'Mise en demeure automatique',
        description: 'Génération et envoi LSE + passage en contentieux',
        icon: '⚖️',
        color: 'bg-red-100 border-red-300 text-red-800',
        channels: [],
        priority: 999,
        day: `J+${lastStepDay + 15}`
      });
    }

    return stepsWithDays;
  }, [settings.delayBeforeFirst, settings.maxRelances, settings.channels, settings.autoMiseEnDemeure]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Bot className="h-6 w-6 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuration Automatique</h2>
          <p className="text-muted-foreground text-sm">
            Paramétrez vos relances multicanales selon vos besoins
          </p>
        </div>
      </div>

      {/* Main Content - Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Paramètres Généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Settings className="h-5 w-5 mr-2" />
              Paramètres Généraux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Déclenchement automatique */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">Déclenchement automatique</Label>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                />
              </div>
               <p className="text-sm text-muted-foreground mb-2">
                 Activé dès +{settings.delayBeforeFirst} jours de retard
               </p>
            </div>

            <Separator />

            {/* Délai avant première relance */}
            <div>
              <Label className="font-medium mb-2 block">Délai avant première relance</Label>
              <select
                value={settings.delayBeforeFirst}
                onChange={(e) => handleSettingChange('delayBeforeFirst', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input bg-white rounded-md text-sm z-50 relative"
                style={{ background: 'white', zIndex: 50 }}
              >
                <option value={15}>15 jours (recommandé)</option>
                <option value={30}>30 jours (recommandé)</option>
                <option value={45}>45 jours</option>
                <option value={60}>60 jours</option>
              </select>
            </div>

            <Separator />

            {/* Nombre max de relances */}
            <div>
              <Label className="font-medium mb-2 block">Nombre max de relances</Label>
              <select
                value={settings.maxRelances}
                onChange={(e) => handleSettingChange('maxRelances', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input bg-white rounded-md text-sm z-50 relative"
                style={{ background: 'white', zIndex: 50 }}
              >
                <option value={3}>3 relances</option>
                <option value={5}>5 relances (optimal)</option>
                <option value={7}>7 relances</option>
                <option value={10}>10 relances</option>
              </select>
            </div>

            <Separator />

            {/* Canaux de communication */}
            <div>
              <Label className="font-medium mb-3 block">Canaux de communication</Label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSettingChange('channels', { ...settings.channels, email: !settings.channels.email })}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all ${
                    settings.channels.email 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-blue-600 text-base">📧</span>
                  <Label className="text-sm font-medium cursor-pointer">Email</Label>
                </button>

                <button
                  type="button"
                  onClick={() => handleSettingChange('channels', { ...settings.channels, sms: !settings.channels.sms })}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all ${
                    settings.channels.sms 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-green-600 text-base">📱</span>
                  <Label className="text-sm font-medium cursor-pointer">SMS</Label>
                </button>

                <button
                  type="button"
                  onClick={() => handleSettingChange('channels', { ...settings.channels, whatsapp: !settings.channels.whatsapp })}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all ${
                    settings.channels.whatsapp 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-green-600 text-base">💬</span>
                  <Label className="text-sm font-medium cursor-pointer">WhatsApp</Label>
                </button>

                <button
                  type="button"
                  onClick={() => handleSettingChange('channels', { ...settings.channels, phone: !settings.channels.phone })}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all ${
                    settings.channels.phone 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-red-600 text-base">📞</span>
                  <Label className="text-sm font-medium cursor-pointer">Appel vocal</Label>
                </button>

                <button
                  type="button"
                  onClick={() => handleSettingChange('channels', { ...settings.channels, mail: !settings.channels.mail })}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all ${
                    settings.channels.mail 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-purple-600 text-base">📮</span>
                  <Label className="text-sm font-medium cursor-pointer">Courrier LRE</Label>
                </button>
              </div>
            </div>

            <Separator />

            {/* Passage automatique en mise en demeure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">Passage automatique en mise en demeure</Label>
                <Switch
                  checked={settings.autoMiseEnDemeure}
                  onCheckedChange={(checked) => handleSettingChange('autoMiseEnDemeure', checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Après 5 relances infructueuses
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Aperçu du Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <Zap className="h-5 w-5 mr-2" />
              Aperçu du Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all ${step.color} ${
                    !settings.enabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{step.icon}</span>
                      <span className="font-medium text-sm">{step.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {step.day}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-80">{step.description}</p>
                  
                   <div className="mt-2">
                     <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                       ✓ Activé
                     </Badge>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder la configuration
        </Button>
        <Button variant="outline" onClick={handleTest} className="border-gray-400">
          <TestTube className="h-4 w-4 mr-2" />
          Tester le workflow
        </Button>
      </div>
    </div>
  );
};

export default RelanceIATab;