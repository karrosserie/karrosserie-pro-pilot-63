import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PreferencesTab = () => {
  const { toast } = useToast();

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
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un modèle de facture" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="default">Modèle par défaut</SelectItem>
                <SelectItem value="alternative">Modèle alternatif</SelectItem>
              </SelectContent>
            </Select>
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