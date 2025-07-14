import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCompany } from '@/hooks/use-company';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DefaultInvoicePreview from '@/components/invoices/templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from '@/components/invoices/templates/AlternativeInvoicePreview';

const PreferencesTab = () => {
  const { user } = useAuth();
  const { companyData } = useCompany();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [currency, setCurrency] = useState('EUR');
  const [showClientSignature, setShowClientSignature] = useState(true);
  const [showRepairOrderDetails, setShowRepairOrderDetails] = useState(true);
  const [showZeroPriceProducts, setShowZeroPriceProducts] = useState(false);

  useEffect(() => {
    if (preferences) {
      setSelectedTemplate(preferences.invoice_template || 'default');
      setLanguage(preferences.language || 'fr');
      setTimezone(preferences.timezone || 'Europe/Paris');
      setCurrency(preferences.currency || 'EUR');
      setShowClientSignature(preferences.show_client_signature ?? true);
      setShowRepairOrderDetails(preferences.show_repair_order_details ?? true);
      setShowZeroPriceProducts(preferences.show_zero_price_products ?? false);
    }
  }, [preferences]);

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      const updatedPreferences = {
        user_id: user.id,
        language: language,
        timezone: timezone,
        currency: currency,
        invoice_template: selectedTemplate,
        show_client_signature: showClientSignature,
        show_repair_order_details: showRepairOrderDetails,
        show_zero_price_products: showZeroPriceProducts,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(updatedPreferences, { 
          onConflict: 'user_id' 
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="language-select" className="text-sm font-medium mb-2 block">Langue</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone-select" className="text-sm font-medium mb-2 block">Fuseau horaire</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency-select" className="text-sm font-medium mb-2 block">Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dollar US ($)</SelectItem>
                  <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options d'affichage */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options d'affichage</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="client-signature" className="text-sm font-medium">Signature client</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher la signature du client sur les documents
                </p>
              </div>
              <Switch
                id="client-signature"
                checked={showClientSignature}
                onCheckedChange={setShowClientSignature}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="repair-order-details" className="text-sm font-medium">Détails de l'ordre de réparation</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les détails complets de l'ordre de réparation
                </p>
              </div>
              <Switch
                id="repair-order-details"
                checked={showRepairOrderDetails}
                onCheckedChange={setShowRepairOrderDetails}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="zero-price-products" className="text-sm font-medium">Produits à prix zéro</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les produits avec un prix de 0€
                </p>
              </div>
              <Switch
                id="zero-price-products"
                checked={showZeroPriceProducts}
                onCheckedChange={setShowZeroPriceProducts}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modèles de factures */}
      <Card>
        <CardHeader>
          <CardTitle>Modèles de factures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="template-select" className="text-lg font-medium mb-4 block">Choisir un modèle</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Modèle par défaut</SelectItem>
                <SelectItem value="alternative">Modèle alternatif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Aperçu du modèle sélectionné</h3>
            <div className="border rounded-lg h-96 overflow-auto bg-white">
              {selectedTemplate === 'default' ? (
                <DefaultInvoicePreview companyData={companyData} />
              ) : (
                <AlternativeInvoicePreview companyData={companyData} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePreferences} className="bg-orange-500 hover:bg-orange-600 text-white">
          Sauvegarder les préférences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesTab;