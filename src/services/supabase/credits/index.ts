
import { getCredits, getCredit } from './queries';
import { createCredit, updateCredit, deleteCredit } from './mutations';
import { generateReference } from './table-utils';

export const creditsService = {
  getCredits,
  getCredit,
  createCredit,
  updateCredit,
  deleteCredit,
  generateReference
};

export * from './types';
