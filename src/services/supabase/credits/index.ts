
import { getCredits, getCredit } from './queries';
import { createCredit, updateCredit, deleteCredit, archiveCredit, restoreCredit } from './mutations';
import { generateReference } from './table-utils';

export const creditsService = {
  getCredits,
  getCredit,
  createCredit,
  updateCredit,
  deleteCredit,
  archiveCredit,
  restoreCredit,
  generateReference
};

export * from './types';
