import { useState } from 'react';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

export interface VehicleFormData {
  clientId: string;
  vin: string;
  brand: string;
  model: string;
  modelId: string;
  licensePlate: string;
  engineNumber: string;
  year: string;
  color: string;
  mileage: string;
  insuranceCompany: string;
  insuranceExpiryDate: string;
  startDate: string;
  arrivalDate: string;
  endDate: string;
  status: string;
  roadTest: string;
  roadTestNotes: string;
  fuelLevel: number;
  preAccidentDefects: string;
  workItems: string[];
  registrationDocumentFrontUrl: string;
  registrationDocumentBackUrl: string;
  vehicleImageUrl: string;
  vehicleImages: string[];
  fuelType: string;
}

interface UseVehicleFormLogicProps {
  defaultValues: any;
  onSubmit: (data: any) => void;
  isViewMode: boolean;
}

export function useVehicleFormLogic({ defaultValues, onSubmit, isViewMode }: UseVehicleFormLogicProps) {
  const { carBrands } = useCarBrands();
  
  // Parse work items from database
  const parseWorkItems = (workItems: any) => {
    if (!workItems) return [''];
    if (Array.isArray(workItems)) return workItems.length > 0 ? workItems : [''];
    if (typeof workItems === 'string') {
      try {
        const parsed = JSON.parse(workItems);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
      } catch {
        return workItems.trim() !== '' ? [workItems] : [''];
      }
    }
    return [''];
  };

  // Parse vehicle images from database
  const parseVehicleImages = (vehicleImages: any) => {
    if (!vehicleImages) return [''];
    if (Array.isArray(vehicleImages)) return vehicleImages.length > 0 ? vehicleImages : [''];
    if (typeof vehicleImages === 'string') {
      try {
        const parsed = JSON.parse(vehicleImages);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
      } catch {
        return vehicleImages.trim() !== '' ? [vehicleImages] : [''];
      }
    }
    return [''];
  };

  // Get brand and model names from IDs for display
  const getBrandName = (brandId: string) => {
    const brand = carBrands.find(b => b.id === brandId);
    return brand?.name || '';
  };

  const [formData, setFormData] = useState<VehicleFormData>({
    // Required fields
    clientId: defaultValues.client_id || '',
    vin: defaultValues.vin || '',
    brand: defaultValues.car_brands?.name || getBrandName(defaultValues.brand_id || ''),
    model: defaultValues.car_models?.name || '',
    modelId: defaultValues.model_id || '',
    licensePlate: defaultValues.license_plate || '',
    
    // Optional fields
    engineNumber: defaultValues.engine_number || '',
    year: defaultValues.year?.toString() || '',
    color: defaultValues.color || '',
    mileage: defaultValues.mileage?.toString() || '',
    insuranceCompany: defaultValues.insurance_company || '',
    insuranceExpiryDate: defaultValues.insurance_expiry_date || '',
    startDate: defaultValues.start_date || '',
    arrivalDate: defaultValues.arrival_date || '',
    endDate: defaultValues.end_date || '',
    status: defaultValues.status || 'En attente',
    roadTest: defaultValues.road_test || '',
    roadTestNotes: defaultValues.road_test_notes || '',
    fuelLevel: defaultValues.fuel_level || 50,
    preAccidentDefects: defaultValues.pre_accident_defects || '',
    workItems: parseWorkItems(defaultValues.work_items),
    registrationDocumentFrontUrl: defaultValues.registration_document_front_url || '',
    registrationDocumentBackUrl: defaultValues.registration_document_back_url || '',
    vehicleImageUrl: defaultValues.vehicle_image_url || '',
    vehicleImages: parseVehicleImages(defaultValues.vehicle_images),
    fuelType: defaultValues.fuel_type || ''
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
        return { ...prev, [name]: value, model: '', modelId: '' };
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

  const handleRegistrationFrontUpload = (url: string) => {
    setFormData(prev => ({ ...prev, registrationDocumentFrontUrl: url }));
  };

  const handleRegistrationBackUpload = (url: string) => {
    setFormData(prev => ({ ...prev, registrationDocumentBackUrl: url }));
  };

  const handleVehicleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, vehicleImageUrl: url }));
  };

  const handleVehicleImagesUpdate = (images: string[]) => {
    setFormData(prev => ({ ...prev, vehicleImages: images }));
  };

  const validateRequiredFields = () => {
    const requiredFields = ['clientId', 'vin', 'brand', 'model', 'licensePlate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Les champs suivants sont obligatoires : Client, Numéro de série (VIN), Marque, Modèle, Plaque d\'immatriculation');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submit triggered with mode:', isViewMode ? 'view' : 'edit/create');
    console.log('Form data:', formData);
    
    if (!isViewMode && !validateRequiredFields()) {
      return;
    }
    
    onSubmit(formData);
  };

  return {
    formData,
    regDocPreview,
    vehicleImagePreview,
    handleInputChange,
    handleSelectChange,
    handleFileUpload,
    handleRemoveFile,
    handleFuelLevelChange,
    handleAddWorkItem,
    handleRemoveWorkItem,
    handleWorkItemChange,
    handleRegistrationFrontUpload,
    handleRegistrationBackUpload,
    handleVehicleImageUpload,
    handleVehicleImagesUpdate,
    handleSubmit
  };
}
