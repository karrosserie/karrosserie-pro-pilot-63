
export const getFilename = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/');
    return segments[segments.length - 1];
  } catch (e) {
    return 'document';
  }
};

export const isImageFile = (url: string): boolean => {
  return url && 
    (url.toLowerCase().endsWith('.jpg') || 
     url.toLowerCase().endsWith('.jpeg') || 
     url.toLowerCase().endsWith('.png') ||
     url.toLowerCase().includes('image'));
};

export const handleDownload = async (url: string, customFilename?: string) => {
  if (!url) return;

  try {
    // Méthode robuste avec fetch/blob pour éviter les blocages Chrome
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = customFilename || getFilename(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL temporaire
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    // Fallback: méthode classique si fetch échoue
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = customFilename || getFilename(url);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (linkError) {
      // Dernier recours: ouvrir dans un nouvel onglet
      window.open(url, '_blank');
    }
  }
};
