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
  console.log('=== STARTING PDF SERVICE ===');
  console.log('Cession passed to pdfService:', JSON.stringify(cession, null, 2));
  console.log('Company data:', JSON.stringify(companyData, null, 2));
  console.log('Client data passed to pdfService:', JSON.stringify(clientData, null, 2));
  console.log('Vehicle data passed to pdfService:', JSON.stringify(vehicleData, null, 2));
  
  try {
    // Ne pas générer de composant PDF complexe, laisser le CessionPDF gérer l'affichage
    let repairOrderPDFComponent = null;

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