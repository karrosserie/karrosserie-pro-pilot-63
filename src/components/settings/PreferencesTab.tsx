import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCompany } from '@/hooks/use-company';
import { supabase } from "@/integrations/supabase/client";
import { formatAmount } from '@/utils/invoiceCalculations';

const PreferencesTab = () => {
  const { toast } = useToast();
  const { companyData } = useCompany();
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [language, setLanguage] = useState("fr");
  const [timezone, setTimezone] = useState("europe/paris");
  const [currency, setCurrency] = useState("eur");
  const [showRepairOrderDetails, setShowRepairOrderDetails] = useState(true);
  const [showClientSignature, setShowClientSignature] = useState(false);
  const [showZeroPriceProducts, setShowZeroPriceProducts] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger les préférences existantes
  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setLanguage(data.language);
        setTimezone(data.timezone);
        setCurrency(data.currency);
        setSelectedTemplate(data.invoice_template);
        setShowRepairOrderDetails(data.show_repair_order_details);
        setShowClientSignature(data.show_client_signature);
        setShowZeroPriceProducts(data.show_zero_price_products);
      }
    };

    loadPreferences();
  }, []);

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder les préférences.",
          variant: "destructive",
        });
        return;
      }

      const preferences = {
        user_id: user.id,
        language,
        timezone,
        currency,
        invoice_template: selectedTemplate,
        show_repair_order_details: showRepairOrderDetails,
        show_client_signature: showClientSignature,
        show_zero_price_products: showZeroPriceProducts,
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences, { onConflict: 'user_id' });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les préférences.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Préférences sauvegardées",
          description: "Vos préférences ont été mises à jour avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Langue et région</CardTitle>
          <CardDescription>
            Configurez la langue et les paramètres régionaux de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un fuseau horaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe/paris">Europe/Paris (GMT+1)</SelectItem>
                <SelectItem value="europe/london">Europe/London (GMT+0)</SelectItem>
                <SelectItem value="america/new_york">America/New_York (GMT-5)</SelectItem>
                <SelectItem value="asia/tokyo">Asia/Tokyo (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">Euro (€)</SelectItem>
                <SelectItem value="usd">Dollar US ($)</SelectItem>
                <SelectItem value="gbp">Livre Sterling (£)</SelectItem>
                <SelectItem value="chf">Franc Suisse (CHF)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'affichage</CardTitle>
          <CardDescription>
            Personnalisez l'apparence et le comportement de l'interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-repair-order">Afficher l'ordre de réparation sur vos ordres de réparation et factures</Label>
              <p className="text-sm text-muted-foreground">
                Inclure les détails de l'ordre de réparation sur les documents
              </p>
            </div>
            <Switch id="show-repair-order" checked={showRepairOrderDetails} onCheckedChange={setShowRepairOrderDetails} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="client-signatures-invoices">Activer les signatures des clients sur les factures</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux clients de signer électroniquement les factures
              </p>
            </div>
            <Switch id="client-signatures-invoices" checked={showClientSignature} onCheckedChange={setShowClientSignature} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="client-signatures-repair-orders">Activer les signatures des clients sur les ordres de réparation</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux clients de signer électroniquement les ordres de réparation
              </p>
            </div>
            <Switch id="client-signatures-repair-orders" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-zero-price-products">Afficher les produits avec un prix unitaire zéro</Label>
              <p className="text-sm text-muted-foreground">
                Activez cette option pour inclure des produits avec un prix unitaire de zéro sur les ordres de réparation et les factures
              </p>
            </div>
            <Switch id="show-zero-price-products" checked={showZeroPriceProducts} onCheckedChange={setShowZeroPriceProducts} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="date-based-reference">Activer le format de référence basé sur la date pour les ordres de réparation et les factures</Label>
              <p className="text-sm text-muted-foreground">
                Si cette option est activée, la référence inclura la date au format YYYY/MM/0000
              </p>
            </div>
            <Switch id="date-based-reference" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-payment-details">Souhaitez-vous afficher les détails des paiements effectués (liste des paiements) sur la facture ou l'avoir ?</Label>
              <p className="text-sm text-muted-foreground">
                Inclure la liste complète des paiements sur les documents
              </p>
            </div>
            <Switch id="show-payment-details" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activities-homepage">Définir la page d'aperçu des activités comme page d'accueil</Label>
              <p className="text-sm text-muted-foreground">
                Utiliser la page d'activités comme page d'accueil par défaut
              </p>
            </div>
            <Switch id="activities-homepage" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-warning-text">Afficher le texte 'Avertissement' sur le ordre de réparation ou la facture</Label>
              <p className="text-sm text-muted-foreground">
                Activez cette option pour inclure un avertissement expliquant les limites du ordre de réparation. Si vous souhaitez adopter un ton plus souple, désactivez cette option
              </p>
            </div>
            <Switch id="show-warning-text" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facturation</CardTitle>
          <CardDescription>
            Configurez les paramètres de facturation de votre entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoice-template">Modèle de facture</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un modèle de facture" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="default">Modèle par défaut</SelectItem>
                <SelectItem value="alternative">Modèle alternatif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aperçu du modèle de facture */}
          <div className="space-y-2">
            <Label>Aperçu du modèle</Label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-[1200px] overflow-y-auto w-full">
              {selectedTemplate === "default" ? (
                // Modèle par défaut
                 <div className="bg-white p-4 rounded shadow-sm h-full flex flex-col">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-base">
                     {/* Colonne 1 - Informations entreprise */}
                     <div>
                       <h1 className="text-2xl font-bold text-white px-3 py-1 text-center mb-3" style={{backgroundColor: 'rgba(64,67,72,255)'}}>FACTURE</h1>
                       {companyData.logo_url ? (
                         <div className="flex items-center justify-start mb-3" style={{maxWidth: '160px'}}>
                           <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
                         </div>
                       ) : (
                         <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
                           <span className="text-white font-bold text-base">KR</span>
                         </div>
                       )}
                       <p className="text-gray-600 font-bold">{companyData.name || 'KARROSSERIE'}</p>
                       <div className="text-base text-gray-600">
                         <p className="m-0">{companyData.address || 'Votre adresse'}</p>
                         <p className="m-0">{companyData.zipcode || ''} {companyData.city || ''}</p>
                         <p className="m-0">Téléphone : {companyData.phone || '+33 1 23 45 67 89'}</p>
                         <p className="m-0">E-mail : {companyData.email || 'contact@karrosserie.fr'}</p>
                         <p className="m-0">SIRET : {companyData.siret || '123 456 789 00123'}</p>
                         <p className="m-0">N° TVA : {companyData.tva || 'FR 12 123456789'}</p>
                       </div>
                     </div>

                     {/* Colonne 2 - Détails de la facture */}
                     <div>
                       <h3 className="text-lg font-semibold mb-3 text-gray-800">Détails de la facture</h3>
                       <div className="text-base">
                         <div className="flex justify-between m-0">
                           <span className="font-medium">Facture</span>
                           <span>N° 1</span>
                         </div>
                         <div className="flex justify-between m-0">
                           <span className="font-medium">N° de sinistre</span>
                           <span>SIN-2024-001</span>
                         </div>
                          <div className="flex justify-between m-0 bg-gray-100 p-2 rounded-xl">
                            <span className="font-medium">Date de facturation</span>
                            <span>11/07/2025</span>
                          </div>
                          <div className="flex justify-between m-0 bg-gray-100 p-2 rounded-xl">
                            <span className="font-medium">Date d&apos;échéance</span>
                            <span>10/08/2025</span>
                          </div>
                         <div className="flex justify-between m-0">
                           <span className="font-medium">Véhicule</span>
                           <span>Peugeot 308</span>
                         </div>
                         <div className="flex justify-between m-0">
                           <span className="font-medium">Immatriculation</span>
                           <span>AB-123-CD</span>
                         </div>
                         <div className="flex justify-between m-0">
                           <span className="font-medium">Kilométrage</span>
                           <span>85 000 km</span>
                         </div>
                       </div>
                       
                       {/* Encadré Montant dû */}
                       <div className="bg-blue-600 text-white p-2 text-center mt-3">
                         <p className="text-base mb-1">Montant dû</p>
                         <p className="text-lg font-bold">1 250,00 €</p>
                       </div>
                     </div>

                     {/* Colonne 3 - Facture pour */}
                     <div>
                       <h3 className="text-lg font-semibold mb-3 text-gray-800">Facture pour</h3>
                       <div className="text-base">
                         <p className="font-medium m-0">Jean Dupont</p>
                         <p className="m-0">456 Avenue de la République</p>
                         <p className="m-0">75011 Paris</p>
                         <p className="m-0">Téléphone : +33 6 12 34 56 78</p>
                         <p className="m-0">E-mail : jean.dupont@email.com</p>
                       </div>
                     </div>
                   </div>

                   {/* Tableau complet des articles - maintenant directement après le header */}
                   <div className="mt-6">
                       <table className="w-full text-base bg-white rounded-xl overflow-hidden border-2 border-black">
                         <thead>
                            <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
                              <th className="p-3 text-left font-medium border-r-2 border-white">Article</th>
                              <th className="p-3 text-right font-medium border-r-2 border-white">Quantité</th>
                              <th className="p-3 text-right font-medium border-r-2 border-white">Coût Unitaire</th>
                              <th className="p-3 text-right font-medium border-r-2 border-white">Remise</th>
                              <th className="p-3 text-right font-medium border-r-2 border-white">TVA</th>
                              <th className="p-3 text-right font-medium">Total HT</th>
                           </tr>
                        </thead>
                        <tbody>
                          <tr>
                             <td className="p-3 border-2 border-r-2 border-white">Réparation pare-chocs avant</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">1</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">350,00 €</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">0%</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">20%</td>
                             <td className="p-3 text-right font-medium border-2 border-white">350,00 €</td>
                           </tr>
                           <tr>
                             <td className="p-3 border-2 border-r-2 border-white">Peinture carrosserie</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">1</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">450,00 €</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">0%</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">20%</td>
                             <td className="p-3 text-right font-medium border-2 border-white">450,00 €</td>
                           </tr>
                           <tr>
                             <td className="p-3 border-2 border-r-2 border-white">Pièce détachée - Feu avant gauche</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">1</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">125,00 €</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">5%</td>
                             <td className="p-3 text-right border-2 border-r-2 border-white">20%</td>
                             <td className="p-3 text-right font-medium border-2 border-white">118,75 €</td>
                          </tr>
                        </tbody>
                     </table>
                     
                     {/* Totaux */}
                     <div className="mt-4 flex justify-end">
                       <div className="w-56">
                         <div className="space-y-1 text-base">
                           <div className="flex justify-between font-bold">
                             <span>Sous-total</span>
                             <span>918,75 €</span>
                           </div>
                           <div className="flex justify-between">
                             <span>TVA</span>
                             <span>183,75 €</span>
                           </div>
                           <div className="flex justify-between font-bold text-lg bg-blue-600 text-white p-2">
                             <span>TOTAL</span>
                             <span>1 102,50 €</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Footer fixe en bas - toujours visible */}
                   <div className="mt-auto pt-4 border-t text-[10px] text-gray-500 text-center">
                     <p>
                       {companyData.name || 'AUTO PAINT'} - {companyData.address || '25 rue sainte victoire'} {companyData.zipcode || '13006'} {companyData.city || 'MARSEILLE'} - 
                       SIRET {companyData.siret || '12345678900010'} - N° TVA : {companyData.tva || 'FR123456789'} - 
                       Tel : {companyData.phone || '+330646465242'} - Email : {companyData.email || 'autopaint@yopmail.com'}
                     </p>
                   </div>
                 </div>
              ) : (
                // Modèle alternatif
                <div className="bg-white p-4 rounded shadow-sm h-full flex flex-col">
                  {/* Header avec nom d'entreprise et FACTURE */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-red-600 mb-2">{companyData.name || "Z's ISTRES"}</h1>
                      <div className="text-sm space-y-0">
                        <p className="m-0">{companyData.address || '75 ROUTE DE LA'}</p>
                        <p className="m-0">{companyData.zipcode || '13800'} {companyData.city || 'ISTRES'}</p>
                        <p className="m-0">Téléphone : {companyData.phone || '+33646252624'}</p>
                        <p className="m-0">E-mail : {companyData.email || 'kenneford@mail.com'}</p>
                        <p className="m-0">SIRET : {companyData.siret || '902 000 675955'}</p>
                        <p className="m-0">N° TVA : {companyData.tva || 'FR902 000 675'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-3xl font-bold text-black mb-1">FACTURE N° 5</h1>
                      
                      {/* Informations client */}
                      <div className="mb-6">
                        <p className="font-bold">Demo user</p>
                        <div className="text-sm space-y-0">
                          <p className="m-0">11 rue juramy</p>
                          <p className="m-0">13004 MARSEILLE</p>
                          <p className="m-0">Téléphone : +33646464646</p>
                          <p className="m-0">E-mail : demo@demo.com</p>
                          <p className="m-0">Véhicule : Slio Biomm</p>
                          <p className="m-0">Immatriculation : AZ-ER-RTY</p>
                          <p className="m-0">Kilométrage : 500 Km</p>
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Dates encadrées */}
                   <div className="flex justify-center gap-8 mb-6">
                     <div className="border-2 border-black px-6 py-2 text-center rounded-xl">
                       <p className="font-bold text-sm">DATE</p>
                       <p className="text-sm">11/12/2024</p>
                     </div>
                     <div className="border-2 border-black px-6 py-2 text-center rounded-xl">
                       <p className="font-bold text-sm">DATE D'ÉCHÉANCE</p>
                       <p className="text-sm">11/12/2024</p>
                     </div>
                   </div>

                   {/* Tableau */}
                   <div className="mb-6 flex-1">
                     <table className="w-full bg-white border-2 border-black text-sm rounded-xl overflow-hidden">
                       <thead>
                         <tr>
                           <th className="border-2 border-black p-2 text-left font-bold border-r">Réf</th>
                           <th className="border-2 border-black p-2 text-left font-bold border-r">Description</th>
                           <th className="border-2 border-black p-2 text-center font-bold border-r">Quantité</th>
                           <th className="border-2 border-black p-2 text-center font-bold border-r">Remise</th>
                           <th className="border-2 border-black p-2 text-center font-bold border-r">Prix HT</th>
                           <th className="border-2 border-black p-2 text-center font-bold border-r">TVA</th>
                           <th className="border-2 border-black p-2 text-center font-bold border-r">Total HT</th>
                           <th className="border-2 border-black p-2 text-center font-bold">Total TTC</th>
                         </tr>
                      </thead>
                       <tbody>
                         <tr>
                            <td className="p-2 border-2 border-r border-black">T1</td>
                            <td className="p-2 border-2 border-r border-black">Réparation pare-chocs</td>
                            <td className="p-2 text-center border-2 border-r border-black">2</td>
                            <td className="p-2 text-center border-2 border-r border-black">0%</td>
                            <td className="p-2 text-center font-bold border-2 border-r border-black">110,00€</td>
                            <td className="p-2 text-center border-2 border-r border-black">20%</td>
                            <td className="p-2 text-center border-2 border-r border-black">220,00€</td>
                             <td className="p-2 text-center border-2 border-black">264,00€</td>
                           </tr>
                           <tr>
                             <td className="p-2 border-2 border-r border-black">T2</td>
                             <td className="p-2 border-2 border-r border-black">Peinture</td>
                             <td className="p-2 text-center border-2 border-r border-black">2</td>
                             <td className="p-2 text-center border-2 border-r border-black">0%</td>
                             <td className="p-2 text-center font-bold border-2 border-r border-black">110,00€</td>
                             <td className="p-2 text-center border-2 border-r border-black">20%</td>
                             <td className="p-2 text-center border-2 border-r border-black">220,00€</td>
                             <td className="p-2 text-center border-2 border-black">264,00€</td>
                           </tr>
                           <tr>
                             <td className="p-2 border-2 border-r border-black">-</td>
                             <td className="p-2 border-2 border-r border-black">GRILLE DE PARE-CHOCS AV</td>
                             <td className="p-2 text-center border-2 border-r border-black">1</td>
                             <td className="p-2 text-center border-2 border-r border-black">5%</td>
                             <td className="p-2 text-center font-bold border-2 border-r border-black">95,00€</td>
                             <td className="p-2 text-center border-2 border-r border-black">20%</td>
                             <td className="p-2 text-center border-2 border-r border-black">90,25€</td>
                             <td className="p-2 text-center border-2 border-black">108,30€</td>
                           </tr>
                           <tr>
                             <td className="p-2 border-2 border-r border-black">-</td>
                             <td className="p-2 border-2 border-r border-black">CONDENSEUR DE CLIMATISATION MOTRIO</td>
                             <td className="p-2 text-center border-2 border-r border-black">5</td>
                             <td className="p-2 text-center border-2 border-r border-black">0%</td>
                             <td className="p-2 text-center font-bold border-2 border-r border-black">0,00€</td>
                             <td className="p-2 text-center border-2 border-r border-black">20%</td>
                             <td className="p-2 text-center border-2 border-r border-black">0,00€</td>
                             <td className="p-2 text-center border-2 border-black">0,00€</td>
                         </tr>
                       </tbody>
                    </table>
                  </div>

                  {/* Totaux */}
                  <div className="flex justify-center">
                    <table className="border-2 border-black text-sm rounded-xl overflow-hidden">
                      <tbody>
                         <tr>
                           <td className="p-2 bg-gray-100 font-bold border-r border-black">TOTAL HT</td>
                           <td className="p-2 bg-gray-100 font-bold border-r border-black">TOTAL TVA</td>
                           <td className="p-2 bg-gray-100 font-bold border-r border-black">Total Remise</td>
                           <td className="p-2 bg-gray-100 font-bold">Total TTC</td>
                         </tr>
                         <tr>
                           <td className="p-2 text-center border-r border-black">530,25€</td>
                           <td className="p-2 text-center border-r border-black">106,05€</td>
                           <td className="p-2 text-center border-r border-black">4,75€</td>
                           <td className="p-2 text-center font-bold">636,30€</td>
                         </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t text-xs text-blue-500 text-center">
                    <p>SARL au capital de 9 000,00 - SIRET 90140277700014</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSavePreferences} 
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading ? "Sauvegarde..." : "Sauvegarder les préférences"}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesTab;