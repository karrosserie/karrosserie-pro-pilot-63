
import { STATIC_CAR_BRANDS, mockApiDelay } from '@/data/staticData';

export type CarBrand = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Variable pour stocker les marques modifiées
let carBrandsData = [...STATIC_CAR_BRANDS];

export const carBrandsService = {
  getAll: async (): Promise<CarBrand[]> => {
    console.log('carBrandsService.getAll - Starting query');
    await mockApiDelay(200);
    
    const sortedBrands = [...carBrandsData].sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('carBrandsService.getAll - Returning:', sortedBrands);
    return sortedBrands;
  }
};
