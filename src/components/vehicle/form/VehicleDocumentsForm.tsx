
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X, Car } from 'lucide-react';

interface VehicleDocumentsFormProps {
  formData: any;
  isViewMode: boolean;
  regDocPreview: string | null;
  vehicleImagePreview: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fileType: 'registrationDocument' | 'vehicleImage') => void;
  onRemoveFile: (fileType: 'registrationDocument' | 'vehicleImage') => void;
}

const VehicleDocumentsForm: React.FC<VehicleDocumentsFormProps> = ({
  isViewMode,
  regDocPreview,
  vehicleImagePreview,
  onFileUpload,
  onRemoveFile
}) => {
  return (
    <div className="space-y-6">
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
                  onClick={() => onRemoveFile('registrationDocument')}
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
                      onChange={(e) => onFileUpload(e, 'registrationDocument')}
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
                  onClick={() => onRemoveFile('vehicleImage')}
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
                      onChange={(e) => onFileUpload(e, 'vehicleImage')}
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
  );
};

export default VehicleDocumentsForm;
