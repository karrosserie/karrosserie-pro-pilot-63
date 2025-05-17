
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isViewMode?: boolean;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: defaultValues?.firstName || '',
    lastName: defaultValues?.lastName || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    address: defaultValues?.address || '',
    city: defaultValues?.city || '',
    zipCode: defaultValues?.zipCode || '',
    company: defaultValues?.company || '',
    driverLicenseImage: defaultValues?.driverLicenseImage || null
  });

  const [driverLicensePreview, setDriverLicensePreview] = useState<string | null>(
    defaultValues?.driverLicenseImage || null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDriverLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setDriverLicensePreview(event.target.result as string);
          setFormData(prev => ({ ...prev, driverLicenseImage: file }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRemoveDriverLicense = () => {
    setDriverLicensePreview(null);
    setFormData(prev => ({ ...prev, driverLicenseImage: null }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="info">Informations personnelles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Société (optionnel)</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Code postal</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="driverLicense">Permis de conduire</Label>
              <div className="mt-2">
                {driverLicensePreview ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img 
                      src={driverLicensePreview} 
                      alt="Permis de conduire"
                      className="w-full h-64 object-contain bg-gray-100" 
                    />
                    {!isViewMode && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveDriverLicense}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="space-y-2 text-center">
                      <div className="flex justify-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold text-karrosserie-orange">
                          Cliquez pour importer
                        </span>{" "}
                        ou glissez-déposez
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou PDF (max. 5MB)
                      </p>
                    </div>
                    {!isViewMode && (
                      <div className="mt-4 flex space-x-2">
                        <div>
                          <input
                            id="driverLicense"
                            name="driverLicense"
                            type="file"
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={handleDriverLicenseUpload}
                            className="sr-only"
                            disabled={isViewMode}
                          />
                          <Label htmlFor="driverLicense" className="cursor-pointer">
                            <Button 
                              type="button"
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Importer un fichier
                            </Button>
                          </Label>
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Ici, vous ajouteriez la logique pour prendre une photo
                            console.log("Prendre une photo");
                          }}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Prendre une photo
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isViewMode ? "Fermer" : "Annuler"}
        </Button>
        {!isViewMode && (
          <Button type="submit" className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
            {defaultValues.id ? "Mettre à jour" : "Enregistrer"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ClientForm;
