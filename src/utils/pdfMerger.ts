import { PDFDocument } from 'pdf-lib';
import { pdf } from '@react-pdf/renderer';
import { supabase } from '@/integrations/supabase/client';

/**
 * Convertit une image en page PDF
 */
export const imageToPDFPage = async (imageUrl: string, title: string): Promise<Uint8Array> => {
  console.log('🖼️ [imageToPDFPage] Converting image to PDF page:', imageUrl);
  console.log('🏷️ [imageToPDFPage] Title:', title);
  
  try {
    let imageBytes: ArrayBuffer;
    
    // Si c'est une URL Supabase Storage, utiliser le client Supabase
    if (imageUrl.includes('supabase.co/storage')) {
      console.log('📦 [imageToPDFPage] Detected Supabase Storage URL, using supabase.storage.download()');
      
      try {
        // Extraire le bucket et le path de l'URL
        const urlParts = imageUrl.split('/storage/v1/object/public/');
        if (urlParts.length !== 2) {
          throw new Error('Invalid Supabase Storage URL format');
        }
        
        const [bucket, ...pathParts] = urlParts[1].split('/');
        const filePath = decodeURIComponent(pathParts.join('/'));
        
        console.log(`📂 [imageToPDFPage] Downloading from bucket: "${bucket}", path: "${filePath}"`);
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(filePath);
          
        if (error) {
          console.error('❌ [imageToPDFPage] Supabase storage download error:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('No data returned from Supabase storage');
        }
        
        console.log('✅ [imageToPDFPage] Successfully downloaded from Supabase Storage, size:', data.size, 'bytes');
        imageBytes = await data.arrayBuffer();
      } catch (storageError) {
        console.error('❌ [imageToPDFPage] Failed to download from Supabase Storage:', storageError);
        throw storageError;
      }
    } else {
      // Pour les autres URLs, utiliser fetch standard
      console.log('🌐 [imageToPDFPage] Using standard fetch for non-Supabase URL');
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        imageBytes = await response.arrayBuffer();
        console.log('✅ [imageToPDFPage] Successfully fetched image, size:', imageBytes.byteLength, 'bytes');
      } catch (fetchError) {
        console.error('❌ [imageToPDFPage] Failed to fetch image:', fetchError);
        throw fetchError;
      }
    }
    
    console.log('📊 [imageToPDFPage] Image bytes loaded, size:', imageBytes.byteLength, 'bytes');
    
    // Créer un nouveau document PDF
    console.log('📄 [imageToPDFPage] Creating new PDF document...');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    
    // Embed l'image
    console.log('🎨 [imageToPDFPage] Embedding image into PDF...');
    let image;
    try {
      if (imageUrl.toLowerCase().endsWith('.png')) {
        console.log('🖼️ [imageToPDFPage] Embedding as PNG...');
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        console.log('🖼️ [imageToPDFPage] Embedding as JPG...');
        image = await pdfDoc.embedJpg(imageBytes);
      }
      console.log('✅ [imageToPDFPage] Image embedded successfully, dimensions:', image.width, 'x', image.height);
    } catch (embedError) {
      console.error('❌ [imageToPDFPage] Failed to embed image:', embedError);
      throw embedError;
    }
    
    // Calculer les dimensions pour adapter l'image à la page
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const imageAspectRatio = image.width / image.height;
    const pageAspectRatio = pageWidth / pageHeight;
    
    let scaledWidth, scaledHeight;
    if (imageAspectRatio > pageAspectRatio) {
      scaledWidth = pageWidth - 100;
      scaledHeight = scaledWidth / imageAspectRatio;
    } else {
      scaledHeight = pageHeight - 150;
      scaledWidth = scaledHeight * imageAspectRatio;
    }
    
    console.log('📐 [imageToPDFPage] Scaled dimensions:', scaledWidth.toFixed(2), 'x', scaledHeight.toFixed(2));
    
    // Centrer l'image
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;
    
    // Dessiner l'image
    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
    
    // Ajouter le titre en haut de page
    page.drawText(title, {
      x: 50,
      y: pageHeight - 50,
      size: 14,
    });
    
    const pdfBytes = await pdfDoc.save();
    console.log('✅ [imageToPDFPage] Image successfully converted to PDF page, final size:', pdfBytes.length, 'bytes');
    return pdfBytes;
  } catch (error) {
    console.error('❌ [imageToPDFPage] Critical error converting image to PDF page:', error);
    console.error('❌ [imageToPDFPage] Error details:', {
      message: error.message,
      stack: error.stack,
      imageUrl,
      title
    });
    
    // Créer une page d'erreur au lieu de crasher
    console.log('⚠️ [imageToPDFPage] Creating error page instead...');
    try {
      const errorPdfDoc = await PDFDocument.create();
      const errorPage = errorPdfDoc.addPage([595.28, 841.89]);
      const pageHeight = errorPage.getHeight();
      
      errorPage.drawText('Erreur de chargement de l\'image', {
        x: 50,
        y: pageHeight - 50,
        size: 16,
      });
      
      errorPage.drawText(`URL: ${imageUrl}`, {
        x: 50,
        y: pageHeight - 80,
        size: 10,
      });
      
      errorPage.drawText(`Erreur: ${error.message}`, {
        x: 50,
        y: pageHeight - 110,
        size: 10,
      });
      
      const errorPdfBytes = await errorPdfDoc.save();
      console.log('✅ [imageToPDFPage] Error page created successfully');
      return errorPdfBytes;
    } catch (errorPageError) {
      console.error('❌ [imageToPDFPage] Failed to create error page:', errorPageError);
      throw error; // Rethrow original error
    }
  }
};

