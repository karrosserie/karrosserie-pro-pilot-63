
import { useState } from 'react';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

export interface VehicleFormData {
  clientId: string;
  vin: string;
  brandId: string;
  modelId: string;
  licensePlate: string;
  engineNumber: string;
  year: string;
  color: string;
  mileage: string;
  insuranceCompanyId: string;
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
}

interface UseVehicleFormLogicProps {
  defaultValues: any;
  onSubmit: (data: any) => void;
  isViewMode: boolean;
}

export function useVehicleFormLogic({ defaultValues, onSubmit, isViewMode }: UseVehicleFormLogicProps) {
  const { carBrands } = useCarBrands();
  
  // Ensure defaultValues is an object to prevent null access errors
  const safeDefaultValues = defaultValues || {};
  
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
    clientId: safeDefaultValues.client_id || '',
    vin: safeDefaultValues.vin || '',
    brandId: safeDefaultValues.brand_id || '',
    modelId: safeDefaultValues.model_id || '',
    licensePlate: safeDefaultValues.license_plate || '',
    
    // Optional fields
    engineNumber: safeDefaultValues.engine_number || '',
    year: safeDefaultValues.year?.toString() || '',
    color: safeDefaultValues.color || '',
    mileage: safeDefaultValues.mileage?.toString() || '',
    insuranceCompanyId: safeDefaultValues.insurance_company_id || '',
    insuranceExpiryDate: safeDefaultValues.insurance_expiry_date || '',
    startDate: safeDefaultValues.start_date || '',
    arrivalDate: safeDefaultValues.arrival_date || '',
    endDate: safeDefaultValues.end_date || '',
    status: safeDefaultValues.status || 'En attente',
    roadTest: safeDefaultValues.road_test || '',
    roadTestNotes: safeDefaultValues.road_test_notes || '',
    fuelLevel: safeDefaultValues.fuel_level || 50,
    preAccidentDefects: safeDefaultValues.pre_accident_defects || '',
    workItems: parseWorkItems(safeDefaultValues.work_items),
    registrationDocumentFrontUrl: safeDefaultValues.registration_document_front_url || '',
    registrationDocumentBackUrl: safeDefaultValues.registration_document_back_url || '',
    vehicleImageUrl: safeDefaultValues.vehicle_image_url || '',
    vehicleImages: parseVehicleImages(safeDefaultValues.vehicle_images)
  });

  const [regDocPreview, setRegDocPreview] = useState<string | null>(
    safeDefaultValues.registrationDocument || null
  );
  
  const [vehicleImagePreview, setVehicleImagePreview] = useState<string | null>(
    safeDefaultValues.vehicleImage || null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      // Reset model if brand changes
      if (name === 'brandId') {
        return { ...prev, [name]: value, modelId: '' };
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
    const requiredFields = ['clientId', 'vin', 'brandId', 'modelId', 'licensePlate'];
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
