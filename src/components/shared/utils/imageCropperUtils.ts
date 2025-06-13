
// Fonction utilitaire pour calculer les dimensions après rotation
export const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = Math.abs((rotation * Math.PI) / 180);
  
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

// Calculer les dimensions d'affichage pour que l'image reste dans le conteneur
export const calculateDisplayDimensions = (
  naturalWidth: number,
  naturalHeight: number,
  rotation: number,
  containerWidth: number,
  containerHeight: number
) => {
  const rotatedDimensions = rotateSize(naturalWidth, naturalHeight, rotation);
  
  // Calculer le ratio pour que l'image tienne dans le conteneur
  const scaleX = containerWidth / rotatedDimensions.width;
  const scaleY = containerHeight / rotatedDimensions.height;
  const scale = Math.min(scaleX, scaleY, 1); // Ne pas agrandir l'image
  
  return {
    width: naturalWidth * scale,
    height: naturalHeight * scale,
    scale
  };
};

// Fonction pour créer une image recadrée à partir du canvas
export const getCroppedImageBlob = (
  image: HTMLImageElement,
  crop: any,
  rotation: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx || !crop) {
      resolve(null);
      return;
    }

    // Calculer les dimensions en tenant compte de la rotation
    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.naturalWidth,
      image.naturalHeight,
      rotation
    );

    // Configurer le canvas
    canvas.width = crop.width;
    canvas.height = crop.height;

    // Créer un canvas temporaire pour l'image pivotée
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      resolve(null);
      return;
    }

    tempCanvas.width = bBoxWidth;
    tempCanvas.height = bBoxHeight;

    // Appliquer la rotation sur le canvas temporaire
    tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    tempCtx.rotate(rotRad);
    tempCtx.scale(1, 1);
    tempCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
    tempCtx.drawImage(image, 0, 0);

    // Calculer les coordonnées de recadrage avec la rotation
    const scaleX = image.naturalWidth / bBoxWidth;
    const scaleY = image.naturalHeight / bBoxHeight;

    // Dessiner la portion recadrée
    ctx.drawImage(
      tempCanvas,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convertir le canvas en Blob
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      0.95
    );
  });
};
