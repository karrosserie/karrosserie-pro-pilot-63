import { pdf } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export const printInvoicePDF = async (
  invoice: Invoice, 
  companyData: any, 
  payments: any[] = [],
  clientData?: any,
  vehicleData?: any
) => {
  try {
    // Créer le document PDF
    const doc = InvoicePDF({ invoice, companyData, payments, clientData, vehicleData });
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob);
    
    // Utiliser un iframe caché pour l'impression (évite le blocage par les extensions)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = url;

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (error) {
          console.error('Erreur impression iframe:', error);
          // Fallback: télécharger le PDF
          const link = document.createElement('a');
          link.href = url;
          link.download = `Facture_${invoice.reference}.pdf`;
          link.click();
        }
      }, 500);
      
      // Nettoyer après impression (laisser 60s)
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 60000);
    };

    document.body.appendChild(iframe);
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'ouverture du PDF pour impression:', error);
    return { success: false, error: error.message };
  }
};