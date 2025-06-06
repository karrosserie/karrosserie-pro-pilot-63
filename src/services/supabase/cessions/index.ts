
import { getAllCessions, getCessionById } from './queries';
import { createCession, updateCession, deleteCession } from './mutations';

// Export types
export type { Cession, NewCession, UpdateCession } from './types';

// Export the service object for backward compatibility
export const cessionsService = {
  getAll: getAllCessions,
  getById: getCessionById,
  create: createCession,
  update: updateCession,
  delete: deleteCession
};

// Export individual functions for more flexible usage
export {
  getAllCessions,
  getCessionById,
  createCession,
  updateCession,
  deleteCession
};
