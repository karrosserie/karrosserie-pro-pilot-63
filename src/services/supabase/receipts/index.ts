
import { receiptQueries } from './queries';
import { receiptMutations } from './mutations';

export const receiptsService = {
  ...receiptQueries,
  ...receiptMutations
};

export * from './types';
