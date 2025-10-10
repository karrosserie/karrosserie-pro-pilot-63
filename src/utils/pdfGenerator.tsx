import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';

import { Invoice } from '@/services/supabase/invoices';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import DenunciationPDF from '@/components/fleet/DenunciationPDF';
import AttestationPDF from '@/components/fleet/AttestationPDF';
import { getCurrentPosition } from '@/utils/geolocation';
import { supabase } from '@/integrations/supabase/client';

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

export const generateComponentPDF = async (
  Component: React.ComponentType<any>,
  props: any,
  filename?: string
) => {
  try {
    // Créer le document PDF avec le composant et props fournis
    const doc = <Component {...props} />;

    const blob = await pdf(doc).toBlob();

    // Convertir le blob en buffer pour l'upload
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    return buffer;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF générique:', error);
    throw error;
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
    
    // 4. Fonction utilitaire pour ajouter une image au PDF
    const addImageToPdf = async (imageUrl: string, title: string) => {
      try {
        console.log(`📥 Tentative de récupération de l'image: ${title} depuis ${imageUrl}`);
        
        // Vérifier si l'URL contient le domaine Supabase complet ou si c'est un chemin relatif
        let fullUrl = imageUrl;
        if (!imageUrl.startsWith('http')) {
          fullUrl = `https://jukdsypvuehnniskgpfd.supabase.co${imageUrl}`;
        }
        
        console.log(`🔗 URL complète: ${fullUrl}`);
        
        // Extraire le bucket et le path depuis l'URL Supabase
        const urlParts = fullUrl.split('/storage/v1/object/public/');
        if (urlParts.length !== 2) {
          console.error(`❌ Format d'URL invalide pour ${title}: ${fullUrl}`);
          console.error(`   URL parts:`, urlParts);
          return false;
        }
        
        const pathAfterPublic = urlParts[1];
        const [bucket, ...pathParts] = pathAfterPublic.split('/');
        const filePath = pathParts.join('/');
        
        console.log(`📦 Bucket: "${bucket}", Path: "${filePath}"`);
        
        // Télécharger l'image depuis Supabase Storage
        console.log(`⬇️ Téléchargement depuis Supabase Storage...`);
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(filePath);
        
        if (error) {
          console.error(`❌ Erreur Supabase pour ${title}:`, error);
          console.error(`   Bucket: "${bucket}", Path: "${filePath}"`);
          return false;
        }
        
        if (!data) {
          console.error(`❌ Aucune données reçues pour ${title}`);
          return false;
        }
        
        console.log(`✅ Blob reçu - Type: ${data.type}, Taille: ${data.size} bytes`);
        
        const imageArrayBuffer = await data.arrayBuffer();
        console.log(`✅ Image téléchargée: ${title}, taille: ${imageArrayBuffer.byteLength} bytes`);
        
        // Déterminer le type d'image et l'embarquer
        let image;
        const contentType = data.type || '';
        const isJpeg = contentType.includes('jpeg') || contentType.includes('jpg') || filePath.match(/\.(jpg|jpeg)$/i);
        const isPng = contentType.includes('png') || filePath.match(/\.png$/i);
        
        console.log(`🎨 Type de contenu: "${contentType}", JPEG: ${isJpeg}, PNG: ${isPng}`);
        
        try {
          if (isPng) {
            console.log(`   Tentative d'embedding PNG...`);
            image = await combinedPdf.embedPng(imageArrayBuffer);
          } else if (isJpeg) {
            console.log(`   Tentative d'embedding JPEG...`);
            image = await combinedPdf.embedJpg(imageArrayBuffer);
          } else {
            // Essayer JPEG par défaut
            console.log(`⚠️ Type inconnu, essai avec JPEG...`);
            image = await combinedPdf.embedJpg(imageArrayBuffer);
          }
        } catch (embedError) {
          console.error(`❌ Erreur lors de l'embedding de l'image:`, embedError);
          // Essayer l'autre format
          try {
            if (isPng) {
              console.log(`   Nouvelle tentative avec JPEG...`);
              image = await combinedPdf.embedJpg(imageArrayBuffer);
            } else {
              console.log(`   Nouvelle tentative avec PNG...`);
              image = await combinedPdf.embedPng(imageArrayBuffer);
            }
          } catch (secondError) {
            console.error(`❌ Impossible d'embedder l'image dans aucun format:`, secondError);
            return false;
          }
        }
        
        console.log(`✅ Image embarquée - Dimensions: ${image.width}x${image.height}`);
        
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
        
        console.log(`📐 Position: (${x}, ${y}), Taille: ${scaledWidth}x${scaledHeight}`);
        
        photoPage.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
        
        // Ajouter un titre
        photoPage.drawText(title, {
          x: 50,
          y: height - 50,
          size: 16,
        });
        
        console.log(`✅ Image ${title} intégrée au PDF avec succès`);
        return true;
      } catch (error) {
        console.error(`❌ Erreur lors de l'intégration de ${title}:`, error);
        if (error instanceof Error) {
          console.error(`   Message: ${error.message}`);
          console.error(`   Stack:`, error.stack);
        }
        return false;
      }
    };

    // 5. Ajouter les documents du véhicule
    const vehicle = violationData.reservation?.vehicles;
    if (vehicle) {
      // Certificat d'immatriculation recto
      if (vehicle.registration_front_url) {
        await addImageToPdf(vehicle.registration_front_url, 'Certificat d\'immatriculation - Recto');
      }
      
      // Certificat d'immatriculation verso
      if (vehicle.registration_back_url) {
        await addImageToPdf(vehicle.registration_back_url, 'Certificat d\'immatriculation - Verso');
      }
      
      // Carte d'assurance
      if (vehicle.insurance_card_url) {
        await addImageToPdf(vehicle.insurance_card_url, 'Carte d\'assurance');
      }
    }

    // 6. Ajouter les documents du client
    const client = violationData.reservation?.clients;
    if (client) {
      // Permis de conduire recto
      if (client.driver_license_front_url) {
        await addImageToPdf(client.driver_license_front_url, 'Permis de conduire - Recto');
      }
      
      // Permis de conduire verso
      if (client.driver_license_back_url) {
        await addImageToPdf(client.driver_license_back_url, 'Permis de conduire - Verso');
      }
    }

    // 7. Ajouter la photo de la contravention
    if (violationData.violation.document_url) {
      await addImageToPdf(violationData.violation.document_url, 'Photo de la contravention');
    }
    
    // 8. Générer le PDF final
    const finalPdfBytes = await combinedPdf.save();
    const finalBlob = new Blob([new Uint8Array(finalPdfBytes)], { type: 'application/pdf' });
    
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