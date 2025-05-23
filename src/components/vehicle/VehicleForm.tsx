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
import { useClients } from '@/hooks/use-clients';

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
    engineNumber: defaultValues.engineNumber || '',
    color: defaultValues.color || '',
    mileage: defaultValues.mileage || '',
    fuelType: defaultValues.fuelType || '',
    clientId: defaultValues.clientId || '',
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

  const { clients } = useClients();

  // Listes des marques et modèles
  const carBrands = [
    'Audi', 'BMW', 'Citroën', 'Ford', 'Mercedes-Benz', 'Nissan', 'Opel', 
    'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Volvo', 'Autre'
  ];

  const carModels: { [key: string]: string[] } = {
    'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
    'BMW': ['Série 1', 'Série 2', 'Série 3', 'Série 4', 'Série 5', 'Série 6', 'Série 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
    'Citroën': ['C1', 'C3', 'C4', 'C5', 'C6', 'Berlingo', 'Picasso', 'Jumpy'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Mustang', 'Transit'],
    'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS'],
    'Nissan': ['Micra', 'Note', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland'],
    'Peugeot': ['108', '208', '308', '508', '2008', '3008', '5008'],
    'Renault': ['Twingo', 'Clio', 'Mégane', 'Talisman', 'Captur', 'Kadjar', 'Koleos'],
    'Toyota': ['Yaris', 'Corolla', 'Camry', 'Prius', 'RAV4', 'Highlander'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'T-Roc'],
    'Volvo': ['V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
    'Autre': ['Autre modèle']
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      // Reset model if brand changes
      if (name === 'brand') {
        return { ...prev, [name]: value, model: '' };
      }
      return { ...prev, [name]: value };
    });
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

  const fuelTypes = [
    { value: 'essence', label: 'Essence' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybride', label: 'Hybride' },
    { value: 'electrique', label: 'Électrique' },
    { value: 'gpl', label: 'GPL' }
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
              <Select 
                disabled={isViewMode} 
                value={formData.brand} 
                onValueChange={(value) => handleSelectChange('brand', value)}
              >
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Sélectionner une marque" />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Select 
                disabled={isViewMode || !formData.brand} 
                value={formData.model} 
                onValueChange={(value) => handleSelectChange('model', value)}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Sélectionner un modèle" />
                </SelectTrigger>
                <SelectContent>
                  {formData.brand && carModels[formData.brand]?.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="engineNumber">Numéro de moteur</Label>
              <Input
                id="engineNumber"
                name="engineNumber"
                value={formData.engineNumber}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuelType">Type de carburant</Label>
              <Select 
                disabled={isViewMode} 
                value={formData.fuelType} 
                onValueChange={(value) => handleSelectChange('fuelType', value)}
              >
                <SelectTrigger id="fuelType">
                  <SelectValue placeholder="Sélectionner un carburant" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map(fuel => (
                    <SelectItem key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select 
                disabled={isViewMode} 
                value={formData.clientId} 
                onValueChange={(value) => handleSelectChange('clientId', value)}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
