import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from './types';
import { validateInvoiceForm } from './utils/validation';
import { calculateGlobalTotals } from './hooks/useInvoiceCalculations';
import { parseInvoiceNotes, generateNextInvoiceNumber } from './utils/invoiceFormUtils';

interface UseInvoiceFormLogicProps {
  invoice?: Invoice | null;
  prefillData?: any;
}

// Helper pour parser les données JSON de façon sécurisée
const safeParseJSON = <T>(data: any, fallback: T): T => {
  if (!data) return fallback;
  if (Array.isArray(data)) return data as T;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

export const useInvoiceFormLogic = ({ invoice, prefillData }: UseInvoiceFormLogicProps) => {
  // Ref pour éviter les ré-initialisations
  const initializedRef = useRef(false);
  const invoiceIdRef = useRef<string | null>(null);

  const [formData, setFormData] = useState<Partial<Invoice>>(() => {
    const initialData: Partial<Invoice> = {
      reference: '',
      client_id: undefined,
      vehicle_id: undefined,
      status: 'En attente de paiement',
      date: '',
      due_date: '',
      payment_details: '',
      notes: ''
    };
    
    if (prefillData) {
      return {
        ...initialData,
        client_id: prefillData.client_id || undefined,
        vehicle_id: prefillData.vehicle_id || undefined,
        repair_order_id: prefillData.repair_order_id || null,
        report_number: prefillData.report_number || '',
        policy_number: prefillData.policy_number || '',
        report_date: prefillData.report_date || '',
        expert_name: prefillData.expert_name || '',
        incident_date: prefillData.incident_date || ''
      };
    }
    
    return initialData;
  });

  const [claimNumber, setClaimNumber] = useState('');
  const [repairs, setRepairs] = useState<InvoiceRepairItem[]>([]);
  const [parts, setParts] = useState<InvoicePartItem[]>([]);
  const [discounts, setDiscounts] = useState<InvoiceDiscountItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skipVehicle, setSkipVehicle] = useState(false);

  // Permettre la modification de toutes les factures
  const isReadOnly = false;

  const validateForm = useCallback(() => {
    const validationResult = validateInvoiceForm(formData, claimNumber, skipVehicle);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  }, [formData, claimNumber, skipVehicle]);

  const handleChange = useCallback((field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [isReadOnly, errors]);

  const handleClaimNumberChange = useCallback((value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      if (errors.claim_number) {
        setErrors(prev => ({ ...prev, claim_number: '' }));
      }
    }
  }, [isReadOnly, errors.claim_number]);

  // Préparation des données pour soumission - memoized
  const prepareSubmitData = useCallback(() => {
    const safeNumber = (val: any): number => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const normalizedRepairs = repairs.map(item => ({
      ...item,
      quantity: safeNumber(item.quantity),
      unitCost: safeNumber(item.unitCost),
      discount: safeNumber(item.discount),
      vat: safeNumber(item.vat),
      total: safeNumber(item.total)
    }));

    const normalizedParts = parts.map(item => ({
      ...item,
      quantity: safeNumber(item.quantity),
      unitCost: safeNumber(item.unitCost),
      discount: safeNumber(item.discount),
      vat: safeNumber(item.vat),
      total: safeNumber(item.total)
    }));

    return {
      ...formData,
      claim_number: claimNumber,
      client_id: formData.client_id || null,
      vehicle_id: skipVehicle ? null : (formData.vehicle_id || null),
      repairs_data: JSON.stringify(normalizedRepairs),
      parts_data: JSON.stringify(normalizedParts),
      discounts_data: JSON.stringify(discounts),
      report_number: (formData as any).report_number || '',
      policy_number: (formData as any).policy_number || '',
      report_date: (formData as any).report_date || null,
      expert_name: (formData as any).expert_name || '',
      incident_date: (formData as any).incident_date || null
    };
  }, [formData, claimNumber, repairs, parts, discounts, skipVehicle]);

  // Initialisation - effet unique comme useQuoteFormLogic
  useEffect(() => {
    const currentInvoiceId = invoice?.id || 'new';
    
    // Éviter la ré-initialisation pour la même facture
    if (initializedRef.current && invoiceIdRef.current === currentInvoiceId) {
      return;
    }

    const initializeForm = async () => {
      if (invoice?.id) {
        // Facture existante
        setFormData({
          reference: invoice.reference,
          client_id: invoice.client_id,
          vehicle_id: invoice.vehicle_id,
          status: invoice.status || 'En attente de paiement',
          date: invoice.date,
          due_date: invoice.due_date,
          payment_details: invoice.payment_details || '',
          notes: invoice.notes || '',
          report_number: (invoice as any).report_number || '',
          policy_number: (invoice as any).policy_number || '',
          report_date: (invoice as any).report_date || '',
          expert_name: (invoice as any).expert_name || '',
          incident_date: (invoice as any).incident_date || ''
        });

        setClaimNumber(invoice.claim_number || '');

        // Parser les données avec fallback
        let repairsData = safeParseJSON<InvoiceRepairItem[]>(invoice.repairs_data, []);
        let partsData = safeParseJSON<InvoicePartItem[]>(invoice.parts_data, []);
        let discountsData = safeParseJSON<InvoiceDiscountItem[]>(invoice.discounts_data, []);

        // Fallback depuis notes si données vides
        if (repairsData.length === 0 && partsData.length === 0 && invoice.notes) {
          const parsedData = parseInvoiceNotes(invoice.notes);
          repairsData = parsedData.repairs || [];
          partsData = parsedData.parts || [];
          discountsData = parsedData.discounts || [];
        }

        setRepairs(repairsData);
        setParts(partsData);
        setDiscounts(discountsData);
      } else {
        // Nouvelle facture
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        const dueDateString = dueDate.toISOString().split('T')[0];

        try {
          const nextNumber = await generateNextInvoiceNumber();
          
          setFormData(prev => ({
            ...prev,
            reference: nextNumber,
            date: today,
            due_date: dueDateString,
            client_id: prefillData?.client_id || prev.client_id,
            vehicle_id: prefillData?.vehicle_id || prev.vehicle_id,
            repair_order_id: prefillData?.repair_order_id || null
          }));
        } catch {
          setFormData(prev => ({
            ...prev,
            reference: '1',
            date: today,
            due_date: dueDateString
          }));
        }

        // Appliquer prefillData pour réparations/pièces/remises
        if (prefillData) {
          setClaimNumber(prefillData.claim_number || '');
          setRepairs(safeParseJSON(prefillData.repairs_data, []));
          setParts(safeParseJSON(prefillData.parts_data, []));
          setDiscounts(safeParseJSON(prefillData.discounts_data || prefillData.global_discount_data, []));
        }
      }

      initializedRef.current = true;
      invoiceIdRef.current = currentInvoiceId;
    };

    initializeForm();
  }, [invoice?.id, prefillData?.client_id, prefillData?.vehicle_id]);

  // Calcul des totaux globaux - memoized
  const globalTotals = useMemo(() => 
    calculateGlobalTotals(repairs, parts, discounts),
    [repairs, parts, discounts]
  );

  return {
    formData,
    claimNumber,
    repairs,
    parts,
    discounts,
    errors,
    isReadOnly,
    skipVehicle,
    setSkipVehicle,
    setRepairs,
    setParts,
    setDiscounts,
    handleChange,
    handleClaimNumberChange,
    validateForm,
    globalTotals,
    prepareSubmitData
  };
};
