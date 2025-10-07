import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';
import { CessionPDF } from './CessionPDFGenerator';
import { Cession } from '@/services/supabase/cessions';
import { prepareRepairOrderDataForPDF } from '@/utils/repairOrderPDFGeneration';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { quotesService } from '@/services/supabase/quotes';
import { expertiseReportsService } from '@/services/supabase/expertise-reports';
import { PDFDocument } from 'pdf-lib';
import { getCurrentUserCompanyId } from '@/services/supabase/auth-company';

// Fonction pour vérifier que le fichier est accessible
const verifyFileAccessibility = async (url: string, maxRetries: number = 5): Promise<void> => {
  console.log('Vérification de l\'accessibilité du fichier:', url);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`Fichier accessible après ${attempt} tentative(s)`);
        return;
      }
      console.log(`Tentative ${attempt}/${maxRetries} échouée: ${response.status}`);
    } catch (error) {
      console.log(`Tentative ${attempt}/${maxRetries} échouée:`, error);
    }
    
    // Attendre avant la prochaine tentative (délai progressif)
    if (attempt < maxRetries) {
      const delay = attempt * 1000; // 1s, 2s, 3s, 4s, 5s
      console.log(`Attente de ${delay}ms avant la prochaine tentative...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`Le fichier n'est pas accessible après ${maxRetries} tentatives`);
};

export const generateAndUploadCessionPDF = async (
  cession: Cession,
  companyData: any,
  selectedInsuranceCompany: any,
  clientData?: any,
  vehicleData?: any
): Promise<string> => {
  try {

    // Récupérer le PDF du rapport d'expertise si disponible
    let expertiseReportPDFUrl = null;
    if (cession.repair_order_id) {
      try {
        console.log('Récupération du rapport d\'expertise pour l\'ordre de réparation:', cession.repair_order_id);
        
        // 1. Récupérer l'ordre de réparation pour obtenir le quote_id
        const repairOrder = await repairOrdersService.getById(cession.repair_order_id);
        console.log('Ordre de réparation récupéré:', repairOrder);
        
        if (repairOrder?.quote_id) {
          // 2. Récupérer le devis pour obtenir le report_id
          const quote = await quotesService.getById(repairOrder.quote_id);
          console.log('Devis récupéré:', quote);
          
          if (quote?.report_id) {
            // 3. Récupérer le rapport d'expertise pour obtenir le document_url
            const expertiseReport = await expertiseReportsService.getById(quote.report_id);
            console.log('Rapport d\'expertise récupéré:', expertiseReport);
            
            if (expertiseReport?.document_url) {
              expertiseReportPDFUrl = expertiseReport.document_url;
              console.log('URL du PDF du rapport d\'expertise trouvée:', expertiseReportPDFUrl);
            } else {
              console.log('Aucun document_url trouvé dans le rapport d\'expertise');
            }
          } else {
            console.log('Aucun report_id trouvé dans le devis');
          }
        } else {
          console.log('Aucun quote_id trouvé dans l\'ordre de réparation');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rapport d\'expertise:', error);
      }
    } else {
      console.log('Aucun repair_order_id dans la cession');
    }

    // Generate PDF blob (sans le rapport d'expertise car on va le fusionner séparément)
    const cessionPdfBlob = await pdf(
      CessionPDF({
        cession,
        companyData,
        selectedInsuranceCompany,
        clientData,
        vehicleData
      })
    ).toBlob();

    console.log('PDF de cession généré, taille:', cessionPdfBlob.size, 'bytes');

    // Si on a un PDF du rapport d'expertise, fusionner les deux PDFs
    let finalPdfBlob = cessionPdfBlob;
    if (expertiseReportPDFUrl) {
      try {
        console.log('Fusion du PDF du rapport d\'expertise avec le PDF de cession');
        console.log('URL du rapport d\'expertise:', expertiseReportPDFUrl);
        
        // Télécharger le PDF du rapport d'expertise
        const response = await fetch(expertiseReportPDFUrl);
        if (!response.ok) {
          throw new Error(`Impossible de télécharger le rapport d'expertise: ${response.status}`);
        }
        const expertisePdfArrayBuffer = await response.arrayBuffer();
        console.log('Rapport d\'expertise téléchargé, taille:', expertisePdfArrayBuffer.byteLength, 'bytes');
        
        // Convertir le blob de cession en ArrayBuffer
        const cessionPdfArrayBuffer = await cessionPdfBlob.arrayBuffer();
        console.log('PDF de cession converti, taille:', cessionPdfArrayBuffer.byteLength, 'bytes');
        
        // Créer les documents PDF avec pdf-lib
        const cessionPdfDoc = await PDFDocument.load(cessionPdfArrayBuffer);
        const expertisePdfDoc = await PDFDocument.load(expertisePdfArrayBuffer);
        
        console.log('Nombre de pages du PDF de cession:', cessionPdfDoc.getPageCount());
        console.log('Nombre de pages du rapport d\'expertise:', expertisePdfDoc.getPageCount());
        
        // Copier toutes les pages du rapport d'expertise dans le document de cession
        const expertisePages = await cessionPdfDoc.copyPages(expertisePdfDoc, expertisePdfDoc.getPageIndices());
        expertisePages.forEach((page) => cessionPdfDoc.addPage(page));
        
        console.log('Nombre total de pages après fusion:', cessionPdfDoc.getPageCount());
        
        // Sauvegarder le PDF fusionné
        const mergedPdfBytes = await cessionPdfDoc.save();
        finalPdfBlob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
        
        console.log('PDF fusionné avec succès, taille finale:', finalPdfBlob.size, 'bytes');
      } catch (error) {
        console.error('Erreur lors de la fusion des PDFs:', error);
        // En cas d'erreur, on garde le PDF de cession original
        finalPdfBlob = cessionPdfBlob;
        console.log('Utilisation du PDF de cession original à cause de l\'erreur de fusion');
      }
    } else {
      console.log('Aucun rapport d\'expertise à fusionner');
    }

    // Get current user and company
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Get company ID for the current user
    const companyId = await getCurrentUserCompanyId();

    // Create filename with company-based path structure
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cession-${cession.reference}-${timestamp}.pdf`;
    const filePath = `company/${companyId}/cessions/${filename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, finalPdfBlob, {
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

    console.log('PDF uploadé avec succès, URL publique:', publicUrl);

    // Vérifier que le fichier est accessible avant de retourner l'URL
    await verifyFileAccessibility(publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};