
export const getRotatedDimensions = (width: number, height: number, rotation: number) => {
  // Normaliser la rotation (0, 90, 180, 270)
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  
  // Pour les rotations de 90° et 270°, inverser width et height
  if (normalizedRotation === 90 || normalizedRotation === 270) {
    return {
      width: height,
      height: width,
    };
  }
  
  // Pour 0° et 180°, garder les dimensions originales
  return {
    width: width,
    height: height,
  };
};

export const createInitialCrop = () => ({
  unit: '%' as const,
  x: 5,
  y: 5,
  width: 90,
  height: 90,
});
