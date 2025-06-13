
export type CarModel = {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Données statiques temporaires en attendant la création des tables - avec UUIDs valides
const staticCarModels: CarModel[] = [
  // Audi
  { id: '550e8400-e29b-41d4-a716-446655440201', brand_id: '550e8400-e29b-41d4-a716-446655440101', name: 'A3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440202', brand_id: '550e8400-e29b-41d4-a716-446655440101', name: 'A4', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440203', brand_id: '550e8400-e29b-41d4-a716-446655440101', name: 'A6', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440204', brand_id: '550e8400-e29b-41d4-a716-446655440101', name: 'Q3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440205', brand_id: '550e8400-e29b-41d4-a716-446655440101', name: 'Q5', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // BMW
  { id: '550e8400-e29b-41d4-a716-446655440206', brand_id: '550e8400-e29b-41d4-a716-446655440102', name: 'Série 1', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440207', brand_id: '550e8400-e29b-41d4-a716-446655440102', name: 'Série 3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440208', brand_id: '550e8400-e29b-41d4-a716-446655440102', name: 'Série 5', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440209', brand_id: '550e8400-e29b-41d4-a716-446655440102', name: 'X1', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440210', brand_id: '550e8400-e29b-41d4-a716-446655440102', name: 'X3', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Mercedes-Benz
  { id: '550e8400-e29b-41d4-a716-446655440211', brand_id: '550e8400-e29b-41d4-a716-446655440103', name: 'Classe A', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440212', brand_id: '550e8400-e29b-41d4-a716-446655440103', name: 'Classe C', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440213', brand_id: '550e8400-e29b-41d4-a716-446655440103', name: 'Classe E', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440214', brand_id: '550e8400-e29b-41d4-a716-446655440103', name: 'GLA', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440215', brand_id: '550e8400-e29b-41d4-a716-446655440103', name: 'GLC', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Volkswagen
  { id: '550e8400-e29b-41d4-a716-446655440216', brand_id: '550e8400-e29b-41d4-a716-446655440104', name: 'Golf', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440217', brand_id: '550e8400-e29b-41d4-a716-446655440104', name: 'Polo', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440218', brand_id: '550e8400-e29b-41d4-a716-446655440104', name: 'Passat', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440219', brand_id: '550e8400-e29b-41d4-a716-446655440104', name: 'Tiguan', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  
  // Peugeot
  { id: '550e8400-e29b-41d4-a716-446655440220', brand_id: '550e8400-e29b-41d4-a716-446655440105', name: '208', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440221', brand_id: '550e8400-e29b-41d4-a716-446655440105', name: '308', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440222', brand_id: '550e8400-e29b-41d4-a716-446655440105', name: '3008', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440223', brand_id: '550e8400-e29b-41d4-a716-446655440105', name: '5008', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
];

export const carModelsService = {
  getByBrandId: async (brandId: string): Promise<CarModel[]> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticCarModels.filter(model => model.brand_id === brandId);
  }
};
