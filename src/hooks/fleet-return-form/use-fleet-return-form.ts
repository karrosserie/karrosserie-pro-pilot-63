
import { useFleetReturns, useFleetReturnByReservation } from '@/hooks/use-fleet-returns';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { FleetReturnFormData } from '@/components/fleet/FleetReturnForm.types';
import { useFleetReturnFormData } from './use-fleet-return-form-data';
import { useFleetReturnFormHandlers } from './use-fleet-return-form-handlers';
import { useFleetReturnFormNavigation } from './use-fleet-return-form-navigation';

export const useFleetReturnForm = (
  vehicle: FleetVehicle, 
  onSubmit: (returnData: FleetReturnFormData) => void, 
  reservationId: string
) => {
  const { reservation } = useFleetReservation(reservationId);
  const { fleetReturn } = useFleetReturnByReservation(reservationId);
  const { activeTab, setActiveTab } = useFleetReturnFormNavigation();
  
  const { formData, setFormData } = useFleetReturnFormData(
    vehicle, 
    reservationId, 
    reservation, 
    fleetReturn
  );
  
  const {
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
  } = useFleetReturnFormHandlers(formData, setFormData, onSubmit);

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