/**
 * Fusionne plusieurs PDFs et images en un seul document
 */
export const mergePDFs = async (
  pdfSources: Array<{
    blob?: Blob;
    url?: string;
    title: string;
    type?: 'pdf' | 'image';
  }>
): Promise<Blob> => {
  console.log('🔄 [mergePDFs] Starting PDF merge process with', pdfSources.length, 'sources');
  console.log('📋 [mergePDFs] Sources:', pdfSources.map((s, i) => `${i + 1}. ${s.title} (${s.type || 'pdf'})`).join(', '));
  
  try {
    const mergedPdf = await PDFDocument.create();
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < pdfSources.length; i++) {
      const source = pdfSources[i];
      console.log(`\n📄 [mergePDFs] Processing source ${i + 1}/${pdfSources.length}:`, source.title, `(type: ${source.type || 'pdf'})`);
      
      try {
        let pdfBytes: Uint8Array;
        
        // Si c'est une image, la convertir en PDF d'abord
        if (source.type === 'image' && source.url) {
          console.log('🖼️ [mergePDFs] Converting image to PDF page...');
          try {
            pdfBytes = await imageToPDFPage(source.url, source.title);
            console.log('✅ [mergePDFs] Image converted successfully');
          } catch (imageError) {
            console.error('❌ [mergePDFs] Failed to convert image:', imageError);
            failureCount++;
            continue;
          }
        }
        // Si on a un blob
        else if (source.blob) {
          console.log('📦 [mergePDFs] Processing blob, size:', source.blob.size, 'bytes');
          const arrayBuffer = await source.blob.arrayBuffer();
          pdfBytes = new Uint8Array(arrayBuffer);
          console.log('✅ [mergePDFs] Blob processed successfully');
        }
        // Si on a une URL
        else if (source.url) {
          console.log('🌐 [mergePDFs] Fetching from URL:', source.url);
          
          // Si c'est une URL Supabase Storage, utiliser le client Supabase
          if (source.url.includes('supabase.co/storage')) {
            console.log('📦 [mergePDFs] Detected Supabase Storage URL, using supabase.storage.download()');
            
            try {
              // Extraire le bucket et le path de l'URL
              const urlParts = source.url.split('/storage/v1/object/public/');
              if (urlParts.length !== 2) {
                throw new Error('Invalid Supabase Storage URL format');
              }
              
              const [bucket, ...pathParts] = urlParts[1].split('/');
              const filePath = decodeURIComponent(pathParts.join('/'));
              
              console.log(`📂 [mergePDFs] Downloading from bucket: "${bucket}", path: "${filePath}"`);
              
              const { data, error } = await supabase.storage
                .from(bucket)
                .download(filePath);
                
              if (error) {
                console.error('❌ [mergePDFs] Supabase storage download error:', error);
                throw error;
              }
              
              if (!data) {
                throw new Error('No data returned from Supabase storage');
              }
              
              console.log('✅ [mergePDFs] Successfully downloaded from Supabase Storage, size:', data.size, 'bytes');
              const arrayBuffer = await data.arrayBuffer();
              pdfBytes = new Uint8Array(arrayBuffer);
            } catch (storageError) {
              console.error('❌ [mergePDFs] Failed to download from Supabase Storage:', storageError);
              failureCount++;
              continue;
            }
          } else {
            // Pour les autres URLs, utiliser fetch standard
            console.log('🌐 [mergePDFs] Using standard fetch');
            try {
              const response = await fetch(source.url);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const arrayBuffer = await response.arrayBuffer();
              pdfBytes = new Uint8Array(arrayBuffer);
              console.log('✅ [mergePDFs] Fetched successfully, size:', pdfBytes.length, 'bytes');
            } catch (fetchError) {
              console.error('❌ [mergePDFs] Failed to fetch:', fetchError);
              failureCount++;
              continue;
            }
          }
        } else {
          console.warn('⚠️ [mergePDFs] Source has neither blob nor URL, skipping');
          failureCount++;
          continue;
        }
        
        // Charger le document PDF
        console.log('📄 [mergePDFs] Loading PDF document...');
        const pdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        console.log(`✅ [mergePDFs] Loaded ${pages.length} page(s) from "${source.title}"`);
        
        // Ajouter toutes les pages
        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        
        console.log(`✅ [mergePDFs] Successfully added ${pages.length} page(s) from "${source.title}"`);
        successCount++;
      } catch (sourceError) {
        console.error(`❌ [mergePDFs] Failed to process source "${source.title}":`, sourceError);
        failureCount++;
      }
    }
    
    console.log(`\n📊 [mergePDFs] Summary: ${successCount} succeeded, ${failureCount} failed out of ${pdfSources.length} total`);
    
    if (successCount === 0) {
      throw new Error('Aucun document n\'a pu être ajouté au PDF final');
    }
    
    console.log('\n💾 [mergePDFs] Saving merged PDF...');
    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
    
    console.log('✅ [mergePDFs] PDF merge completed successfully! Final size:', blob.size, 'bytes');
    console.log(`✅ [mergePDFs] Final document contains ${mergedPdf.getPageCount()} total pages`);
    return blob;
  } catch (error) {
    console.error('❌ [mergePDFs] Critical error during PDF merge:', error);
    console.error('❌ [mergePDFs] Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
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