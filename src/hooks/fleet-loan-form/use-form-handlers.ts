
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { useClients } from '@/hooks/use-clients';
import { DamageItem, LoanFormData } from '@/components/fleet/FleetLoanForm';
import { prepareReservationData } from './utils';
import { FleetLoanFormState } from './types';

export const useFleetLoanFormHandlers = (
  state: FleetLoanFormState,
  onSubmit: (loanData: LoanFormData) => void,
  defaultValues?: any
) => {
  const { createReservation, updateReservation } = useFleetReservations();
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const { clients } = useClients();
  const { formData, setFormData } = state;
  
  // Determine if we're editing an existing reservation
  const isEditing = Boolean(defaultValues?.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
    
    // Si c'est un ID temporaire (nom libre saisi), extraire le nom
    if (clientId.startsWith('temp_')) {
      // Le nom libre est dans le SearchableSelect, on le récupère depuis l'input
      return;
    }
    
    // Find the selected client and populate license information if available
    const selectedClient = clients?.find(client => client.id === clientId);
    if (selectedClient) {
      setFormData(prev => ({ 
        ...prev, 
        clientId,
        // Pre-fill license information from client data
        licenseNumber: selectedClient.license_number || prev.licenseNumber,
        licenseIssueDate: selectedClient.license_issue_date || prev.licenseIssueDate,
        prefecture: selectedClient.prefecture || prev.prefecture,
        dateOfBirth: selectedClient.date_of_birth || prev.dateOfBirth,
        placeOfBirth: selectedClient.place_of_birth || prev.placeOfBirth,
        // Pre-fill driver license URLs if available
        driverLicenseFrontUrl: selectedClient.driver_license_front_url || prev.driverLicenseFrontUrl,
        driverLicenseBackUrl: selectedClient.driver_license_back_url || prev.driverLicenseBackUrl,
        // Pre-fill basic client information
        clientName: `${selectedClient.first_name} ${selectedClient.last_name}`,
        clientPhone: selectedClient.phone || prev.clientPhone,
        clientEmail: selectedClient.email || prev.clientEmail,
        // Set holder info based on client name
        holderInfo: `${selectedClient.first_name} ${selectedClient.last_name}`
      }));
    }
    
    // Also update the client data in the parent component
    state.setFormData(prev => ({ ...prev, clientId }));
  };

  const handleFreeTextClientChange = (text: string) => {
    setFormData(prev => ({ 
      ...prev, 
      clientName: text,
      holderInfo: text
    }));
  };

  const handleMileageChange = (mileage: number) => {
    setFormData(prev => ({ ...prev, mileage }));
  };

  const handleFuelLevelChange = (fuelLevel: number) => {
    setFormData(prev => ({ ...prev, fuelLevel }));
  };

  const handleImageAdd = (url: string) => {
    console.log('useFleetLoanForm - Adding image:', url);
    console.log('Current vehicleImages:', formData.vehicleImages);
    
    setFormData(prev => {
      const newImages = [...prev.vehicleImages, url];
      console.log('New vehicleImages after add:', newImages);
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
  };

  const handleImageRemove = (index: number) => {
    console.log('useFleetLoanForm - Removing image at index:', index);
    setFormData(prev => {
      const newImages = prev.vehicleImages.filter((_, i) => i !== index);
      console.log('New vehicleImages after remove:', newImages);
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
  };

  const handleImageUpdate = (index: number, url: string) => {
    console.log('useFleetLoanForm - Updating image at index:', index, 'with url:', url);
    setFormData(prev => {
      const newImages = [...prev.vehicleImages];
      newImages[index] = url;
      console.log('New vehicleImages after update:', newImages);
      return {
        ...prev,
        vehicleImages: newImages
      };
    });
  };

  const handleDamageUpdate = (damages: DamageItem[]) => {
    setFormData(prev => ({ ...prev, damages }));
  };

  const handleDriverLicenseFrontUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseFrontUrl: url }));
  };

  const handleDriverLicenseBackUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseBackUrl: url }));
  };

  const handleLicenseAnalyzed = (analyzedData: any) => {
    // Update form data with analyzed information
    if (analyzedData.numero_permis) {
      setFormData(prev => ({ ...prev, licenseNumber: analyzedData.numero_permis }));
    }
    if (analyzedData.date_delivrance) {
      setFormData(prev => ({ ...prev, licenseIssueDate: analyzedData.date_delivrance }));
    }
    if (analyzedData.prefecture) {
      setFormData(prev => ({ ...prev, prefecture: analyzedData.prefecture }));
    }
    if (analyzedData.date_naissance) {
      setFormData(prev => ({ ...prev, dateOfBirth: analyzedData.date_naissance }));
    }
    if (analyzedData.lieu_naissance) {
      setFormData(prev => ({ ...prev, placeOfBirth: analyzedData.lieu_naissance }));
    }
  };

  const handleInsuranceSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, clientInsurance: checked }));
  };

  const handleInsurancePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, insurancePhone: value || '' }));
  };

  const handleSignatureChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    try {
      // Prepare data for database with proper JSON conversion
      const reservationData = await prepareReservationData(formData, formData.vehicleId, companyId!);

      if (isEditing && defaultValues?.id) {
        // Update existing reservation - toast is handled by the mutation
        await updateReservation.mutateAsync({
          id: defaultValues.id,
          data: reservationData
        });
      } else {
        // Create new reservation - toast is handled by the mutation
        await createReservation.mutateAsync(reservationData);
      }
      
      // Call the onSubmit callback without any additional toast
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving reservation:', error);
      // Error toasts are already handled by the mutations
    }
  };

  return {
    createReservation: isEditing ? updateReservation : createReservation,
    handleInputChange,
    handleClientSelect,
    handleFreeTextClientChange,
    handleMileageChange,
    handleFuelLevelChange,
    handleImageAdd,
    handleImageRemove,
    handleImageUpdate,
    handleDamageUpdate,
    handleDriverLicenseFrontUpload,
    handleDriverLicenseBackUpload,
    handleLicenseAnalyzed,
    handleInsuranceSwitchChange,
    handleInsurancePhoneChange,
    handleSignatureChange,
    handleSubmit
  };
};
