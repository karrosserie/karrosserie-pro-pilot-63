
import React, { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { companyService } from '@/services/supabase/company';
import { useStorage } from '@/hooks/use-storage';

interface CompanyData {
  name: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  phone: string;
  siren: string;
  siret: string;
  tva: string;
  logo_url?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface CompanyTabProps {
  userId: string;
  accountData: CompanyData;
  setAccountData: React.Dispatch<React.SetStateAction<CompanyData>>;
}

const CompanyTab: React.FC<CompanyTabProps> = ({ userId, accountData, setAccountData }) => {
  const { toast } = useToast();
  const { uploadDocument } = useStorage();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await companyService.updateCompanyInfo(userId, accountData);
      toast({
        title: "Données sauvegardées",
        description: "Les informations de votre entreprise ont été mises à jour.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const logoUrl = await uploadDocument(file, 'company', 'logo');
      if (logoUrl) {
        setAccountData(prev => ({ ...prev, logo_url: logoUrl }));
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du logo:', error);
    }
  };

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
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              {accountData.logo_url ? (
                <img src={accountData.logo_url} alt="Logo" className="max-w-full max-h-full object-contain rounded-lg" />
              ) : (
                <FileText className="h-8 w-8 text-gray-400" />
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
                value={accountData.name} 
                onChange={(e) => setAccountData({...accountData, name: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={accountData.email} 
                onChange={(e) => setAccountData({...accountData, email: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input 
              id="address" 
              value={accountData.address} 
              onChange={(e) => setAccountData({...accountData, address: e.target.value})} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Code postal</Label>
              <Input 
                id="zipCode" 
                value={accountData.zipCode} 
                onChange={(e) => setAccountData({...accountData, zipCode: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input 
                id="city" 
                value={accountData.city} 
                onChange={(e) => setAccountData({...accountData, city: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                value={accountData.phone} 
                onChange={(e) => setAccountData({...accountData, phone: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siren">SIREN</Label>
              <Input 
                id="siren" 
                value={accountData.siren} 
                onChange={(e) => setAccountData({...accountData, siren: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input 
                id="siret" 
                value={accountData.siret} 
                onChange={(e) => setAccountData({...accountData, siret: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tva">Numéro de TVA</Label>
              <Input 
                id="tva" 
                value={accountData.tva} 
                onChange={(e) => setAccountData({...accountData, tva: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleSave}
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
