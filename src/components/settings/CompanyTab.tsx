
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { useCompany } from '@/hooks/use-company';

export const CompanyTab = () => {
  const { companyData, isLoading, isSaving, updateCompanyData, saveCompanyData } = useCompany();

  const handleInputChange = (field: string, value: string) => {
    updateCompanyData({ [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCompanyData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'entreprise</CardTitle>
        <CardDescription>
          Gérez les informations de votre entreprise.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input
                id="name"
                value={companyData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={companyData.siret || ''}
                onChange={(e) => handleInputChange('siret', e.target.value)}
                placeholder="Numéro SIRET"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={companyData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Adresse complète"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={companyData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Ville"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Code postal</Label>
              <Input
                id="postal_code"
                value={companyData.postal_code || ''}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="Code postal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={companyData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Pays"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <CustomPhoneInput
                value={companyData.phone || ''}
                onChange={(value) => handleInputChange('phone', value || '')}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email de l'entreprise"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyTab;
