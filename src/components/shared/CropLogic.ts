
export class CropLogic {
  static getCroppedImage(
    image: HTMLImageElement,
    completedCrop: any,
    rotation: number,
    zoom: number,
    onComplete: (blob: Blob) => void
  ) {
    if (!image || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    console.log('=== CROP DEBUG INFO ===');
    console.log('Completed crop:', completedCrop);
    console.log('Image natural size:', image.naturalWidth, 'x', image.naturalHeight);
    console.log('Current rotation:', rotation);
    console.log('Current zoom:', zoom);

    // Calculer les dimensions de l'image affichée
    const displayedImageRect = image.getBoundingClientRect();
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    
    // Calculer le ratio entre l'image naturelle et l'image affichée
    const scaleX = naturalWidth / image.offsetWidth;
    const scaleY = naturalHeight / image.offsetHeight;
    
    console.log('Scale ratios:', { scaleX, scaleY });
    console.log('Image offset size:', image.offsetWidth, 'x', image.offsetHeight);

    // Convertir les coordonnées du crop en tenant compte du zoom
    // Les coordonnées de crop sont relatives à l'image transformée
    const cropX = (completedCrop.x * scaleX) / zoom;
    const cropY = (completedCrop.y * scaleY) / zoom;
    const cropWidth = (completedCrop.width * scaleX) / zoom;
    const cropHeight = (completedCrop.height * scaleY) / zoom;

    console.log('Adjusted crop coordinates:', {
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight
    });

    // Calculer les dimensions du canvas final en tenant compte de la rotation
    const rotationInRadians = (rotation * Math.PI) / 180;
    const isRotated90or270 = rotation === 90 || rotation === 270;
    
    // Définir la taille du canvas
    if (isRotated90or270) {
      canvas.width = cropHeight;
      canvas.height = cropWidth;
    } else {
      canvas.width = cropWidth;
      canvas.height = cropHeight;
    }

    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    // Sauvegarder l'état du contexte
    ctx.save();

    // Déplacer l'origine au centre du canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Appliquer la rotation
    ctx.rotate(rotationInRadians);

    // Calculer les coordonnées de dessin en tenant compte de la rotation
    let drawX, drawY, drawWidth, drawHeight;
    
    if (rotation === 0) {
      drawX = -cropWidth / 2;
      drawY = -cropHeight / 2;
      drawWidth = cropWidth;
      drawHeight = cropHeight;
    } else if (rotation === 90) {
      drawX = -cropHeight / 2;
      drawY = -cropWidth / 2;
      drawWidth = cropHeight;
      drawHeight = cropWidth;
    } else if (rotation === 180) {
      drawX = -cropWidth / 2;
      drawY = -cropHeight / 2;
      drawWidth = cropWidth;
      drawHeight = cropHeight;
    } else if (rotation === 270) {
      drawX = -cropHeight / 2;
      drawY = -cropWidth / 2;
      drawWidth = cropHeight;
      drawHeight = cropWidth;
    } else {
      // Pour les rotations non-orthogonales, utiliser les valeurs de base
      drawX = -cropWidth / 2;
      drawY = -cropHeight / 2;
      drawWidth = cropWidth;
      drawHeight = cropHeight;
    }

    // Dessiner l'image croppée avec la rotation appliquée
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );

    // Restaurer l'état du contexte
    ctx.restore();

    console.log('=== END CROP DEBUG ===');

    // Convertir le canvas en Blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onComplete(blob);
        }
      },
      'image/jpeg',
      0.95
    );
  }
}
