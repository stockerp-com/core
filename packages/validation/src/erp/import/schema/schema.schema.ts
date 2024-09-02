import { z } from 'zod';

const goodsSheetSchema = z.object({
  idField: z.string(),
  nameField: z.string(),
  quantityField: z.string(),
  oldPriceField: z.string(),
  saleField: z.string(),
  priceField: z.string(),
  sizeField: z.string(),
  manufacturerField: z.string(),
  mediaField: z.string(),
});

export const importSchemaSchema = z.object({
  goodsSheet: z.object({
    name: z.string(),
    schema: goodsSheetSchema,
  }),
});
