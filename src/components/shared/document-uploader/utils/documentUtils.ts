
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

export const handleDownload = (url: string) => {
  if (url) {
    // Créer un élément temporaire pour forcer le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = getFilename(url);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
