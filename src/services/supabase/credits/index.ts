
import { getCredits, getCreditById, getLastCreditByUser } from './queries';
import { createCredit, updateCredit, deleteCredit, generateReference } from './mutations';

export const creditsService = {
  getAll: getCredits,
  getById: getCreditById,
  getLastCreditByUser,
  create: createCredit,
  update: updateCredit,
  delete: deleteCredit,
  generateReference
};

export * from './types';
export * from './queries';
export * from './mutations';
