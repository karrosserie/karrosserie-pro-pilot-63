
export class CropLogic {
  static getCroppedImage(
    image: HTMLImageElement,
    completedCrop: any,
    rotation: number,
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

    // Utiliser directement les coordonnées du crop sur l'image non transformée
    const naturalCropX = completedCrop.x;
    const naturalCropY = completedCrop.y;
    const naturalCropWidth = completedCrop.width;
    const naturalCropHeight = completedCrop.height;

    console.log('Crop coordinates:', {
      x: naturalCropX,
      y: naturalCropY,
      width: naturalCropWidth,
      height: naturalCropHeight
    });

    // Calculer les dimensions finales en tenant compte de la rotation
    const rotationInRadians = (rotation * Math.PI) / 180;
    const isRotated90or270 = rotation === 90 || rotation === 270;
    
    // Définir la taille du canvas en fonction de la rotation
    if (isRotated90or270) {
      canvas.width = naturalCropHeight;
      canvas.height = naturalCropWidth;
    } else {
      canvas.width = naturalCropWidth;
      canvas.height = naturalCropHeight;
    }

    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    // Sauvegarder l'état du contexte
    ctx.save();

    // Déplacer l'origine au centre du canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Appliquer la rotation
    ctx.rotate(rotationInRadians);

    // Dessiner l'image avec la rotation appliquée
    ctx.drawImage(
      image,
      naturalCropX,
      naturalCropY,
      naturalCropWidth,
      naturalCropHeight,
      -naturalCropWidth / 2,
      -naturalCropHeight / 2,
      naturalCropWidth,
      naturalCropHeight
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
