import { pdf } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export const printInvoicePDF = async (
  invoice: Invoice, 
  companyData: any, 
  receipts: any[] = [],
  clientData?: any,
  vehicleData?: any
) => {
  try {
    // Créer le document PDF
    const doc = InvoicePDF({ invoice, companyData, receipts, clientData, vehicleData });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob);
    
    // Ouvrir le PDF dans un nouvel onglet pour impression
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        // Nettoyer l'URL après un délai
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'ouverture du PDF pour impression:', error);
    return { success: false, error: error.message };
  }
};