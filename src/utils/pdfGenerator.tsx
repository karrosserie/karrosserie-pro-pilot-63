import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';

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
    // 1. Générer le PDF de dénonciation
    const denunciationDoc = <DenunciationPDF violationData={violationData} companyData={companyData} signature={signature} signatoryName={signatoryName} />;
    const denunciationPdf = pdf(denunciationDoc);
    const denunciationBlob = await denunciationPdf.toBlob();
    const denunciationArrayBuffer = await denunciationBlob.arrayBuffer();
    
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
    const attestationArrayBuffer = await attestationBlob.arrayBuffer();
    
    // 3. Créer un PDF combiné avec PDFDocument
    const combinedPdf = await PDFDocument.create();
    
    // Copier les pages du courrier de dénonciation
    const denunciationPdfDoc = await PDFDocument.load(denunciationArrayBuffer);
    const denunciationPages = await combinedPdf.copyPages(denunciationPdfDoc, denunciationPdfDoc.getPageIndices());
    denunciationPages.forEach((page) => combinedPdf.addPage(page));
    
    // Copier les pages de l'attestation
    const attestationPdfDoc = await PDFDocument.load(attestationArrayBuffer);
    const attestationPages = await combinedPdf.copyPages(attestationPdfDoc, attestationPdfDoc.getPageIndices());
    attestationPages.forEach((page) => combinedPdf.addPage(page));
    
    // 4. Ajouter la photo de la contravention si disponible
    if (violationData.violation.document_url) {
      try {
        const response = await fetch(violationData.violation.document_url);
        if (response.ok) {
          const imageBlob = await response.blob();
          const imageArrayBuffer = await imageBlob.arrayBuffer();
          
          let image;
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('jpeg') || contentType.includes('jpg')) {
            image = await combinedPdf.embedJpg(imageArrayBuffer);
          } else if (contentType.includes('png')) {
            image = await combinedPdf.embedPng(imageArrayBuffer);
          } else {
            // Essayer JPEG par défaut
            image = await combinedPdf.embedJpg(imageArrayBuffer);
          }
          
          // Créer une nouvelle page pour la photo
          const photoPage = combinedPdf.addPage();
          const { width, height } = photoPage.getSize();
          
          // Calculer les dimensions pour ajuster l'image
          const imageWidth = image.width;
          const imageHeight = image.height;
          const aspectRatio = imageWidth / imageHeight;
          
          let scaledWidth = width - 100; // Marge de 50 de chaque côté
          let scaledHeight = scaledWidth / aspectRatio;
          
          // Si l'image est trop haute, ajuster par la hauteur
          if (scaledHeight > height - 100) {
            scaledHeight = height - 100;
            scaledWidth = scaledHeight * aspectRatio;
          }
          
          // Centrer l'image sur la page
          const x = (width - scaledWidth) / 2;
          const y = (height - scaledHeight) / 2;
          
          photoPage.drawImage(image, {
            x,
            y,
            width: scaledWidth,
            height: scaledHeight,
          });
          
          // Ajouter un titre
          photoPage.drawText('Photo de la contravention', {
            x: 50,
            y: height - 50,
            size: 16,
          });
        }
      } catch (error) {
        console.warn('Impossible de récupérer ou d\'intégrer la photo de la contravention:', error);
      }
    }
    
    // 5. Générer le PDF final
    const finalPdfBytes = await combinedPdf.save();
    const finalBlob = new Blob([finalPdfBytes], { type: 'application/pdf' });
    
    // Créer un nom de fichier unique
    const filename = `Dossier_Denonciation_Complet_${violationData.violation.reference_number}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(finalBlob);
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