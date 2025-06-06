
import { useState, useEffect } from 'react';
import { Cession } from '@/services/supabase/cessions';
import { CessionFormData, CessionFormErrors } from './types';
import { useRepairOrder } from '@/hooks/use-repair-orders';
import { useClient } from '@/hooks/use-clients';
import { useClientVehicles } from '@/hooks/use-vehicles';

interface UseCessionFormLogicProps {
  cession?: Cession | null;
}

export const useCessionFormLogic = ({ cession }: UseCessionFormLogicProps) => {
  const [formData, setFormData] = useState<CessionFormData>({
    repair_order_id: null,
    bank_account_id: null,
    incident_number: '',
    incident_date: new Date().toISOString().split('T')[0],
    policy_number: '',
    report_number: '',
    expert_name: '',
    insurance_company_id: null,
    status: 'en_attente'
  });

  const [errors, setErrors] = useState<CessionFormErrors>({});
  const [validationBlocked, setValidationBlocked] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);

  // Get repair order data when one is selected
  const { order, isLoading: isLoadingOrder } = useRepairOrder(formData.repair_order_id || undefined);
  const { client, isLoading: isLoadingClient } = useClient(order?.client_id || undefined);
  const { vehicles, isLoading: isLoadingVehicles } = useClientVehicles(order?.client_id || undefined);

  // Find the specific vehicle for this repair order
  const repairOrderVehicle = vehicles?.find(v => v.id === order?.vehicle_id);

  // Determiner si c'est en lecture seule
  const isReadOnly = cession?.status === 'payee';

  useEffect(() => {
    if (cession) {
      console.log('Loading existing cession data:', cession);
      setFormData({
        repair_order_id: (cession as any).repair_order_id || null,
        bank_account_id: (cession as any).bank_account_id || null,
        incident_number: (cession as any).incident_number || '',
        incident_date: (cession as any).incident_date || new Date().toISOString().split('T')[0],
        policy_number: (cession as any).policy_number || '',
        report_number: (cession as any).report_number || '',
        expert_name: (cession as any).expert_name || '',
        insurance_company_id: (cession as any).insurance_company_id || null,
        status: (cession.status as any) || 'en_attente'
      });
    }
  }, [cession]);

  // Effect to validate repair order data when all data is loaded
  useEffect(() => {
    if (formData.repair_order_id && !isLoadingOrder && !isLoadingClient && !isLoadingVehicles) {
      console.log('Validating repair order data:', {
        order,
        client,
        repairOrderVehicle,
        vehicles: vehicles?.length
      });
      
      const validationError = validateRepairOrderData();
      if (validationError) {
        setValidationErrorMessage(validationError);
        setValidationBlocked(true);
      } else {
        // Clear any previous errors
        setValidationErrorMessage(null);
        setValidationBlocked(false);
      }
    } else if (!formData.repair_order_id) {
      // Clear errors and unblock validation when no repair order is selected
      setValidationErrorMessage(null);
      setValidationBlocked(false);
    }
  }, [formData.repair_order_id, order, client, repairOrderVehicle, isLoadingOrder, isLoadingClient, isLoadingVehicles]);

  const validateRepairOrderData = (): string | null => {
    if (!order || !client || !repairOrderVehicle) {
      console.log('Missing data:', { order: !!order, client: !!client, repairOrderVehicle: !!repairOrderVehicle });
      return "Impossible de récupérer les données de l'ordre de réparation, du client ou du véhicule.";
    }

    const missingClientFields = [];
    const missingVehicleDocuments = [];

    // Vérifier les champs obligatoires du client (sans l'email)
    if (!client.first_name) missingClientFields.push("Prénom");
    if (!client.last_name) missingClientFields.push("Nom");
    if (!client.phone) missingClientFields.push("Téléphone");
    if (!client.address) missingClientFields.push("Adresse");
    if (!client.city) missingClientFields.push("Ville");
    if (!client.postal_code) missingClientFields.push("Code postal");

    // Vérifier les photos du permis de conduire
    if (!client.driver_license_front_url) missingClientFields.push("Photo recto du permis de conduire");
    if (!client.driver_license_back_url) missingClientFields.push("Photo verso du permis de conduire");

    // Vérifier les photos du certificat d'immatriculation
    if (!repairOrderVehicle.registration_document_front_url) missingVehicleDocuments.push("Photo recto du certificat d'immatriculation");
    if (!repairOrderVehicle.registration_document_back_url) missingVehicleDocuments.push("Photo verso du certificat d'immatriculation");

    if (missingClientFields.length > 0 || missingVehicleDocuments.length > 0) {
      let errorMessage = "Des informations obligatoires sont manquantes :\n\n";
      
      if (missingClientFields.length > 0) {
        errorMessage += "Fiche client :\n";
        missingClientFields.forEach(field => {
          errorMessage += `    - ${field}\n`;
        });
      }
      
      if (missingVehicleDocuments.length > 0) {
        if (missingClientFields.length > 0) {
          errorMessage += "\n";
        }
        errorMessage += "Fiche véhicule :\n";
        missingVehicleDocuments.forEach(document => {
          errorMessage += `    - ${document}\n`;
        });
      }

      errorMessage += "\nVeuillez compléter ces informations avant de pouvoir créer une cession de créance.";
      
      return errorMessage;
    }

    return null;
  };

  const handleChange = (field: keyof CessionFormData, value: any) => {
    console.log(`Field changed: ${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    console.log('Starting form validation...');
    console.log('Current form data:', formData);
    console.log('Validation blocked:', validationBlocked);

    // Si la validation est bloquée à cause des données manquantes, empêcher la soumission
    if (validationBlocked) {
      console.log('Validation blocked due to missing data');
      return false;
    }

    const newErrors: CessionFormErrors = {};

    if (!formData.repair_order_id) {
      console.log('Missing repair_order_id');
      newErrors.repair_order_id = 'L\'ordre de réparation est obligatoire';
    }

    if (!formData.bank_account_id) {
      console.log('Missing bank_account_id');
      newErrors.bank_account_id = 'Le compte bancaire est obligatoire';
    }

    if (!formData.incident_number.trim()) {
      console.log('Missing incident_number');
      newErrors.incident_number = 'Le numéro de sinistre est obligatoire';
    }

    if (!formData.incident_date) {
      console.log('Missing incident_date');
      newErrors.incident_date = 'La date du sinistre est obligatoire';
    }

    if (!formData.policy_number.trim()) {
      console.log('Missing policy_number');
      newErrors.policy_number = 'Le numéro de police est obligatoire';
    }

    if (!formData.report_number.trim()) {
      console.log('Missing report_number');
      newErrors.report_number = 'Le numéro de rapport est obligatoire';
    }

    if (!formData.expert_name.trim()) {
      console.log('Missing expert_name');
      newErrors.expert_name = 'Le nom de l\'expert est obligatoire';
    }

    if (!formData.insurance_company_id) {
      console.log('Missing insurance_company_id');
      newErrors.insurance_company_id = 'L\'assurance est obligatoire';
    }

    console.log('Validation errors found:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    
    return isValid;
  };

  const prepareSubmitData = (): Partial<Cession> => {
    console.log('Preparing submit data...');
    const submitData = {
      repair_order_id: formData.repair_order_id,
      bank_account_id: formData.bank_account_id,
      incident_number: formData.incident_number,
      incident_date: formData.incident_date,
      policy_number: formData.policy_number,
      report_number: formData.report_number,
      expert_name: formData.expert_name,
      insurance_company_id: formData.insurance_company_id,
      status: formData.status
    } as any;
    
    console.log('Submit data prepared:', submitData);
    return submitData;
  };

  const clearValidationError = () => {
    setValidationErrorMessage(null);
  };

  return {
    formData,
    errors,
    isReadOnly,
    validationBlocked,
    validationErrorMessage,
    handleChange,
    validateForm,
    prepareSubmitData,
    clearValidationError
  };
};
