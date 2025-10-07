import { PDFDocument } from 'pdf-lib';
import { pdf } from '@react-pdf/renderer';

/**
 * Fusionne plusieurs PDFs en un seul document
 */
export const mergePDFs = async (pdfSources: Array<{ blob?: Blob; url?: string; title: string }>): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const source of pdfSources) {
    try {
      let pdfBytes: ArrayBuffer;
      
      if (source.blob) {
        // Si c'est un blob, le convertir en ArrayBuffer
        pdfBytes = await source.blob.arrayBuffer();
      } else if (source.url) {
        // Si c'est une URL, la télécharger
        const response = await fetch(source.url);
        if (!response.ok) {
          console.warn(`Impossible de télécharger le PDF: ${source.title}`);
          continue;
        }
        pdfBytes = await response.arrayBuffer();
      } else {
        console.warn(`Source PDF invalide: ${source.title}`);
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