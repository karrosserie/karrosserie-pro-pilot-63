
import { useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';
import { parseInvoiceNotes, generateNextInvoiceNumber } from '../utils/invoiceFormUtils';

interface UseInvoiceFormInitializationProps {
  invoice?: Invoice | null;
  setFormData: (updater: (prev: Partial<Invoice>) => Partial<Invoice>) => void;
  setDescription: (value: string) => void;
  setClaimNumber: (value: string) => void;
  setCurrentMileage: (value: string) => void;
  setRepairs: (value: InvoiceRepairItem[]) => void;
  setParts: (value: InvoicePartItem[]) => void;
  setDiscounts: (value: InvoiceDiscountItem[]) => void;
}

export const useInvoiceFormInitialization = ({
  invoice,
  setFormData,
  setDescription,
  setClaimNumber,
  setCurrentMileage,
  setRepairs,
  setParts,
  setDiscounts
}: UseInvoiceFormInitializationProps) => {
  useEffect(() => {
    const initializeForm = async () => {
      console.log('Invoice form initializing with invoice:', invoice);
      
      // Vérifier si c'est une facture existante (avec un ID) ou une nouvelle facture
      const isExistingInvoice = invoice && invoice.id;
      
      if (isExistingInvoice) {
        console.log('Existing invoice, setting form data with reference:', invoice.reference);
        setFormData(prev => ({
          reference: invoice.reference,
          client_id: invoice.client_id,
          vehicle_id: invoice.vehicle_id,
          status: invoice.status || 'En attente de paiement',
          due_date: invoice.due_date,
          payment_details: invoice.payment_details || ''
        }));
        
        const parsedData = parseInvoiceNotes(invoice.notes || '');
        setDescription(parsedData.description);
        setClaimNumber(parsedData.claimNumber);
        setCurrentMileage(parsedData.currentMileage);
        setRepairs(parsedData.repairs);
        setParts(parsedData.parts);
        setDiscounts(parsedData.discounts);
      } else {
        console.log('New invoice or prefilled data, generating number...');
        // Pour une nouvelle facture, générer automatiquement le numéro
        const today = new Date().toISOString().split('T')[0];
        
        try {
          const nextNumber = await generateNextInvoiceNumber();
          console.log('Generated invoice number:', nextNumber);
          
          setFormData(prev => ({
            reference: nextNumber,
            client_id: invoice?.client_id || '',
            vehicle_id: invoice?.vehicle_id || '',
            repair_order_id: invoice?.repair_order_id || null,
            status: 'En attente de paiement',
            due_date: today,
            payment_details: ''
          }));
          
          // Si des notes sont fournies (depuis un ordre de réparation), les parser
          if (invoice?.notes) {
            console.log('Parsing notes from repair order:', invoice.notes);
            const parsedData = parseInvoiceNotes(invoice.notes);
            setDescription(parsedData.description || '');
            setClaimNumber(parsedData.claimNumber || '');
            setCurrentMileage(parsedData.currentMileage || '');
            setRepairs(parsedData.repairs || []);
            setParts(parsedData.parts || []);
            setDiscounts(parsedData.discounts || []);
          } else {
            setDescription('');
            setClaimNumber('');
            setCurrentMileage('');
            setRepairs([]);
            setParts([]);
            setDiscounts([]);
          }
          
          console.log('Form data set with generated number:', nextNumber);
        } catch (error) {
          console.error('Erreur lors de la génération du numéro de facture:', error);
          setFormData(prev => ({
            reference: '1',
            client_id: invoice?.client_id || '',
            vehicle_id: invoice?.vehicle_id || '',
            repair_order_id: invoice?.repair_order_id || null,
            status: 'En attente de paiement',
            due_date: today,
            payment_details: ''
          }));
          console.log('Set fallback form data with 1');
        }
      }
    };

    initializeForm();
  }, [invoice, setFormData, setDescription, setClaimNumber, setCurrentMileage, setRepairs, setParts, setDiscounts]);
};
