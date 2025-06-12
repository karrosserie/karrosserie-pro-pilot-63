
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

export function useVehicleFormData() {
  const { carBrands } = useCarBrands();

  const getBrandIdFromName = (brandName: string): string | null => {
    const brand = carBrands.find(b => b.name === brandName);
    return brand?.id || null;
  };

  const getBrandNameFromId = (brandId: string): string => {
    const brand = carBrands.find(b => b.id === brandId);
    return brand?.name || '';
  };

  const getModelIdFromName = (modelName: string, brandId: string): string | null => {
    // This requires getting models for the specific brand
    // Will be handled by components that have access to models
    return null;
  };

  return {
    getBrandIdFromName,
    getBrandNameFromId,
    getModelIdFromName
  };
}
