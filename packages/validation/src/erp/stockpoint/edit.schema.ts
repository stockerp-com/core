import { z } from 'zod';
import { numberField } from '../../utils/common.js';
import { addStockpointSchema } from './add.schema.js';

export const editStockpointSchema = addStockpointSchema.extend({
  id: numberField,
});

export type EditStockpointInput = z.infer<typeof editStockpointSchema>;
