
export type InsuranceCompany = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Données statiques temporaires en attendant la création des tables
const staticInsuranceCompanies: InsuranceCompany[] = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'AXA', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Allianz', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Generali', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'MAIF', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'MACIF', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'MAAF', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Groupama', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Crédit Agricole Assurances', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Matmut', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '550e8400-e29b-41d4-a716-44665544000a', name: 'Direct Assurance', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
];

export const insuranceCompaniesService = {
  getAll: async (): Promise<InsuranceCompany[]> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticInsuranceCompanies;
  }
};
