
import { useEffect } from 'react';
import { Invoice } from '@/services/supabase/invoices';
import { InvoiceRepairItem, InvoicePartItem, InvoiceDiscountItem } from '../types';
import { parseInvoiceNotes, generateNextInvoiceNumber } from '../utils/invoiceFormUtils';

interface UseInvoiceFormInitializationProps {
  invoice?: Invoice | null;
  prefillData?: any;
  setFormData: (updater: (prev: Partial<Invoice>) => Partial<Invoice>) => void;
  setClaimNumber: (value: string) => void;
  setRepairs: (value: InvoiceRepairItem[]) => void;
  setParts: (value: InvoicePartItem[]) => void;
  setDiscounts: (value: InvoiceDiscountItem[]) => void;
}

export const useInvoiceFormInitialization = ({
  invoice,
  prefillData,
  setFormData,
  setClaimNumber,
  setRepairs,
  setParts,
  setDiscounts
}: UseInvoiceFormInitializationProps) => {
  useEffect(() => {
    const initializeForm = async () => {
      console.log('Invoice form initializing with invoice:', invoice);
      console.log('PrefillData:', prefillData);
      
      // Vérifier si c'est une facture existante (avec un ID) ou une nouvelle facture
      const isExistingInvoice = invoice && invoice.id;
      
      if (isExistingInvoice) {
        console.log('Existing invoice, setting form data with reference:', invoice.reference);
        setFormData(prev => ({
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
        }));
        
        // Pour une facture existante, récupérer les données directement depuis les champs de la facture
        console.log('Loading existing invoice data:', {
          claim_number: invoice.claim_number,
          repairs_data: invoice.repairs_data,
          parts_data: invoice.parts_data,
          discounts_data: invoice.discounts_data
        });

        setClaimNumber(invoice.claim_number || '');
        
        // Traiter les données de réparations, pièces et remises
        let repairsData: InvoiceRepairItem[] = [];
        let partsData: InvoicePartItem[] = [];
        let discountsData: InvoiceDiscountItem[] = [];

        try {
          // Gérer les repairs_data (peut être string ou array)
          if (invoice.repairs_data) {
            if (typeof invoice.repairs_data === 'string') {
              repairsData = JSON.parse(invoice.repairs_data);
            } else if (Array.isArray(invoice.repairs_data)) {
              repairsData = invoice.repairs_data;
            }
          }

          // Gérer les parts_data (peut être string ou array)
          if (invoice.parts_data) {
            if (typeof invoice.parts_data === 'string') {
              partsData = JSON.parse(invoice.parts_data);
            } else if (Array.isArray(invoice.parts_data)) {
              partsData = invoice.parts_data;
            }
          }

          // Gérer les discounts_data (peut être string ou array)
          if (invoice.discounts_data) {
            if (typeof invoice.discounts_data === 'string') {
              discountsData = JSON.parse(invoice.discounts_data);
            } else if (Array.isArray(invoice.discounts_data)) {
              discountsData = invoice.discounts_data;
            }
          }
        } catch (error) {
          console.error('Error parsing invoice data:', error);
          // En cas d'erreur, essayer de parser depuis les notes comme fallback
          if (invoice.notes) {
            const parsedData = parseInvoiceNotes(invoice.notes);
            repairsData = parsedData.repairs || [];
            partsData = parsedData.parts || [];
            discountsData = parsedData.discounts || [];
          }
        }

        console.log('Setting parsed data:', {
          repairs: repairsData,
          parts: partsData,
          discounts: discountsData
        });

        setRepairs(repairsData);
        setParts(partsData);
        setDiscounts(discountsData);
      } else {
        console.log('New invoice or prefilled data, generating number...');
        // Pour une nouvelle facture, générer automatiquement le numéro
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        const dueDateString = dueDate.toISOString().split('T')[0];
        
        try {
          const nextNumber = await generateNextInvoiceNumber();
          console.log('Generated invoice number:', nextNumber);
          
           setFormData(prev => ({
             reference: nextNumber,
             client_id: invoice?.client_id || prefillData?.client_id || '',
             vehicle_id: invoice?.vehicle_id || prefillData?.vehicle_id || '',
             repair_order_id: invoice?.repair_order_id || prefillData?.repair_order_id || null,
             status: 'En attente de paiement',
             date: today,
             due_date: dueDateString,
             payment_details: prefillData?.payment_details || '',
             notes: (invoice as any)?.notes || prefillData?.notes || '',
             report_number: (invoice as any)?.report_number || prefillData?.report_number || '',
             policy_number: (invoice as any)?.policy_number || prefillData?.policy_number || '',
             report_date: (invoice as any)?.report_date || prefillData?.report_date || '',
             expert_name: (invoice as any)?.expert_name || prefillData?.expert_name || '',
             incident_date: (invoice as any)?.incident_date || prefillData?.incident_date || ''
           }));
           
           // Initialiser claim_number depuis l'invoice fournie ou prefillData
           setClaimNumber((invoice as any)?.claim_number || prefillData?.claim_number || '');
           
           // Initialiser les données de réparations, pièces et remises depuis l'invoice fournie ou prefillData
           let repairsData: InvoiceRepairItem[] = [];
           let partsData: InvoicePartItem[] = [];
           let discountsData: InvoiceDiscountItem[] = [];

           // Priorité aux données de l'invoice, puis aux prefillData
           const dataSource = invoice || prefillData;

           // Gérer les repairs_data
           if (dataSource?.repairs_data) {
             try {
               if (typeof dataSource.repairs_data === 'string') {
                 repairsData = JSON.parse(dataSource.repairs_data);
               } else if (Array.isArray(dataSource.repairs_data)) {
                 repairsData = dataSource.repairs_data;
               }
             } catch (error) {
               console.error('Erreur lors du parsing des repairs_data:', error);
             }
           }

           // Gérer les parts_data
           if (dataSource?.parts_data) {
             try {
               if (typeof dataSource.parts_data === 'string') {
                 partsData = JSON.parse(dataSource.parts_data);
               } else if (Array.isArray(dataSource.parts_data)) {
                 partsData = dataSource.parts_data;
               }
             } catch (error) {
               console.error('Erreur lors du parsing des parts_data:', error);
             }
           }

           // Gérer les discounts_data
           if (dataSource?.discounts_data) {
             try {
               if (typeof dataSource.discounts_data === 'string') {
                 discountsData = JSON.parse(dataSource.discounts_data);
               } else if (Array.isArray(dataSource.discounts_data)) {
                 discountsData = dataSource.discounts_data;
               }
             } catch (error) {
               console.error('Erreur lors du parsing des discounts_data:', error);
             }
           }

           setRepairs(repairsData);
           setParts(partsData);
           setDiscounts(discountsData);
           
           console.log('Initialized form with data from repair order:', {
             client_id: prefillData?.client_id,
             vehicle_id: prefillData?.vehicle_id,
             claim_number: (invoice as any)?.claim_number || prefillData?.claim_number,
             repairs: repairsData,
             parts: partsData,
             discounts: discountsData
           });
          
          console.log('Form data set with generated number:', nextNumber);
        } catch (error) {
          console.error('Erreur lors de la génération du numéro de facture:', error);
           setFormData(prev => ({
             reference: '1',
             client_id: invoice?.client_id || prefillData?.client_id || '',
             vehicle_id: invoice?.vehicle_id || prefillData?.vehicle_id || '',
             repair_order_id: invoice?.repair_order_id || prefillData?.repair_order_id || null,
             status: 'En attente de paiement',
             date: today,
             due_date: dueDateString,
             payment_details: prefillData?.payment_details || '',
             notes: (invoice as any)?.notes || prefillData?.notes || '',
             report_number: (invoice as any)?.report_number || prefillData?.report_number || '',
             policy_number: (invoice as any)?.policy_number || prefillData?.policy_number || '',
             report_date: (invoice as any)?.report_date || prefillData?.report_date || '',
             expert_name: (invoice as any)?.expert_name || prefillData?.expert_name || '',
             incident_date: (invoice as any)?.incident_date || prefillData?.incident_date || ''
           }));
           
           // Même logique que ci-dessus pour initialiser les données en cas d'erreur
           setClaimNumber((invoice as any)?.claim_number || prefillData?.claim_number || '');
           
           let repairsData: InvoiceRepairItem[] = [];
           let partsData: InvoicePartItem[] = [];
           let discountsData: InvoiceDiscountItem[] = [];

           // Priorité aux données de l'invoice, puis aux prefillData (même logique que plus haut)
           const dataSource = invoice || prefillData;

           // Répéter la même logique de parsing pour la cohérence
           if (dataSource?.repairs_data) {
             try {
               repairsData = typeof dataSource.repairs_data === 'string' ? JSON.parse(dataSource.repairs_data) : dataSource.repairs_data;
             } catch (err) {
               console.error('Erreur parsing repairs_data fallback:', err);
             }
           }
           if (dataSource?.parts_data) {
             try {
               partsData = typeof dataSource.parts_data === 'string' ? JSON.parse(dataSource.parts_data) : dataSource.parts_data;
             } catch (err) {
               console.error('Erreur parsing parts_data fallback:', err);
             }
           }
           if (dataSource?.discounts_data) {
             try {
               discountsData = typeof dataSource.discounts_data === 'string' ? JSON.parse(dataSource.discounts_data) : dataSource.discounts_data;
             } catch (err) {
               console.error('Erreur parsing discounts_data fallback:', err);
             }
           }

           setRepairs(repairsData);
           setParts(partsData);
           setDiscounts(discountsData);
           
           console.log('Set fallback form data with prefillData support');
        }
      }
    };

    initializeForm();
  }, [invoice, prefillData, setFormData, setClaimNumber, setRepairs, setParts, setDiscounts]);
};
