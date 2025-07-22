import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';
import { CessionPDF } from './CessionPDFGenerator';
import { Cession } from '@/services/supabase/cessions';
import { prepareRepairOrderDataForPDF } from '@/utils/repairOrderPDFGeneration';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export const generateAndUploadCessionPDF = async (
  cession: Cession,
  companyData: any,
  selectedInsuranceCompany: any,
  clientData?: any,
  vehicleData?: any
): Promise<string> => {
  try {
    // Générer le composant PDF de l'ordre de réparation si disponible
    let repairOrderPDFComponent: React.ReactElement | null = null;
    if (cession.repair_orders) {
      try {
        console.log('Generating repair order PDF component for cession:', cession.repair_orders);
        console.log('Client data passed:', clientData);
        console.log('Vehicle data passed:', vehicleData);
        
        const data = await prepareRepairOrderDataForPDF(cession.repair_orders as any, companyData);
        console.log('Prepared repair order data:', data);
        
        const invoiceData = {
          ...data.repairOrder,
          amount: data.totals.total,
          date: data.repairOrder.created_at,
          due_date: data.repairOrder.created_at,
          repairs_data: Array.isArray(data.repairOrder.repairs_data) ? data.repairOrder.repairs_data : [],
          parts_data: Array.isArray(data.repairOrder.parts_data) ? data.repairOrder.parts_data : []
        } as any;

        console.log('Invoice data for PDF:', invoiceData);
        console.log('Final client data for PDF:', data.clientData);
        console.log('Final vehicle data for PDF:', data.vehicleData);

        // Créer le composant InvoicePDF pour l'ordre de réparation
        repairOrderPDFComponent = InvoicePDF({ 
          invoice: invoiceData, 
          companyData: data.companyData, 
          receipts: [],
          clientData: data.clientData,
          vehicleData: data.vehicleData,
          template: data.template,
          documentType: 'repair_order'
        });
      } catch (error) {
        console.error('Erreur lors de la génération du composant PDF ordre de réparation:', error);
      }
    }

    // Generate PDF blob
    const pdfBlob = await pdf(
      CessionPDF({
        cession,
        companyData,
        selectedInsuranceCompany,
        clientData,
        vehicleData,
        repairOrderPDFComponent
      })
    ).toBlob();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Create filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cession-${cession.reference}-${timestamp}.pdf`;
    const filePath = `${user.id}/cessions/${filename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading PDF:', uploadError);
      throw new Error(`Erreur lors du téléchargement du PDF: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};