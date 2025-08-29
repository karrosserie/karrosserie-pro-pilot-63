import React, { useState } from 'react';
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

const RelanceIATab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    enabled: false,
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 150,
    prompt: 'Rédigez une relance de paiement professionnelle et courtoise pour la facture {facture_ref} d\'un montant de {montant}€ échue depuis {jours_retard} jours pour le client {nom_client}.',
    autoSend: false,
    delayBeforeSend: 24,
    tonality: 'professional'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de l'IA ont été mis à jour avec succès.",
    });
  };

  const handleTest = () => {
    // TODO: Implement test functionality
    toast({
      title: "Test en cours...",
      description: "Un test de génération de message va être effectué.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Relance IA</h2>
          <p className="text-muted-foreground">
            Configurez l'intelligence artificielle pour générer automatiquement vos messages de relance
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Bot className="h-3 w-3 mr-1" />
          Beta
        </Badge>
      </div>

      {/* Status Card */}
      <Card className={`border-2 ${settings.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.enabled ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <h3 className="font-medium text-foreground">
                  {settings.enabled ? 'IA activée' : 'IA désactivée'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.enabled 
                    ? 'L\'IA génère automatiquement les messages de relance'
                    : 'Activez l\'IA pour générer automatiquement les messages'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configuration API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Clé API OpenAI</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={settings.apiKey}
                onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Votre clé API sera chiffrée et stockée en sécurité
              </p>
            </div>

            <div>
              <Label htmlFor="model">Modèle IA</Label>
              <select
                id="model"
                value={settings.model}
                onChange={(e) => handleSettingChange('model', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Rapide)</option>
                <option value="gpt-4o">GPT-4o (Performant)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Économique)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="temperature">Créativité</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxTokens">Longueur max</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="50"
                  max="500"
                  value={settings.maxTokens}
                  onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Configuration Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tonality">Tonalité</Label>
              <select
                id="tonality"
                value={settings.tonality}
                onChange={(e) => handleSettingChange('tonality', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="professional">Professionnel</option>
                <option value="friendly">Amical</option>
                <option value="formal">Formel</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Envoi automatique</Label>
                <p className="text-xs text-muted-foreground">
                  Envoyer automatiquement les messages générés
                </p>
              </div>
              <Switch
                checked={settings.autoSend}
                onCheckedChange={(checked) => handleSettingChange('autoSend', checked)}
              />
            </div>

            {settings.autoSend && (
              <div>
                <Label htmlFor="delayBeforeSend">Délai avant envoi (heures)</Label>
                <Input
                  id="delayBeforeSend"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.delayBeforeSend}
                  onChange={(e) => handleSettingChange('delayBeforeSend', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prompt Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Modèle de prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="prompt">Prompt personnalisé</Label>
            <Textarea
              id="prompt"
              rows={4}
              value={settings.prompt}
              onChange={(e) => handleSettingChange('prompt', e.target.value)}
              className="mt-1"
              placeholder="Définissez le style et le contenu des messages générés par l'IA..."
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {'{facture_ref}'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {'{montant}'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {'{jours_retard}'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {'{nom_client}'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Utilisez les variables ci-dessus pour personnaliser vos messages
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Statistiques d'utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground">Messages générés</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground">Messages envoyés</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">0€</div>
              <div className="text-xs text-muted-foreground">Coût API ce mois</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">0%</div>
              <div className="text-xs text-muted-foreground">Taux de réponse</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder les paramètres
        </Button>
        <Button variant="outline" onClick={handleTest}>
          <TestTube className="h-4 w-4 mr-2" />
          Tester la génération
        </Button>
      </div>

      {/* Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Comment ça fonctionne ?</p>
              <p className="text-blue-700">
                L'IA analyse automatiquement vos factures impayées et génère des messages de relance personnalisés 
                selon le nombre de jours de retard, le montant et l'historique client. Les messages sont créés 
                dans le style que vous définissez et peuvent être envoyés automatiquement ou après validation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelanceIATab;