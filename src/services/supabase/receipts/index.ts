
import { receiptQueries } from './queries';
import { receiptMutations } from './mutations';
import { generateReference } from './table-utils';

export const receiptsService = {
  ...receiptQueries,
  ...receiptMutations,
  generateReference
};

export * from './types';
