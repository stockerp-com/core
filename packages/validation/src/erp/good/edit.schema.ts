import { z } from 'zod';
import { addGoodSchema } from './add.schema.js';
import { numberField } from '../../utils/common.js';

export const editGoodSchema = z.object({
  ...addGoodSchema.shape,
  id: numberField.optional(),
});

export const editGoodFieldsSchema = z.object({
  retailGroupId: z.boolean(),
  distributionChannel: z.boolean(),
  sku: z.boolean(),
  isArchived: z.boolean(),
  additionalIdentificators: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
  retailPrices: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
  bulkPrices: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
  media: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
  attributes: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
  stock: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
  localizations: z.object({
    edit: z.boolean(),
    delete: z.boolean(),
  }),
});

export type EditGoodSchemaInput = z.infer<typeof editGoodSchema>;

export type EditGoodFieldsSchemaInput = z.infer<typeof editGoodFieldsSchema>;
