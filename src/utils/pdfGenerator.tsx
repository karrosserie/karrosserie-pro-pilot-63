import React from 'react';
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { Invoice } from '@/services/supabase/invoices';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import DenunciationPDF from '@/components/fleet/DenunciationPDF';
import AttestationPDF from '@/components/fleet/AttestationPDF';
import { getCurrentPosition } from '@/utils/geolocation';

export const generateInvoicePDF = async (
  invoice: Invoice, 
  companyData: any, 
  receipts: any[] = [],
  clientData?: any,
  vehicleData?: any
) => {
  try {
    // Créer le document PDF
    const doc = <InvoicePDF invoice={invoice} companyData={companyData} receipts={receipts} clientData={clientData} vehicleData={vehicleData} />;
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer un nom de fichier unique
    const filename = `Facture_${invoice.reference}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error: any) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
};

export const generateDenunciationPDF = async (
  violationData: any,
  companyData: any,
  signature?: string,
  signatoryName?: string
) => {
  try {
    const zip = new JSZip();
    
    // 1. Générer le PDF de dénonciation
    const denunciationDoc = <DenunciationPDF violationData={violationData} companyData={companyData} signature={signature} signatoryName={signatoryName} />;
    const denunciationPdf = pdf(denunciationDoc);
    const denunciationBlob = await denunciationPdf.toBlob();
    zip.file(`Denonciation_${violationData.violation.reference_number}.pdf`, denunciationBlob);
    
    // 2. Générer le PDF d'attestation de prêt signé
    let userPosition = '[position non disponible]';
    try {
      const position = await getCurrentPosition();
      userPosition = `${position.latitude.toFixed(6)},${position.longitude.toFixed(6)}`;
    } catch (error) {
      console.warn('Impossible de récupérer la position:', error);
    }
    
    const attestationDoc = AttestationPDF({ 
      loanData: violationData.reservation, 
      companyData: companyData, 
      userPosition: userPosition 
    });
    const attestationPdf = pdf(attestationDoc);
    const attestationBlob = await attestationPdf.toBlob();
    zip.file(`Attestation_Pret_${violationData.violation.license_plate}.pdf`, attestationBlob);
    
    // 3. Ajouter la photo de la contravention si disponible
    if (violationData.violation.document_url) {
      try {
        const response = await fetch(violationData.violation.document_url);
        if (response.ok) {
          const imageBlob = await response.blob();
          const extension = violationData.violation.document_url.split('.').pop()?.toLowerCase() || 'jpg';
          zip.file(`Photo_Contravention_${violationData.violation.reference_number}.${extension}`, imageBlob);
        }
      } catch (error) {
        console.warn('Impossible de récupérer la photo de la contravention:', error);
      }
    }
    
    // Générer le fichier ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Créer un nom de fichier unique
    const filename = `Dossier_Denonciation_${violationData.violation.reference_number}_${new Date().toISOString().split('T')[0]}.zip`;
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error: any) {
    console.error('Erreur lors de la génération du dossier de dénonciation:', error);
    return { success: false, error: error.message };
  }
};