
export type CarBrand = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Données statiques temporaires en attendant la création des tables - avec UUIDs valides
const staticCarBrands: CarBrand[] = [
  { id: '550e8400-e29b-41d4-a716-446655440101', name: 'Audi', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440102', name: 'BMW', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440103', name: 'Mercedes-Benz', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440104', name: 'Volkswagen', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440105', name: 'Peugeot', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440106', name: 'Renault', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440107', name: 'Citroën', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440108', name: 'Ford', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440109', name: 'Opel', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440110', name: 'Toyota', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
];

export const carBrandsService = {
  getAll: async (): Promise<CarBrand[]> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticCarBrands;
  }
};
