
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

  // Get repair order data when one is selected
  const { order } = useRepairOrder(formData.repair_order_id || undefined);
  const { client } = useClient(order?.client_id || undefined);
  const { vehicles } = useClientVehicles(order?.client_id || undefined);

  // Find the specific vehicle for this repair order
  const repairOrderVehicle = vehicles?.find(v => v.id === order?.vehicle_id);

  // Determiner si c'est en lecture seule
  const isReadOnly = cession?.status === 'payee';

  useEffect(() => {
    if (cession) {
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

  const validateRepairOrderData = (repairOrderId: string): string | null => {
    if (!order || !client || !repairOrderVehicle) {
      return "Impossible de récupérer les données de l'ordre de réparation, du client ou du véhicule.";
    }

    const missingClientFields = [];
    const missingVehicleDocuments = [];

    // Vérifier les champs obligatoires du client
    if (!client.first_name) missingClientFields.push("Prénom");
    if (!client.last_name) missingClientFields.push("Nom");
    if (!client.email) missingClientFields.push("Email");
    if (!client.phone) missingClientFields.push("Téléphone");
    if (!client.address) missingClientFields.push("Adresse");
    if (!client.city) missingClientFields.push("Ville");
    if (!client.postal_code) missingClientFields.push("Code postal");

    // Vérifier les photos du permis de conduire
    if (!client.driver_license_front_url) missingClientFields.push("Photo recto du permis de conduire");
    if (!client.driver_license_back_url) missingClientFields.push("Photo verso du permis de conduire");

    // Vérifier les photos du certificat d'immatriculation - corriger les noms des propriétés
    if (!repairOrderVehicle.registration_document_front_url) missingVehicleDocuments.push("Photo recto du certificat d'immatriculation");
    if (!repairOrderVehicle.registration_document_back_url) missingVehicleDocuments.push("Photo verso du certificat d'immatriculation");

    if (missingClientFields.length > 0 || missingVehicleDocuments.length > 0) {
      let errorMessage = "Des informations obligatoires sont manquantes :\n";
      
      if (missingClientFields.length > 0) {
        errorMessage += `\nFiche client : ${missingClientFields.join(", ")}`;
      }
      
      if (missingVehicleDocuments.length > 0) {
        errorMessage += `\nFiche véhicule : ${missingVehicleDocuments.join(", ")}`;
      }

      errorMessage += "\n\nVeuillez compléter ces informations avant de pouvoir créer une cession de créance.";
      
      return errorMessage;
    }

    return null;
  };

  const handleChange = (field: keyof CessionFormData, value: any) => {
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

    // Si c'est le champ repair_order_id, effectuer la validation
    if (field === 'repair_order_id' && value) {
      const validationError = validateRepairOrderData(value);
      if (validationError) {
        setErrors(prev => ({
          ...prev,
          repair_order_id: validationError
        }));
        setValidationBlocked(true);
      } else {
        setValidationBlocked(false);
      }
    } else if (field === 'repair_order_id' && !value) {
      setValidationBlocked(false);
    }
  };

  const validateForm = (): boolean => {
    // Si la validation est bloquée à cause des données manquantes, empêcher la soumission
    if (validationBlocked) {
      return false;
    }

    const newErrors: CessionFormErrors = {};

    if (!formData.repair_order_id) {
      newErrors.repair_order_id = 'L\'ordre de réparation est obligatoire';
    }

    if (!formData.bank_account_id) {
      newErrors.bank_account_id = 'Le compte bancaire est obligatoire';
    }

    if (!formData.incident_number.trim()) {
      newErrors.incident_number = 'Le numéro de sinistre est obligatoire';
    }

    if (!formData.incident_date) {
      newErrors.incident_date = 'La date du sinistre est obligatoire';
    }

    if (!formData.policy_number.trim()) {
      newErrors.policy_number = 'Le numéro de police est obligatoire';
    }

    if (!formData.report_number.trim()) {
      newErrors.report_number = 'Le numéro de rapport est obligatoire';
    }

    if (!formData.expert_name.trim()) {
      newErrors.expert_name = 'Le nom de l\'expert est obligatoire';
    }

    if (!formData.insurance_company_id) {
      newErrors.insurance_company_id = 'L\'assurance est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmitData = (): Partial<Cession> => {
    return {
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
  };

  return {
    formData,
    errors,
    isReadOnly,
    validationBlocked,
    handleChange,
    validateForm,
    prepareSubmitData
  };
};
