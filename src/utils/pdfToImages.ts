import * as pdfjsLib from 'pdfjs-dist';

// Configurer le worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFPageImage {
  pageNumber: number;
  dataUrl: string;  // Base64 image (data:image/png;base64,...)
  width: number;
  height: number;
}

export const convertPDFToImages = async (
  file: File,
  options: {
    scale?: number;      // Qualité/résolution (default: 2)
    format?: 'png' | 'jpeg';  // Format image
    quality?: number;    // Qualité JPEG (0-1)
  } = {}
): Promise<PDFPageImage[]> => {
  const { scale = 2, format = 'png', quality = 0.92 } = options;
  
  // Lire le fichier comme ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Charger le PDF
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const images: PDFPageImage[] = [];
  
  // Convertir chaque page en image
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    
    // Créer un canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Rendre la page sur le canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    }).promise;
    
    // Convertir en image Base64
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    images.push({
      pageNumber: pageNum,
      dataUrl,
      width: viewport.width,
      height: viewport.height
    });
  }
  
  return images;
};

// Fonction pour extraire uniquement le Base64 (sans le préfixe data:image/...)
export const extractBase64FromDataUrl = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};
