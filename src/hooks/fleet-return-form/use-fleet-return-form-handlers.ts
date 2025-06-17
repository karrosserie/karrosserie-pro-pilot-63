
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFleetReturns } from '@/hooks/use-fleet-returns';
import { FleetReturnFormData, ReturnDamageItem } from '@/components/fleet/FleetReturnForm.types';

export const useFleetReturnFormHandlers = (
  formData: FleetReturnFormData,
  setFormData: React.Dispatch<React.SetStateAction<FleetReturnFormData>>,
  onSubmit: (returnData: FleetReturnFormData) => void
) => {
  const { createReturn } = useFleetReturns();
  const { user } = useAuth();

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
