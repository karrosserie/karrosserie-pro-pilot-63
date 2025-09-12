
import { getCredits, getCredit } from './queries';
import { createCredit, updateCredit, deleteCredit, archiveCredit } from './mutations';
import { generateReference } from './table-utils';

export const creditsService = {
  getCredits,
  getCredit,
  createCredit,
  updateCredit,
  deleteCredit,
  archiveCredit,
  generateReference
};

export * from './types';
