import { PDFDocument } from 'pdf-lib';
import { pdf } from '@react-pdf/renderer';

/**
 * Convertit une image en page PDF
 */
export const imageToPDFPage = async (imageUrl: string, title: string): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  
  try {
    // Télécharger l'image
    const response = await fetch(imageUrl);
    const imageBytes = await response.arrayBuffer();
    
    // Détecter le type d'image et l'embarquer
    let image;
    if (imageUrl.toLowerCase().match(/\.(png|webp)$/)) {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      image = await pdfDoc.embedJpg(imageBytes);
    }
    
    // Calculer les dimensions pour ajuster l'image à la page
    const imageDims = image.scale(1);
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    
    const scale = Math.min(
      (pageWidth - 40) / imageDims.width,
      (pageHeight - 100) / imageDims.height
    );
    
    const scaledWidth = imageDims.width * scale;
    const scaledHeight = imageDims.height * scale;
    
    // Centrer l'image sur la page
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;
    
    // Ajouter un titre en haut de page
    page.drawText(title, {
      x: 50,
      y: pageHeight - 30,
      size: 12,
    });
    
    // Dessiner l'image
    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
    
    console.log(`✅ Image convertie en PDF: ${title}`);
  } catch (error) {
    console.error(`❌ Erreur conversion image: ${title}`, error);
  }
  
  return await pdfDoc.save();
};

/**
 * Fusionne plusieurs PDFs et images en un seul document
 */
export const mergePDFs = async (pdfSources: Array<{ blob?: Blob; url?: string; title: string; type?: 'pdf' | 'image' }>): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const source of pdfSources) {
    try {
      let pdfBytes: ArrayBuffer;
      
      // Si c'est une image, la convertir en PDF d'abord
      if (source.type === 'image' && source.url) {
        const imagePdfBytes = await imageToPDFPage(source.url, source.title);
        pdfBytes = imagePdfBytes.buffer as ArrayBuffer;
      } else if (source.blob) {
        // Si c'est un blob, le convertir en ArrayBuffer
        pdfBytes = await source.blob.arrayBuffer();
      } else if (source.url) {
        // Si c'est une URL, la télécharger
        const response = await fetch(source.url);
        if (!response.ok) {
          console.warn(`Impossible de télécharger: ${source.title}`);
          continue;
        }
        pdfBytes = await response.arrayBuffer();
      } else {
        console.warn(`Source invalide: ${source.title}`);
        continue;
      }
      
      const sourcePdf = await PDFDocument.load(pdfBytes);
      const sourcePages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      
      sourcePages.forEach((page) => {
        mergedPdf.addPage(page);
      });
      
      console.log(`✅ PDF ajouté: ${source.title}`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'ajout du PDF ${source.title}:`, error);
    }
  }
  
  const finalPdfBytes = await mergedPdf.save();
  return new Blob([new Uint8Array(finalPdfBytes)], { type: 'application/pdf' });
};

/**
 * Génère un PDF React et le convertit en blob pour fusion
 */
export const generateReactPDFBlob = async (component: React.ReactElement): Promise<Blob> => {
  const asPdf = pdf(component);
  return await asPdf.toBlob();
};

/**
 * Télécharge un blob en tant que fichier
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};