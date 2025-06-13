
export const getRotatedDimensions = (width: number, height: number, rotation: number) => {
  const rotRad = Math.abs((rotation * Math.PI) / 180);
  
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export const createInitialCrop = () => ({
  unit: '%' as const,
  x: 5,
  y: 5,
  width: 90,
  height: 90,
});
