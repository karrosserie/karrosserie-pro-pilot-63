
import { getRepairOrders, getRepairOrderById, getLastOrderByUser } from './queries';
import { createRepairOrder, updateRepairOrder, deleteRepairOrder, archiveRepairOrder, restoreRepairOrder } from './mutations';

export * from './types';

export const repairOrdersService = {
  getAll: getRepairOrders,
  getById: getRepairOrderById,
  getLastOrderByUser,
  create: createRepairOrder,
  update: updateRepairOrder,
  delete: deleteRepairOrder,
  archive: archiveRepairOrder,
  restore: restoreRepairOrder
};
