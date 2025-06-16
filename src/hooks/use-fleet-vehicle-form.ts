
import { useState, useEffect } from 'react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

export interface FleetVehicleFormData {
  vin: string;
  engine_number: string;
  brand_id: string;
  model_id: string;
  year: number;
  license_plate: string;
  color: string;
  status: string;
}

export function useFleetVehicleForm(vehicle?: FleetVehicle | null) {
  const [formData, setFormData] = useState<FleetVehicleFormData>({
    vin: '',
    engine_number: '',
    brand_id: '',
    model_id: '',
    year: new Date().getFullYear(),
    license_plate: '',
    color: '',
    status: 'Disponible'
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin || '',
        engine_number: vehicle.engine_number || '',
        brand_id: vehicle.brand_id || '',
        model_id: vehicle.model_id || '',
        year: vehicle.year || new Date().getFullYear(),
        license_plate: vehicle.license_plate || '',
        color: vehicle.color || '',
        status: vehicle.status || 'Disponible'
      });
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    console.log('handleInputChange called with:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log('handleSelectChange called with:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange
  };
}
