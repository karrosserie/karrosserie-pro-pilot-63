import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import VehicleFormTabs from './form/VehicleFormTabs';

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
    clientId: defaultValues.clientId || '',
    status: defaultValues.status || 'En attente',
    registrationDocument: defaultValues.registrationDocument || null,
    vehicleImage: defaultValues.vehicleImage || null,
    insuranceCompany: defaultValues.insuranceCompany || '',
    insuranceExpiryDate: defaultValues.insuranceExpiryDate || '',
    startDate: defaultValues.startDate || '',
    arrivalDate: defaultValues.arrivalDate || '',
    endDate: defaultValues.endDate || '',
    roadTest: defaultValues.roadTest || '',
    roadTestNotes: defaultValues.roadTestNotes || '',
    fuelLevel: defaultValues.fuelLevel || 50,
    preAccidentDefects: defaultValues.preAccidentDefects || '',
    workItems: defaultValues.workItems || ['']
  });

  const [regDocPreview, setRegDocPreview] = useState<string | null>(
    defaultValues.registrationDocument || null
  );
  
  const [vehicleImagePreview, setVehicleImagePreview] = useState<string | null>(
    defaultValues.vehicleImage || null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleRemoveFile = (fileType: 'registrationDocument' | 'vehicleImage') => {
    if (fileType === 'registrationDocument') {
      setRegDocPreview(null);
    } else {
      setVehicleImagePreview(null);
    }
    setFormData(prev => ({ ...prev, [fileType]: null }));
  };

  const handleFuelLevelChange = (value: number) => {
    setFormData(prev => ({ ...prev, fuelLevel: value }));
  };

  const handleAddWorkItem = () => {
    setFormData(prev => ({
      ...prev,
      workItems: [...(prev.workItems || []), '']
    }));
  };

  const handleRemoveWorkItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workItems: prev.workItems.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleWorkItemChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      workItems: prev.workItems.map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VehicleFormTabs
        formData={formData}
        isViewMode={isViewMode}
        regDocPreview={regDocPreview}
        vehicleImagePreview={vehicleImagePreview}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        onFuelLevelChange={handleFuelLevelChange}
        onAddWorkItem={handleAddWorkItem}
        onRemoveWorkItem={handleRemoveWorkItem}
        onWorkItemChange={handleWorkItemChange}
      />
      
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
