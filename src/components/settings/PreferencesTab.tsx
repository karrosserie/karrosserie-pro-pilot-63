import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/hooks/use-company';
import { useCompanyPreferences } from '@/hooks/use-company-preferences';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DefaultInvoicePreview from '@/components/invoices/templates/DefaultInvoicePreview';
import AlternativeInvoicePreview from '@/components/invoices/templates/AlternativeInvoicePreview';

const PreferencesTab = () => {
  const { user } = useAuth();
  const { companyData } = useCompany();
  const { preferences, isLoading } = useCompanyPreferences();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [currency, setCurrency] = useState('EUR');
  const [showRepairOrderOnDocuments, setShowRepairOrderOnDocuments] = useState(false);
  const [showClientSignatureInvoices, setShowClientSignatureInvoices] = useState(true);
  const [showClientSignatureRepairOrders, setShowClientSignatureRepairOrders] = useState(true);
  const [showZeroPriceProducts, setShowZeroPriceProducts] = useState(true);
  const [useDateBasedReference, setUseDateBasedReference] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(true);
  const [setActivitiesAsHomePage, setSetActivitiesAsHomePage] = useState(true);
  const [showWarningText, setShowWarningText] = useState(true);
  const [nextRepairOrderRef, setNextRepairOrderRef] = useState('47');
  const [nextInvoiceRef, setNextInvoiceRef] = useState('8');
  const [nextCreditRef, setNextCreditRef] = useState('2');

  useEffect(() => {
    if (preferences) {
      setSelectedTemplate(preferences.invoice_template || 'default');
      setLanguage(preferences.language || 'fr');
      setTimezone(preferences.timezone || 'Europe/Paris');
      setCurrency(preferences.currency || 'EUR');
      setShowClientSignatureInvoices(preferences.show_client_signature ?? true);
      setShowZeroPriceProducts(preferences.show_zero_price_products ?? true);
    }
  }, [preferences]);

  const handleSavePreferences = async () => {
    if (!user || !companyData?.id) return;

    try {
      const updatedPreferences = {
        company_id: companyData.id,
        language: language,
        timezone: timezone,
        currency: currency,
        invoice_template: selectedTemplate,
        show_client_signature: showClientSignatureInvoices,
        show_zero_price_products: showZeroPriceProducts,
      };

      const { error } = await supabase
        .from('company_preferences')
        .upsert(updatedPreferences, { 
          onConflict: 'company_id' 
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
                <Label htmlFor="repair-order-on-documents" className="text-sm font-medium">Afficher l'ordre de réparation sur vos ordres de réparation et factures</Label>
              </div>
              <Switch
                id="repair-order-on-documents"
                checked={showRepairOrderOnDocuments}
                onCheckedChange={setShowRepairOrderOnDocuments}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="client-signature-invoices" className="text-sm font-medium">Activer les signatures des clients sur les factures</Label>
              </div>
              <Switch
                id="client-signature-invoices"
                checked={showClientSignatureInvoices}
                onCheckedChange={setShowClientSignatureInvoices}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="client-signature-repair-orders" className="text-sm font-medium">Activer les signatures des clients sur les ordres de réparation</Label>
              </div>
              <Switch
                id="client-signature-repair-orders"
                checked={showClientSignatureRepairOrders}
                onCheckedChange={setShowClientSignatureRepairOrders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="zero-price-products" className="text-sm font-medium">Afficher les produits avec un prix unitaire zéro</Label>
                <p className="text-sm text-muted-foreground">
                  (Activez cette option pour inclure des produits avec un prix unitaire de zéro sur les ordres de réparation et les factures.)
                </p>
              </div>
              <Switch
                id="zero-price-products"
                checked={showZeroPriceProducts}
                onCheckedChange={setShowZeroPriceProducts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="date-based-reference" className="text-sm font-medium">Activer le format de référence basé sur la date pour les ordres de réparation et les factures</Label>
                <p className="text-sm text-muted-foreground">
                  (Si cette option est activée, la référence inclura la date au format YYYY/MM/0000)
                </p>
              </div>
              <Switch
                id="date-based-reference"
                checked={useDateBasedReference}
                onCheckedChange={setUseDateBasedReference}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payment-details" className="text-sm font-medium">Souhaitez-vous afficher les détails des paiements effectués (liste des paiements) sur la facture ou l'avoir ?</Label>
              </div>
              <Switch
                id="payment-details"
                checked={showPaymentDetails}
                onCheckedChange={setShowPaymentDetails}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activities-homepage" className="text-sm font-medium">Définir la page d'aperçu des activités comme page d'accueil</Label>
              </div>
              <Switch
                id="activities-homepage"
                checked={setActivitiesAsHomePage}
                onCheckedChange={setSetActivitiesAsHomePage}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="warning-text" className="text-sm font-medium">Afficher le texte 'Avertissement' sur l'ordre de réparation ou la facture</Label>
                <p className="text-sm text-muted-foreground">
                  (Activez cette option pour inclure un avertissement expliquant les limites du ordre de réparation. Si vous souhaitez adopter un ton plus souple, désactivez cette option)
                </p>
              </div>
              <Switch
                id="warning-text"
                checked={showWarningText}
                onCheckedChange={setShowWarningText}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numérotation */}
      <Card>
        <CardHeader>
          <CardTitle>Numérotation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="next-repair-order-ref" className="text-sm font-medium mb-2 block">
                Référence pour le prochain ordre de réparation
              </Label>
              <Input
                id="next-repair-order-ref"
                type="number"
                value={nextRepairOrderRef}
                onChange={(e) => setNextRepairOrderRef(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                La valeur de la référence de votre prochain ordre de réparation, qui sera affiché sur votre document
              </p>
            </div>

            <div>
              <Label htmlFor="next-invoice-ref" className="text-sm font-medium mb-2 block">
                Référence pour la prochaine facture
              </Label>
              <Input
                id="next-invoice-ref"
                type="number"
                value={nextInvoiceRef}
                onChange={(e) => setNextInvoiceRef(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                La valeur de la référence de votre prochaine facture, qui sera affiché sur votre document
              </p>
            </div>

            <div>
              <Label htmlFor="next-credit-ref" className="text-sm font-medium mb-2 block">
                Référence pour le prochain avoir
              </Label>
              <Input
                id="next-credit-ref"
                type="number"
                value={nextCreditRef}
                onChange={(e) => setNextCreditRef(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                La valeur de la référence de votre prochain avoir, qui sera affiché sur votre document
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modèles de factures */}
      <Card>
        <CardHeader>
          <CardTitle>Modèle des documents</CardTitle>
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
             <div className="border rounded-lg h-[48rem] overflow-auto bg-white">
               {selectedTemplate === 'default' ? (
                 <DefaultInvoicePreview 
                   companyData={companyData}
                   invoiceData={{
                      number: "1",
                     claimNumber: "SIN-2024-12345",
                     billingDate: "15/01/2024",
                     dueDate: "15/02/2024",
                     vehicle: "Peugeot 308",
                     licensePlate: "AB-123-CD",
                     mileage: "45 320 km",
                     amountDue: "2 458,75",
                     notes: "Réparation suite à sinistre - Impact avant droit",
                     payment_details: "Paiement par virement bancaire sous 30 jours"
                   }}
                   clientData={{
                     name: "Martin Dubois",
                     address: "25 rue de la République",
                     city: "75001 Paris",
                     phone: "01 23 45 67 89",
                     email: "martin.dubois@email.com"
                   }}
                   items={[
                     {
                       ref: "REP001",
                        description: "T1",
                        quantity: 7.5,
                       discount: 0,
                       unitPrice: 450.00,
                       vat: 20,
                       totalHT: 450.00,
                       totalTTC: 540.00
                     },
                     {
                       ref: "REP002", 
                        description: "AILE AVG",
                       quantity: 1,
                       discount: 10,
                       unitPrice: 380.00,
                       vat: 20,
                       totalHT: 342.00,
                       totalTTC: 410.40
                     },
                     {
                       ref: "MO001",
                        description: "PEINTURE",
                       quantity: 8,
                       discount: 0,
                       unitPrice: 65.00,
                       vat: 20,
                       totalHT: 520.00,
                       totalTTC: 624.00
                     }
                   ]}
                   totals={{
                     subtotal: "1 312,00 €",
                     vat: "262,40 €", 
                     total: "1 574,40 €"
                   }}
                   payments={[
                     {
                       id: "1",
                       date: "2024-01-16",
                       amount: 500.00,
                       payment_method: "Virement",
                       reference: "VIR-001"
                     },
                   ]}
                    totalPaidAmount={500.00}
                    remainingAmount={1074.40}
                 />
               ) : (
                 <AlternativeInvoicePreview 
                   companyData={companyData}
                   invoiceData={{
                     number: "1",
                     date: "15/01/2024",
                     dueDate: "15/02/2024",
                     notes: "Réparation suite à sinistre - Impact avant droit",
                     payment_details: "Paiement par virement bancaire sous 30 jours"
                   }}
                   clientData={{
                     name: "Martin Dubois",
                     address: "25 rue de la République",
                     city: "75001 Paris",
                     phone: "01 23 45 67 89",
                     email: "martin.dubois@email.com",
                     licensePlate: "AB-123-CD",
                     mileage: "45 320 km",
                     vehicle: "Peugeot 308"
                   }}
                   items={[
                     {
                       ref: "REP001",
                        description: "T1",
                        quantity: 7.5,
                       discount: 0,
                       unitPrice: 450.00,
                       vat: 20,
                       totalHT: 450.00,
                       totalTTC: 540.00
                     },
                     {
                       ref: "REP002",
                       description: "AILE AVG", 
                       quantity: 1,
                       discount: 10,
                       unitPrice: 380.00,
                       vat: 20,
                       totalHT: 342.00,
                       totalTTC: 410.40
                     },
                     {
                       ref: "MO001",
                       description: "PEINTURE",
                       quantity: 8,
                       discount: 0,
                       unitPrice: 65.00,
                       vat: 20,
                       totalHT: 520.00,
                       totalTTC: 624.00
                     }
                   ]}
                   totals={{
                     totalHT: "1 312,00 €",
                     totalVAT: "262,40 €",
                     totalDiscount: "38,00 €",
                     totalTTC: "1 574,40 €"
                   }}
                   payments={[
                     {
                       id: "1",
                       date: "2024-01-16", 
                       amount: 500.00,
                       payment_method: "Virement",
                       reference: "VIR-001"
                     },
                   ]}
                    totalPaidAmount={500.00}
                    remainingAmount={1074.40}
                 />
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