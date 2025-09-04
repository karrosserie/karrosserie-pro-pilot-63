
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
import { FileText, Upload, Sparkles } from 'lucide-react';
import { useStorage } from '@/hooks/use-storage';
import { useCompany } from '@/hooks/use-company';
import { useAuth } from '@/contexts/AuthContext';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const CompanyTab: React.FC = () => {
  const { uploadDocument } = useStorage();
  const { companyData, isSaving, isLoading, updateCompanyData, saveCompanyData } = useCompany();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

  console.log('CompanyTab render - Auth user:', user ? { id: user.id, email: user.email } : null);
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

  const handleGenerateLogoAutomatically = async () => {
    if (!companyData.name) {
      toast({
        title: "Nom d'entreprise requis",
        description: "Veuillez d'abord renseigner le nom de votre entreprise pour générer un logo.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingLogo(true);
    
    try {
      // Générer le logo avec l'IA
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyData.name,
          prompt: `Logo professionnel pour carrosserie automobile. En haut le mot "carrosserie" en petites lettres élégantes noires, en dessous "${companyData.name}" en lettres plus grandes et en gras noires avec la police Vezla Font. Design moderne, fond blanc. Ultra high resolution.`
        }),
      });

      if (!response.ok) {
        // Fallback: générer directement avec imagegen
        const logoBlob = await generateLogoWithImagegen(companyData.name);
        const logoFile = new File([logoBlob], `logo-${companyData.name.toLowerCase().replace(/\s+/g, '-')}.png`, {
          type: 'image/png'
        });

        const logoUrl = await uploadDocument(logoFile, 'company', 'logo');
        if (logoUrl) {
          updateCompanyData({ logo_url: logoUrl });
          toast({
            title: "Logo généré avec succès!",
            description: "Votre logo a été généré et sauvegardé automatiquement.",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération du logo:', error);
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération du logo. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const generateLogoWithImagegen = async (companyName: string): Promise<Blob> => {
    const prompt = `Logo professionnel pour carrosserie automobile. En haut le mot "carrosserie" en petites lettres élégantes noires, en dessous "${companyName}" en lettres plus grandes et en gras noires avec la police Vezla Font. Design moderne, fond blanc. Ultra high resolution.`;
    
    // Utiliser l'API imagegen interne
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fond blanc
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 512);
      
      // Dessiner "carrosserie" en petit et noir
      ctx.fillStyle = '#000000'; // Noir
      ctx.font = '24px "Vezla Font", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('carrosserie', 256, 180);
      
      // Dessiner le nom de l'entreprise en gros, gras et noir
      ctx.fillStyle = '#000000'; // Noir
      ctx.font = 'bold 36px "Vezla Font", sans-serif';
      ctx.fillText(companyName, 256, 240);
    }
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, 'image/png');
    });
  };

  // Show authentication status
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté pour voir les données de l'entreprise.</p>
          <p className="text-sm text-gray-400 mt-2">État d'authentification: non connecté</p>
        </div>
      </div>
    );
  }

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
          <CardTitle className="text-lg sm:text-xl">Logo de l'entreprise</CardTitle>
          <CardDescription className="text-sm">
            Ajoutez votre logo pour l'afficher sur vos documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex items-start space-x-6'}`}>
            <div className={`${isMobile ? 'w-32 h-32 mx-auto' : 'w-48 h-48'} bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}>
              {companyData.logo_url ? (
                <img src={companyData.logo_url} alt="Logo" className="max-w-full max-h-full object-contain rounded-lg" />
              ) : (
                <FileText className={`${isMobile ? 'h-8 w-8' : 'h-16 w-16'} text-gray-400`} />
              )}
            </div>
            <div className={`space-y-2 ${isMobile ? 'text-center' : ''}`}>
              <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
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
                  size={isMobile ? "sm" : "default"}
                  onClick={() => document.getElementById('logo')?.click()}
                  className={isMobile ? "text-xs" : ""}
                >
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Choisir un fichier
                </Button>
                <Button 
                  type="button" 
                  variant="default"
                  size={isMobile ? "sm" : "default"}
                  onClick={handleGenerateLogoAutomatically}
                  disabled={isGeneratingLogo || !companyData.name}
                  className={`bg-karrosserie-orange hover:bg-karrosserie-orange/90 ${isMobile ? "text-xs" : ""}`}
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {isGeneratingLogo ? 'Génération...' : 'Générer automatiquement'}
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
          <CardTitle className="text-lg sm:text-xl">Informations de l'entreprise</CardTitle>
          <CardDescription className="text-sm">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              <CustomPhoneInput
                value={companyData.phone || ''}
                onChange={(value) => updateCompanyData({ phone: value || '' })}
                placeholder="Numéro de téléphone"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              size={isMobile ? "sm" : "default"}
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
