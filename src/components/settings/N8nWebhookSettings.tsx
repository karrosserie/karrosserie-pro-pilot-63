import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { Webhook, TestTube, ExternalLink, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const N8nWebhookSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();
  const { companyInfo } = useCompany();

  // Charger l'URL du webhook actuelle
  useEffect(() => {
    const loadWebhookUrl = async () => {
      if (!companyInfo?.id) return;

      try {
        const { data, error } = await supabase
          .from('company_preferences')
          .select('n8n_webhook_url')
          .eq('company_id', companyInfo.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors du chargement du webhook:', error);
          return;
        }

        if (data?.n8n_webhook_url) {
          setWebhookUrl(data.n8n_webhook_url);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    };

    loadWebhookUrl();
  }, [companyInfo?.id]);

  // Sauvegarder l'URL du webhook
  const handleSave = async () => {
    if (!companyInfo?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de l'entreprise",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier si les préférences existent déjà
      const { data: existing, error: checkError } = await supabase
        .from('company_preferences')
        .select('id')
        .eq('company_id', companyInfo.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        // Mettre à jour les préférences existantes
        const { error } = await supabase
          .from('company_preferences')
          .update({ n8n_webhook_url: webhookUrl || null })
          .eq('company_id', companyInfo.id);

        if (error) throw error;
      } else {
        // Créer de nouvelles préférences
        const { error } = await supabase
          .from('company_preferences')
          .insert({
            company_id: companyInfo.id,
            n8n_webhook_url: webhookUrl || null
          });

        if (error) throw error;
      }

      toast({
        title: "Configuration sauvegardée",
        description: "L'URL du webhook N8N a été mise à jour avec succès",
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration du webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Tester le webhook
  const handleTest = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL manquante",
        description: "Veuillez d'abord saisir une URL de webhook",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      const testPayload = {
        timestamp: new Date().toISOString(),
        event_type: 'test_webhook',
        test: true,
        message: 'Test de connexion depuis l\'interface des paramètres'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testPayload)
      });

      toast({
        title: "Test envoyé",
        description: "Le test a été envoyé à N8N. Vérifiez votre workflow pour confirmer la réception.",
      });

    } catch (error) {
      console.error('Erreur lors du test:', error);
      toast({
        title: "Erreur de test",
        description: "Impossible d'envoyer le test au webhook N8N",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Configuration Webhook N8N
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL du Webhook N8N</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            L'URL du webhook N8N qui sera appelée quand un employé démarre une tâche.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Données envoyées au webhook :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Informations de la tâche</strong> : type, heure de début, employé</li>
            <li>• <strong>Informations du véhicule</strong> : plaque, marque, modèle</li>
            <li>• <strong>Informations du client</strong> : nom, prénom, email, téléphone</li>
            <li>• <strong>Rapport d'expertise</strong> : détails complets si disponible</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={isTesting || !webhookUrl.trim()}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {isTesting ? 'Test en cours...' : 'Tester le webhook'}
          </Button>
        </div>

        {webhookUrl && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Webhook configuré</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a 
                  href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Documentation N8N
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default N8nWebhookSettings;