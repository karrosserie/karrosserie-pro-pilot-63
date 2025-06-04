
import { invoiceQueries } from './queries';
import { invoiceMutations } from './mutations';

export const invoicesService = {
  ...invoiceQueries,
  ...invoiceMutations
};

export * from './types';
