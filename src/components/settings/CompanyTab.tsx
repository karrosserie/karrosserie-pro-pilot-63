
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { useCompany } from '@/hooks/use-company';
import { useToast } from '@/hooks/use-toast';

export const CompanyTab = () => {
  const { company, updateCompany } = useCompany();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: company?.name || '',
    address: company?.address || '',
    city: company?.city || '',
    postal_code: company?.postal_code || '',
    phone: company?.phone || '',
    email: company?.email || '',
    website: company?.website || '',
    siret: company?.siret || '',
    vat_number: company?.vat_number || '',
    description: company?.description || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany.mutateAsync(formData);
      toast({
        title: "Informations mises à jour",
        description: "Les informations de l'entreprise ont été sauvegardées."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'entreprise</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siret">N° SIRET</Label>
          <Input
            id="siret"
            name="siret"
            value={formData.siret}
            onChange={handleInputChange}
            placeholder="123 456 789 00012"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Adresse complète"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ville"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            placeholder="12345"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <CustomPhoneInput
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="Numéro de téléphone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="contact@entreprise.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://www.entreprise.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vat_number">N° TVA</Label>
          <Input
            id="vat_number"
            name="vat_number"
            value={formData.vat_number}
            onChange={handleInputChange}
            placeholder="FR12345678901"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description de votre entreprise..."
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateCompany.isPending}>
          {updateCompany.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};
