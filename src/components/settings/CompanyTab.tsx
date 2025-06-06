
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Upload } from 'lucide-react';
import { useStorage } from '@/hooks/use-storage';
import { useCompany } from '@/hooks/use-company';

const CompanyTab: React.FC = () => {
  const { uploadDocument } = useStorage();
  const { companyData, isSaving, isLoading, updateCompanyData, saveCompanyData } = useCompany();

  console.log('CompanyTab render - companyData:', companyData);
  console.log('CompanyTab render - isLoading:', isLoading);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const logoUrl = await uploadDocument(file, 'company', 'logo');
      if (logoUrl) {
        updateCompanyData({ logo_url: logoUrl });
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du logo:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Logo de l'entreprise</CardTitle>
          <CardDescription>
            Ajoutez votre logo pour l'afficher sur vos documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {companyData.logo_url ? (
                <img src={companyData.logo_url} alt="Logo" className="max-w-full max-h-full object-contain rounded-lg" />
              ) : (
                <FileText className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input 
                  type="file" 
                  id="logo" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden" 
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('logo')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir un fichier
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Formats acceptés : PNG, JPG. Taille maximale : 2 MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'entreprise</CardTitle>
          <CardDescription>
            Mettez à jour les informations de votre entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input 
                id="name" 
                value={companyData.name || ''} 
                onChange={(e) => updateCompanyData({ name: e.target.value })} 
                placeholder="Nom de votre entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={companyData.email || ''} 
                onChange={(e) => updateCompanyData({ email: e.target.value })} 
                placeholder="contact@entreprise.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input 
              id="address" 
              value={companyData.address || ''} 
              onChange={(e) => updateCompanyData({ address: e.target.value })} 
              placeholder="Adresse complète"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipcode">Code postal</Label>
              <Input 
                id="zipcode" 
                value={companyData.zipcode || ''} 
                onChange={(e) => updateCompanyData({ zipcode: e.target.value })} 
                placeholder="75000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input 
                id="city" 
                value={companyData.city || ''} 
                onChange={(e) => updateCompanyData({ city: e.target.value })} 
                placeholder="Paris"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                value={companyData.phone || ''} 
                onChange={(e) => updateCompanyData({ phone: e.target.value })} 
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siren">SIREN</Label>
              <Input 
                id="siren" 
                value={companyData.siren || ''} 
                onChange={(e) => updateCompanyData({ siren: e.target.value })} 
                placeholder="123 456 789"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input 
                id="siret" 
                value={companyData.siret || ''} 
                onChange={(e) => updateCompanyData({ siret: e.target.value })} 
                placeholder="123 456 789 00012"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tva">Numéro de TVA</Label>
              <Input 
                id="tva" 
                value={companyData.tva || ''} 
                onChange={(e) => updateCompanyData({ tva: e.target.value })} 
                placeholder="FR12345678901"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={saveCompanyData}
              disabled={isSaving}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyTab;
