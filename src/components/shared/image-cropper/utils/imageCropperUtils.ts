
export const getEffectiveDimensions = (width: number, height: number, rotation: number) => {
  const normalizedRotation = Math.abs(rotation) % 360;
  const isRotated90or270 = normalizedRotation === 90 || normalizedRotation === 270;
  
  return {
    width: isRotated90or270 ? height : width,
    height: isRotated90or270 ? width : height
  };
};

export const getMaxZoom = (
  imageWidth: number, 
  imageHeight: number, 
  rotation: number,
  containerElement: HTMLDivElement | null
) => {
  if (!containerElement) return 3;
  
  const containerRect = containerElement.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  
  const effectiveDims = getEffectiveDimensions(imageWidth, imageHeight, rotation);
  
  const maxZoomX = containerWidth / effectiveDims.width;
  const maxZoomY = containerHeight / effectiveDims.height;
  
  return Math.min(maxZoomX, maxZoomY, 3);
};

export const getFormattedAcceptTypes = (accept: string) => {
  return accept.split('.').join('').split(',').join(' ');
};
