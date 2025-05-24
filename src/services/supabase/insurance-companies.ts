
export type InsuranceCompany = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

// Données statiques temporaires en attendant la création des tables
const staticInsuranceCompanies: InsuranceCompany[] = [
  { id: '1', name: 'AXA', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'Allianz', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '3', name: 'Generali', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '4', name: 'MAIF', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '5', name: 'MACIF', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '6', name: 'MAAF', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '7', name: 'Groupama', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '8', name: 'Crédit Agricole Assurances', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '9', name: 'Matmut', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '10', name: 'Direct Assurance', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }
];

export const insuranceCompaniesService = {
  getAll: async (): Promise<InsuranceCompany[]> => {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticInsuranceCompanies;
  }
};
