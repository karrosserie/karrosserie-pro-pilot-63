
export type CarModel = {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Données statiques temporaires en attendant la création des tables
const staticCarModels: CarModel[] = [
  // Audi
  { id: '1', brand_id: '1', name: 'A3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', brand_id: '1', name: 'A4', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '3', brand_id: '1', name: 'A6', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '4', brand_id: '1', name: 'Q3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '5', brand_id: '1', name: 'Q5', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // BMW
  { id: '6', brand_id: '2', name: 'Série 1', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '7', brand_id: '2', name: 'Série 3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '8', brand_id: '2', name: 'Série 5', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '9', brand_id: '2', name: 'X1', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '10', brand_id: '2', name: 'X3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Mercedes-Benz
  { id: '11', brand_id: '3', name: 'Classe A', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '12', brand_id: '3', name: 'Classe C', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '13', brand_id: '3', name: 'Classe E', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '14', brand_id: '3', name: 'GLA', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '15', brand_id: '3', name: 'GLC', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Volkswagen
  { id: '16', brand_id: '4', name: 'Golf', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '17', brand_id: '4', name: 'Polo', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '18', brand_id: '4', name: 'Passat', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '19', brand_id: '4', name: 'Tiguan', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Peugeot
  { id: '20', brand_id: '5', name: '208', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '21', brand_id: '5', name: '308', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '22', brand_id: '5', name: '3008', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '23', brand_id: '5', name: '5008', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
];

export const carModelsService = {
  getByBrandId: async (brandId: string): Promise<CarModel[]> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticCarModels.filter(model => model.brand_id === brandId);
  }
};
