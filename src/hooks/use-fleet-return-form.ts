
import { useState, useEffect } from 'react';
import { useFleetReturns, useFleetReturnByReservation } from '@/hooks/use-fleet-returns';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';
import { useAuth } from '@/contexts/AuthContext';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { FleetReturnFormData, ReturnDamageItem } from '@/components/fleet/FleetReturnForm.types';

export const useFleetReturnForm = (
  vehicle: FleetVehicle, 
  onSubmit: (returnData: FleetReturnFormData) => void, 
  reservationId: string
) => {
  const [activeTab, setActiveTab] = useState('damages');
  const { createReturn } = useFleetReturns();
  const { reservation } = useFleetReservation(reservationId);
  const { fleetReturn } = useFleetReturnByReservation(reservationId);
  const { user } = useAuth();
  
  // Helper function to get current date/time for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const [formData, setFormData] = useState<FleetReturnFormData>({
    reservationId,
    vehicleId: vehicle.id,
    clientId: '',
    returnDate: getCurrentDateTime(),
    returnMileage: vehicle.mileage || 0,
    fuelLevelReturn: 100,
    vehicleImages: [],
    damages: [],
    notes: '',
    attestationAccepted: false,
    clientSignature: '',
    clientName: ''
  });

  // Helper function to safely parse damages from reservation
  const parseDamagesFromReservation = (damages: any): ReturnDamageItem[] => {
    if (!damages) return [];
    
    // If damages is already an array of the correct type
    if (Array.isArray(damages)) {
      return damages.filter(item => 
        item && 
        typeof item === 'object' && 
        'id' in item && 
        'name' in item && 
        'type' in item
      ) as ReturnDamageItem[];
    }
    
    return [];
  };

  // Helper function to safely convert JSON to string array
  const jsonToStringArray = (json: any): string[] => {
    if (!json) return [];
    if (Array.isArray(json)) {
      return json.filter(item => typeof item === 'string') as string[];
    }
    return [];
  };

  // Update form data when reservation data is loaded
  useEffect(() => {
    if (reservation) {
      setFormData(prev => ({
        ...prev,
        clientId: reservation.client_id || '',
        clientName: reservation.clients ? `${reservation.clients.first_name} ${reservation.clients.last_name}` : '',
        damages: parseDamagesFromReservation(reservation.damages),
        returnMileage: reservation.start_mileage || vehicle.mileage || 0
      }));
    }
  }, [reservation, vehicle.mileage]);

  // Update form data when fleet return data is loaded (for viewing existing returns)
  useEffect(() => {
    if (fleetReturn && reservation) {
      setFormData(prev => ({
        ...prev,
        clientId: reservation.client_id || '',
        clientName: reservation.clients ? `${reservation.clients.first_name} ${reservation.clients.last_name}` : '',
        returnDate: fleetReturn.return_date || getCurrentDateTime(),
        returnMileage: fleetReturn.return_mileage || 0,
        fuelLevelReturn: fleetReturn.fuel_level_return || 100,
        vehicleImages: jsonToStringArray(fleetReturn.vehicle_images),
        damages: parseDamagesFromReservation(fleetReturn.damages),
        notes: fleetReturn.notes || '',
        attestationAccepted: fleetReturn.attestation_accepted || false,
        clientSignature: fleetReturn.client_signature || '',
      }));
    }
  }, [fleetReturn, reservation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
  };

  const handleMileageChange = (mileage: number) => {
    setFormData(prev => ({ ...prev, returnMileage: mileage }));
  };

  const handleFuelLevelChange = (fuelLevel: number) => {
    setFormData(prev => ({ ...prev, fuelLevelReturn: fuelLevel }));
  };

  const handleImageAdd = (url: string) => {
    console.log('useFleetReturnForm - Adding image:', url);
    setFormData(prev => ({
      ...prev,
      vehicleImages: [...prev.vehicleImages, url]
    }));
  };

  const handleImageRemove = (index: number) => {
    console.log('useFleetReturnForm - Removing image at index:', index);
    setFormData(prev => ({
      ...prev,
      vehicleImages: prev.vehicleImages.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpdate = (index: number, url: string) => {
    console.log('useFleetReturnForm - Updating image at index:', index, 'with url:', url);
    setFormData(prev => {
      const newImages = [...prev.vehicleImages];
      newImages[index] = url;
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
  };

  const handleDamageUpdate = (damages: ReturnDamageItem[]) => {
    setFormData(prev => ({ ...prev, damages }));
  };

  const handleSignatureChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      console.log('Submitting fleet return form with data:', formData);
      
      // Prepare data for database
      const returnData = {
        fleet_reservation_id: formData.reservationId,
        fleet_vehicle_id: formData.vehicleId,
        client_id: formData.clientId,
        user_id: user.id,
        return_date: formData.returnDate,
        return_mileage: formData.returnMileage,
        fuel_level_return: formData.fuelLevelReturn,
        notes: formData.notes || '',
        status: 'completed' as const,
        // Attestation
        attestation_accepted: formData.attestationAccepted,
        client_signature: formData.clientSignature,
        client_name: formData.clientName,
        // Convert arrays to JSON format for database storage
        vehicle_images: formData.vehicleImages as any,
        damages: formData.damages as any
      };

      console.log('Prepared return data for database:', returnData);
      
      const result = await createReturn.mutateAsync(returnData);
      console.log('Fleet return created successfully:', result);
      
      // Call the parent onSubmit callback
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving fleet return:', error);
    }
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    reservation,
    fleetReturn,
    createReturn,
    handleInputChange,
    handleClientSelect,
    handleMileageChange,
    handleFuelLevelChange,
    handleImageAdd,
    handleImageRemove,
    handleImageUpdate,
    handleDamageUpdate,
    handleSignatureChange,
    handleSubmit
  };
};
