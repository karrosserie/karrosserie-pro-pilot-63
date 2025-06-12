
export type CarBrand = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Données statiques temporaires en attendant la création des tables
const staticCarBrands: CarBrand[] = [
  { id: '1', name: 'Audi', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'BMW', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '3', name: 'Mercedes-Benz', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '4', name: 'Volkswagen', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '5', name: 'Peugeot', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '6', name: 'Renault', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '7', name: 'Citroën', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '8', name: 'Ford', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '9', name: 'Opel', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '10', name: 'Toyota', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
];

export const carBrandsService = {
  getAll: async (): Promise<CarBrand[]> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticCarBrands;
  }
};
