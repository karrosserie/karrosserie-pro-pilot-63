import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCompany } from '@/hooks/use-company';
import { formatAmount } from '@/utils/invoiceCalculations';

const PreferencesTab = () => {
  const { toast } = useToast();
  const { companyData } = useCompany();
  const [selectedTemplate, setSelectedTemplate] = useState("default");

  const handleSavePreferences = () => {
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
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
            <Select defaultValue="fr">
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
            <Select defaultValue="europe/paris">
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
            <Select defaultValue="eur">
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
            <Switch id="show-repair-order" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="client-signatures-invoices">Activer les signatures des clients sur les factures</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux clients de signer électroniquement les factures
              </p>
            </div>
            <Switch id="client-signatures-invoices" />
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
            <Switch id="show-zero-price-products" />
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
                         <div className="flex items-center justify-start mb-3" style={{maxWidth: '120px'}}>
                           <img src={companyData.logo_url} alt="Logo entreprise" className="max-w-full h-auto object-contain" />
                         </div>
                       ) : (
                         <div className="bg-orange-500 rounded-full p-2 w-fit mb-3">
                           <span className="text-white font-bold text-base">KR</span>
                         </div>
                       )}
                       <p className="text-gray-600 font-bold mb-2">{companyData.name || 'KARROSSERIE'}</p>
                       <div className="text-base text-gray-600 space-y-1">
                         <p>{companyData.address || 'Votre adresse'}</p>
                         <p>{companyData.zipcode || ''} {companyData.city || ''}</p>
                         <p>Téléphone : {companyData.phone || '+33 1 23 45 67 89'}</p>
                         <p>E-mail : {companyData.email || 'contact@karrosserie.fr'}</p>
                         <p>SIRET : {companyData.siret || '123 456 789 00123'}</p>
                         <p>N° TVA : {companyData.tva || 'FR 12 123456789'}</p>
                       </div>
                     </div>

                     {/* Colonne 2 - Détails de la facture */}
                     <div>
                       <h3 className="text-lg font-semibold mb-3 text-gray-800">Détails de la facture</h3>
                       <div className="text-base space-y-1">
                         <div className="flex justify-between">
                           <span className="font-medium">Facture</span>
                           <span>N° 1</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">N° de sinistre</span>
                           <span>SIN-2024-001</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">Date de facturation</span>
                           <span>11/07/2025</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">Date d&apos;échéance</span>
                           <span>10/08/2025</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">Véhicule</span>
                           <span>Peugeot 308</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="font-medium">Immatriculation</span>
                           <span>AB-123-CD</span>
                         </div>
                         <div className="flex justify-between">
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
                       <div className="text-base space-y-1">
                         <p className="font-medium">Jean Dupont</p>
                         <p>456 Avenue de la République</p>
                         <p>75011 Paris</p>
                         <p>Téléphone : +33 6 12 34 56 78</p>
                         <p>E-mail : jean.dupont@email.com</p>
                       </div>
                     </div>
                   </div>

                   {/* Tableau complet des articles - maintenant directement après le header */}
                   <div className="mt-6">
                     <table className="w-full text-base bg-white">
                       <thead>
                         <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
                           <th className="p-3 text-left font-medium">Article</th>
                           <th className="p-3 text-right font-medium">Quantité</th>
                           <th className="p-3 text-right font-medium">Coût Unitaire</th>
                           <th className="p-3 text-right font-medium">Remise</th>
                           <th className="p-3 text-right font-medium">TVA</th>
                           <th className="p-3 text-right font-medium">Total HT</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr>
                           <td className="p-3">Réparation pare-chocs avant</td>
                           <td className="p-3 text-right">1</td>
                           <td className="p-3 text-right">350,00 €</td>
                           <td className="p-3 text-right">0%</td>
                           <td className="p-3 text-right">20%</td>
                           <td className="p-3 text-right font-medium">350,00 €</td>
                         </tr>
                         <tr>
                           <td className="p-3">Peinture carrosserie</td>
                           <td className="p-3 text-right">1</td>
                           <td className="p-3 text-right">450,00 €</td>
                           <td className="p-3 text-right">0%</td>
                           <td className="p-3 text-right">20%</td>
                           <td className="p-3 text-right font-medium">450,00 €</td>
                         </tr>
                         <tr>
                           <td className="p-3">Pièce détachée - Feu avant gauche</td>
                           <td className="p-3 text-right">1</td>
                           <td className="p-3 text-right">125,00 €</td>
                           <td className="p-3 text-right">5%</td>
                           <td className="p-3 text-right">20%</td>
                           <td className="p-3 text-right font-medium">118,75 €</td>
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
                 // Modèle alternatif - basé sur l'image de référence
                 <div className="bg-white p-6 rounded shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                   {/* En-tête avec entreprise et FACTURE */}
                   <div className="flex justify-between items-start mb-8">
                     <div>
                       <h1 className="text-2xl font-bold text-red-600 mb-4">ZS ISTRES</h1>
                       <div className="text-sm text-gray-700 space-y-1">
                         <p><strong>ADRESSE :</strong> 75 ROUTE DE LA</p>
                         <p>CABANE NOIRE 13800 ISTRES</p>
                         <p><strong>TEL :</strong> +33646252624</p>
                         <p><strong>EMAIL :</strong> kenneforauto@gmail.com</p>
                         <p><strong>SIRET :</strong> 902 000 675955</p>
                         <p><strong>TVA :</strong> FR902 000 675</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <h2 className="text-3xl font-bold text-black mb-2">FACTURE</h2>
                       <p className="text-gray-500">2024/12/0036</p>
                     </div>
                   </div>

                   {/* Informations client */}
                   <div className="flex justify-between mb-8">
                     <div>
                       <p className="text-sm font-medium text-gray-700 mb-2">Demo user</p>
                       <div className="text-sm text-gray-600 space-y-1">
                         <p><strong>TEL :</strong> +33646464646</p>
                         <p><strong>EMAIL :</strong> demo@user.com</p>
                         <p><strong>ADRESSE :</strong> 11 rue jurany 13004</p>
                         <p>Immatricule : AZ-ER-RTY</p>
                         <p>Kilométrage : 500 Km</p>
                         <p>Véhicule : Sito Blomn</p>
                       </div>
                     </div>
                   </div>

                   {/* Dates */}
                   <div className="flex justify-center gap-8 mb-8">
                     <div className="border-2 border-black rounded px-4 py-2 text-center">
                       <div className="font-bold text-sm mb-1">DATE</div>
                       <div className="text-sm">11/12/2024</div>
                     </div>
                     <div className="border-2 border-black rounded px-4 py-2 text-center">
                       <div className="font-bold text-sm mb-1">DATE D'ECHANCE</div>
                       <div className="text-sm">11/12/2024</div>
                     </div>
                   </div>

                   {/* Tableau des articles */}
                   <table className="w-full text-sm border-collapse border-2 border-black mb-6">
                     <thead>
                       <tr className="bg-gray-100">
                         <th className="border-2 border-black p-2 text-left">Réf</th>
                         <th className="border-2 border-black p-2 text-left">Description</th>
                         <th className="border-2 border-black p-2 text-center">Quantité</th>
                         <th className="border-2 border-black p-2 text-center">Remise</th>
                         <th className="border-2 border-black p-2 text-center">Prix HT</th>
                         <th className="border-2 border-black p-2 text-center">TVA</th>
                         <th className="border-2 border-black p-2 text-center">Total HT</th>
                         <th className="border-2 border-black p-2 text-center border-r-4 border-r-black">Total TTC</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <td className="border-2 border-black p-2">T1</td>
                         <td className="border-2 border-black p-2">-</td>
                         <td className="border-2 border-black p-2 text-center">2</td>
                         <td className="border-2 border-black p-2 text-center">0%</td>
                         <td className="border-2 border-black p-2 text-center">110,00€</td>
                         <td className="border-2 border-black p-2 text-center">20%</td>
                         <td className="border-2 border-black p-2 text-center">220,00€</td>
                         <td className="border-2 border-black p-2 text-center border-r-4 border-r-black">264,00€</td>
                       </tr>
                       <tr>
                         <td className="border-2 border-black p-2">T2</td>
                         <td className="border-2 border-black p-2">-</td>
                         <td className="border-2 border-black p-2 text-center">2</td>
                         <td className="border-2 border-black p-2 text-center">0%</td>
                         <td className="border-2 border-black p-2 text-center">110,00€</td>
                         <td className="border-2 border-black p-2 text-center">20%</td>
                         <td className="border-2 border-black p-2 text-center">220,00€</td>
                         <td className="border-2 border-black p-2 text-center border-r-4 border-r-black">264,00€</td>
                       </tr>
                       <tr>
                         <td className="border-2 border-black p-2">-</td>
                         <td className="border-2 border-black p-2">GRILLE DE PARE-CHOCS AV</td>
                         <td className="border-2 border-black p-2 text-center">1</td>
                         <td className="border-2 border-black p-2 text-center">5%</td>
                         <td className="border-2 border-black p-2 text-center">95,00€</td>
                         <td className="border-2 border-black p-2 text-center">20%</td>
                         <td className="border-2 border-black p-2 text-center">90,25€</td>
                         <td className="border-2 border-black p-2 text-center border-r-4 border-r-black">108,30€</td>
                       </tr>
                       <tr>
                         <td className="border-2 border-black p-2">-</td>
                         <td className="border-2 border-black p-2">CONDENSEUR DE CLIMATISATION MOTRIO</td>
                         <td className="border-2 border-black p-2 text-center">5</td>
                         <td className="border-2 border-black p-2 text-center">0%</td>
                         <td className="border-2 border-black p-2 text-center">0,00€</td>
                         <td className="border-2 border-black p-2 text-center">20%</td>
                         <td className="border-2 border-black p-2 text-center">0,00€</td>
                         <td className="border-2 border-black p-2 text-center border-r-4 border-r-black">0,00€</td>
                       </tr>
                     </tbody>
                   </table>

                   {/* Totaux */}
                   <div className="flex justify-center">
                     <table className="border-2 border-black text-sm">
                       <tr className="bg-gray-100">
                         <td className="border-2 border-black p-2 font-bold text-center">TOTAL HT</td>
                         <td className="border-2 border-black p-2 font-bold text-center">TOTAL TVA</td>
                         <td className="border-2 border-black p-2 font-bold text-center">Total Remise</td>
                         <td className="border-2 border-black p-2 font-bold text-center border-r-4 border-r-black">Total TTC</td>
                       </tr>
                       <tr>
                         <td className="border-2 border-black p-2 text-center">530,25€</td>
                         <td className="border-2 border-black p-2 text-center">106,05€</td>
                         <td className="border-2 border-black p-2 text-center">5,30€</td>
                         <td className="border-2 border-black p-2 text-center border-r-4 border-r-black">630,00€</td>
                       </tr>
                     </table>
                   </div>

                   {/* Footer */}
                   <div className="mt-8 text-xs text-center text-gray-500">
                     <p>SARL au capital de 8 000,00 € - SIRET: 90194807700014</p>
                   </div>
                 </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePreferences}>
          Sauvegarder les préférences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesTab;