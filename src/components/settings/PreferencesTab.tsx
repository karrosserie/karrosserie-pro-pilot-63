import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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

  useEffect(() => {
    if (preferences?.invoice_template) {
      setSelectedTemplate(preferences.invoice_template);
    }
  }, [preferences]);

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      const updatedPreferences = {
        user_id: user.id,
        language: preferences?.language || 'fr',
        timezone: preferences?.timezone || 'Europe/Paris',
        currency: preferences?.currency || 'EUR',
        invoice_template: selectedTemplate,
        show_client_signature: preferences?.show_client_signature ?? true,
        show_repair_order_details: preferences?.show_repair_order_details ?? true,
        show_zero_price_products: preferences?.show_zero_price_products ?? false,
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
            <div className="border rounded-lg h-96 overflow-auto bg-gray-50">
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