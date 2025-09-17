import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { Invoice } from '@/services/supabase/invoices';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import DenunciationPDF from '@/components/fleet/DenunciationPDF';

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
  signature?: string
) => {
  try {
    // Créer le document PDF
    const doc = <DenunciationPDF violationData={violationData} companyData={companyData} signature={signature} />;
    
    // Générer le blob PDF
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    
    // Créer un nom de fichier unique
    const filename = `Denonciation_${violationData.violation.reference_number}_${new Date().toISOString().split('T')[0]}.pdf`;
    
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
    console.error('Erreur lors de la génération du PDF de dénonciation:', error);
    return { success: false, error: error.message };
  }
};