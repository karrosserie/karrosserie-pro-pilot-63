
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X, Car, Calendar, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isViewMode?: boolean;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    brand: defaultValues.brand || '',
    model: defaultValues.model || '',
    year: defaultValues.year || new Date().getFullYear(),
    licensePlate: defaultValues.licensePlate || '',
    vin: defaultValues.vin || '',
    color: defaultValues.color || '',
    engineType: defaultValues.engineType || '',
    owner: defaultValues.owner || '',
    status: defaultValues.status || 'En attente',
    registrationDocument: defaultValues.registrationDocument || null,
    vehicleImage: defaultValues.vehicleImage || null
  });

  const [regDocPreview, setRegDocPreview] = useState<string | null>(
    defaultValues.registrationDocument || null
  );
  
  const [vehicleImagePreview, setVehicleImagePreview] = useState<string | null>(
    defaultValues.vehicleImage || null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'registrationDocument' | 'vehicleImage') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          if (fileType === 'registrationDocument') {
            setRegDocPreview(event.target.result as string);
          } else {
            setVehicleImagePreview(event.target.result as string);
          }
          setFormData(prev => ({ ...prev, [fileType]: file }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRemoveFile = (fileType: 'registrationDocument' | 'vehicleImage') => {
    if (fileType === 'registrationDocument') {
      setRegDocPreview(null);
    } else {
      setVehicleImagePreview(null);
    }
    setFormData(prev => ({ ...prev, [fileType]: null }));
  };

  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Diagnostic', label: 'Diagnostic' },
    { value: 'En réparation', label: 'En réparation' },
    { value: 'Terminé', label: 'Terminé' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="info">Informations du véhicule</TabsTrigger>
          <TabsTrigger value="documents">Documents & Photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vin">Numéro de série (VIN)</Label>
            <Input
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="engineType">Type de moteur</Label>
              <Input
                id="engineType"
                name="engineType"
                value={formData.engineType}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Propriétaire</Label>
              <Input
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                disabled={isViewMode} 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="registrationDocument">Certificat d'immatriculation</Label>
              <div className="mt-2">
                {regDocPreview ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img 
                      src={regDocPreview} 
                      alt="Certificat d'immatriculation"
                      className="w-full h-64 object-contain bg-gray-100" 
                    />
                    {!isViewMode && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveFile('registrationDocument')}
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
                            id="registrationDocument"
                            name="registrationDocument"
                            type="file"
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={(e) => handleFileUpload(e, 'registrationDocument')}
                            className="sr-only"
                            disabled={isViewMode}
                          />
                          <Label htmlFor="registrationDocument" className="cursor-pointer">
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

            <div>
              <Label htmlFor="vehicleImage">Photo du véhicule</Label>
              <div className="mt-2">
                {vehicleImagePreview ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img 
                      src={vehicleImagePreview} 
                      alt="Photo du véhicule"
                      className="w-full h-64 object-contain bg-gray-100" 
                    />
                    {!isViewMode && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveFile('vehicleImage')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="space-y-2 text-center">
                      <div className="flex justify-center">
                        <Car className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="text-gray-600">
                        <span className="font-semibold text-karrosserie-orange">
                          Cliquez pour importer
                        </span>{" "}
                        ou glissez-déposez
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (max. 5MB)
                      </p>
                    </div>
                    {!isViewMode && (
                      <div className="mt-4 flex space-x-2">
                        <div>
                          <input
                            id="vehicleImage"
                            name="vehicleImage"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => handleFileUpload(e, 'vehicleImage')}
                            className="sr-only"
                            disabled={isViewMode}
                          />
                          <Label htmlFor="vehicleImage" className="cursor-pointer">
                            <Button 
                              type="button"
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Importer une photo
                            </Button>
                          </Label>
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
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

export default VehicleForm;
