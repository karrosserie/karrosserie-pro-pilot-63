import { PDFDocument } from 'pdf-lib';
import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';

/**
 * Convertit une image en page PDF
 */
export const imageToPDFPage = async (imageUrl: string, title: string): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  
  try {
    console.log(`📥 Conversion image en PDF: ${title} depuis ${imageUrl}`);
    
    let imageBytes: ArrayBuffer;
    
    // Vérifier si l'URL est une URL Supabase Storage
    if (imageUrl.includes('/storage/v1/object/public/')) {
      // Extraire le bucket et le path depuis l'URL Supabase
      let fullUrl = imageUrl;
      if (!imageUrl.startsWith('http')) {
        fullUrl = `https://jukdsypvuehnniskgpfd.supabase.co${imageUrl}`;
      }
      
      const urlParts = fullUrl.split('/storage/v1/object/public/');
      if (urlParts.length === 2) {
        const [bucket, ...pathParts] = urlParts[1].split('/');
        const filePath = pathParts.join('/');
        
        console.log(`📦 Téléchargement depuis Supabase - Bucket: "${bucket}", Path: "${filePath}"`);
        
        // Télécharger depuis Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(filePath);
        
        if (error) {
          console.error(`❌ Erreur Supabase Storage pour ${title}:`, error);
          throw error;
        }
        
        if (!data) {
          throw new Error(`Aucune donnée reçue pour ${title}`);
        }
        
        imageBytes = await data.arrayBuffer();
        console.log(`✅ Image téléchargée depuis Supabase: ${imageBytes.byteLength} bytes`);
      } else {
        throw new Error(`Format d'URL Supabase invalide: ${imageUrl}`);
      }
    } else {
      // Pour les autres URLs, utiliser fetch
      console.log(`⬇️ Téléchargement via fetch...`);
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Échec du téléchargement: ${response.status} ${response.statusText}`);
      }
      imageBytes = await response.arrayBuffer();
      console.log(`✅ Image téléchargée via fetch: ${imageBytes.byteLength} bytes`);
    }
    
    // Détecter le type d'image et l'embarquer
    let image;
    const isPng = imageUrl.toLowerCase().match(/\.(png|webp)$/i);
    const isJpg = imageUrl.toLowerCase().match(/\.(jpg|jpeg)$/i);
    
    console.log(`🎨 Type d'image détecté - PNG: ${!!isPng}, JPG: ${!!isJpg}`);
    
    try {
      if (isPng) {
        console.log(`   Tentative d'embedding PNG...`);
        image = await pdfDoc.embedPng(imageBytes);
      } else if (isJpg) {
        console.log(`   Tentative d'embedding JPEG...`);
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        // Essayer JPEG par défaut
        console.log(`   Type inconnu, essai JPEG par défaut...`);
        image = await pdfDoc.embedJpg(imageBytes);
      }
    } catch (embedError) {
      console.warn(`⚠️ Erreur avec le premier format, essai de l'autre format...`, embedError);
      // Essayer l'autre format
      if (isPng) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else {
        image = await pdfDoc.embedPng(imageBytes);
      }
    }
    
    console.log(`✅ Image embarquée - Dimensions: ${image.width}x${image.height}`);
    
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
    
    console.log(`📐 Position: (${x}, ${y}), Taille: ${scaledWidth}x${scaledHeight}`);
    
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
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      console.error(`   Stack:`, error.stack);
    }
  }
  
  return await pdfDoc.save();
};

/**
 * Fusionne plusieurs PDFs et images en un seul document
 */
export const mergePDFs = async (pdfSources: Array<{ blob?: Blob; url?: string; title: string; type?: 'pdf' | 'image' }>): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();
  
  console.log(`🔄 Fusion de ${pdfSources.length} sources PDF/images...`);
  
  for (const source of pdfSources) {
    try {
      console.log(`📄 Traitement de: ${source.title} (type: ${source.type})`);
      let pdfBytes: ArrayBuffer;
      
      // Si c'est une image, la convertir en PDF d'abord
      if (source.type === 'image' && source.url) {
        console.log(`   → Conversion image en PDF...`);
        const imagePdfBytes = await imageToPDFPage(source.url, source.title);
        pdfBytes = imagePdfBytes.buffer as ArrayBuffer;
      } else if (source.blob) {
        // Si c'est un blob, le convertir en ArrayBuffer
        console.log(`   → Utilisation du blob fourni...`);
        pdfBytes = await source.blob.arrayBuffer();
      } else if (source.url) {
        // Si c'est une URL, vérifier si c'est Supabase ou autre
        if (source.url.includes('/storage/v1/object/public/')) {
          // URL Supabase Storage
          let fullUrl = source.url;
          if (!source.url.startsWith('http')) {
            fullUrl = `https://jukdsypvuehnniskgpfd.supabase.co${source.url}`;
          }
          
          const urlParts = fullUrl.split('/storage/v1/object/public/');
          if (urlParts.length === 2) {
            const [bucket, ...pathParts] = urlParts[1].split('/');
            const filePath = pathParts.join('/');
            
            console.log(`   → Téléchargement depuis Supabase - Bucket: "${bucket}", Path: "${filePath}"`);
            
            const { data, error } = await supabase.storage
              .from(bucket)
              .download(filePath);
            
            if (error) {
              console.error(`❌ Erreur Supabase Storage pour ${source.title}:`, error);
              continue;
            }
            
            if (!data) {
              console.warn(`⚠️ Aucune donnée reçue pour ${source.title}`);
              continue;
            }
            
            pdfBytes = await data.arrayBuffer();
            console.log(`   ✅ PDF téléchargé depuis Supabase: ${pdfBytes.byteLength} bytes`);
          } else {
            console.warn(`⚠️ Format d'URL Supabase invalide: ${source.url}`);
            continue;
          }
        } else {
          // Autre URL, utiliser fetch
          console.log(`   → Téléchargement via fetch...`);
          const response = await fetch(source.url);
          if (!response.ok) {
            console.warn(`⚠️ Impossible de télécharger: ${source.title} (${response.status})`);
            continue;
          }
          pdfBytes = await response.arrayBuffer();
          console.log(`   ✅ PDF téléchargé via fetch: ${pdfBytes.byteLength} bytes`);
        }
      } else {
        console.warn(`⚠️ Source invalide: ${source.title}`);
        continue;
      }
      
      const sourcePdf = await PDFDocument.load(pdfBytes);
      const sourcePages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      
      sourcePages.forEach((page) => {
        mergedPdf.addPage(page);
      });
      
      console.log(`✅ PDF ajouté: ${source.title} (${sourcePages.length} pages)`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'ajout du PDF ${source.title}:`, error);
      if (error instanceof Error) {
        console.error(`   Message: ${error.message}`);
      }
    }
  }
  
  console.log(`✅ Fusion terminée - Total de ${mergedPdf.getPageCount()} pages`);
  
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